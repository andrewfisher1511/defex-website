import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { GATE_ROUTE, safeInternalPath } from "@/lib/auth/access";

/**
 * OAuth callback (Part A5).
 *
 * Google -> Supabase `/auth/v1/callback` -> here with `?code=`. Exchanging
 * the code sets the session cookies, after which the proxy routes the user:
 * admitted -> main site, no role -> the invite-only gate state.
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
    return NextResponse.redirect(`${origin}${GATE_ROUTE}?auth_error=provider`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}${GATE_ROUTE}?auth_error=missing_code`);
  }

  const supabase = await createClient();
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error("[auth/callback] code exchange failed:", exchangeError.message);
    return NextResponse.redirect(`${origin}${GATE_ROUTE}?auth_error=exchange`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
