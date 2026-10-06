import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

/*
 * The callback is the first of the allowlist's three enforcement points, and
 * the only one that can be exercised without a real Google sign-in by an
 * outside account. Supabase is mocked: these tests pin what the route DOES
 * with each outcome — above all, that a refused account is signed out.
 */

const exchangeCodeForSession = vi.fn();
const signOut = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ auth: { exchangeCodeForSession, signOut } }),
}));

const { GET } = await import("./route");

const ORIGIN = "https://defex.engineering";

function callback(query: string) {
  return GET(new NextRequest(`${ORIGIN}/auth/callback${query}`));
}

function signedInAs(email: string | undefined) {
  exchangeCodeForSession.mockResolvedValue({ data: { user: email === undefined ? null : { email } }, error: null });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
  signOut.mockResolvedValue({ error: null });
});

describe("/auth/callback — the allowlisted owner", () => {
  it("is let through to the requested page, and not signed out", async () => {
    signedInAs("andrew@defex.engineering");
    const res = await callback("?code=abc&next=/");
    expect(res.headers.get("location")).toBe(`${ORIGIN}/`);
    expect(signOut).not.toHaveBeenCalled();
  });

  it("is let through whatever case Google returns the address in", async () => {
    signedInAs("Andrew@DEFEX.engineering");
    const res = await callback("?code=abc");
    expect(res.headers.get("location")).toBe(`${ORIGIN}/`);
    expect(signOut).not.toHaveBeenCalled();
  });
});

describe("/auth/callback — any other account", () => {
  it("is signed straight back out and told it cannot sign in", async () => {
    signedInAs("andrew.fisher1511@gmail.com");
    const res = await callback("?code=abc&next=/");
    expect(signOut).toHaveBeenCalledTimes(1);
    expect(res.headers.get("location")).toBe(`${ORIGIN}/?auth_error=not_permitted`);
  });

  it("is refused even when it asked to go somewhere specific", async () => {
    signedInAs("someone@example.com");
    const res = await callback("?code=abc&next=/dbp-act");
    expect(signOut).toHaveBeenCalledTimes(1);
    expect(res.headers.get("location")).toBe(`${ORIGIN}/?auth_error=not_permitted`);
  });

  it("is refused when the session comes back with no user at all", async () => {
    signedInAs(undefined);
    const res = await callback("?code=abc");
    expect(signOut).toHaveBeenCalledTimes(1);
    expect(res.headers.get("location")).toBe(`${ORIGIN}/?auth_error=not_permitted`);
  });

  it("is still refused if signing it out fails", async () => {
    signedInAs("someone@example.com");
    signOut.mockResolvedValue({ error: { message: "network" } });
    const res = await callback("?code=abc");
    expect(res.headers.get("location")).toBe(`${ORIGIN}/?auth_error=not_permitted`);
  });

  it("never writes the refused address to the logs", async () => {
    signedInAs("someone@example.com");
    await callback("?code=abc");
    const logged = [...vi.mocked(console.warn).mock.calls, ...vi.mocked(console.error).mock.calls].flat().join(" ");
    expect(logged).not.toContain("someone@example.com");
  });
});

describe("/auth/callback — failures before any account is known", () => {
  it("reports a provider error without exchanging anything", async () => {
    const res = await callback("?error=access_denied");
    expect(exchangeCodeForSession).not.toHaveBeenCalled();
    expect(res.headers.get("location")).toBe(`${ORIGIN}/?auth_error=provider`);
  });

  it("reports a missing code", async () => {
    const res = await callback("");
    expect(res.headers.get("location")).toBe(`${ORIGIN}/?auth_error=missing_code`);
  });

  it("reports a failed exchange, and signs nobody out", async () => {
    exchangeCodeForSession.mockResolvedValue({ data: { user: null }, error: { message: "bad code" } });
    const res = await callback("?code=abc");
    expect(signOut).not.toHaveBeenCalled();
    expect(res.headers.get("location")).toBe(`${ORIGIN}/?auth_error=exchange`);
  });
});
