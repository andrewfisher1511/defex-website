/**
 * Hand-written to match supabase/migrations/*.sql. Regenerate from the live
 * project once one exists as the source of truth:
 *   npx supabase gen types typescript --project-id <ref> > src/lib/supabase/types.ts
 */

/** Part A3: `create type app_role as enum ('owner','paid','free','trial')`. */
export type AppRole = "owner" | "paid" | "free" | "trial";

/** 20260724090000_leads_and_events.sql: `create type lead_source as enum (...)`. */
export type LeadSource = "dbp_guide" | "quiz_email" | "contact_form";

/**
 * The access ladder from Part A3, most privileged first. Access control in
 * this app is deliberately flat — any non-null role is admitted (Part A5) —
 * but the order is the documented ladder and is what a future tier check
 * (e.g. paid-only routes) would compare against.
 */
export const APP_ROLES: readonly AppRole[] = ["owner", "paid", "free", "trial"];

export function isAppRole(value: unknown): value is AppRole {
  return typeof value === "string" && (APP_ROLES as readonly string[]).includes(value);
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          /** null = signed in but NOT admitted. */
          role: AppRole | null;
          created_at: string | null;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: AppRole | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: AppRole | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
      invites: {
        Row: {
          email: string;
          role: AppRole;
          invited_at: string | null;
        };
        Insert: {
          email: string;
          role?: AppRole;
          invited_at?: string | null;
        };
        Update: {
          email?: string;
          role?: AppRole;
          invited_at?: string | null;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          source: LeadSource;
          name: string | null;
          email: string;
          phone: string | null;
          topic: string | null;
          message: string | null;
          score: number | null;
          missed: unknown | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          source: LeadSource;
          name?: string | null;
          email: string;
          phone?: string | null;
          topic?: string | null;
          message?: string | null;
          score?: number | null;
          missed?: unknown | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          source?: LeadSource;
          name?: string | null;
          email?: string;
          phone?: string | null;
          topic?: string | null;
          message?: string | null;
          score?: number | null;
          missed?: unknown | null;
          created_at?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          event_type: "quiz_completed";
          score: number | null;
          missed: unknown | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_type: "quiz_completed";
          score?: number | null;
          missed?: unknown | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_type?: "quiz_completed";
          score?: number | null;
          missed?: unknown | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    // public.is_owner() (20260723120100) was moved into a non-exposed
    // `private` schema by 20260723120200 — app code never calls it via RPC,
    // only RLS policies reference it, so there is nothing to type here.
    Functions: Record<never, never>;
    Enums: {
      app_role: AppRole;
      lead_source: LeadSource;
    };
    CompositeTypes: Record<never, never>;
  };
}
