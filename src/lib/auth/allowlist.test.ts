import { describe, expect, it } from "vitest";
import { SIGN_IN_ALLOWLIST, isAllowedEmail } from "./allowlist";
import { AUTH_ERROR, signInNoticeFor } from "./sign-in-notice";

describe("SIGN_IN_ALLOWLIST", () => {
  it("is exactly the owner, per the 6 October 2026 ruling", () => {
    expect(SIGN_IN_ALLOWLIST).toEqual(["andrew@defex.engineering"]);
  });

  it("holds only lower-case, trimmed addresses (isAllowedEmail relies on it)", () => {
    for (const email of SIGN_IN_ALLOWLIST) {
      expect(email).toBe(email.trim().toLowerCase());
    }
  });
});

describe("isAllowedEmail", () => {
  it("allows the owner", () => {
    expect(isAllowedEmail("andrew@defex.engineering")).toBe(true);
  });

  it("ignores case and surrounding whitespace", () => {
    expect(isAllowedEmail("Andrew@DEFEX.Engineering")).toBe(true);
    expect(isAllowedEmail("  andrew@defex.engineering\n")).toBe(true);
  });

  it("refuses the owner's other Google account", () => {
    // It is on the Google consent screen's test-user list, so Google itself
    // would let it through. This check is what stops it.
    expect(isAllowedEmail("andrew.fisher1511@gmail.com")).toBe(false);
  });

  it("refuses lookalikes", () => {
    for (const email of [
      "andrew@defex.engineering.example.com",
      "xandrew@defex.engineering",
      "andrew@defex.engineerin",
      "andrew@sub.defex.engineering",
      "andrew+admin@defex.engineering",
      "andrew@defex.engineering,someone@example.com",
      "andrew @defex.engineering",
    ]) {
      expect(isAllowedEmail(email), email).toBe(false);
    }
  });

  it("refuses anyone else", () => {
    expect(isAllowedEmail("someone@example.com")).toBe(false);
  });

  it("fails closed on a missing address", () => {
    expect(isAllowedEmail(null)).toBe(false);
    expect(isAllowedEmail(undefined)).toBe(false);
    expect(isAllowedEmail("")).toBe(false);
    expect(isAllowedEmail("   ")).toBe(false);
  });
});

describe("signInNoticeFor", () => {
  it("shows nothing when there is no error", () => {
    expect(signInNoticeFor(undefined)).toBeNull();
  });

  it("names the refused-account case", () => {
    expect(signInNoticeFor(AUTH_ERROR.notPermitted)).toBe("not-permitted");
  });

  it("shows the generic notice for every other callback error", () => {
    expect(signInNoticeFor(AUTH_ERROR.provider)).toBe("failed");
    expect(signInNoticeFor(AUTH_ERROR.missingCode)).toBe("failed");
    expect(signInNoticeFor(AUTH_ERROR.exchange)).toBe("failed");
  });

  it("never echoes unknown or repeated values back", () => {
    expect(signInNoticeFor("<script>alert(1)</script>")).toBe("failed");
    expect(signInNoticeFor([AUTH_ERROR.notPermitted, AUTH_ERROR.provider])).toBe("failed");
  });
});
