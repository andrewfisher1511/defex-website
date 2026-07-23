import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ANONYMOUS_VIEWER, type Viewer } from "./viewer";
import { isAppRole } from "@/lib/supabase/types";
import { GATE_ROUTE, isAdmitted } from "./access";
import { isSitePublic } from "./launch";

/**
 * Data access layer for the current viewer.
 *
 * The proxy makes the routing decision, but Next's own guidance is that the
 * proxy is an optimistic check only — a matcher change or a Server Function
 * on a skipped path can bypass it. So every gated page re-reads the viewer
 * through here rather than trusting that the proxy ran. `cache()` dedupes
 * that to one round trip per request.
 *
 * Always `getUser()`, never `getSession()`: getUser revalidates the JWT with
 * the Supabase Auth server, whereas getSession returns whatever the cookie
 * claims, which a client can forge.
 */
export const getViewer = cache(async (): Promise<Viewer> => {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return ANONYMOUS_VIEWER;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    // Fail closed. A failed role lookup must never read as "admitted".
    console.error("[dal] profiles.role lookup failed:", error.message);
    return { email: user.email ?? null, role: null, hasSession: true };
  }

  return {
    email: user.email ?? null,
    role: isAppRole(data?.role) ? data.role : null,
    hasSession: true,
  };
});

/**
 * Page-level guard for everything behind the preview. Call it at the top of
 * each gated page so the page is safe on its own terms, whether or not the
 * proxy ran.
 *
 * After public launch this returns before reading cookies, so the gated
 * pages go back to being statically prerenderable.
 */
export async function requireAdmitted(): Promise<void> {
  if (isSitePublic()) return;

  const viewer = await getViewer();
  if (!isAdmitted(viewer.role)) {
    redirect(GATE_ROUTE);
  }
}
