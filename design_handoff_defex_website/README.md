# Handoff: DEFEX Website Launch (gate + main site + DBP hub + legal + resume)

## Overview
Complete public-website launch package for **DEFEX Engineering Pty Ltd** (ABN 31 700 169 580), a Sydney remedial engineering consultancy. Five surfaces:

1. **Private-preview gate** at the root domain (variant "1a Photographic") — single sign-in action, no navigation.
2. **Main marketing site** ("rev3") — shown to authenticated, admitted users until public launch, then flipped public.
3. **DBP Act Hub** — plain-English guide (behind a name+email gate), an 8-question interactive quiz with personalised results, and a feature-flagged "Defect Map" (ships hidden).
4. **Legal pages** — Terms of Use and Privacy Policy (copy is final, solicitor review pending).

(A resume/capability page for Andrew Fisher is being finalised separately in Claude Design and is NOT in this build — see "Known open items".)

Backend wiring (Supabase auth + role tiers, Resend email identity, staging/prod environments, SEO/noindex flag, Sentry/UptimeRobot/Plausible) is specified in `DEFEX Launch Pack.md` — treat it as part of this handoff.

## About the Design Files
The files in `design_files/` are **design references created in HTML** (Claude Design "Design Components"). They are prototypes showing intended look and behaviour — **not production code to copy**. The task is to **recreate these designs in the target codebase**: Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui, matching the patterns of the existing `andrewfisher1511/defex` repo family. Open each `.dc.html` in a browser to inspect; all styling is inline, so every value is readable in the markup. (They reference a `_ds/` token stylesheet that isn't bundled — the token values are enumerated below and in `brand-tokens.json`, and inline styles carry the design regardless.)

## Fidelity
**High-fidelity.** Recreate pixel-accurately: colours, type scale, spacing, radii, copy. All copy (guide, quiz questions/explanations, legal pages, resume) is **final and must be reproduced verbatim** — Australian English, no em dashes in quiz copy, no emoji anywhere.

## Routes
| Route | Source design | Access |
|---|---|---|
| `/` | `Defex-website-preview.dc.html` → option **1a** (`#1a` desktop, `#1a-mobile`, `#1a-signedin`) | Public |
| `/` (authed + admitted) | `DEFEX Website rev3.dc.html` | role ∈ {trial, free, paid, owner} |
| `/dbp-act` | `DEFEX DBP Hub.dc.html` | Same as main site pre-launch |
| `/terms`, `/privacy` | `DEFEX Terms of Use.dc.html`, `DEFEX Privacy Policy.dc.html` | Public (OAuth consent screen links here) |

## Component map (suggested names)
- `<ComingSoonGate />` — full-screen gate; states: signed-out (default), signed-in-not-admitted ("This preview is invite-only" + signed-in email + sign out), signed-in-admitted (button becomes "Enter DEFEX workspace").
- `<PrivatePreviewSignInButton />` — `supabase.auth.signInWithOAuth({ provider: 'google' })`; 52px min-height, #2563EB, radius 8, hover #1D4ED8 + translateY(-1px), press scale(0.97), focus 2px ring offset 2.
- `<SiteNav />` — sticky, 84px tall, `rgba(255,255,255,0.92)` + backdrop-blur, bottom border appears after 8px scroll; logo `defex-lockup-horizontal-navy.png` at 68px height.
- `<SiteFooter />` — includes the credentials row: quiet 13px underlined links (underline colour #C9CFD8, offset 3px, hover #2563EB) with 13px Lucide icons: `badge-check` → NSW Professional Engineer (https://verify.licence.nsw.gov.au/details/Professional%20Engineer/53509), `badge-check` → NSW Design Practitioner (https://verify.licence.nsw.gov.au/details/Design%20Practitioner/53511). **Omit the Resume link for now** — the resume page is deferred; the footer link ships in a later pass. © line: "© DEFEX Engineering Pty Ltd 2026. All rights reserved." + Privacy + Terms links. Contact block includes "PO Box 148, Gymea NSW 2227 · ABN 31 700 169 580". **The gate page footer omits the phone number; the main site keeps it.**
- `<DbpGuideGate />` — name + email → reveals guide, writes a lead (`source: 'dbp_guide'`). Server-flag `gateGuide` to disable.
- `<DbpQuiz />` — see State Management.
- `<DefectMap />` — fully built in the design file but ships behind flag `showDefectMap=false`; render the "IN DEVELOPMENT" placecard instead.

## Interactions & Behaviour
- **Motion**: 0.2s ease on all controls; entrances `cubic-bezier(0.16,1,0.3,1)` fade/slide-up 0.3–0.8s; hero parallax + scroll-progress bar on rev3 (see its logic script); respect `prefers-reduced-motion`.
- **Quiz flow**: one question at a time, 3 options; after pick → correct option turns green (#ECFDF3/#12B76A/#067647), wrong pick red (#FEF3F2/#F04438/#B42318), explanation panel with 3px left border; progress bar tops the card. End: score band (0–3 "Time for a crash course", 4–6 "Solid foundations", 7–8 "Committee ready"), then "Where DEFEX can help you specifically" built from the *missed* questions' `assist` strings, the 5-item strata-manager checklist, optional email capture, "Retake the check", CTA to contact.
- **Quiz data**: anonymous by default. Log a completion event (score, missed question ids) to an `events` table; attach identity only if the user submits email (guide gate or results email) → `leads` table with score. Covered by the Privacy Policy as written.
- **Email flows** (Launch Pack Part D1): auto-reply From `DEFEX Engineering <enquiries@defex.engineering>` Reply-To andrew@; internal notification From `DEFEX Website <enquiries@defex.engineering>` Reply-To the enquirer; auth emails From `sign-in@defex.engineering` via Supabase SMTP.
- **Indexing**: site-wide `noindex,nofollow` + robots.txt disallow behind env flag `INDEXING=off` (flip at launch). `/app` and the workspace stay noindex forever.

## State Management
- Auth/roles: `profiles.role` enum `owner|paid|free|trial|null` + `invites` table, trigger and RLS per Launch Pack Part A3 (run verbatim, staging first).
- Middleware: no session → gate; session without role → gate (invite-only state); role present → site/workspace.
- Feature flags (env or config): `INDEXING`, `showDefectMap`, `gateGuide`.
- Quiz: local component state (index, picked, missed[], done); no persistence needed beyond the completion event.

## Design Tokens
- **Colours**: Electric Blue `#2563EB` (single accent; hover `#1D4ED8`), Navy Ink `#1A1A2E`, body `#44505F`, muted `#5C6B7F`, faint `#98A2B3`, Concrete `#C9CFD8`, border `#E4E7EC`, Canvas `#F9FAFB`, Blueprint tint `#EFF4FE` (chip border `#BFD3F8`), success `#12B76A`/`#067647`/`#ECFDF3`, error `#F04438`/`#B42318`/`#FEF3F2`, warning text `#B54708`. Hero overlay: `linear-gradient(155deg, rgba(26,26,46,0.94), rgba(26,26,46,0.78) 48%, rgba(37,99,235,0.45))`. Blueprint grid: 1px `rgba(37,99,235,0.07–0.09)` lines, 40–56px cells, on navy.
- **Type**: Inter 300–700 only. Hero display 64–92px weight 300 uppercase tracking -0.02em; section h2 32–40px weight 300; card titles 600; body 15–16px/1.65–1.75; UI labels 500; eyebrows 13px/600/letter-spacing 0.32em uppercase; tabular-nums on dates/figures.
- **Spacing**: 8pt grid; section padding 88px; card padding 22–44px; 44px min tap targets (52px primary buttons).
- **Radius**: controls 8, cards 12–16, pills 999.
- **Shadows**: soft (`0 4px 24px rgba(16,24,40,0.12)` cards); blue lift on hover `0 8px 24px rgba(37,99,235,0.35)`.
- Full canonical set: `design_files/brand-tokens.json`.

## Assets (`design_files/assets/`)
Logos (transparent PNGs): `defex-lockup-horizontal-navy/white`, `defex-lockup-stacked-navy/white`, `defex-mark-navy/white-2048`, wordmarks. Photography: `hero-architecture.jpg`, `project-1..3.jpg`. Use Lucide for all icons (stroke 2).

## Files
- `design_files/*.dc.html` — the five design references (open in a browser)
- `design_files/brand-tokens.json` — canonical tokens
- `DEFEX Launch Pack.md` — Supabase/Google OAuth/Resend/environments/ops spec (Parts A–D) + fee-proposal and footer legal copy
- `PROMPTS.md` — phased Claude Code prompt plan with model/effort guidance

## Known open items (do not guess)
- Gate "Sign in with Google" is mocked in the design; wire per Launch Pack A5.
- Defect Map ships hidden; real defect photos to be added later.
- Resume page (/andrew-fisher) deferred — being finalised in Claude Design; footer Resume link ships with it.
- Legal copy pending solicitor sign-off — implement as-is, keep copy in easily-editable files/MDX.
- ABN is confirmed (31 700 169 580); PI insurance is **unconfirmed — never claim it anywhere**.
