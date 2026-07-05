# CONTENT_GUIDE.md — editing the DEFEX Engineering website

This site is **content-first**: almost everything you'll want to change lives in
plain files under `src/content/` and `src/assets/`. You do not need to touch page
components for routine edits. Read the hard rules in `WEBSITE_BUILD_SPEC.md` §1
before editing — they are non-negotiable, and the build enforces them.

Golden rule: **run `npm run build` locally before deploying.** The build runs a
facts gate and a budget check; if either fails, the deploy should not happen.
Never bypass the gate.

---

## 1. Company facts — `src/content/site.json`

This is the single source of truth for every company fact. Each field is
**nullable**, and `null` renders **nothing** — no label, no empty row, no dash.
That is deliberate: we never show a placeholder or an unconfirmed claim.

| Field | Effect when set | Effect when `null` (current) |
|---|---|---|
| `legalEntity` | Would allow an entity line (currently no component prints one) | No entity line anywhere |
| `abn` | Footer can show ABN; JSON-LD may include it | No ABN anywhere (the facts gate **fails** if "ABN" appears in output) |
| `postal` | Renders in the footer and Contact page | No postal address shown |
| `piInsurance` | Would allow an insurance line | **No insurance claim** anywhere (gate fails on the word "insurance") |
| `appUrl` | Shows the **Sign in** button (header + mobile) and the **Open DEFEX** button (DEFEX App page) | Neither button renders; the client-access panel stands alone |
| `social.linkedin` | Could drive a LinkedIn link | No link |
| `phone`, `email`, `web`, `serviceArea`, `tagline`, `principal` | Rendered as provided | (these are confirmed and always present) |

To set a field, replace `null` with a quoted string, e.g.
`"appUrl": "https://app.defex.engineering"`. Then run `npm run build` and confirm
the gate passes and the new element renders. **Setting `abn`, `postal`,
`legalEntity`, or `piInsurance` is a launch decision — see `LAUNCH_CHECKLIST.md`.**

---

## 2. Editing text content — `src/content/`

All body copy lives in Markdown collections. Edit the file; the site picks it up.

- **Services** — `src/content/services/*.md`. Frontmatter: `title`, `slug`
  (also the on-page anchor `#slug`), `order`, `summary` (≤160 chars). The body
  (below the `---`) is the section prose.
- **Projects** — `src/content/projects/*.md`. Frontmatter: `title`, `sector`,
  `region`, `scopeTags` (array of pill labels), `order`, `image` (one of
  `project-1`, `project-2`, `project-3`, `hero`). Body = the three paragraphs.
- **App features** — `src/content/app-features/*.md`. Frontmatter: `title`,
  `order`, `screenshot` (a filename key, or `null` for the typographic panel).
- **Testimonials** — `src/content/testimonials/*.md`. Every entry has
  `placeholder: true` and is **excluded from the site by the render filter**.
  Do not publish a testimonial until you have a real, permissioned quote; then
  set `placeholder: false` and add the page section to use it.

**To add** a service/project/feature: copy an existing file, change the
frontmatter and body, set a unique `order`. **To reorder:** change `order`.
**To remove:** delete the file.

Voice rules (enforced by review, not code): plain, competent, Australian English
(organise, colour, metre). No exclamation marks, no emoji, no superlatives
("leading", "best", "trusted", "premier" are banned).

---

## 3. Images — `src/assets/`

Drop image files into `src/assets/` (projects) or `src/assets/screenshots/`
(app shots) and reference them by their **key** (filename without extension) in
the content frontmatter. Conventions:

- **Kebab-case** filenames (`project-4.jpg`, not `Project 4.JPG`).
- **Project photos:** 4:3 aspect, **≥1600px wide** for crisp retina rendering.
  (The four supplied photos are smaller; replace them with high-res originals at
  launch — see `LAUNCH_CHECKLIST.md` item 5.)
- **Screenshots:** native PNG at their real resolution; never upscale.
- New image keys must be registered in `src/lib/images.ts` (one import line +
  one map entry) so `astro:assets` can process them.

Images are served as AVIF/WebP with a JPG/PNG fallback, with explicit dimensions
(no layout shift). The hero image is used **only** on the home hero.

---

## 4. Regenerating the OG / social kit

The Open Graph cards and social images in `public/og/` and `public/social/` are
generated offline and **committed** to the repo. They are **not** rebuilt on
Cloudflare. If you change a page title or the brand mark, regenerate them:

```
npm run og
```

This runs `scripts/generate-og.mjs` (uses the committed Inter font; no network),
rewrites the PNGs, and you commit the result.

---

## 5. Maintaining this site with Claude Code / Cowork

1. Open the repo. **Read `CONTENT_GUIDE.md` and `WEBSITE_BUILD_SPEC.md` §1 (hard
   rules) first.**
2. Make content edits in `src/content/` only (and images in `src/assets/`).
   Avoid editing page components unless you're changing structure.
3. Run `npm run build` locally so the **facts gate** and **budget check** pass.
   If the gate fails, fix the content — **never bypass the gate**.
4. Deploy a **preview** first and review it. Production go-live is a manual,
   Andrew-gated step (`LAUNCH_CHECKLIST.md`).
5. Keep every claim defensible. If a fact isn't confirmed, leave it `null` — the
   site is designed to look complete with nothing in those slots.
