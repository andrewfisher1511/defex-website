/**
 * Small, dependency-free input checks shared by the /api route handlers.
 * Deliberately mirrors the DB CHECK constraints in
 * supabase/migrations/20260724090000_leads_and_events.sql — the DB is the
 * final word, this is just the layer that turns bad input into a clean
 * 422 instead of a Postgres error string reaching the client.
 */

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && value.length <= 320 && EMAIL_RE.test(value);
}

export function isNonEmptyString(value: unknown, maxLength: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;
}

/** Trims, caps length, and collapses empty/whitespace-only input to null. */
export function cleanOptionalString(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLength);
}

export function isQuizScore(value: unknown, totalQuestions: number): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= totalQuestions;
}

/** An array of in-range, integer question indices — not necessarily unique. */
export function isMissedQuestionList(value: unknown, totalQuestions: number): value is number[] {
  return (
    Array.isArray(value) &&
    value.length <= totalQuestions &&
    value.every((v) => typeof v === "number" && Number.isInteger(v) && v >= 0 && v < totalQuestions)
  );
}
