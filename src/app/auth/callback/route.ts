import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { GATE_ROUTE, safeInternalPath } from "@/lib/auth/access";
import { isAllowedEmail } from "@/lib/auth/allowlist";
import { AUTH_ERROR } from "@/lib/auth/sign-in-notice";

/**
 * OAuth callback (Part A5).
 *
 * Google -> Supabase `/auth/v1/callback` -> here with `?code=`. Exchanging
 * the code sets the session cookies, after which the proxy routes the user:
 * admitted -> main site, no role -> the gate.
 *
 * Only the allowlisted account may finish signing in (allowlist.ts). Any
 * other account is signed straight back out here, so it never holds a
 * session on this site.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // `next` is attacker-influencable, so it is constrained to a same-origin
  // path before use — otherwise this route is an open redirect.
  const next = safeInternalPath(searchParams.get("next"), GATE_ROUTE);

  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  if (error) {
    console.error("[auth/callback] provider returned an error:", error, errorDescription);
    return NextResponse.redirect(`${origin}${GATE_ROUTE}?auth_error=${AUTH_ERROR.provider}`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}${GATE_ROUTE}?auth_error=${AUTH_ERROR.missingCode}`);
  }

  const supabase = await createClient();
  const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error("[auth/callback] code exchange failed:", exchangeError.message);
    return NextResponse.redirect(`${origin}${GATE_ROUTE}?auth_error=${AUTH_ERROR.exchange}`);
  }

  if (!isAllowedEmail(data.user?.email)) {
    // The address is deliberately not logged: it belongs to someone who is
    // not a user of this site.
    console.warn("[auth/callback] sign-in refused: account is not on the allowlist");
    // Revoke the session just created (all of its refresh tokens) and clear
    // the cookies, so nothing usable survives the redirect.
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      // The proxy and the data layer still refuse this account, so this is
      // contained, but it is worth knowing about.
      console.error("[auth/callback] sign-out of a refused account failed:", signOutError.message);
    }
    return NextResponse.redirect(`${origin}${GATE_ROUTE}?auth_error=${AUTH_ERROR.notPermitted}`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
