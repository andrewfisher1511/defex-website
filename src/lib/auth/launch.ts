/**
 * Public-launch switch.
 *
 * README overview: the main site is "shown to authenticated, admitted users
 * until public launch, then flipped public". Until then this stays false and
 * `/`, `/dbp-act` and the rest sit behind the gate. `/app/**` is never
 * affected — the workspace is gated permanently (Launch Pack A5, D3).
 *
 * Deliberately not NEXT_PUBLIC_: this is a server-side access decision and
 * has no business being readable or bundled into client code.
 */
export function isSitePublic(): boolean {
  return process.env.SITE_PUBLIC === "true";
}
