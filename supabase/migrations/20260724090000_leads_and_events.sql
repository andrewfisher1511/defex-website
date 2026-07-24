-- =====================================================================
-- Leads and events — Launch Pack Part D1 email flows + README "Quiz data"
--
-- Three flows write here:
--   dbp_guide    — DbpGuideGate: name + email -> a lead, guide email sent.
--   quiz_email   — DbpQuiz results: email + score -> a lead, results email sent.
--   contact_form — /contact: name + email + message -> a lead, the auto-reply
--                  + internal-notification pair sent (Part D1.3/D1.4).
--
-- README "Quiz data": "anonymous by default. Log a completion event (score,
-- missed question ids) to an events table; attach identity only if the user
-- submits email ... -> leads table with score." events is therefore always
-- written on quiz completion, with no email/name — leads only gets a row
-- when someone actually hands over an email address.
--
-- SECURITY MODEL
--   - RLS stays on for both tables. Owner reads everything via
--     private.is_owner() (20260723120200) — same function the profiles/
--     invites policies already use.
--   - No SELECT/UPDATE/DELETE for anon or authenticated at all: from the
--     public's side these tables are write-only. Nobody can read back
--     another visitor's email, message, or quiz score.
--   - INSERT is open to anon + authenticated, gated by a CHECK rather than
--     an application secret. Reached in practice only through this app's
--     own Route Handlers (server-side, anon key) — Turnstile/rate-limiting
--     is explicitly future work (form-endpoint-spec.md "Later (agreed
--     backlog)") and is NOT implemented here.
--   - Deliberately still no SUPABASE_SERVICE_ROLE_KEY anywhere in this
--     project (see src/lib/supabase/env.ts) — that key bypasses RLS on
--     EVERY table, including profiles/invites, and nothing here needs
--     that blast radius for what is, worst case, a spammed lead table.
--   - Row-shape integrity (which fields a given source must carry) is
--     enforced with CHECK constraints, not RLS — RLS is about *who*,
--     CHECK is about *what*.
--
-- Apply to defex-staging (tmikvcbrwmjeedleengb) ONLY in this pass. Do not
-- apply to defex-prod (ezbnjdvsexspzovlfzaq) until told to — Launch Pack
-- D2's rule: unfamiliar SQL runs on staging first.
-- =====================================================================

begin;

create type public.lead_source as enum ('dbp_guide', 'quiz_email', 'contact_form');

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  source lead_source not null,
  name text,
  email text not null,
  phone text,
  topic text,
  message text,
  score integer,
  missed jsonb,
  created_at timestamptz not null default now(),

  constraint leads_email_format check (email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  constraint leads_email_length check (char_length(email) <= 320),
  constraint leads_name_length check (name is null or char_length(name) <= 200),
  constraint leads_phone_length check (phone is null or char_length(phone) <= 40),
  constraint leads_topic_length check (topic is null or char_length(topic) <= 200),
  constraint leads_message_length check (message is null or char_length(message) <= 5000),
  constraint leads_score_range check (score is null or score between 0 and 8),

  -- Each source's required shape, matching what its form actually collects.
  constraint leads_source_shape check (
    case source
      when 'dbp_guide'    then name is not null and char_length(trim(name)) > 0
      when 'contact_form' then message is not null and char_length(trim(message)) > 0
      when 'quiz_email'   then score is not null
      else true
    end
  )
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  score integer,
  missed jsonb,
  created_at timestamptz not null default now(),

  -- Widen this list (and the matching RLS check below) if a new event type
  -- is ever added — deliberately not a free-text field.
  constraint events_event_type_known check (event_type = 'quiz_completed'),
  constraint events_score_range check (score is null or score between 0 and 8)
);

alter table public.leads enable row level security;
alter table public.events enable row level security;

create policy "owner reads leads" on public.leads
  for select to authenticated
  using (private.is_owner());

create policy "owner reads events" on public.events
  for select to authenticated
  using (private.is_owner());

create policy "public submits leads" on public.leads
  for insert to anon, authenticated
  with check (source in ('dbp_guide', 'quiz_email', 'contact_form'));

create policy "public logs events" on public.events
  for insert to anon, authenticated
  with check (event_type = 'quiz_completed');

commit;
