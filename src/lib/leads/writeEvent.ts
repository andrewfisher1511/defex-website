import "server-only";

import { createAnonClient } from "@/lib/supabase/anon";
import type { WriteResult } from "./writeLead";

export interface QuizCompletedEventInput {
  score: number;
  missed: number[];
}

/**
 * Inserts a public.events row. README "Quiz data": every completion is
 * logged here, anonymous by default — no email or name field exists on
 * this table at all, so there is nothing identifying to accidentally send.
 */
export async function writeQuizCompletedEvent(input: QuizCompletedEventInput): Promise<WriteResult> {
  const supabase = createAnonClient();

  const { error } = await supabase.from("events").insert({
    event_type: "quiz_completed",
    score: input.score,
    missed: input.missed,
  });

  if (error) {
    console.error("[events] insert failed:", error.message);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
