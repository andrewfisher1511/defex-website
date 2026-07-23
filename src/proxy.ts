import { NextResponse, type NextRequest } from "next/server";
import { resolveAccess } from "@/lib/auth/access";
import { readProxySession } from "@/lib/auth/proxy-session";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { isSitePublic } from "@/lib/auth/launch";

/**
 * Access proxy (Next 16 renamed `middleware.ts` -> `proxy.ts`).
 *
 * README "State Management":
 *   no session          -> gate
 *   session, no role    -> gate, invite-only state
 *   role present        -> site / workspace
 *
 * The decision table itself lives in @/lib/auth/access so it can be unit
 * tested; this file only does the I/O around it.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes are settled without touching Supabase. That keeps /terms
  // and /privacy — which the Google consent screen links to — serving even
  // if Supabase is misconfigured or down.
  const publicOnly = resolveAccess({ pathname, hasSession: false, role: null });
  if (publicOnly.kind === "next" && publicOnly.reason === "public route") {
    return NextResponse.next();
  }

  if (!hasSupabaseEnv()) {
    // Loud, not silent: a missing key must not quietly degrade to "no session"
    // (which would look like a working gate while nobody can ever sign in).
    throw new Error(
      "Supabase environment variables are missing, so access control cannot run. " +
        "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (see .env.example)."
    );
  }

  const { viewer, applyCookies } = await readProxySession(request);

  const decision = resolveAccess({
    pathname,
    hasSession: viewer.hasSession,
    role: viewer.role,
    sitePublic: isSitePublic(),
  });

  switch (decision.kind) {
    case "rewrite": {
      const url = request.nextUrl.clone();
      url.pathname = decision.to;
      return applyCookies(NextResponse.rewrite(url));
    }
    case "redirect": {
      const url = request.nextUrl.clone();
      url.pathname = decision.to;
      url.search = "";
      return applyCookies(NextResponse.redirect(url));
    }
    default:
      return applyCookies(NextResponse.next());
  }
}

export const config = {
  matcher: [
    /*
     * Everything except:
     * - _next/static, _next/image (build output)
     * - favicon.ico, robots.txt, sitemap.xml (metadata files)
     * - /assets/** (public logos and photography, used by the gate itself)
     * - any file with an extension
     *
     * Note Next still runs the proxy for /_next/data/* regardless, so the
     * data route of a guarded page cannot be fetched around the guard.
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|assets/|.*\\.[\\w]+$).*)",
  ],
};
