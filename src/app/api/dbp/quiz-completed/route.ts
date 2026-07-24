import { NextResponse, type NextRequest } from "next/server";
import { isMissedQuestionList, isQuizScore } from "@/lib/validation";
import { writeQuizCompletedEvent } from "@/lib/leads/writeEvent";
import { DBP_QUESTIONS } from "@/components/dbp/dbpQuizData";

const TOTAL = DBP_QUESTIONS.length;

/**
 * README "Quiz data": "anonymous by default. Log a completion event
 * (score, missed question ids) to an events table." Fired once, when
 * <DbpQuiz/> reaches its done state — no email, no name, nothing
 * identifying is ever sent here.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const { score, missed } = (body ?? {}) as Record<string, unknown>;

  if (!isQuizScore(score, TOTAL) || !isMissedQuestionList(missed, TOTAL)) {
    return NextResponse.json({ ok: false, error: "Invalid quiz result." }, { status: 422 });
  }

  const result = await writeQuizCompletedEvent({ score, missed });
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: "Could not record the result." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
