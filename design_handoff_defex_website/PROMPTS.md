# PROMPTS.md — Claude Code build plan (terminal-ready)

Run from your repo. One phase per session, commit between phases. Where a phase says **Opus**, switch with `/model opus` inside Claude Code, do the phase, then switch back.

## Setup (once)
```bash
npm install -g @anthropic-ai/claude-code
git clone https://github.com/andrewfisher1511/defex-website && cd defex-website
claude
```
Inside Claude Code: drop the unzipped `design_handoff_defex_website/` folder into the repo root first so Claude can read it.

**Model guidance**
- Default/fast model (your "Fable"): scaffolding, config, copy transplants, robots/SEO, small fixes. Low effort.
- **Sonnet**: all UI recreation and the quiz logic. Medium–high effort.
- **Opus**: auth/roles/RLS/middleware and the pre-launch security review. High effort — do not economise here.

---

## Phase 0 — Scaffold (Fable, low)
```
Read design_handoff_defex_website/README.md fully. Scaffold a Next.js App Router + TypeScript + Tailwind + shadcn/ui project matching this repo's conventions. Add Inter (300–700) via next/font, the design tokens from design_files/brand-tokens.json as Tailwind theme extensions and CSS custom properties, lucide-react, and copy design_files/assets into /public/assets. Create empty routes: /, /dbp-act, /terms, /privacy, /andrew-fisher. No UI yet. Commit.
```

## Phase 1 — Gate + legal pages (Sonnet, medium)
```
Recreate the private-preview gate from design_files/Defex-website-preview.dc.html, option 1a only (elements #1a desktop, #1a-mobile responsive behaviour, #1a-signedin as a state of the same component — not a separate page). Components: <ComingSoonGate/> and <PrivatePreviewSignInButton/> per README "Component map". The sign-in button is a stub for now (onClick console.log). Then recreate /terms and /privacy from the two legal .dc.html files, copy verbatim. Footer per README (gate footer has NO phone number). Pixel-match colours, spacing, type from the inline styles. Commit.
```

## Phase 2 — Main site (Sonnet, high)
```
Recreate design_files/DEFEX Website rev3.dc.html as the main site page: fixed 84px nav with 68px logo and scroll-border, hero with parallax + staggered entrance (cubic-bezier(0.16,1,0.3,1), respect prefers-reduced-motion), scroll-progress bar, all sections, and the footer including the quiet credential links (badge-check icons, verify.licence.nsw.gov.au URLs in README) without the Resume link (resume page deferred). Keep all copy exactly. Commit.
```

## Phase 3 — DBP Hub (Sonnet, high)
```
Recreate design_files/DEFEX DBP Hub.dc.html at /dbp-act: hero, the guide behind <DbpGuideGate/> (name+email, stub the lead write), the 8-question <DbpQuiz/> with the exact questions/options/explanations/assist strings and score bands from the file's script block (copy verbatim — no em dashes), personalised missed-question results, checklist, optional email capture (stub), and the Defect Map rendered ONLY as the "IN DEVELOPMENT" placecard behind a showDefectMap flag (default false) — port the full map component too, unrendered. Commit.
```

## Phase 4 — (reserved: resume page, deferred)
The /andrew-fisher resume page is being finalised in Claude Design and ships in a later pass, together with the footer Resume link. Skip to Phase 5.

## Phase 5 — Auth, roles, middleware (OPUS, high — the no-mistakes phase)
```
Implement DEFEX Launch Pack.md Part A exactly: Supabase Google OAuth via @supabase/ssr; run the Part A3 SQL as a migration (profiles, invites, trigger, RLS policies verbatim); middleware per README "State Management" (no session → gate; session without role → invite-only gate state; role → site). Gate button becomes the real signInWithOAuth call with the three ComingSoonGate states. Add env examples for staging + prod (two Supabase projects, two Google OAuth clients per Part D2). Write tests for the middleware role logic. Explain every RLS policy back to me before committing.
```

## Phase 6 — Email + capture wiring (Sonnet, medium)
```
Implement Launch Pack Part D1 with Resend: contact-form pair (auto-reply From "DEFEX Engineering <enquiries@defex.engineering>" Reply-To andrew@; internal notification Reply-To the enquirer), guide-gate and quiz-results emails, and leads/events tables (quiz completions anonymous; identity only on submitted email). Commit.
```

## Phase 7 — Ops & stealth (Fable, low)
```
Add: INDEXING env flag driving site-wide noindex,nofollow meta + robots.txt disallow (default off = hidden from Google); permanent noindex on any /app routes; page metadata + OG image (navy lockup on #1A1A2E) per README; Sentry init; Plausible script; deploy config for Vercel with staging/prod env split. Commit.
```

## Phase 8 — Pre-launch review (OPUS, high)
```
Security and correctness review of the whole repo: RLS policies vs Launch Pack Part A, middleware bypass paths, OAuth redirect allowlists, secrets handling, and a copy audit against the design files (flag ANY text that differs — copy is contractual). Produce a launch checklist mapped to Launch Pack "Order of operations for day one". Fix findings, commit.
```

---

**After Phase 8**: run the Launch Pack day-one order — Google consent screen (with live /privacy + /terms URLs) → seed owner role → invite first trial user → keep INDEXING=off until you say go.
