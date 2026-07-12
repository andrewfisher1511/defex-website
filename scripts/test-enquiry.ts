// Direct-invocation test for functions/api/enquiry.ts.
// Run: node --experimental-strip-types scripts/test-enquiry.ts
import { onRequestPost } from '../functions/api/enquiry.ts';

function makeForm(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

function makeCtx(fields: Record<string, string>, env: Record<string, string> = {}) {
  return {
    request: new Request('https://defex.engineering/api/enquiry', {
      method: 'POST',
      body: makeForm(fields),
    }),
    env,
    params: {},
    waitUntil: (_p: Promise<unknown>) => {
      void _p;
    },
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
  description: 'We have spalling concrete on the balcony soffits and would like an inspection.',
  hp: '',
  t: String(past),
};

await expect('honeypot filled → 400', makeCtx({ ...valid, hp: 'bot' }), 400);
await expect('too fast (<2s) → 400', makeCtx({ ...valid, t: String(Date.now()) }), 400);
await expect('bad email → 422', makeCtx({ ...valid, email: 'not-an-email' }), 422);
await expect('missing description → 422', makeCtx({ ...valid, description: '' }), 422);
await expect('missing name → 422', makeCtx({ ...valid, name: '' }), 422);
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
