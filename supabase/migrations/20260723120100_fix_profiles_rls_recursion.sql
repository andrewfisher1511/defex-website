-- =====================================================================
-- Fix: infinite recursion in the Part A3 owner policies
--
-- WHY THIS EXISTS
-- Part A3 defines the owner check inline:
--
--   create policy "owner reads all" on public.profiles for select using (
--     exists (select 1 from public.profiles p
--             where p.id = auth.uid() and p.role = 'owner'));
--
-- The USING clause of a policy ON public.profiles reads FROM
-- public.profiles. That inner read is itself subject to RLS, so
-- evaluating the policy requires evaluating the policy. Postgres detects
-- the cycle and aborts the statement:
--
--   ERROR: infinite recursion detected in policy for relation "profiles"
--
-- This is not cosmetic. Every read of public.profiles raises it,
-- including the single-row role lookup the site does on each request
-- (src/lib/auth/dal.ts, src/lib/auth/proxy-session.ts). That lookup
-- fails closed, so with the Part A3 policies alone NO user is ever
-- admitted, not even the owner. "owner manages invites" fails the same
-- way, because its USING clause also reads public.profiles.
--
-- THE FIX
-- Move the owner check into a SECURITY DEFINER function. It runs as the
-- function owner rather than the caller, so its read of public.profiles
-- bypasses RLS and the cycle disappears. This is the pattern Supabase
-- documents for exactly this case.
--
-- The policy *intent* from Part A3 is unchanged: owners read every
-- profile; owners manage invites; nobody else does either. Only the
-- mechanism changes. "read own profile" is untouched (it never recursed,
-- and it is what the role lookup actually relies on).
--
-- Hardening applied at the same time, both consistent with Part A3's
-- intent rather than additions to it:
--   * policies are scoped `to authenticated` — anon could never satisfy
--     them anyway (auth.uid() is null), this just makes that explicit
--     and stops anon being considered at all;
--   * the invites policy gets an explicit `with check`. Postgres already
--     reuses `using` as the insert/update check for a FOR ALL policy, so
--     this restates the existing behaviour rather than changing it.
--
-- Apply after 20260723120000_part_a3_access_tiers.sql. Staging first.
--
-- PRE-FLIGHT (expects the two Part A3 policies to exist):
--   select policyname from pg_policies
--    where schemaname = 'public' and tablename in ('profiles','invites');
--
-- TO REVERT: drop the two policies below, drop public.is_owner(), and
-- recreate the two policies exactly as they appear in Part A3. Auth will
-- stop working again, which is the point of this migration.
-- =====================================================================

begin;

-- Owner check that does not re-enter profiles' own RLS.
-- security definer + a pinned search_path is the safe form: the pinned
-- path stops a caller-controlled search_path from resolving `profiles`
-- to some other schema's table inside a definer-rights function.
create or replace function public.is_owner()
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

-- The function reads privileged rows, so do not leave it callable by anon.
revoke execute on function public.is_owner() from public;
grant execute on function public.is_owner() to authenticated;

drop policy "owner reads all" on public.profiles;
create policy "owner reads all" on public.profiles
  for select
  to authenticated
  using (public.is_owner());

drop policy "owner manages invites" on public.invites;
create policy "owner manages invites" on public.invites
  for all
  to authenticated
  using (public.is_owner())
  with check (public.is_owner());

commit;
