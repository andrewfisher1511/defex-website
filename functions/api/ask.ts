/**
 * Cloudflare Pages Function — POST /api/ask (the "Ask DEFEX" assistant).
 *
 * Same Anthropic Messages API used for the enquiry subject line, Haiku-class,
 * temperature 0. The knowledge blob is regenerated at build time from
 * content/ (scripts/generate-knowledge.mjs) so it can't drift from the
 * site's actual copy. Degrades to a fixed, honest "not available" reply when
 * ANTHROPIC_API_KEY isn't configured — never a 500 the widget has to handle.
 */
import knowledgeData from '../_generated/site-knowledge.json';

interface Env {
  ANTHROPIC_API_KEY?: string;
  RATE_LIMIT?: KVNamespace;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT =
  'You are the website assistant for DEFEX Engineering. Answer ONLY from the site information provided ' +
  'below. Plain, competent Australian English. No exclamation marks. No emoji. Keep answers under 110 ' +
  'words. If a question is outside the provided information, say plainly that it is not covered on this ' +
  'site and suggest calling 0432 261 722 or emailing andrew@defex.engineering. Never give engineering ' +
  'advice about a specific building or defect — recommend an inspection instead. Do not invent fees, ' +
  'availability, insurance details or client names. Do not recommend other organisations, registers or ' +
  'practitioners.\n\nSITE INFORMATION:\n' +
  (knowledgeData as { knowledge: string }).knowledge;

const UNAVAILABLE =
  'The assistant is not available right now. Call 0432 261 722 or email andrew@defex.engineering.';

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

async function checkRateLimit(env: Env, ip: string): Promise<boolean> {
  if (!env.RATE_LIMIT || !ip) return true;
  const key = `ask:${ip}`;
  const current = Number((await env.RATE_LIMIT.get(key)) || '0');
  if (current >= 20) return false;
  await env.RATE_LIMIT.put(key, String(current + 1), { expirationTtl: 3600 });
  return true;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const ip = request.headers.get('cf-connecting-ip') || '';

  let body: { question?: unknown; history?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'bad_request' }, 400);
  }

  const question = typeof body.question === 'string' ? body.question.trim() : '';
  if (!question || question.length > 2000) {
    return json({ error: 'invalid' }, 422);
  }

  if (!(await checkRateLimit(env, ip))) {
    return json({ answer: UNAVAILABLE }, 200);
  }

  if (!env.ANTHROPIC_API_KEY) {
    return json({ answer: UNAVAILABLE }, 200);
  }

  const history: ChatMessage[] = Array.isArray(body.history)
    ? (body.history as unknown[])
        .filter(
          (m): m is ChatMessage =>
            !!m &&
            typeof m === 'object' &&
            ((m as ChatMessage).role === 'user' || (m as ChatMessage).role === 'assistant') &&
            typeof (m as ChatMessage).content === 'string'
        )
        .slice(-8)
    : [];

  const messages = history.length ? history : [{ role: 'user' as const, content: question }];

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
        max_tokens: 400,
        temperature: 0,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });
    if (!res.ok) return json({ answer: UNAVAILABLE }, 200);
    const data = (await res.json()) as { content?: Array<{ text?: string }> };
    const answer = (data.content?.[0]?.text || '').trim();
    return json({ answer: answer || 'That is not covered on this site. Call 0432 261 722 or email andrew@defex.engineering.' }, 200);
  } catch {
    return json({ answer: UNAVAILABLE }, 200);
  }
};
