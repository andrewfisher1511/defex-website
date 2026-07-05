/**
 * Minimal ambient type for Cloudflare Pages Functions, so the repo type-checks
 * without pulling @cloudflare/workers-types over the network. Cloudflare's own
 * runtime provides the full types at deploy time.
 */
declare type PagesFunction<Env = unknown> = (context: {
  request: Request;
  env: Env;
  params: Record<string, string | string[]>;
  waitUntil: (promise: Promise<unknown>) => void;
  next: (input?: Request | string) => Promise<Response>;
  data: Record<string, unknown>;
}) => Response | Promise<Response>;
