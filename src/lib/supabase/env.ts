/**
 * Supabase connection settings.
 *
 * Only the URL and the anon/publishable key belong here. The anon key is
 * safe in the browser: it carries no privileges of its own, and every table
 * it can reach is behind RLS (Part A3). The Google OAuth client ID and
 * secret are NOT app config — they live in the Supabase dashboard
 * (Part A2.1), so this app never handles them.
 *
 * Never add SUPABASE_SERVICE_ROLE_KEY to this project. It bypasses RLS
 * entirely, and nothing here needs it: role changes are run by hand in the
 * SQL editor (Part A4) and the signup trigger is SECURITY DEFINER.
 */

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to .env.local and fill in the ` +
        `defex-staging values (see .env.example for where each one comes from).`
    );
  }
  return value;
}

export function supabaseUrl(): string {
  return required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
}

export function supabaseAnonKey(): string {
  return required("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/** True when both are set — lets the proxy fail loudly but only where it matters. */
export function hasSupabaseEnv(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/**
 * Absolute origin used to build the OAuth `redirectTo`. Must be listed in
 * Supabase → Authentication → URL Configuration (Part A2.2), otherwise
 * Supabase refuses the redirect.
 */
export function siteUrl(fallbackOrigin: string): string {
  return process.env.NEXT_PUBLIC_SITE_URL || fallbackOrigin;
}

/** Where an admitted user goes from the gate (Part A5). */
export function workspaceUrl(): string {
  return process.env.NEXT_PUBLIC_WORKSPACE_URL || "/app";
}
