# HANDOFF.md — DEFEX Engineering website overnight build

**Build date:** 6 July 2026 (overnight, unattended)
**Builder:** Claude Code (Opus 4.8, 1M context)
**Repo state:** clean; tasks T0–T13 committed (`T{n}:` prefixes).
**Build status:** ✅ `npm run build` green — facts gate passes, budget 255 kB (< 1 MB), 8 pages.

---

## ⚠️ Read this first: the preview URL

**There is no `*.pages.dev` preview URL yet.** The one step this unattended run
could **not** complete is the Cloudflare Pages deploy, because this environment
has **no Cloudflare credentials** (`CLOUDFLARE_API_TOKEN` is unset and wrangler
is not logged in). The deploy fails fast with:

> In a non-interactive environment, it's necessary to set a CLOUDFLARE_API_TOKEN…

Everything that produces the deploy — a complete, gate-passing `dist/` plus the
Pages Function — **is done and committed.** Publishing is now a single command.

### To deploy the preview (one step, needs credentials)

From the repo root, either log in interactively:

```
npx wrangler login          # opens a browser once
npm run build               # regenerate dist/ (optional if unchanged)
npx wrangler pages deploy dist --project-name=defex-website --branch=preview --commit-dirty=true
```

…or, non-interactively, set a scoped API token first:

```
export CLOUDFLARE_API_TOKEN=...   # token with "Cloudflare Pages: Edit"
export CLOUDFLARE_ACCOUNT_ID=...
npx wrangler pages deploy dist --project-name=defex-website --branch=preview --commit-dirty=true
```

This auto-creates the `defex-website` project on first run, uploads `dist/` as
static assets, and bundles `functions/api/contact.ts` as a Pages Function.
**Attach NO custom domain** (per spec). Wrangler prints the `*.pages.dev` URL on
success — **record it here** once deployed.

> `functions/` sits at the repo root and is picked up automatically by
> `wrangler pages deploy` run from the repo root. Deploy from the repo root, not
> from inside `dist/`.

---

## Task log

| Task | What shipped | Commit |
|---|---|---|
| T0 | Scaffold: Astro 5 + TS strict + Tailwind 4 + sitemap; tokens (`theme.css`); brand assets; self-hosted Inter (latin, no external request); favicons; `brand-tokens.json` → v2.1-website | `T0:` |
| T1 | Shell: Base layout, Seo, SiteHeader (both appUrl states), SiteFooter, Brand, Button, Eyebrow, SectionHeading, Reveal; `site.json` + typed `lib/site.ts` (null semantics) | `T1:` |
| T2 | Content: collection schemas; 6 services, 5 projects, 4 app-features, 2 (excluded) testimonials — §5 copy verbatim; image registry | `T2:` |
| T3 | Home: hero (sanctioned gradient, Picture AVIF/WebP, eager+fetchpriority), all sections, ProfessionalService JSON-LD | `T3:` |
| T4 | Services: six anchored sections, sticky right rail with scroll-spy | `T4:` |
| T5 | Projects: five alternating cases with blueprint chips | `T5:` |
| T6 | DEFEX App: feature rows, DEF-014 typographic panel, client-access null state (no "Open DEFEX") | `T6:` |
| T7 | About: narrative, credential strip, numbered engagement steps | `T7:` |
| T8 | Contact: page, form, Pages Function (Resend, honeypot, 3s gate, 503 unconfigured), mailto fallback, noscript; 7 function tests pass | `T8:` |
| T9 | Privacy (~280-word APP-framed policy, July 2026) + 404 | `T9:` |
| T10 | OG/social kit: offline generator + committed PNGs (7 OG, LinkedIn banner, avatar); og:image per page | `T10:` |
| T11 | Gates: `facts-gate.mjs` + `verify-budget.mjs` wired into `npm run build` | `T11:` |
| T12 | Quality pass: WCAG AA contrast lift, a11y verification, route smoke test | `T12:` |
| T13 | Docs (CONTENT_GUIDE, LAUNCH_CHECKLIST) + this handoff; deploy **blocked on credentials** | `T13:` |

---

## Hard-rule compliance (spec §1) — verified in `dist/`

- **Facts gate passes**: no `TBC` / `XXX` / lorem / `[PLACEHOLDER]` / "Placeholder — do not publish" / `PO Box` / `ABN` / `insurance` in any of the 8 HTML files.
- **Unconfirmed facts render nothing**: no legal entity, ABN, postal, or insurance line anywhere. `appUrl` null → **no "Sign in" and no "Open DEFEX"** in `dist` (gate-asserted).
- **Confirmed facts only**: trading name, principal + credentials/registrations, phone, email, web, service area, tagline.
- **No fabrication**: no client names, no testimonials in output (all `placeholder:true`, filtered out), no counts or registration numbers.
- **One accent colour** (#2563EB); hero gradient on the home hero only; flat fills elsewhere.
- **§5 copy typed verbatim**; Australian English; no exclamation marks; banned superlatives absent.
- **No third-party requests**: the site references only its own origin — self-hosted font, local images, inlined JS. No CDN, analytics, or external fonts.
- **App repo untouched.**

## Acceptance criteria (spec §13) status

| # | Criterion | Status |
|---|---|---|
| 1 | Lighthouse ≥95 all categories, every page | ⏳ **Not machine-verified** — no headless browser in this env. Confirm against the preview URL (morning QA). Static signals are strong: 255 kB first load, one h1/page, semantic landmarks, no blocking third-parties. |
| 2 | WCAG AA (contrast, focus, landmarks, labels, heading order, reduced-motion) | ✅ Verified statically (see Deviations #6 for the contrast lift; math in the T12 commit). |
| 3 | `/` first load < 1 MB; zero console errors | ✅ 255 kB (budget check). Scripts are guarded; no errors expected — confirm in-browser at QA. |
| 4 | Facts gate passes; null-state clean; no forbidden strings | ✅ |
| 5 | Contact form 503 fallback graceful; validation + honeypot | ✅ 7 direct-invocation tests pass (`node --experimental-strip-types scripts/test-contact.ts`). |
| 6 | No testimonials in dist; no third-party requests | ✅ |
| 7 | Copy matches §5 verbatim; AU English; no banned words | ✅ |
| 8 | Preview URL live and recorded | ❌ **Blocked on credentials** — see top of this file. |

---

## Deviations & judgement calls

1. **Deploy not performed** — no Cloudflare credentials in the unattended env.
   `dist/` is complete and green; deploy is a one-command step (see top).
2. **`<Picture>` (AVIF + WebP + JPG/PNG fallback)** used for hero, screenshots
   and project images, to satisfy §3's "AVIF/WebP with fallbacks" (plain
   `<Image>` emits a single format).
3. **Two forced components not in the §3 list** — `Brand.astro` (mark + wordmark,
   reused by header/footer) and `PageHeader.astro` (reused by the five inner
   pages). Both justified by "add only what's forced."
4. **OG generation is a standalone `npm run og`**, not a build hook, so it never
   runs on Cloudflare (§10: "not on Cloudflare; outputs are committed").
5. **Project photos are 800×600** (brand-supplied) — below the ≥1600px retina
   guidance in CONTENT_GUIDE. Flagged as LAUNCH_CHECKLIST item 5 (swap in real
   high-res photography).
6. **Contrast lift (§6.2 vs §13.2):** chip text and the "Defect register" label
   were specified as `blueprintInk` (#6E84A8), which is **3.45:1 on blueprint —
   fails AA** for small text. Lifted to `steel` (#5C6B7F, **4.92:1, passes**),
   the hue-adjacent secondary-text token. T12 explicitly directs lifting failing
   contrast; WCAG AA (acceptance #2) governs.
7. **§7 captions:** only one caption text is given in the spec ("DEFEX Command —
   project control."); the other two frame captions were authored per §7's
   "etc." as minimal, factual product-shot labels.
8. **Privacy policy ~280 words** (spec said ~300) — within tolerance, covers all
   required points, APP-framed, dated July 2026, no entity/ABN/insurance.

---

## Andrew's morning QA checklist (spec §14)

> Note: item 1 requires the preview URL, which needs the one-step deploy above.

1. Open the `pages.dev` URL on your phone first — hero, nav, tap targets, form.
2. Read every page's copy once for factual comfort (it was locked, but you own
   the claims).
3. Confirm **no Sign in button anywhere** (appUrl is null).
4. Submit the contact form — confirm you see the **graceful mailto fallback**
   (Resend isn't configured yet), and that the mailto opens prefilled.
5. Check the five case studies against your actual project history — flag any you
   can't stand behind.
6. Review `/og/` and `/social/` images (open directly by URL, e.g.
   `…pages.dev/og/home.png`, `…/social/linkedin-banner.png`).
7. Skim `LAUNCH_CHECKLIST.md` — it's now the go-live authority.
8. If satisfied: no action tonight's build requires. Go-live is your gated step
   later.

**Extra for this run:** because automated Lighthouse/axe couldn't run here,
please run a Lighthouse pass (mobile emulation) against the preview URL and
confirm ≥95 in all four categories, and a quick axe scan, before treating
acceptance criterion #1/#2 as fully closed.
