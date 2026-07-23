import { describe, expect, it } from "vitest";
import {
  GATE_ROUTE,
  MAIN_SITE_ROUTE,
  isAdmitted,
  resolveAccess,
  safeInternalPath,
  type AccessInput,
} from "./access";
import { APP_ROLES, type AppRole } from "@/lib/supabase/types";
import { gateStateFor } from "./viewer";

const NO_SESSION = { hasSession: false, role: null } as const;
const SESSION_NO_ROLE = { hasSession: true, role: null } as const;

/** Every admitted tier from the Part A3 ladder. */
const ADMITTED: ReadonlyArray<{ hasSession: true; role: AppRole }> = APP_ROLES.map((role) => ({
  hasSession: true as const,
  role,
}));

function decide(pathname: string, viewer: Omit<AccessInput, "pathname">) {
  return resolveAccess({ pathname, ...viewer });
}

describe("isAdmitted", () => {
  it("admits every role on the ladder", () => {
    for (const role of APP_ROLES) {
      expect(isAdmitted(role)).toBe(true);
    }
  });

  it("does not admit a null role (signed in but not invited)", () => {
    expect(isAdmitted(null)).toBe(false);
  });
});

describe("public routes", () => {
  // These two are load-bearing: the Google OAuth consent screen links to
  // them (Launch Pack A1.2), so they must resolve without a session.
  const publicPaths = ["/terms", "/privacy", "/terms/", "/auth/callback", "/auth/signout"];

  it.each(publicPaths)("%s is served with no session", (path) => {
    expect(decide(path, NO_SESSION).kind).toBe("next");
  });

  it.each(publicPaths)("%s is served for a signed-in user with no role", (path) => {
    expect(decide(path, SESSION_NO_ROLE).kind).toBe("next");
  });

  it.each(publicPaths)("%s is served for an admitted user", (path) => {
    expect(decide(path, { hasSession: true, role: "owner" }).kind).toBe("next");
  });

  it("does not treat a lookalike prefix as public", () => {
    // `/terms-and-conditions` must not inherit `/terms`' public status.
    expect(decide("/terms-and-conditions", NO_SESSION).kind).toBe("redirect");
    expect(decide("/privacy-policy", NO_SESSION).kind).toBe("redirect");
  });
});

describe("the gate at /", () => {
  it("renders the gate when there is no session", () => {
    const decision = decide(GATE_ROUTE, NO_SESSION);
    expect(decision).toMatchObject({ kind: "next", reason: "gate: no session" });
  });

  it("renders the gate when signed in without a role", () => {
    const decision = decide(GATE_ROUTE, SESSION_NO_ROLE);
    expect(decision).toMatchObject({ kind: "next", reason: "gate: session without role" });
  });

  it.each(ADMITTED)("serves the main site for role $role", (viewer) => {
    expect(decide(GATE_ROUTE, viewer)).toMatchObject({
      kind: "rewrite",
      to: MAIN_SITE_ROUTE,
    });
  });
});

describe("the main site route", () => {
  it.each([NO_SESSION, SESSION_NO_ROLE, ...ADMITTED])(
    "always redirects /site back to / (role: $role)",
    (viewer) => {
      // One canonical URL for the site, so there is no second entry point
      // that could be guarded differently by mistake.
      expect(decide(MAIN_SITE_ROUTE, viewer)).toMatchObject({
        kind: "redirect",
        to: GATE_ROUTE,
      });
    }
  );
});

describe("gated content routes", () => {
  const gated = ["/dbp-act", "/dbp-act/", "/andrew-fisher"];

  it.each(gated)("%s redirects to the gate with no session", (path) => {
    expect(decide(path, NO_SESSION)).toMatchObject({ kind: "redirect", to: GATE_ROUTE });
  });

  it.each(gated)("%s redirects to the gate when signed in without a role", (path) => {
    expect(decide(path, SESSION_NO_ROLE)).toMatchObject({ kind: "redirect", to: GATE_ROUTE });
  });

  it.each(gated)("%s is served for an admitted user", (path) => {
    expect(decide(path, { hasSession: true, role: "trial" }).kind).toBe("next");
  });

  it("serves every admitted tier, not just owner", () => {
    for (const viewer of ADMITTED) {
      expect(decide("/dbp-act", viewer).kind).toBe("next");
    }
  });
});

describe("the workspace at /app (Launch Pack A5)", () => {
  const workspacePaths = ["/app", "/app/", "/app/projects", "/app/projects/123"];

  it.each(workspacePaths)("%s redirects to the gate with no session", (path) => {
    expect(decide(path, NO_SESSION)).toMatchObject({ kind: "redirect", to: GATE_ROUTE });
  });

  it.each(workspacePaths)("%s redirects to the gate for a session without a role", (path) => {
    expect(decide(path, SESSION_NO_ROLE)).toMatchObject({ kind: "redirect", to: GATE_ROUTE });
  });

  it.each(workspacePaths)("%s is served for an admitted user", (path) => {
    expect(decide(path, { hasSession: true, role: "paid" }).kind).toBe("next");
  });

  it("stays gated even after public launch", () => {
    // D3: the workspace is noindex and private permanently.
    expect(decide("/app", { ...NO_SESSION, sitePublic: true })).toMatchObject({
      kind: "redirect",
      to: GATE_ROUTE,
    });
    expect(decide("/app/anything", { ...SESSION_NO_ROLE, sitePublic: true })).toMatchObject({
      kind: "redirect",
      to: GATE_ROUTE,
    });
  });

  it("does not let a lookalike path inherit the /app rule", () => {
    // `/application` is not the workspace; it is just an unknown path.
    expect(decide("/application", { hasSession: true, role: "owner" }).kind).toBe("next");
  });
});

describe("unknown routes default to deny", () => {
  it.each(["/secret", "/api/internal", "/site/extra", "/dbp-act/quiz"])(
    "%s redirects to the gate with no session",
    (path) => {
      expect(decide(path, NO_SESSION)).toMatchObject({ kind: "redirect", to: GATE_ROUTE });
    }
  );

  it("still denies an unknown route to a signed-in user without a role", () => {
    expect(decide("/whatever", SESSION_NO_ROLE)).toMatchObject({
      kind: "redirect",
      to: GATE_ROUTE,
    });
  });
});

describe("public launch", () => {
  const asPublic = { ...NO_SESSION, sitePublic: true };

  it("serves the main site at / to an anonymous visitor", () => {
    expect(decide(GATE_ROUTE, asPublic)).toMatchObject({
      kind: "rewrite",
      to: MAIN_SITE_ROUTE,
    });
  });

  it("opens the DBP hub", () => {
    expect(decide("/dbp-act", asPublic).kind).toBe("next");
  });

  it("keeps /site canonicalised to /", () => {
    expect(decide(MAIN_SITE_ROUTE, asPublic)).toMatchObject({
      kind: "redirect",
      to: GATE_ROUTE,
    });
  });
});

describe("safeInternalPath", () => {
  it("keeps a same-origin path", () => {
    expect(safeInternalPath("/dbp-act")).toBe("/dbp-act");
    expect(safeInternalPath("/site?x=1")).toBe("/site?x=1");
  });

  it("falls back when the value is missing", () => {
    expect(safeInternalPath(null)).toBe(GATE_ROUTE);
    expect(safeInternalPath(undefined)).toBe(GATE_ROUTE);
    expect(safeInternalPath("")).toBe(GATE_ROUTE);
  });

  it.each([
    "https://evil.example/phish",
    "http://evil.example",
    "//evil.example",
    "/\\evil.example",
    "evil.example",
    "javascript:alert(1)",
  ])("rejects %s", (candidate) => {
    expect(safeInternalPath(candidate)).toBe(GATE_ROUTE);
  });

  it("honours an explicit fallback", () => {
    expect(safeInternalPath("//evil.example", "/dbp-act")).toBe("/dbp-act");
  });
});

describe("gateStateFor", () => {
  it("is signed-out with no session", () => {
    expect(gateStateFor({ hasSession: false, email: null, role: null })).toEqual({
      status: "signed-out",
    });
  });

  it("is invite-only when signed in without a role", () => {
    expect(gateStateFor({ hasSession: true, email: "someone@example.com", role: null })).toEqual({
      status: "signed-in-not-admitted",
      email: "someone@example.com",
    });
  });

  it.each(APP_ROLES)("is admitted for role %s", (role) => {
    expect(gateStateFor({ hasSession: true, email: "andrew@defex.engineering", role })).toEqual({
      status: "signed-in-admitted",
      email: "andrew@defex.engineering",
    });
  });
});
