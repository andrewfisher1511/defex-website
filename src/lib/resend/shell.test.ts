import { afterEach, describe, expect, it, vi } from "vitest";
import { emailAssetUrl, emailShell } from "./shell";

describe("emailAssetUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("resolves against the canonical public domain", () => {
    expect(emailAssetUrl("/assets/defex-lockup-horizontal-white.png")).toBe(
      "https://defex.engineering/assets/defex-lockup-horizontal-white.png"
    );
  });

  it("ignores NEXT_PUBLIC_SITE_URL entirely — emails outlive environments", () => {
    for (const siteUrl of ["http://localhost:3000", "https://defex-website-abc123.vercel.app", ""]) {
      vi.stubEnv("NEXT_PUBLIC_SITE_URL", siteUrl);
      expect(emailAssetUrl("/assets/defex-lockup-horizontal-white.png")).toBe(
        "https://defex.engineering/assets/defex-lockup-horizontal-white.png"
      );
    }
  });
});

describe("emailShell", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("always points the header logo at the canonical domain, never localhost", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
    const html = emailShell({ preheader: "Preview text", bodyHtml: "<p>Body</p>" });

    expect(html).toContain('src="https://defex.engineering/assets/defex-lockup-horizontal-white.png"');
    expect(html).not.toContain("localhost");
  });
});
