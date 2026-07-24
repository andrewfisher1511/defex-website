import { NextResponse, type NextRequest } from "next/server";
import { isMissedQuestionList, isQuizScore, isValidEmail } from "@/lib/validation";
import { writeLead } from "@/lib/leads/writeLead";
import { sendQuizResultsEmail } from "@/lib/resend/send";
import { DBP_QUESTIONS, scoreBandFor } from "@/components/dbp/dbpQuizData";

const TOTAL = DBP_QUESTIONS.length;

/**
 * DbpQuiz's optional post-result email capture — README: "identity only if
 * the user submits email ... -> leads table with score."
 *
 * The client sends only score + the missed question indices; the band
 * title/blurb and each assist string are looked up here from
 * dbpQuizData.ts, the same canonical source the quiz UI renders from —
 * never taken from the request body. A client can only ever cause a
 * truthful result to be emailed, not an arbitrary one.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const { email, score, missed } = (body ?? {}) as Record<string, unknown>;

  const fieldErrors: Record<string, string> = {};
  if (!isValidEmail(email)) fieldErrors.email = "Enter a valid email address.";
  if (!isQuizScore(score, TOTAL)) fieldErrors.score = "Invalid score.";
  if (!isMissedQuestionList(missed, TOTAL)) fieldErrors.missed = "Invalid result.";

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json({ ok: false, fieldErrors }, { status: 422 });
  }

  const validScore = score as number;
  const validMissed = missed as number[];

  const lead = await writeLead({
    source: "quiz_email",
    email: email as string,
    score: validScore,
    missed: validMissed,
  });
  if (!lead.ok) {
    return NextResponse.json({ ok: false, error: "Could not record your details." }, { status: 502 });
  }

  const band = scoreBandFor(validScore);
  const missedAssists = validMissed.map((qIdx, idx) => ({ n: idx + 1, text: DBP_QUESTIONS[qIdx].assist }));

  const result = await sendQuizResultsEmail(email as string, {
    score: validScore,
    total: TOTAL,
    bandTitle: band.title,
    bandBlurb: band.blurb,
    missedAssists,
  });

  return NextResponse.json({ ok: true, emailSent: result.sent });
}
