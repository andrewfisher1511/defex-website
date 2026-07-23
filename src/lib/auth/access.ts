import type { AppRole } from "@/lib/supabase/types";

/**
 * Route access rules for the private preview.
 *
 * Sources of truth:
 *  - README "State Management": no session -> gate; session without role ->
 *    gate (invite-only state); role present -> site/workspace.
 *  - README "Routes": `/` is the gate and, for an admitted user, the rev3
 *    main site. `/dbp-act` matches the main site pre-launch. `/terms` and
 *    `/privacy` are public.
 *  - Launch Pack A5: "Middleware guards /app/**: no session -> gate;
 *    session without role -> gate."
 *
 * This module is deliberately free of `next/*` imports so the decision
 * table is a pure function and can be unit tested directly.
 */

/** Where the rev3 main site actually lives in the app router. */
export const MAIN_SITE_ROUTE = "/site";

/** The gate, and the place every rejected request lands. */
export const GATE_ROUTE = "/";

/**
 * Public regardless of session or launch state.
 *
 * `/terms` and `/privacy` are load-bearing: the Google OAuth consent screen
 * links to them (Launch Pack A1.2), so they must resolve for a signed-out
 * visitor and for Google's own reviewers. Gating them would fail review.
 *
 * `/auth/*` carries the OAuth callback and sign-out; gating those would
 * make signing in impossible.
 */
const PUBLIC_PREFIXES = ["/terms", "/privacy", "/auth/"] as const;

/**
 * Gated forever, independent of public launch: the private workspace
 * (Launch Pack A5, and D3 "noindex on /app" permanently). This app does not
 * serve /app today — app.defex.engineering does — but the rule costs
 * nothing and closes the path if a route is ever added here.
 */
const ALWAYS_GATED_PREFIXES = ["/app"] as const;

export type AccessDecision =
  /** Serve the requested route as-is. */
  | { kind: "next"; reason: string }
  /** Serve a different route under the requested URL. */
  | { kind: "rewrite"; to: string; reason: string }
  /** Send the browser somewhere else. */
  | { kind: "redirect"; to: string; reason: string };

export interface AccessInput {
  pathname: string;
  /** A verified Supabase session exists (`auth.getUser()` succeeded). */
  hasSession: boolean;
  /** `profiles.role`. null = signed in but NOT admitted (Part A3). */
  role: AppRole | null;
  /**
   * Public launch. False during the private preview: the main site and the
   * DBP hub are visible only to admitted users. Flipping this true opens
   * everything except {@link ALWAYS_GATED_PREFIXES}.
   */
  sitePublic?: boolean;
}

function normalise(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.replace(/\/+$/, "") || "/";
  }
  return pathname;
}

function matchesPrefix(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some((prefix) =>
    prefix.endsWith("/") ? pathname.startsWith(prefix) : pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

/** Any non-null role admits. Part A5 draws no distinction between tiers. */
export function isAdmitted(role: AppRole | null): boolean {
  return role !== null;
}

/**
 * The whole access decision table. Deny is the default: an unrecognised
 * path falls through to the gate rather than being served, so adding a
 * route can never silently expose it during the private preview.
 */
export function resolveAccess({
  pathname,
  hasSession,
  role,
  sitePublic = false,
}: AccessInput): AccessDecision {
  const path = normalise(pathname);
  const admitted = isAdmitted(role);

  if (matchesPrefix(path, PUBLIC_PREFIXES)) {
    return { kind: "next", reason: "public route" };
  }

  if (matchesPrefix(path, ALWAYS_GATED_PREFIXES)) {
    return admitted
      ? { kind: "next", reason: "workspace: admitted" }
      : {
          kind: "redirect",
          to: GATE_ROUTE,
          reason: hasSession ? "workspace: session without role" : "workspace: no session",
        };
  }

  // The main site's real route. Always bounce to `/` so there is exactly one
  // public URL for the site and no second, separately-guarded way in.
  if (path === MAIN_SITE_ROUTE) {
    return { kind: "redirect", to: GATE_ROUTE, reason: "main site is served at /" };
  }

  if (path === GATE_ROUTE) {
    if (sitePublic || admitted) {
      return {
        kind: "rewrite",
        to: MAIN_SITE_ROUTE,
        reason: sitePublic ? "public launch: main site" : "admitted: main site",
      };
    }
    return {
      kind: "next",
      reason: hasSession ? "gate: session without role" : "gate: no session",
    };
  }

  if (sitePublic || admitted) {
    return { kind: "next", reason: sitePublic ? "public launch" : "admitted" };
  }

  return {
    kind: "redirect",
    to: GATE_ROUTE,
    reason: hasSession ? "gated: session without role" : "gated: no session",
  };
}

/**
 * Open-redirect guard for the `?next=` parameter on the OAuth callback.
 *
 * Only same-origin, single-slash absolute paths are allowed. Rejects
 * absolute URLs (`https://evil.example`), protocol-relative URLs
 * (`//evil.example`, and the `/\evil.example` form browsers also treat as
 * protocol-relative), and anything not starting with `/`.
 */
export function safeInternalPath(next: string | null | undefined, fallback = GATE_ROUTE): string {
  if (!next) return fallback;
  if (!next.startsWith("/")) return fallback;
  if (next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}
