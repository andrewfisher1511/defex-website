import "server-only";

import { createAnonClient } from "@/lib/supabase/anon";
import type { LeadSource } from "@/lib/supabase/types";

export interface LeadInput {
  source: LeadSource;
  email: string;
  name?: string | null;
  phone?: string | null;
  topic?: string | null;
  message?: string | null;
  score?: number | null;
  missed?: number[] | null;
}

export interface WriteResult {
  ok: boolean;
  error?: string;
}

/** Inserts a row into public.leads. Every source requires a submitted email. */
export async function writeLead(input: LeadInput): Promise<WriteResult> {
  const supabase = createAnonClient();

  const { error } = await supabase.from("leads").insert({
    source: input.source,
    email: input.email,
    name: input.name ?? null,
    phone: input.phone ?? null,
    topic: input.topic ?? null,
    message: input.message ?? null,
    score: input.score ?? null,
    missed: input.missed ?? null,
  });

  if (error) {
    console.error("[leads] insert failed:", error.message, { source: input.source });
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
