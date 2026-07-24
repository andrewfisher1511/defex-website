import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "./env";
import type { Database } from "./types";

/**
 * Stateless Supabase client on the public anon key — no cookies, no
 * session. For server-side writes that are inherently anonymous: lead
 * capture and quiz-completion events. The anon key carries no privileges
 * of its own; RLS on leads/events is insert-only from this role
 * (20260724090000_leads_and_events.sql) — see that migration for why this
 * is preferred over a service-role key.
 */
export function createAnonClient() {
  return createSupabaseClient<Database>(supabaseUrl(), supabaseAnonKey(), {
    auth: { persistSession: false },
  });
}
