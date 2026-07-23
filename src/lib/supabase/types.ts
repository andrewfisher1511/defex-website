/**
 * Hand-written to match supabase/migrations/20260723120000_part_a3_access_tiers.sql.
 * Regenerate from the live project once it exists:
 *   npx supabase gen types typescript --project-id <ref> > src/lib/supabase/types.ts
 */

/** Part A3: `create type app_role as enum ('owner','paid','free','trial')`. */
export type AppRole = "owner" | "paid" | "free" | "trial";

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
    };
    Views: Record<never, never>;
    Functions: {
      is_owner: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      app_role: AppRole;
    };
    CompositeTypes: Record<never, never>;
  };
}
