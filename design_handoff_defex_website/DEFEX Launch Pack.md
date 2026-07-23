# DEFEX Launch Pack
Auth wiring · fee-proposal clauses · legal footer set
Prepared 23 July 2026 — hand the SQL/config to Claude Code as-is; clauses are drafts for your solicitor to confirm.

---

## Part A — Supabase Auth wiring (gate page → workspace)

Goal: one Google sign-in button on the gate page, with four access tiers that you control from a table — no redeploys to let someone in.

### A1. Google Cloud (do this first — it's what "lines up" the consent screen)
1. console.cloud.google.com → create project **DEFEX** (or reuse).
2. **APIs & Services → OAuth consent screen**:
   - User type: **External**.
   - App name: **DEFEX**, support email: andrew@defex.engineering.
   - App domain: `https://defex.engineering` · Privacy policy: `https://defex.engineering/privacy` · Terms: `https://defex.engineering/terms` ← these URLs must exist at launch; rev3's footer pages become these routes.
   - Authorised domain: `defex.engineering`.
   - Scopes: only `email`, `profile`, `openid` (non-sensitive → no Google review needed).
   - Publish the app (leave in "Testing" while only you sign in; Testing mode caps you at 100 named test users — fine for the trial phase).
3. **Credentials → Create credentials → OAuth client ID → Web application**:
   - Authorised JavaScript origins: `https://defex.engineering`, `http://localhost:3000`.
   - Authorised redirect URI: `https://<PROJECT-REF>.supabase.co/auth/v1/callback` (copy exactly from Supabase in A2).
   - Save the **Client ID** and **Client secret**.

### A2. Supabase dashboard
1. Your project → **Authentication → Providers → Google** → enable, paste Client ID + secret. Copy the callback URL shown there back into Google (A1.3).
2. **Authentication → URL Configuration**:
   - Site URL: `https://defex.engineering`
   - Additional redirect URLs: `http://localhost:3000`, plus your Vercel preview URL pattern if used.
3. **Authentication → Sign In / Up**: disable email/password signups (Google-only keeps the surface small; add email later if a client insists).

### A3. Access tiers (run in SQL editor)
```sql
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
```

### A4. Seed yourself, then invite others
```sql
-- 1. Sign in once through the gate with your Google account, then:
update public.profiles set role = 'owner' where email = 'andrew@defex.engineering';

-- 2. Invite a trial user (before they first sign in):
insert into public.invites (email, role) values ('client@example.com', 'trial');

-- 3. Promote later:
update public.profiles set role = 'free' where email = 'client@example.com';
```

### A5. Gate behaviour (Next.js contract for Claude Code)
- `<PrivatePreviewSignInButton />` → `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: siteUrl } })`.
- After redirect, read `profiles.role`:
  - `null` → polite "This preview is invite-only" state (stay on gate; show signed-in email + sign-out).
  - `trial` / `free` / `paid` / `owner` → button becomes **Enter DEFEX workspace** → `/app`.
- Middleware guards `/app/**`: no session → gate; session without role → gate.
- Paid tier (long-term): Stripe webhook → `update profiles set role='paid'` — the schema above already supports it; nothing to rebuild.

---

## Part B — Fee proposal template: photography & publication clause

Insert under your standard terms (suggested heading **"Photography and use of project imagery"**):

> **Photography and use of project imagery.** DEFEX Engineering Pty Ltd may take photographs and video of the site, building elements and defects during inspections and site attendances. These records form part of our engineering documentation and will be included in reports and working files for this engagement.
>
> The Client consents to DEFEX using photographs of the works in a de-identified form — without the property address, strata plan number, Client name, or any occupant or personal information — for professional purposes, including our website, capability statements, proposals to other clients, and professional development material. Imagery will illustrate the nature of the engineering work only and will not identify the property or comment publicly on its defects.
>
> The Client may withdraw or decline this consent at any time by written notice to andrew@defex.engineering, and DEFEX will not use (or will remove from future materials) the relevant imagery. Withdrawal of consent does not affect the use of photographs within the engineering reports and records for this engagement.

Optional tick-box variant for the acceptance page:
> ☐ The Client does **not** consent to de-identified project imagery being used in DEFEX marketing materials.

---

## Part C — Legal footer set (for Claude to apply across templates)

Use **"DEFEX Engineering Pty Ltd"** wherever the company is named as a legal entity (proposals, reports, invoices, terms). "DEFEX" / "DEFEX Engineering" stays fine as the brand in headings and body copy.

**Website + gate page (done):**
> © DEFEX Engineering Pty Ltd 2026. All rights reserved. · ABN 31 700 169 580

**Email signature (final line, 10–11px grey):**
> DEFEX Engineering Pty Ltd · ABN 31 700 169 580 · PO Box 148, Gymea NSW 2227
> This email and any attachments are confidential and may be subject to copyright. If received in error, please delete and notify the sender.

**Report covers / document footers (reports, site reports, minutes, proposals):**
> © DEFEX Engineering Pty Ltd 2026. This document and its contents are subject to copyright and were prepared solely for the named client and the stated purpose. It must not be reproduced, distributed, or relied upon by any other party or for any other purpose without the written consent of DEFEX Engineering Pty Ltd.

**Report limitations section (pairs with Terms of Use s.2 — add if not already in the template):**
> This report addresses only the specific building elements, defects and scope described herein, based on conditions observed at the time of inspection. It is not a certification of the whole building and must not be applied to other structures or later conditions.

---

## Part D — Email, environments & ops

### D1. Resend + sender identity (fixes the "from myself" email)
1. Resend dashboard → **Domains → Add domain** `defex.engineering` → add the DKIM/SPF DNS records it gives you at your DNS host; add a DMARC record too (`v=DMARC1; p=quarantine; rua=mailto:andrew@defex.engineering`).
2. Use two sender addresses (no mailboxes needed — they're send-only):
   - `enquiries@defex.engineering` — contact form traffic
   - `sign-in@defex.engineering` — Supabase auth emails (Supabase → Authentication → SMTP Settings → Resend SMTP credentials, sender "DEFEX \<sign-in@defex.engineering\>")
3. **Auto-reply to the enquirer** (what Graeme sees):
   - From: `DEFEX Engineering <enquiries@defex.engineering>`
   - Reply-To: `andrew@defex.engineering`
   - Subject: `Your enquiry has reached DEFEX`
   - Never "no-reply@" — a consultancy should invite replies.
4. **Internal notification to Andrew**:
   - From: `DEFEX Website <enquiries@defex.engineering>`
   - Reply-To: *the enquirer's email* — hitting Reply in your inbox goes straight to the client
   - Subject: `New enquiry — {name}, {suburb/project}`

### D2. Staging vs production (not confusing if named hard)
- Two Supabase projects: **defex-staging**, **defex-prod**. Two Google OAuth clients (staging one allows `localhost:3000` + Vercel preview URLs).
- Vercel env vars: Production → prod keys; Preview + Development → staging keys. Claude Code wires this once; you never think about it again.
- Day-to-day you only use prod. Staging exists for one thing: testing schema/auth changes before they touch real client data. Rule: if you're about to run SQL you haven't run before, run it on staging first.

### D3. SEO basics (what it is)
- **Title + meta description** — the headline and grey text Google shows for your site.
- **OG image** — the preview card when the link is shared in LinkedIn/iMessage/Teams (use the navy lockup on #1A1A2E).
- **robots noindex on /app** — stops the private workspace ever appearing in Google.
- You do nothing — this ships in the handoff as Next.js metadata.

### D4. Monitoring (no hiccups)
- **Sentry** (free tier): captures every JS error users hit, with stack trace + browser, emails you. Create account → one DSN key into the handoff.
- **UptimeRobot** (free): pings defex.engineering every 5 min, emails/SMS if the site goes down. Create account → add monitor → done. Five minutes total.

### D5. Analytics — Plausible (what it does)
One 1KB script tag. Dashboard shows visitors, top pages, referrers, countries, devices — live. **Cookieless**, so it complies with the APPs and your own privacy policy without a cookie banner (Google Analytics would force one). ~US$9/mo. You do: create account, add `defex.engineering`, paste the script tag into the handoff notes. That's it.

---

## Order of operations for day one
1. Run Part A SQL in Supabase; configure Google consent screen with the /privacy and /terms URLs.
2. Deploy rev3 + gate + legal pages (Claude Code) with routes `/`, `/privacy`, `/terms` — gate at `/`, full site behind auth until you flip it public.
3. Sign in yourself, run the owner update, invite your first trial user.
4. Drop Part B into the fee proposal template; Part C lines into email signature + report templates.
