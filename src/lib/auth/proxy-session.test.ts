import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

/*
 * The proxy is the allowlist's second enforcement point. Supabase is mocked
 * so these tests pin the decision itself: an account that is not on the
 * allowlist is never admitted, and its role is never even looked up — so a
 * stray invite row or profiles.role value cannot admit it.
 */

const getUser = vi.fn();
const profilesQuery = vi.fn();

vi.mock("@/lib/supabase/env", () => ({
  supabaseUrl: () => "https://example.supabase.co",
  supabaseAnonKey: () => "anon-key",
}));

vi.mock("@supabase/ssr", () => ({
  createServerClient: () => ({
    auth: { getUser },
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: profilesQuery }) }) }),
  }),
}));

const { readProxySession } = await import("./proxy-session");

const request = () => new NextRequest("https://defex.engineering/");

beforeEach(() => {
  vi.clearAllMocks();
  profilesQuery.mockResolvedValue({ data: { role: "owner" }, error: null });
});

describe("readProxySession", () => {
  it("admits the allowlisted owner with their role", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "u1", email: "andrew@defex.engineering" } }, error: null });
    const { viewer } = await readProxySession(request());
    expect(viewer).toEqual({ email: "andrew@defex.engineering", role: "owner", hasSession: true });
  });

  it("never admits another account, even if profiles.role says owner", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "u2", email: "andrew.fisher1511@gmail.com" } }, error: null });
    const { viewer } = await readProxySession(request());
    expect(viewer.role).toBeNull();
    expect(viewer.hasSession).toBe(true);
    expect(profilesQuery).not.toHaveBeenCalled();
  });

  it("treats a session with no email as not admitted", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "u3" } }, error: null });
    const { viewer } = await readProxySession(request());
    expect(viewer.role).toBeNull();
    expect(profilesQuery).not.toHaveBeenCalled();
  });

  it("treats no session as anonymous", async () => {
    getUser.mockResolvedValue({ data: { user: null }, error: { message: "Auth session missing" } });
    const { viewer } = await readProxySession(request());
    expect(viewer).toEqual({ email: null, role: null, hasSession: false });
  });
});
