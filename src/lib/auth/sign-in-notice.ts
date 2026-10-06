/**
 * The `?auth_error=` codes the OAuth callback sends back to the gate, and the
 * one-line notice the gate shows for each. Kept in one place so the callback
 * and the page can never drift apart.
 *
 * Pure (no next/* imports) so it can be unit tested directly.
 */
export const AUTH_ERROR = {
  /** Google returned an error, including the visitor cancelling. */
  provider: "provider",
  /** The callback was reached without an authorisation code. */
  missingCode: "missing_code",
  /** Supabase could not exchange the code for a session. */
  exchange: "exchange",
  /** Sign-in worked, but the account is not on the allowlist. */
  notPermitted: "not_permitted",
} as const;

export type AuthErrorCode = (typeof AUTH_ERROR)[keyof typeof AUTH_ERROR];

export type SignInNotice = "not-permitted" | "failed";

/**
 * The query value -> the notice to show, or null for none. Anything unknown
 * (or repeated, which Next delivers as an array) shows the generic notice
 * rather than echoing attacker-supplied text back onto the page.
 */
export function signInNoticeFor(value: string | string[] | undefined): SignInNotice | null {
  if (value === undefined) return null;
  if (value === AUTH_ERROR.notPermitted) return "not-permitted";
  return "failed";
}
