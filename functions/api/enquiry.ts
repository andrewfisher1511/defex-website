/**
 * Cloudflare Pages Function — POST /api/enquiry
 *
 * Builds on rev1's working Resend relay (functions/api/contact.ts, now
 * superseded by this route). Pipeline per form-endpoint-spec.md:
 *
 *   honeypot + time-gate -> validate -> (R2 attachments | inline attach) ->
 *   AI subject line w/ urgency triage + 3s fallback -> Resend email to
 *   Andrew (reply-to enquirer) -> auto-acknowledgement -> (Supabase persist) ->
 *   (magic push-to-Command/CRM links) -> 200 JSON the front end renders.
 *
 * Every integration beyond Resend degrades gracefully when its secret/binding
 * is absent, same philosophy as rev1's "unconfigured -> 503" contact.ts: the
 * enquiry still sends, just without that feature, rather than failing the
 * whole request. See HANDOFF.md for which env vars/bindings light each up.
 */

interface Env {
  RESEND_API_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
  ANTHROPIC_API_KEY?: string;
  TURNSTILE_SECRET?: string;
  INTAKE_JWT_SECRET?: string;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_KEY?: string;
  ENQUIRY_ATTACHMENTS?: R2Bucket;
  RATE_LIMIT?: KVNamespace;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URGENT_RE =
  /\b(leak(s|ing)?|water ingress|flood(ing|ed)?|dripping|ceiling (is )?(sagging|bulging|coming down)|actively|overnight)\b/i;
const ALLOWED_FILE_RE = /\.(jpg|jpeg|png|heic|webp|gif|pdf|docx?|xlsx?)$/i;
const MAX_FILES = 10;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_INLINE_ATTACH_BYTES = 15 * 1024 * 1024; // total, when R2 isn't bound

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

function str(v: FormDataEntryValue | null): string {
  return typeof v === 'string' ? v.trim() : '';
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

function isUrgent(description: string): boolean {
  return URGENT_RE.test(description);
}

function fallbackSubject(f: {
  role: string;
  name: string;
  address: string;
  description: string;
}): string {
  const who = f.role ? `${f.role} (${f.name})` : f.name;
  const where = f.address ? ` - ${f.address}` : '';
  const what = f.description ? ` - ${f.description.slice(0, 80)}` : '';
  const flag = isUrgent(f.description) ? 'URGENT - ' : '';
  return `${flag}New DEFEX Website enquiry - ${who}${where}${what}`;
}

async function aiSubject(
  env: Env,
  f: { role: string; name: string; address: string; description: string; fileCount: number }
): Promise<string> {
  const fallback = fallbackSubject(f);
  if (!env.ANTHROPIC_API_KEY) return fallback;

  const prompt =
    'Write ONE email subject line for a remedial engineering enquiry from a website form. Format exactly: ' +
    '"New DEFEX Website enquiry - <role or company> (<name>) - <address> - <very short plain summary of the request>". ' +
    'Australian English, no exclamation marks, no quotes, under 140 characters, output only the subject line. ' +
    'If the description indicates active water ingress or a safety risk, prefix the whole line with "URGENT - ".\n\n' +
    `Form data:\nName: ${f.name}\nRole: ${f.role || 'not stated'}\nAddress: ${f.address || 'not stated'}\n` +
    `Description: ${f.description}\nAttachments: ${f.fileCount}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 100,
        temperature: 0,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: controller.signal,
    });
    if (!res.ok) return fallback;
    const data = (await res.json()) as { content?: Array<{ text?: string }> };
    const line = (data.content?.[0]?.text || '').trim().split('\n')[0].replace(/^["']|["']$/g, '');
    return line.length > 20 ? line : fallback;
  } catch {
    return fallback;
  } finally {
    clearTimeout(timeout);
  }
}

async function verifyTurnstile(env: Env, token: string, ip: string | null): Promise<boolean> {
  if (!env.TURNSTILE_SECRET) return true; // not configured — skip, don't block launch
  if (!token) return false;
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ secret: env.TURNSTILE_SECRET, response: token, remoteip: ip || undefined }),
    });
    const data = (await res.json()) as { success?: boolean };
    return !!data.success;
  } catch {
    return false;
  }
}

async function checkRateLimit(env: Env, ip: string): Promise<boolean> {
  if (!env.RATE_LIMIT || !ip) return true;
  const key = `enquiry:${ip}`;
  const current = Number((await env.RATE_LIMIT.get(key)) || '0');
  if (current >= 5) return false;
  await env.RATE_LIMIT.put(key, String(current + 1), { expirationTtl: 3600 });
  return true;
}

function base64FromBuffer(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function base64url(input: ArrayBuffer | string): string {
  const b64 =
    typeof input === 'string' ? btoa(input) : base64FromBuffer(input);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function signIntakeToken(
  secret: string,
  payload: Record<string, unknown>
): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encHeader = base64url(JSON.stringify(header));
  const encPayload = base64url(JSON.stringify(payload));
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${encHeader}.${encPayload}`));
  return `${encHeader}.${encPayload}.${base64url(sig)}`;
}

async function sendResendEmail(
  env: Env,
  opts: {
    to: string;
    from: string;
    subject: string;
    html: string;
    replyTo?: string;
    attachments?: Array<{ filename: string; content: string }>;
  }
): Promise<boolean> {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: opts.from,
        to: [opts.to],
        reply_to: opts.replyTo,
        subject: opts.subject,
        html: opts.html,
        attachments: opts.attachments?.length ? opts.attachments : undefined,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const ip = request.headers.get('cf-connecting-ip');

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: 'bad_request' }, 400);
  }

  // Honeypot — a filled hidden field means a bot.
  if (str(form.get('hp')) !== '') {
    return json({ error: 'rejected' }, 400);
  }
  // Time gate — reject submissions faster than 2s after the form rendered.
  const t = Number(form.get('t'));
  if (!Number.isFinite(t) || Date.now() - t < 2000) {
    return json({ error: 'too_fast' }, 400);
  }

  if (!(await checkRateLimit(env, ip || ''))) {
    return json({ error: 'rate_limited' }, 429);
  }

  const turnstileToken = str(form.get('cf-turnstile-response'));
  if (!(await verifyTurnstile(env, turnstileToken, ip))) {
    return json({ error: 'spam_check_failed' }, 400);
  }

  const name = str(form.get('name'));
  const email = str(form.get('email'));
  const phone = str(form.get('phone'));
  const role = str(form.get('role'));
  const address = str(form.get('address'));
  const description = str(form.get('description'));
  const hearAbout = str(form.get('hearAbout'));

  const fieldErrors: Record<string, string> = {};
  if (!name || name.length > 200) fieldErrors.name = 'Enter a name.';
  if (!EMAIL_RE.test(email)) fieldErrors.email = 'Enter a valid email address.';
  if (!description || description.length > 5000) fieldErrors.description = 'Describe the symptoms.';
  if (Object.keys(fieldErrors).length) {
    return json({ error: 'invalid', fields: fieldErrors }, 422);
  }

  const files = form
    .getAll('files')
    .filter((f): f is File => f instanceof File && f.size > 0)
    .slice(0, MAX_FILES);
  for (const f of files) {
    if (f.size > MAX_FILE_BYTES || !ALLOWED_FILE_RE.test(f.name)) {
      return json({ error: 'invalid_file', file: f.name }, 422);
    }
  }

  const urgent = isUrgent(description);
  const subject = await aiSubject(env, { role, name, address, description, fileCount: files.length });

  // Unconfigured — degrade the same way rev1's contact.ts did.
  if (!env.RESEND_API_KEY || !env.CONTACT_FROM) {
    return json({ error: 'unconfigured' }, 503);
  }

  const enquiryId = crypto.randomUUID();
  const to = env.CONTACT_TO || 'andrew@defex.engineering';

  // Attachments: R2 if bound (full-resolution, chain-of-evidence originals);
  // otherwise attach directly to the email up to a safe combined size.
  const attachmentLinks: string[] = [];
  const inlineAttachments: Array<{ filename: string; content: string }> = [];
  if (files.length) {
    if (env.ENQUIRY_ATTACHMENTS) {
      await Promise.all(
        files.map(async (f, i) => {
          const key = `enquiries/${enquiryId}/${i}-${f.name}`;
          await env.ENQUIRY_ATTACHMENTS!.put(key, await f.arrayBuffer(), {
            httpMetadata: { contentType: f.type },
          });
          attachmentLinks.push(key);
        })
      );
    } else {
      const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
      if (totalBytes <= MAX_INLINE_ATTACH_BYTES) {
        for (const f of files) {
          inlineAttachments.push({ filename: f.name, content: base64FromBuffer(await f.arrayBuffer()) });
        }
      }
    }
  }

  const fieldRows = [
    ['Name', name],
    ['Email', email],
    phone ? ['Phone', phone] : null,
    role ? ['Role', role] : null,
    address ? ['Address', address] : null,
    hearAbout ? ['Heard about us via', hearAbout] : null,
  ].filter((r): r is [string, string] => r !== null);

  const attachmentNote = files.length
    ? env.ENQUIRY_ATTACHMENTS
      ? `<p>${files.length} attachment(s) stored: ${attachmentLinks.map(escapeHtml).join(', ')}</p>`
      : inlineAttachments.length
        ? `<p>${files.length} attachment(s) included with this email.</p>`
        : `<p>${files.length} attachment(s) were too large to include automatically — contact the sender directly.</p>`
    : '<p>No attachments.</p>';

  let actionBlock = '';
  if (env.INTAKE_JWT_SECRET) {
    const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 3600;
    const commandToken = await signIntakeToken(env.INTAKE_JWT_SECRET, {
      enquiryId,
      action: 'command',
      exp,
    });
    const crmToken = await signIntakeToken(env.INTAKE_JWT_SECRET, { enquiryId, action: 'crm', exp });
    actionBlock = `
      <p style="margin:24px 0 0">
        <a href="https://app.defex.engineering/intake/${enquiryId}?token=${commandToken}" style="display:inline-block;margin-right:12px;padding:10px 16px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Add to DEFEX Command as potential job</a>
        <a href="https://app.defex.engineering/intake/${enquiryId}?token=${crmToken}&mode=crm" style="display:inline-block;padding:10px 16px;background:#eff4fe;color:#2563eb;border-radius:8px;text-decoration:none;font-weight:600;border:1px solid #d7e3fb">Create CRM contact</a>
      </p>`;
  }

  const html = `
    <div style="font-family:Arial,sans-serif;color:#1c222b">
      <div style="background:#1a1a2e;padding:20px 24px">
        <span style="color:#fff;font-size:18px;font-weight:700">DEFE<span style="color:#2563eb">X</span> ENGINEERING</span>
      </div>
      <div style="padding:24px">
        ${urgent ? '<p style="display:inline-block;padding:4px 12px;background:#fdecec;color:#b91c1c;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:0.04em">URGENT — ACTIVE WATER INDICATED</p>' : ''}
        <table style="border-collapse:collapse;margin:16px 0">
          ${fieldRows.map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#5c6b7f;font-size:13px;vertical-align:top">${escapeHtml(k)}</td><td style="padding:4px 0;font-size:14px">${escapeHtml(v)}</td></tr>`).join('')}
        </table>
        <p style="font-size:13px;color:#5c6b7f;margin:0 0 4px">Description</p>
        <p style="white-space:pre-wrap;font-size:14px;line-height:1.6">${escapeHtml(description)}</p>
        ${attachmentNote}
        ${actionBlock}
      </div>
    </div>`;

  const sent = await sendResendEmail(env, {
    to,
    from: env.CONTACT_FROM,
    subject,
    html,
    replyTo: email,
    attachments: inlineAttachments,
  });
  if (!sent) {
    return json({ error: 'send_failed' }, 502);
  }

  // Auto-acknowledgement — best-effort, never blocks the response.
  context.waitUntil(
    sendResendEmail(env, {
      to: email,
      from: env.CONTACT_FROM,
      subject: 'Your enquiry has reached DEFEX',
      html: `<div style="font-family:Arial,sans-serif;color:#1c222b;padding:24px">
        <p>Thanks ${escapeHtml(name.split(/\s+/)[0] || '')} — your enquiry has reached DEFEX Engineering and Andrew will be in touch.</p>
        <p>If the matter is urgent, call <a href="tel:+61432261722">0432 261 722</a> directly.</p>
      </div>`,
    })
  );

  // Supabase persistence — optional; the enquiry has already sent regardless.
  if (env.SUPABASE_URL && env.SUPABASE_SERVICE_KEY) {
    context.waitUntil(
      fetch(`${env.SUPABASE_URL}/rest/v1/enquiries`, {
        method: 'POST',
        headers: {
          apikey: env.SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          id: enquiryId,
          status: 'new',
          name,
          email,
          phone: phone || null,
          role: role || null,
          address: address || null,
          description,
          hear_about: hearAbout || null,
          subject,
          urgent,
          attachment_keys: attachmentLinks,
          created_at: new Date().toISOString(),
        }),
      }).catch(() => undefined)
    );
  }

  return json({ ok: true, subject, urgent, fileCount: files.length }, 200);
};
