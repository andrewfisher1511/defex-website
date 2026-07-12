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

/**
 * Minimal ambient shapes for the optional Cloudflare bindings the enquiry
 * function uses if present (R2 for attachments, KV for rate limiting). Real
 * types come from the runtime at deploy time; these just satisfy tsc.
 */
declare interface R2Bucket {
  put(
    key: string,
    value: ArrayBuffer | ArrayBufferView | ReadableStream | Blob | string,
    options?: Record<string, unknown>
  ): Promise<unknown>;
}
declare interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}
