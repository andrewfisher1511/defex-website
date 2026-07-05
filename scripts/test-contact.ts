// Direct-invocation test for functions/api/contact.ts (spec §13.5).
// Run: node --experimental-strip-types scripts/test-contact.ts
import { onRequestPost } from '../functions/api/contact.ts';

function makeCtx(body: unknown, env: Record<string, string> = {}) {
  return {
    request: new Request('https://defex.engineering/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }),
    env,
    params: {},
    waitUntil: () => {},
    next: async () => new Response(),
    data: {},
  };
}

const past = Date.now() - 5000;
let pass = 0;
let fail = 0;

async function expect(label: string, ctx: any, status: number) {
  const res = await (onRequestPost as any)(ctx);
  const ok = res.status === status;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label} → ${res.status} (want ${status})`);
  ok ? pass++ : fail++;
}

const valid = {
  name: 'Jane Owner',
  email: 'jane@example.com',
  message: 'We have spalling concrete on the balcony soffits and would like an inspection.',
  hp: '',
  t: past,
};

await expect('honeypot filled → 400', makeCtx({ ...valid, hp: 'bot' }), 400);
await expect('too fast (<3s) → 400', makeCtx({ ...valid, t: Date.now() }), 400);
await expect('bad email → 400', makeCtx({ ...valid, email: 'not-an-email' }), 400);
await expect('short message → 400', makeCtx({ ...valid, message: 'too short' }), 400);
await expect('missing name → 400', makeCtx({ ...valid, name: '' }), 400);
await expect('valid but unconfigured → 503', makeCtx(valid), 503);

// Stub fetch so the configured-path test never hits the network.
globalThis.fetch = (async () => {
  throw new Error('network blocked in test');
}) as typeof fetch;
await expect(
  'valid + configured → attempts send (network → 502 offline)',
  makeCtx(valid, { RESEND_API_KEY: 'test_key', CONTACT_FROM: 'no-reply@defex.engineering' }),
  502
);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
