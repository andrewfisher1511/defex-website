-- =====================================================================
-- Harden SECURITY DEFINER exposure on the PostgREST API surface
--
-- WHY THIS EXISTS
-- Supabase's database linter flagged both definer functions as callable
-- over the public REST API:
--
--   public.handle_new_user()  -> /rest/v1/rpc/handle_new_user
--   public.is_owner()         -> /rest/v1/rpc/is_owner
--
-- ...by `anon`, i.e. without signing in.
--
-- The `revoke execute ... from public` in the previous migration was NOT
-- enough. Supabase's default privileges grant EXECUTE to `anon`,
-- `authenticated` and `service_role` *explicitly* when a function is
-- created in `public`. Revoking from PUBLIC removes only the implicit
-- catch-all grant; the named grants survive. Confirmed by reading proacl:
--
--   is_owner: postgres=X/postgres  anon=X/postgres  authenticated=X/...
--
-- IMPACT
-- handle_new_user() is a trigger function, so calling it over RPC errors
-- with "trigger functions can only be called as triggers" — not
-- exploitable, but it should not be reachable at all.
-- is_owner() leaks a boolean about the caller and has no business being
-- a public endpoint.
--
-- THE FIX
-- Move is_owner() into a `private` schema. PostgREST only exposes the
-- schemas listed in its config (`public` by default), so a function in
-- `private` has no REST surface at all — a stronger guarantee than
-- getting the grants right on a function that stays exposed.
-- RLS policies can reference any schema, so the policies are unaffected
-- beyond the new name. `authenticated` still needs USAGE + EXECUTE,
-- because a policy's USING expression is evaluated as the calling role.
--
-- handle_new_user() must stay in `public` (the trigger on auth.users
-- references it there), so it just loses its EXECUTE grants. Triggers do
-- not re-check EXECUTE at fire time, so the signup flow is unaffected —
-- verified by signing a user up after applying this.
--
-- Apply after 20260723120100_fix_profiles_rls_recursion.sql. Staging first.
-- =====================================================================

begin;

-- PostgREST does not expose this schema, so nothing inside it is an endpoint.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'owner'
  );
$$;

revoke all on function private.is_owner() from public, anon;
grant execute on function private.is_owner() to authenticated;

-- Repoint the policies, then drop the exposed copy.
drop policy "owner reads all" on public.profiles;
create policy "owner reads all" on public.profiles
  for select
  to authenticated
  using (private.is_owner());

drop policy "owner manages invites" on public.invites;
create policy "owner manages invites" on public.invites
  for all
  to authenticated
  using (private.is_owner())
  with check (private.is_owner());

drop function if exists public.is_owner();

-- The trigger function needs no callable grants; only the trigger uses it.
revoke all on function public.handle_new_user() from public, anon, authenticated;

commit;
