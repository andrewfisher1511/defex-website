import { describe, expect, it } from "vitest";
import {
  cleanOptionalString,
  isMissedQuestionList,
  isNonEmptyString,
  isQuizScore,
  isValidEmail,
} from "./validation";

describe("isValidEmail", () => {
  it.each(["andrew@defex.engineering", "a@b.co", "first.last+tag@example.com.au"])(
    "accepts %s",
    (value) => {
      expect(isValidEmail(value)).toBe(true);
    }
  );

  it.each([
    "",
    "not-an-email",
    "missing-domain@",
    "@missing-local.com",
    "has spaces@example.com",
    "no-tld@example",
    123,
    null,
    undefined,
    {},
  ])("rejects %j", (value) => {
    expect(isValidEmail(value)).toBe(false);
  });

  it("rejects an email over 320 characters", () => {
    const huge = "a".repeat(310) + "@example.com";
    expect(isValidEmail(huge)).toBe(false);
  });
});

describe("isNonEmptyString", () => {
  it("accepts a trimmed non-empty string within the limit", () => {
    expect(isNonEmptyString("Andrew", 200)).toBe(true);
  });

  it("rejects empty and whitespace-only strings", () => {
    expect(isNonEmptyString("", 200)).toBe(false);
    expect(isNonEmptyString("   ", 200)).toBe(false);
  });

  it("rejects a string over the max length", () => {
    expect(isNonEmptyString("a".repeat(201), 200)).toBe(false);
    expect(isNonEmptyString("a".repeat(200), 200)).toBe(true);
  });

  it("rejects non-strings", () => {
    expect(isNonEmptyString(42, 200)).toBe(false);
    expect(isNonEmptyString(null, 200)).toBe(false);
    expect(isNonEmptyString(undefined, 200)).toBe(false);
  });
});

describe("cleanOptionalString", () => {
  it("trims and caps length", () => {
    expect(cleanOptionalString("  hello  ", 10)).toBe("hello");
    expect(cleanOptionalString("a".repeat(20), 10)).toBe("a".repeat(10));
  });

  it("collapses empty/whitespace-only/non-string input to null", () => {
    expect(cleanOptionalString("", 10)).toBeNull();
    expect(cleanOptionalString("   ", 10)).toBeNull();
    expect(cleanOptionalString(undefined, 10)).toBeNull();
    expect(cleanOptionalString(42, 10)).toBeNull();
  });
});

describe("isQuizScore", () => {
  it("accepts integers in [0, total]", () => {
    for (let i = 0; i <= 8; i++) expect(isQuizScore(i, 8)).toBe(true);
  });

  it("rejects out-of-range, non-integer, and non-number values", () => {
    expect(isQuizScore(-1, 8)).toBe(false);
    expect(isQuizScore(9, 8)).toBe(false);
    expect(isQuizScore(3.5, 8)).toBe(false);
    expect(isQuizScore("5", 8)).toBe(false);
    expect(isQuizScore(null, 8)).toBe(false);
  });
});

describe("isMissedQuestionList", () => {
  it("accepts an in-range, correctly-sized array", () => {
    expect(isMissedQuestionList([0, 3, 7], 8)).toBe(true);
    expect(isMissedQuestionList([], 8)).toBe(true);
  });

  it("rejects out-of-range indices", () => {
    expect(isMissedQuestionList([8], 8)).toBe(false);
    expect(isMissedQuestionList([-1], 8)).toBe(false);
  });

  it("rejects a list longer than the question count", () => {
    expect(isMissedQuestionList([0, 1, 2, 3, 4, 5, 6, 7, 0], 8)).toBe(false);
  });

  it("rejects non-integer entries and non-arrays", () => {
    expect(isMissedQuestionList([1.5], 8)).toBe(false);
    expect(isMissedQuestionList(["1"], 8)).toBe(false);
    expect(isMissedQuestionList("not an array", 8)).toBe(false);
    expect(isMissedQuestionList(null, 8)).toBe(false);
  });
});
