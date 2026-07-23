import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";
import { isAppRole, type Database } from "@/lib/supabase/types";
import { ANONYMOUS_VIEWER, type Viewer } from "./viewer";

interface CookieToSet {
  name: string;
  value: string;
  options?: Record<string, unknown>;
}

export interface ProxySession {
  viewer: Viewer;
  /**
   * Refreshed auth cookies. These MUST be copied onto whatever response the
   * proxy finally returns — including redirects and rewrites. Dropping them
   * loses the rotated refresh token, which logs the user out on the next
   * request and, at the gate, produces a redirect loop.
   */
  applyCookies: <T extends NextResponse>(response: T) => T;
}

/**
 * Reads and refreshes the Supabase session inside the proxy, then resolves
 * the viewer's role.
 *
 * `getUser()` rather than `getSession()`: it revalidates the JWT against the
 * Auth server instead of trusting the cookie's claims.
 */
export async function readProxySession(request: NextRequest): Promise<ProxySession> {
  const cookiesToSet: CookieToSet[] = [];

  const supabase = createServerClient<Database>(supabaseUrl(), supabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(incoming) {
        for (const cookie of incoming) {
          // Keep the request view consistent for any later read in this pass.
          request.cookies.set(cookie.name, cookie.value);
          cookiesToSet.push(cookie);
        }
      },
    },
  });

  const applyCookies = <T extends NextResponse>(response: T): T => {
    for (const { name, value, options } of cookiesToSet) {
      response.cookies.set(name, value, options);
    }
    return response;
  };

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { viewer: ANONYMOUS_VIEWER, applyCookies };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    // Fail closed: an errored lookup is treated as "signed in, not admitted",
    // never as admitted. Note this is exactly what the un-fixed Part A3
    // "owner reads all" policy triggers on every request — see
    // supabase/migrations/20260723120100_fix_profiles_rls_recursion.sql.
    console.error("[proxy] profiles.role lookup failed:", error.message);
    return {
      viewer: { email: user.email ?? null, role: null, hasSession: true },
      applyCookies,
    };
  }

  return {
    viewer: {
      email: user.email ?? null,
      role: isAppRole(data?.role) ? data.role : null,
      hasSession: true,
    },
    applyCookies,
  };
}
