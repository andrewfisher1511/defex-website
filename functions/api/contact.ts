/**
 * Cloudflare Pages Function — POST /api/contact
 *
 * Plain fetch to the Resend REST API (no SDK). Validates, rejects honeypot and
 * sub-3s submissions, and returns 503 {"error":"unconfigured"} when the sending
 * secrets are absent — which is the live path tonight (Resend not yet verified).
 * The client treats any non-200 as "show the mailto fallback", so the 503 path
 * degrades gracefully.
 */

interface Env {
  RESEND_API_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
}

interface Payload {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  suburb?: unknown;
  message?: unknown;
  hp?: unknown;
  t?: unknown;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  let data: Payload;
  try {
    data = (await request.json()) as Payload;
  } catch {
    return json({ error: 'bad_request' }, 400);
  }

  // Honeypot — a filled hidden field means a bot.
  if (str(data.hp) !== '') {
    return json({ error: 'rejected' }, 400);
  }

  // Time gate — reject submissions faster than 3s after render.
  const t = Number(data.t);
  if (!Number.isFinite(t) || Date.now() - t < 3000) {
    return json({ error: 'too_fast' }, 400);
  }

  const name = str(data.name);
  const email = str(data.email);
  const phone = str(data.phone);
  const suburb = str(data.suburb);
  const message = str(data.message);

  if (
    name.length < 1 ||
    name.length > 200 ||
    !EMAIL_RE.test(email) ||
    message.length < 10 ||
    message.length > 5000
  ) {
    return json({ error: 'invalid' }, 400);
  }

  // Unconfigured → graceful 503 (tonight's live path).
  if (!env.RESEND_API_KEY || !env.CONTACT_FROM) {
    return json({ error: 'unconfigured' }, 503);
  }

  const to = env.CONTACT_TO || 'andrew@defex.engineering';
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    suburb ? `Building suburb: ${suburb}` : null,
    '',
    'Message:',
    message,
  ]
    .filter((line) => line !== null)
    .join('\n');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM,
        to: [to],
        reply_to: email,
        subject: `Website enquiry — ${name}`,
        text,
      }),
    });

    if (!res.ok) {
      return json({ error: 'send_failed' }, 502);
    }
    return json({ ok: true }, 200);
  } catch {
    return json({ error: 'send_failed' }, 502);
  }
};
