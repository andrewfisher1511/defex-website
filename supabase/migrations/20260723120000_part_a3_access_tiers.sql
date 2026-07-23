-- =====================================================================
-- Part A3 — Access tiers (profiles, invites, trigger, RLS)
-- Source: design_handoff_defex_website/DEFEX Launch Pack.md, Part A3.
-- The statements below are VERBATIM from the Launch Pack.
--
-- APPLY ORDER (Launch Pack D2): run on defex-staging first, confirm a
-- full sign-in round trip, then run on defex-prod. "If you're about to
-- run SQL you haven't run before, run it on staging first."
--
-- PRE-FLIGHT (run before applying; all three must come back empty):
--   select 1 from pg_type where typname = 'app_role';
--   select 1 from information_schema.tables
--     where table_schema = 'public' and table_name in ('profiles','invites');
--   select 1 from pg_trigger where tgname = 'on_auth_user_created';
--
-- POST-APPLY DML is Part A4 and is NOT run here — seeding the owner role
-- requires you to have signed in through the gate once first:
--   update public.profiles set role = 'owner' where email = 'andrew@defex.engineering';
--
-- KNOWN ISSUE: the "owner reads all" policy below is self-referential
-- (a policy on public.profiles whose USING clause selects from
-- public.profiles), which Postgres rejects at query time with
-- "infinite recursion detected in policy for relation profiles".
-- That error breaks the role lookup for EVERY user, so nobody is ever
-- admitted. Fixed in the follow-up migration
-- 20260723120100_fix_profiles_rls_recursion.sql — see its header.
-- This file is kept verbatim so the Launch Pack and the schema history
-- agree; the fix is additive and separately revertable.
-- =====================================================================

begin;

-- role ladder: owner > paid > free > trial > none
create type app_role as enum ('owner','paid','free','trial');

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  full_name text,
  role app_role,          -- null = signed in but NOT admitted
  created_at timestamptz default now()
);

-- invites: put an email here BEFORE the person signs in
create table public.invites (
  email text primary key,
  role app_role not null default 'trial',
  invited_at timestamptz default now()
);

-- auto-create profile on first sign-in, picking up any invite
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id, new.email,
    new.raw_user_meta_data->>'full_name',
    (select role from public.invites where email = new.email)
  );
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.invites  enable row level security;

create policy "read own profile"  on public.profiles for select using (auth.uid() = id);
create policy "owner reads all"   on public.profiles for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner'));
create policy "owner manages invites" on public.invites for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner'));

commit;
