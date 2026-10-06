/**
 * Who may sign in at all.
 *
 * Owner ruling, 6 October 2026: only andrew@defex.engineering signs in. Every
 * other Google account is refused, even if it is on the Google consent
 * screen's test-user list and even if an invite row is ever added for it.
 *
 * This is deliberately a code constant, not an environment variable: it is a
 * security boundary, and a missing or mistyped env var must never be able to
 * widen it. Adding a person is a reviewed code change.
 *
 * Enforced in three independent places, so no single bypass admits anyone:
 *   1. /auth/callback — a refused account is signed straight back out.
 *   2. the proxy (proxy-session.ts) — a refused account is never admitted.
 *   3. the page-level data layer (dal.ts) — same rule, in case the proxy is
 *      ever skipped.
 *
 * Pure (no next/* or Supabase imports) so it can be unit tested directly.
 */
export const SIGN_IN_ALLOWLIST: readonly string[] = ["andrew@defex.engineering"];

/**
 * True only for an address on the allowlist. Case and surrounding whitespace
 * are ignored (email domains are case-insensitive and Google may return
 * either); everything else must match exactly, so lookalikes such as
 * `andrew@defex.engineering.example.com` or `xandrew@defex.engineering` fail.
 */
export function isAllowedEmail(email: string | null | undefined): boolean {
  if (typeof email !== "string") return false;
  const normalised = email.trim().toLowerCase();
  if (normalised.length === 0) return false;
  return SIGN_IN_ALLOWLIST.includes(normalised);
}
