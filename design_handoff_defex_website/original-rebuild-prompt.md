# Prompt: Rebuild the DEFEX Engineering website — About page first

Copy everything below the line into Claude Code (run from the `defex-website` repo root).

---

You are rebuilding the public marketing site for **DEFEX Engineering** — a deliberately small Sydney remedial engineering consultancy led by Andrew Fisher. The repo is `andrewfisher1511/defex-website` (Astro 5, deployed to Cloudflare Pages). Rebuild the **About page** (`/about`) to a standard that feels like a multi-million-dollar practice built it, plus the shared shell (nav, footer, motion system) that every other page will inherit. Do not invent content; do not drift from the brand system below. Precision over decoration.

## 1. Brand system (locked — do not re-derive)

**Colour. One accent only.**
- Electric Blue `#2563EB` — links, active nav, focus rings, progress, the diamond in the mark. If the page looks "too blue", it is.
- Navy Ink `#1A1A2E` — wordmark, headings, dark bands, hero overlays.
- Steel `#5C6B7F` — secondary text and captions.
- Canvas `#F9FAFB` — page background. Cards pure white.
- Concrete `#C9CFD8` — hairlines on dark surfaces, muted fills.
- Blueprint tint `#EFF4FE` (border `#D7E3FB`, ink `#6E84A8`) — info panels, selected states, table headers.
- Neutrals: body ink `#1C222B`, muted `#44505F`, border `#E4E7EC`.
- Never introduce a second hue. Status colours exist elsewhere in the brand but do not belong on the marketing site.

**Type.** Inter only, weights 300–700, scale 12/13/14/15/18/24/30/37/46px (extend upward for hero display, e.g. clamp to ~72–96px).
- Hero/display: **Light 300, uppercase**, tracking tight (−0.02em).
- Eyebrows/section labels: small **ALL-CAPS, wide tracking** (`ABOUT`, `HOW ENGAGEMENTS RUN`).
- Body: Regular 400; UI labels Medium 500; subheads Semibold 600; never faux-bold.
- Numerals in any figures: tabular lining.

**Geometry.** Strict 8pt grid. Card radius 12px, tiles 16px, buttons/inputs 8px, pills fully rounded. Cards = white + 1px `#E4E7EC` border + faint shadow (3–8% black, border-first elevation). Max content width 1400px, 32px gutters. Tap targets ≥44px.

**Interaction states.** Hover: primary buttons darken ~10%; outline buttons fill with `hsl(217 91% 97%)`; interactive cards lift `translateY(-2px)` with a soft blue shadow. Press: `scale(0.97)`. Focus-visible: 2px solid `#2563EB`, 2px offset, everywhere.

**Iconography.** Lucide only (~2px stroke). **No emoji anywhere.** No icon fonts, no hand-drawn SVG illustration.

## 2. Voice (binding)

Plain, competent, **Australian English** (organise, colour, metre). Direct, specific, never salesy. **No exclamation marks.** Em dashes for asides. Marketing eyebrows ALL-CAPS; everything else sentence case. The reader is addressed as "you"; the practice in third person.

## 3. About page content (keep this copy — it is approved)

Use the existing copy verbatim; the rebuild is visual and structural, not editorial:

- Eyebrow: `ABOUT` · H1: **"A deliberately small practice."**
- Three paragraphs (from the current page): the practice is led by Andrew Fisher — BEng(Civil), MIEAust, CPEng, NSW Registered Professional Engineer and NSW Registered Design Practitioner; the structural choice that the engineer who inspects is the engineer who reports, designs and superintends — accountability never blurs; and the DEFEX in-house platform that lets a small practice deliver with the speed and consistency of a large one.
- Credential chips (3): `BEng(Civil), MIEAust, CPEng` · `NSW Registered Professional Engineer` · `NSW Registered Design Practitioner`.
- Process section — "How engagements run", numbered `01–04`: Contact / Proposal / Investigation and reporting / Design and delivery (keep the existing one-line descriptions).
- CTA band: **"Talk to the engineer directly."** → Contact button.
- Footer: DEFEX wordmark + "Defects Resolved." · 0432 261 722 · andrew@defex.engineering · site links · "Remedial consulting engineers. Sydney metro, occasionally Greater NSW." · credentials line · © 2026 · Privacy.

**Hard guardrails:** ABN is TBC — if shown anywhere, use placeholder `XXX XXX XXX XXX`. **Never claim professional indemnity insurance.** Do not widen the service-area claim. Do not add testimonials, stats, or team members that don't exist.

## 4. Layout direction for /about

Architectural and editorial — closer to a well-set document than a SaaS template.

1. **Hero** — full-width architectural photograph under a navy→blue gradient overlay (`#1A1A2E` → `#2563EB` at low opacity, darker at the text edge). Eyebrow `ABOUT`, then the H1 set huge in Inter Light 300 uppercase, white. Subtle parallax on the photo (transform only, ~10%). A thin scroll-progress bar in Electric Blue fixed at the very top of the viewport.
2. **The practice** — two-column on desktop: the three paragraphs left (max ~65ch, 18px/1.7), a sticky right rail with the credential chips stacked as blueprint-tint cards and a small "The engineer you meet is the engineer who signs" pull-line in navy. Single column on mobile, chips as a wrapping row.
3. **How engagements run** — four steps on a vertical rule: oversized `01–04` numerals in Inter Light, Electric Blue; step title Semibold; one-line description in Steel. A thin blue progress line draws down the rule as the section scrolls (scroll-driven animation, transform/height only).
4. **CTA band** — full-width Navy Ink band, "Talk to the engineer directly." in Light 300, one primary Electric Blue button → `/contact`. No secondary clutter.
5. **Footer** — as specified above, on Canvas with a 1px top border.

## 5. Motion system (site-wide, restrained)

- Global transition: `0.2s ease` on colour/background/border/shadow/transform for all controls.
- Entrances: fade + 24px slide-up, `cubic-bezier(0.16, 1, 0.3, 1)`, 0.5–0.8s, staggered ~80ms within a section. Trigger once via IntersectionObserver (threshold ~0.2); never re-trigger on scroll-up.
- Hero: text staggers in on load (eyebrow → H1 → sub), photo does a slow 6s scale from 1.04→1.00.
- Process rule: scroll-linked line draw as above.
- Nav: `background: rgb(255 255 255 / 0.8)` + `backdrop-blur`, hairline border appears after 8px scroll; active link gets a 2px Electric Blue underline that slides between items.
- Page-to-page: Astro View Transitions (fade/slide, 0.3s).
- **`prefers-reduced-motion: reduce` disables all of it** — content simply appears.
- Nothing bouncy, nothing looping, no cursor gimmicks, no tilt cards, no particle effects.

## 6. Engineering bar (no mistakes)

- Astro 5, static output, component-per-section; motion in one small shared script (no animation libraries — CSS + IntersectionObserver is enough).
- Semantic HTML: one `h1`, ordered `h2`s, `<ol>` for the process, skip-link kept, visible focus everywhere, WCAG AA contrast (check white-on-blue and steel-on-canvas).
- Images: existing repo assets, AVIF/WebP with width/height set, lazy below the fold, hero preloaded. `font-display: swap` for Inter, self-hosted, weights 300/400/500/600/700 only.
- Keep existing meta/OG/canonical structure (`theme-color #1a1a2e`, OG image per page).
- Performance budget: Lighthouse ≥ 95 across the board, CLS < 0.02, no layout shift from animations (transform/opacity only).
- Day-first dates, `tel:+61432261722` and `mailto:` links kept.

When About is approved, apply the same shell, motion system and quality bar to Home, Services, Projects, DEFEX App and Contact — one page per pass, not all at once.
