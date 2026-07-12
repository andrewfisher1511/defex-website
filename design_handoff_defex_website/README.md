# Handoff: DEFEX Engineering — marketing website rev2

Implementation brief for Claude Code (recommended: Sonnet, high reasoning). Target repo: `andrewfisher1511/defex-website` — Astro 5, static output, deployed to Cloudflare Pages.

## Overview
A full eight-page rebuild of the DEFEX Engineering public site: Home, Services, Projects, DEFEX App, About, Blog, Contact, Privacy. Architectural/editorial direction — big Inter Light uppercase display type, one Electric Blue accent, navy photographic heroes, restrained scroll-linked motion, and a CRM-grade contact form.

## About the design files
The files in `pages/` are **design references created in HTML** (single-file interactive prototypes) — they show intended look and behaviour, not production code to copy. The task is to **recreate these designs in the Astro codebase** using its established patterns (components per section, static output, self-hosted Inter). Ignore prototype plumbing: `support.js` references, `<x-dc>` wrappers, `{{ }}` holes, `_ds/` stylesheet links, and `data-reveal`/`ref` attributes are prototype mechanics — reimplement the equivalent behaviour natively (CSS + a small IntersectionObserver script; no animation libraries).

## Fidelity
**High-fidelity.** Colours, type sizes, spacing, radii, copy and interactions are final. Recreate pixel-perfectly. All copy in the prototypes is approved — do not rewrite it.

## Hard guardrails (binding)
- ABN is TBC — if shown, placeholder `XXX XXX XXX XXX`.
- **Never claim professional indemnity insurance.**
- Service area is exactly: "Sydney metro, occasionally Greater NSW."
- No emoji anywhere. No exclamation marks. Australian English. Lucide icons only (~2px stroke).
- One accent colour: Electric Blue `#2563EB`. If it looks too blue, it is.
- Projects are "representative engagements, described in general terms" — addresses and parties withheld. Verify the two new case studies (Podium waterproofing; Expert reporting) with Andrew before launch; the Inner West strata case is from the existing site.

## Design tokens
See `brand-tokens.json` (locked, canonical). Key values:
- Colours: Electric Blue `#2563EB` (hover `#1D4ED8`), Navy Ink `#1A1A2E`, Steel `#5C6B7F`, Canvas `#F9FAFB`, Concrete `#C9CFD8`, Blueprint tint `#EFF4FE` / border `#D7E3FB` / ink `#6E84A8`, body ink `#1C222B`, muted `#44505F`, grey `#98A2B3`, border `#E4E7EC`. Error `#B91C1C`, success `#15803D` on `#E8F6EE`.
- Type: Inter 300–700, self-hosted, `font-display: swap`. Display: Light 300 uppercase, tracking −0.02em (H1 76–104px, CTA h2 52px light). Section h2 37px Semibold. Body 16–18px/1.65–1.75. Eyebrows 13px Semibold, letter-spacing 0.32em. Tabular numerals for phone numbers and figures.
- Geometry: 8pt grid, 1400px max container, 32px gutters. Cards 12px radius (tiles/frames 16px), buttons/inputs 8px, chips full pills. 1px `#E4E7EC` borders, faint shadows. Tap targets ≥44px.
- States: primary hover `#1D4ED8` + lift `translateY(-2px)` + `0 8px 24px rgba(37,99,235,0.35)`; press `scale(0.97)`; focus-visible 2px solid `#2563EB`, 2px offset.

## Shared shell (every page)
- **Scroll progress bar**: fixed top, 3px, Electric Blue, width = scroll %.
- **Nav**: fixed, 72px, `rgba(255,255,255,0.82)` + `backdrop-blur(12px)`; hairline border + faint shadow appear after 8px scroll. Logo lockup (`assets/defex-lockup-light.png`, 36px high) left; links right (14px, Medium, `#44505F`, hover navy + `#F2F4F7` wash); active page Semibold navy with 2px blue bottom border; Contact as primary blue button.
- **CTA band**: navy `#1A1A2E`, 128px padding, h2 52px Light white, contact details in Concrete, blue button right, watermark `assets/defex-mark-white.svg` at 5% opacity rotated 8° off right edge.
- **Footer**: Canvas, 1px top border. 3 columns (1.5fr/1fr/1.2fr): lockup 44px + "Defects Resolved." + phone/email · SITE links · PRACTICE text. Bottom row: credentials line left, © 2026 + Privacy right.

## Motion system (site-wide)
- Reveals: fade + 24px slide-up, `cubic-bezier(0.16, 1, 0.3, 1)`, 0.7s, per-element delay stagger (0/60–240ms). IntersectionObserver threshold 0.15, rootMargin `0 0 -40px`, fire once.
- Hero intro on load: eyebrow → H1 → sub → buttons, 750ms each, 140ms stagger; photo heroes scale 1.06→1.00 over 6s.
- Photo hero parallax: background wrapper translates 0→90px over the hero's scroll.
- Scroll-drawn lines: vertical rule on Services list + About process (blue line height = progress to 72% viewport focal); horizontal timeline line on Services process (width = progress).
- Page transitions: Astro View Transitions, 0.3s fade/slide.
- All motion disabled under `prefers-reduced-motion: reduce` (content simply appears). Transform/opacity only; CLS < 0.02.

## Pages

### 1. Home (`pages/DEFEX Home.dc.html`)
- Photo hero 820px (`assets/hero-architecture.jpg`, navy→blue overlay `linear-gradient(155deg, rgba(26,26,46,0.93), rgba(26,26,46,0.62) 48%, rgba(37,99,235,0.42))`). Eyebrow "SYDNEY · REMEDIAL CONSULTING ENGINEERS", H1 "REMEDIAL ENGINEERING." 104px Light, sub line, two buttons (primary → /contact, outline → /services). Vertical SCROLL cue right.
- Practice strip: 26px Light lead + 3 blueprint-tint credential chips (Lucide `award`, `shield-check`, `pencil-ruler`), "About the practice →".
- Services grid: 3×2 white cards (16px radius) — numeral 40px Light blue, title, one-liner; hover lift + blue shadow; all link to /services.
- **Defect diagnostics interactive** (navy section): a 3-scenario carousel (Strata balconies / Podium and façade / Roof and interior — data in the logic's `scenarios`), switched by round outline chevrons + title + `n / 3` counter in the left column. Each scenario: photo in a 16px frame with 3 pin buttons (44px circles, white border, active = blue fill) whose glyph is the **white DEFEX X mark** (`assets/defex-mark-white.svg`, 22px — deliberate brand exception approved by Andrew). Clicking a pin swaps a white detail card (kind eyebrow / title / body / standards line) anchored away from the pin.
- Platform teaser: text left + Command board screenshot in dark browser frame (navy bar, 3 grey dots) right; link to /defex-app.
- CTA band + footer.

### 2. Services (`pages/DEFEX Services.dc.html`)
- Navy header with subtle 56px blueprint grid (white hairlines at 4.5% opacity) + faint mark watermark. H1 "REMEDIAL ENGINEERING, END TO END." + approved intro paragraph.
- Service list: `<ol>` with left vertical rule (grey 2px) + scroll-drawn blue line; 6 items, each 130px numeral column + content (h2 26px Semibold, paragraph ≤68ch). Items 01–02 use the existing site copy verbatim; 03–06 are new copy in voice — confirm with Andrew.
- Sticky "ON THIS PAGE" rail right (2px left border, anchor links).
- Engagement timeline (shared visual with About): horizontal 4-step grid, top rule + scroll-drawn blue line + node dots, 40px Light numerals. Steps = Contact / Proposal / Investigation and reporting / Design and delivery.
- CTA "Not sure which service you need?" + footer.

### 3. Projects (`pages/DEFEX Projects.dc.html`)
- White header: H1 "REPRESENTATIVE ENGAGEMENTS." + withholding note + **"ACTS FOR" client-type pill strip** (Owners corporations / Strata managers / Private owners / Insurers / Builders / Legal practitioners — client *types*, not names; named client logos only with written permission).
- 3 alternating case studies, each with an **image carousel**: 480px image (click = zoom-in cursor), white circular prev/next buttons overlaid, maximize button bottom-right, caption bar beneath (caption left, `n / 3` tabular counter right). Captions per image live in the logic's `galleries` data — replace with real project photography + captions.
- **Lightbox**: full-screen `rgba(12,12,24,0.93)` overlay, image ≤84vw/74vh, caption + counter below, prev/next/close buttons, Esc + arrow keys, backdrop click closes.
- CTA "A building presenting the same way?" + footer.

### 4. DEFEX App (`pages/DEFEX App.dc.html`)
- Navy header with blueprint grid; H1 "DEFEX — FIELD TO ISSUED DOCUMENT." + two approved paragraphs (incl. "not for sale, no pricing page"). Command board screenshot rises out of the header bottom in a browser frame (16px top radius, blue glow shadow).
- Alternating sections: Command ("One board, every engagement") with Timesheets screenshot · Capture ("Capture on site, keep the chain of evidence" — approved copy) with Capture settings screenshot. Screenshots in `screenshots/`.
- "What flows through DEFEX": 4 cards — Inspections (`clipboard-check`), Defect registers (`crosshair`), Claims and contract admin (`receipt`), Client portal (`globe`).
- CTA "Engage the practice, get the platform." + footer.

### 5. About (`pages/DEFEX About.dc.html`)
- As per the approved rev2 About: photo hero "A DELIBERATELY SMALL PRACTICE.", two-column practice section (24px Light lead + 2 paragraphs; sticky rail with navy pull-quote card "The engineer you meet is the engineer who signs." + 3 credential chips), then a **PEOPLE section ("The engineer")**: 360×420 rounded portrait slot (drop Andrew's photo in the prototype; real `<img>` in production) + name, "PRINCIPAL ENGINEER" title line, two bio paragraphs (facts only — no invented staff), LinkedIn + email buttons. When the practice grows this section becomes a card grid — same portrait/name/title/bio pattern per person. Then the vertical scroll-drawn process 01–04, CTA, footer.

### 7. Privacy (`pages/DEFEX Privacy.dc.html`)
- Same shell; white header H1 "PRIVACY." + "Last updated July 2026". Five white cards on canvas (max 860px column): What is collected / How it is used (notes automated subject summarisation; content not used to train models) / Who it is shared with / Storage and retention / Access and questions. Plain Australian-English copy — have Andrew review before launch; it is a draft, not legal advice. Footer Privacy links on every page point here.

### 6. Contact (`pages/DEFEX Contact.dc.html`)
- White header: H1 "DISCUSS A DEFECT." + approved sub.
- Two columns on canvas: **sticky left rail** — PHONE (24px Light, tel:), EMAIL (20px Light, mailto:), SERVICE AREA, and a blueprint-tint tip card (Lucide `camera`): "Attachments help with an early read…".
- **Form card** (white, 16px radius, 44–48px padding):
  - Name* · Email* (half) + Phone (half, tabular numerals)
  - "I am the" — pill toggle chips: Owner / Strata manager / Body corporate / Builder / Insurer / Other (single-select, click again to clear; selected = blue fill)
  - Building address + **Maps button** (blueprint-tint, `map-pin` icon; disabled until text; opens `https://www.google.com/maps/search/?api=1&query=<address>, NSW, Australia` in new tab). Helper: "The Maps button checks the address you have typed." Production upgrade: Google Places Autocomplete (session tokens, `country:au`).
  - "What's happening with the building?"* — 6-row textarea, symptom-prompt placeholder
  - "How did you hear about us?" — free text, placeholder "Referral, search, strata manager, previous project…"
  - **Uploads** — dashed drop zone (`upload` icon, "Drop files here, or click to browse", cap 10 files); drag-over highlights blue; file chips list name + size + type icon (`image`/`file-text`/`file`) + remove ×
  - Submit "Send enquiry →" + privacy microcopy "Details are used only to respond to this enquiry."
- **Validation**: required Name, Email (format-checked), description. Errors: red `#B91C1C` border + message under field + summary beside button. No browser-native validation UI.
- **Success state** replaces the card: green check disc, "Enquiry sent.", personalised first-name line, urgent-call fallback, attachment count line, then a **"What Andrew receives" email preview**: To line, an **AI-summarised subject line** (live in the prototype via an LLM call with a deterministic fallback — see `generateSubject()`), and the two magic-link action buttons ("Add to DEFEX Command as potential job" / "Create CRM contact"). "Send another enquiry" reset.
- Production: POST to `/api/enquiry` — full pipeline in **`form-endpoint-spec.md`** (Turnstile + honeypot, R2 attachments, AI subject with 3s fallback, Resend relay — Resend is already working from rev1 — auto-acknowledgement, and signed magic links that create a draft Command job + CRM contact on click).

### 8. Blog (`pages/DEFEX Blog.dc.html`)
- Index: H1 "NOTES FROM SITE." + sub ("web versions of posts first shared on LinkedIn") + "Follow on LinkedIn" button. 3-column card grid: image, category + date eyebrow, title, excerpt, "Read post".
- Article view (in-page in the prototype; real `/blog/<slug>` routes in production): back link, category/date/author meta, 46px title, hero image, ~3 body paragraphs (17px/1.8), footer row with "Discuss this post on LinkedIn" + contextual Contact CTA.
- The three posts are **sample content** — the production build should source posts from Markdown/MDX files so Andrew can add a post per LinkedIn article. Sync direction: write here, share to LinkedIn.

### 9. Shared social row (all footers)
- LinkedIn / Facebook / Instagram 44px icon buttons under the footer contact line (Lucide icons). URLs are placeholders — confirm the real profile URLs before launch.

### Google Reviews (decision note)
- Deliberately NOT a sitewide "Rate me" button — an open prompt invites drive-by reviews and reads needy on a professional-practice site. Instead: request reviews in the post-completion email (happy clients, right moment), and once a strong rating exists, show a small static "★ 4.9 on Google" badge near the footer or Contact rail linking to the profile. Revisit after ~10 reviews.

### 10. "Ask DEFEX" AI assistant (prototyped on Home; roll out sitewide)
- Floating 56px Electric Blue FAB bottom-right with an "Ask DEFEX" navy pill label beside it (label hides after first open; per-session) → 388×min(540px, 100vh−130px) panel: navy header (white mark, "Ask DEFEX", "Answers from this website's information"), scrolling message list (user = blue right bubbles, assistant = white bordered left bubbles), "Thinking…" state, input + send (Enter works), disclaimer microcopy with phone fallback.
- Production: same Anthropic Messages API as the subject line (Haiku-class, temperature 0, ~400 max tokens), called from a Pages Function `/api/ask` (key stays server-side). System prompt = the guardrails in the prototype's `chatSystem` + `siteKnowledge` — REGENERATE the knowledge blob at build time from the site's actual page content so it never drifts. Hard rules baked in: answer only from site content; decline out-of-scope with phone/email; never give building-specific engineering advice (recommend an inspection); no invented fees/insurance/clients; Australian English, no exclamation marks. Rate-limit per IP; log questions (they are FAQ research gold).

### 11. Log in + client/builder portal
- Nav (all pages): quiet outline "Log in" button (lock icon) → `https://app.defex.engineering`. DEFEX App page hero adds a primary "Log in to DEFEX" button + "Approved users only — sign-in verified with an authenticator app."
- Auth spec: Supabase Auth with TOTP MFA (authenticator app) enforced for all accounts; Andrew = admin. Client/builder accounts are invited per project; portal shows ONLY the projects that account is connected to (row-level security on project membership) — dashboards, documents, programs, progress. No self-signup.

### 12. Small additions
- Footer (all pages): credentials line now includes NER and `ABN XXX XXX XXX XXX` (placeholder — replace when the ABN is confirmed; switch to ACN if that is what gets registered). PRACTICE column has a "Capability statement (PDF)" link — href is a placeholder until the PDF exists (generate it from the brand kit's report templates).
- Contact rail: HOURS block (Mon–Fri 8:00am–5:00pm, site attendances by arrangement — CONFIRM with Andrew) and an embedded Google Maps plan view of Gymea NSW (keyless `output=embed` iframe; production may swap to the Maps Embed API with the practice's place entry once a Google Business Profile exists).

### Decisions & recommendations (from design review)
- **Dark mode**: recommend AGAINST on the marketing site — the brand is deliberately light/document-like, photography + navy bands already provide dark rhythm, and a second theme doubles visual QA. If wanted later, the Astro build makes it cheap: move the ~15 colour literals to CSS custom properties and add a `[data-theme=dark]` block + 3-state toggle (light/dark/auto via `prefers-color-scheme`). Dark mode DOES belong in the DEFEX app product (field use at night).
- **Testimonials**: yes, but only real quotes with written permission. Pattern: a single restrained quote strip (navy band, one 26px Light quote, attribution by role — "Strata manager, Inner West" — names optional) between Projects' last case study and the CTA. Do not launch with placeholders; add when 2–3 permissions exist.
- **Accreditations/certifications**: folded into the existing credential chips + footer line (CPEng, MIEAust, NER, both NSW registrations) rather than a separate section — a dedicated "Accreditations" page for four items reads as padding. Add logos (Engineers Australia etc.) only if brand-permitted, as small greyscale marks under the About credential rail.
- **FAQs**: superseded by Ask DEFEX — the logged questions become the FAQ source if a static section is ever wanted for SEO (then: 5–6 questions max, `<details>` accordions, schema.org FAQPage markup).

## State management (Contact page)
`name, email, phone, role, address, desc, hear, files[], errors{}, submitted`. Errors computed on submit only; cleared on successful submit; reset restores empty form. Files stored as name+size (prototype does not upload).

## Interactions & behaviour summary
- Nav border/shadow toggles at 8px scroll; progress bar tracks scroll.
- Defect-pin selector on Home (click to switch active pin card).
- Scroll-drawn blue lines (Services list, Services timeline, About process).
- Card hovers: lift + blue shadow; buttons: darken/lift/press-scale; focus rings everywhere.
- All internal links: Home ↔ Services ↔ Projects ↔ DEFEX App ↔ About ↔ Contact; tel:/mailto: throughout.

## Engineering bar
- Astro 5 static; component per section; one small shared motion script.
- Semantic HTML: one h1/page, `<ol>` for processes/services, labels bound to inputs, skip-link, WCAG AA contrast.
- Images AVIF/WebP with dimensions, hero preloaded, below-fold lazy. Self-hosted Inter 300/400/500/600/700.
- Meta/OG per page (existing structure, `theme-color #1a1a2e`); **per-page OG images generated at build** (e.g. satori/astro-og) — navy card, lockup, page title in Inter Light uppercase.
- Lighthouse ≥95 all categories; CLS < 0.02.

## Assets
- `assets/` — logo lockups + SVG marks + 4 architectural photos (from the locked brand drop).
- `screenshots/` — real DEFEX app captures: `defex-command-board.png`, `defex-timesheets.png`, `defex-capture-settings.png`.
- `brand-tokens.json` — canonical tokens incl. company facts.
- `original-rebuild-prompt.md` — the approved rev2 brief this build follows.

## Companion specs
- **`mobile-nav-spec.md`** — the <900px navigation drawer + page-level mobile rules. Implement alongside the pages, not after.
- **`form-endpoint-spec.md`** — the `/api/enquiry` Cloudflare Pages Function: spam gates, R2 attachments, AI subject line, Resend relay (already configured in rev1), and the magic push-to-Command/CRM links.
- **`content-editing-spec.md`** — post-launch editing: content as Markdown/JSON, Cloudflare preview deployments as the sandbox, AI-driven edits via Claude Code / the Claude GitHub app, and the LinkedIn post pipeline. Structure `content/` from day one so this workflow works.
- **`launch-checklist.md`** — everything remaining to launch, split by owner (Andrew's content/facts vs Claude Code's build tasks vs post-launch).
- **`How to Edit (print to PDF).dc.html`** — Andrew's printable editing guide (open in the design workspace and print to PDF).

## Files
- `pages/DEFEX Home.dc.html` · `pages/DEFEX Services.dc.html` · `pages/DEFEX Projects.dc.html` · `pages/DEFEX App.dc.html` · `pages/DEFEX About.dc.html` · `pages/DEFEX Contact.dc.html` · `pages/DEFEX Privacy.dc.html` · `pages/DEFEX Blog.dc.html`
(Reference prototypes; view them in the original design workspace for full interactivity.)
