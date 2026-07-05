# WEBSITE_BUILD_SPEC.md — DEFEX Engineering public website (full build)

**Repo:** `defex-website` (fresh). **Builder:** Claude Code (Sonnet, high effort), one unattended overnight run.
**Author:** Fable design session, 6 July 2026. **Review gate:** none required (static site, no prod data).
**End state tonight:** a complete site on a `*.pages.dev` preview URL. **No custom domain is attached tonight.**
**Out of scope tonight:** the DEFEX App repo (`andrewfisher1511/defex`) — do not touch it. App deployment is a separate supervised task card.

This spec is self-sufficient. Assume zero context beyond this file and `/brand-drop/` in the repo. Where this spec and any file in `/brand-drop/` disagree, **this spec wins**.

---

## 0. Mission

Build the public marketing site for DEFEX Engineering — a Sydney remedial consulting engineering practice — at consultancy-first positioning: forensic, minimal, professional. The DEFEX App is presented as the in-house field-to-issued-document platform (the delivery mechanism and the client login door), never as a product for sale. No pricing, no signup, no SaaS framing anywhere.

Voice: plain, competent, Australian. Direct, specific, never salesy. No exclamation marks. No emoji. No superlatives without basis — "leading", "best", "trusted", "Sydney's premier" are banned words in copy. Australian English throughout (organise, colour, metre).

---

## 1. Hard rules (violating any of these fails the run)

1. **FACTS GATE.** Every company fact lives in `src/content/site.json` as a nullable field. `null` renders **nothing** — no label, no empty row, no dash. No placeholder text may reach production. The build fails on forbidden-string hits in `dist/` (see §11, gate script).
2. **Unconfirmed facts render nothing:** legal entity (no entity line anywhere), ABN, postal address, PI insurance (make no insurance claim of any kind), `appUrl` (no "Sign in" button, no "Open DEFEX" CTA).
3. **Confirmed facts (the only company facts that may appear):**
   - Trading name: DEFEX Engineering
   - Principal: Andrew Fisher — BEng(Civil), MIEAust, CPEng, NSW Registered Professional Engineer, NSW Registered Design Practitioner
   - Phone: 0432 261 722 · Email: andrew@defex.engineering · Web: defex.engineering
   - Service area: Sydney metro, occasionally Greater NSW
   - Tagline: "Defects Resolved."
4. **No fabrication.** No invented client names, no testimonials (the collection exists but every entry is `placeholder: true` and excluded from production builds), no years-in-operation claims, no project-count claims, no registration numbers.
5. **One accent colour** (Electric Blue #2563EB). The hero gradient is sanctioned on the **home hero only**. Everything else is flat fills.
6. **Copy in §5 is final.** Type it verbatim. Do not improve it, extend it, or add sections.
7. **Port no code** from the existing app repo's marketing pages. Content intent was already harvested into this spec.
8. **Context-limit rule:** if you approach your context limit at any point, commit clean work, write `HANDOFF.md` (state, next task, any deviations), and stop. Do not attempt risky work near the limit.

---

## 2. Canonical design tokens (embedded — reconciled v2.1)

Provenance: `/brand-drop/brand-tokens.json` exists in two historical versions (v1.0 named marketing palette; v2.0 app design-system). This block reconciles them and is canonical for this build. **Task T0 overwrites `/brand-drop/brand-tokens.json` with this block, tagged `"version": "2.1-website"`.**

### 2.1 Colour

| Token | Value | Use |
|---|---|---|
| `blue` (accent) | `#2563EB` | Actions, links, active nav, focus ring, the X-mark diamond. The only accent. |
| `navy` (ink) | `#1A1A2E` | Headings, wordmark, dark surfaces (footer, CTA band, hero overlay base) |
| `steel` | `#5C6B7F` | Secondary text, captions, eyebrows on light |
| `canvas` | `#F9FAFB` | Page background |
| `concrete` | `#C9CFD8` | Hairlines on dark surfaces, muted fills |
| `blueprint` | `#EFF4FE` | Tinted panels, selected states |
| `blueprintBorder` | `#D7E3FB` | Borders on blueprint panels |
| `inkBody` | `#1C222B` | Body text |
| `inkMuted` | `#44505F` | Muted body text |
| `border` | `#E4E7EC` | Hairlines on light |
| `surface` | `#FFFFFF` | Cards, panels |

Blue scale (hover states etc.): hsl(217 91%) at 97/93/85/73/63/54/45/37/28/20 for 50→900. `primary-hover` = 600.

### 2.2 Gradients (home hero ONLY)

```css
--gradient-hero:    linear-gradient(135deg, hsl(217 91% 25% / 0.85), hsl(217 91% 54% / 0.40));
--gradient-overlay: linear-gradient(180deg, hsl(217 91% 25% / 0.85), hsl(217 91% 25% / 0.10));
```
Applied over `hero-architecture.jpg` for white text. Nowhere else on the site.

### 2.3 Typography

- Family: **Inter variable, self-hosted** (latin subset, weights 300–700). Deviation register: v2.0 tokens reference a Google Fonts import; overridden for performance and to avoid a third-party request. Use `@fontsource-variable/inter` or a committed `InterVariable.woff2` — either is fine; no runtime external font request may exist.
- OpenType features: `"cv02","cv03","cv04","cv11"`. Tabular numerals for any figures.
- Scale (px): 12, 13, 14, 15 (base), 18, 24, 30, 37, 46.
- Headings: Navy Ink, tracking −0.02em. Marketing hero/display: weight 300, generous size. Eyebrows: 13px, ALL CAPS, tracking 0.1em, weight 600, Steel (or Concrete on dark).
- Body: 15–18px, `inkBody`, line-height 1.6 for prose.

### 2.4 Spacing, radius, effects, motion

- 8pt grid. Container max 1200px (marketing; the app's 1400px is for data screens), gutter 24px mobile / 32px desktop. Section vertical rhythm: 64px mobile / 96–112px desktop. Min tap target 44px.
- Radius: cards 12px, buttons/inputs 8px, screenshot frames 12–16px.
- Shadows: border-first elevation; card shadow ≤ 8% black. `shadow-brand` (soft blue lift) on interactive cards only.
- Focus ring: 2px solid #2563EB, 2px offset — on every interactive element.
- Motion: 200ms ease global; entrance reveals `cubic-bezier(0.16,1,0.3,1)` 300ms, translate-y 12px + fade, staggered ≤ 3 items; buttons `scale(0.97)` on active. All entrance motion disabled under `prefers-reduced-motion: reduce`. Duration window for everything: 150–300ms.

---

## 3. Stack and repo layout

- **Astro 5**, static output (`output: 'static'`). TypeScript strict.
- **Tailwind CSS 4** with tokens mapped in `src/styles/theme.css` via `@theme` (CSS variables from §2). No arbitrary hex values in components — token variables only.
- **Zero client frameworks.** Allowed client JS, each as a small vanilla module: mobile nav toggle, contact form handler, scroll-reveal IntersectionObserver. Nothing else.
- `@astrojs/sitemap`. Images via `astro:assets` (sharp) — AVIF/WebP with fallbacks, explicit width/height everywhere (no CLS).
- Deploy target: **Cloudflare Pages** (static + one Pages Function). Use `@astrojs/cloudflare` adapter ONLY if required for the function; preferred: static Astro build + `functions/api/contact.ts` in the Pages functions directory (works with static output).

### File tree (create exactly; add only what's forced)

```
defex-website/
├── brand-drop/                     # exists — verify, then overwrite tokens per T0
├── functions/
│   └── api/contact.ts              # Cloudflare Pages Function
├── public/
│   ├── favicon.svg                 # from defex-mark-navy.svg
│   ├── favicon-dark.svg            # defex-mark-white.svg via media query in <head>
│   ├── og/                         # generated: home.png, services.png, projects.png,
│   │                               #   defex-app.png, about.png, contact.png, default.png
│   ├── social/                     # linkedin-banner.png (1584×396), avatar.png (400×400)
│   └── robots.txt
├── scripts/
│   ├── facts-gate.mjs              # §11
│   └── generate-og.mjs             # §10
├── src/
│   ├── assets/                     # images imported for astro:assets processing
│   │   ├── hero-architecture.jpg   # copied from brand-drop
│   │   ├── project-1.jpg … project-3.jpg
│   │   ├── logos/  (svg marks + png lockups from brand-drop)
│   │   └── screenshots/ (defex-command-board.png, defex-timesheets.png, defex-capture-settings.png)
│   ├── components/
│   │   ├── SiteHeader.astro  SiteFooter.astro  Seo.astro
│   │   ├── Hero.astro  Eyebrow.astro  SectionHeading.astro
│   │   ├── ServiceSection.astro  ProjectCase.astro  CredentialStrip.astro
│   │   ├── ScreenshotFrame.astro  FeatureRow.astro  CtaBand.astro
│   │   ├── ContactForm.astro  Reveal.astro  Button.astro
│   ├── content/
│   │   ├── config.ts               # collections + Zod schemas (§4)
│   │   ├── site.json               # THE facts file (§4.1)
│   │   ├── services/  *.md         # 6 entries
│   │   ├── projects/  *.md         # 5 entries
│   │   ├── app-features/ *.md      # 4 entries
│   │   └── testimonials/ *.md      # placeholder:true entries only
│   ├── layouts/Base.astro
│   ├── pages/
│   │   ├── index.astro  services.astro  projects.astro
│   │   ├── defex-app.astro  about.astro  contact.astro
│   │   ├── privacy.astro  404.astro
│   ├── styles/theme.css  global.css
│   └── lib/site.ts                 # typed accessor for site.json with null semantics
├── CONTENT_GUIDE.md                # §11 docs task
├── LAUNCH_CHECKLIST.md             # §11 docs task
├── HANDOFF.md                      # written at end of run (or at context limit)
├── astro.config.mjs  package.json  tsconfig.json
```

---

## 4. Content architecture (mock-now, real-later)

All content is file-editable — no copy hardcoded in page components except structural microcopy (nav labels, button verbs). Collections in `src/content/config.ts`:

### 4.1 `site.json` — single source of company facts

```jsonc
{
  "tradingName": "DEFEX Engineering",
  "tagline": "Defects Resolved.",
  "legalEntity": null,          // render NOTHING until confirmed
  "abn": null,                  // render NOTHING until confirmed
  "phone": "0432 261 722",
  "phoneHref": "tel:+61432261722",
  "email": "andrew@defex.engineering",
  "web": "https://defex.engineering",
  "postal": null,               // PO Box unconfirmed — LAUNCH_CHECKLIST item
  "serviceArea": "Sydney metro, occasionally Greater NSW",
  "principal": {
    "name": "Andrew Fisher",
    "credentials": "BEng(Civil), MIEAust, CPEng",
    "registrations": [
      "NSW Registered Professional Engineer",
      "NSW Registered Design Practitioner"
    ]
  },
  "piInsurance": null,          // NO insurance claim anywhere until confirmed
  "appUrl": null,               // when live: "https://app.defex.engineering"
  "social": { "linkedin": null }
}
```

Zod schema: every nullable field is `z.string().nullable()` (or object/nullable as shaped above). `src/lib/site.ts` exports a typed `site` object; components must guard every nullable with a conditional that renders nothing on null. **appUrl drives:** nav "Sign in" button (header, desktop + mobile menu) and the "Open DEFEX" CTA on the DEFEX App page. Both must be designed and implemented for both states; tonight's build ships the null state live.

### 4.2 Other collections (Zod)

- **services**: `{ title, slug, order, summary (≤160 chars), body (md) }` — 6 entries, copy in §5.2.
- **projects**: `{ title, sector, region, scopeTags: string[], order, image ('project-1'|'project-2'|'project-3'|'hero'), body (md) }` — 5 entries, copy in §5.3.
- **app-features**: `{ title, order, screenshot: string|null, body (md) }` — 4 entries, copy in §5.4.
- **testimonials**: `{ quote, attribution, placeholder: boolean }`. Create 2 entries with `placeholder: true` and obviously-synthetic attribution ("Placeholder — do not publish"). The collection query used by any page MUST filter `placeholder !== true`; since all entries are placeholders, **no testimonial section renders anywhere tonight**. Fabricated testimonials and invented client names never ship — this is enforced by the filter plus the facts gate.

---

## 5. Copy deck — FINAL. Type verbatim.

Global microcopy: nav = Home · Services · Projects · DEFEX App · About · Contact. Header button (appUrl set): "Sign in". Footer columns: contact block (phone, email — nullable postal/ABN/entity slots render nothing), nav links, and the line "© {currentYear} DEFEX Engineering" with "Privacy" link. Footer credential line: "Andrew Fisher — BEng(Civil), MIEAust, CPEng · NSW Registered Professional Engineer · NSW Registered Design Practitioner".

### 5.1 Home (`/`)

**Hero** (over hero-architecture.jpg + `--gradient-hero`):
- Eyebrow: `REMEDIAL CONSULTING ENGINEERS — SYDNEY`
- H1: `Defects Resolved.`
- Support line: `Forensic remedial engineering for Sydney strata, owners and managers.`
- Primary button: `Discuss a defect` → `/contact`. Secondary (ghost, white): `Our services` → `/services`.

**Section: What we do** — Eyebrow `THE PRACTICE`. H2: `From first inspection to issued certificate.`
Body: `DEFEX Engineering investigates building defects, designs their rectification, and administers the contracts that deliver the work. The practice is led and carried out by one registered engineer — the person who inspects your building is the person who signs the report, prepares the design, and superintends the repair.`

Three cards (title + one line, linking to the matching /services anchor):
1. `Investigate` — `Diagnostic inspection and testing that establishes cause, not just symptoms.`
2. `Design` — `Remedial designs and declared designs prepared under the Design and Building Practitioners Act.`
3. `Deliver` — `Specifications, tendering, superintendency and contract administration through to completion.`

**Section: Services strip** — Eyebrow `SERVICES`. H2: `Six things, done properly.` The six service titles from §5.2 as a two-column list, each linking to its anchor. Text link below: `All services →`.

**Section: Platform** (navy surface) — Eyebrow (Concrete): `THE DEFEX PLATFORM`. H2 (white): `Built by the engineer who uses it.`
Body (Concrete): `Every DEFEX engagement runs on DEFEX — our in-house platform that carries a defect from site capture to issued document. Photographs stay tied to the defect they evidence, defects stay keyed to the Australian Standards they breach, and reports are assembled from the record rather than rewritten from memory. It is why the paperwork is fast, and why it holds up.`
One screenshot (`defex-command-board.png`, framed per §7). Text link (Electric Blue on navy): `About the platform →` → `/defex-app`.

**Section: Principal strip** — H2: `A registered practitioner, personally accountable.`
Body: `DEFEX Engineering is led by Andrew Fisher — BEng(Civil), MIEAust, CPEng, NSW Registered Professional Engineer and NSW Registered Design Practitioner. Engagements are accepted across Sydney, and occasionally Greater NSW.`
Text link: `About Andrew →` → `/about`.

**CTA band** (navy) — H2 (white): `Have a defect that needs resolving?` Body: `Call or email to discuss the building, the symptoms, and the sensible next step.` Button: `Contact DEFEX` → `/contact`.

### 5.2 Services (`/services`) — one page, six anchored sections

Page header — Eyebrow: `SERVICES`. H1: `Remedial engineering, end to end.`
Lede: `DEFEX provides the consulting spine of a remedial project: establishing what is wrong, designing the fix, and administering the contract that delivers it. Engage one service or the full sequence.`

Each section: H2 title, body, thin hairline between sections, anchor id = slug.

**1. Defect investigation and diagnostics** (`#investigation`)
`A defect report is only as good as its diagnosis. Investigations begin with the symptoms — water ingress, cracking, spalling, movement, failed finishes — and work back to cause through close inspection, targeted opening-up and testing where warranted. Findings are photo-evidenced, keyed to the relevant Australian Standards and NCC provisions, and reported with a clear statement of cause, consequence and recommended action. Reports are written to be read: by owners, committees, insurers and, where necessary, courts.`

**2. Remedial design and declared designs** (`#remedial-design`)
`Rectification that lasts starts with design, not with a contractor's quote. DEFEX prepares remedial designs and specifications for concrete repair, waterproofing, façade elements and associated structural work. For Class 2 buildings in NSW, regulated designs are prepared and declared under the Design and Building Practitioners Act 2020 by a Registered Design Practitioner, ready for lodgement.`

**3. Specifications and tender** (`#specification-tender`)
`A precise specification is what makes contractor prices comparable and the finished work enforceable. DEFEX prepares technical specifications and scopes of work, assembles tender packages, invites and levels tenders, and reports with a clear recommendation — so the decision to award is an informed one.`

**4. Superintendency and contract administration** (`#superintendency`)
`Once works begin, someone independent has to hold the contract. DEFEX acts as Superintendent under AS 4000 and AS 4902 contracts: assessing progress claims and variations, ruling on extensions of time, directing and inspecting the works, and certifying practical completion. The role is administered impartially, with the paperwork to show it.`

**5. Expert and litigation-support reporting** (`#expert-reporting`)
`Where defects become disputes, DEFEX prepares expert reports for use in court and tribunal proceedings, written in accordance with the Expert Witness Code of Conduct — including Scott schedules, reports in response, and conclave participation. Opinions are confined to what the evidence supports.`

**6. Façade and waterproofing assessment** (`#facade-waterproofing`)
`Façades and membranes are where Sydney buildings most often fail, and where the cost of guessing is highest. DEFEX assesses façade condition, cladding, balustrades, balconies, planters, podiums and below-ground waterproofing — establishing the state of the element, the risk it presents, and the remediation pathway, with priorities an owners corporation can actually budget against.`

Page CTA band: H2 `Not sure which service you need?` Body: `Describe the problem — the right starting point is usually a short conversation.` Button: `Contact DEFEX` → `/contact`.

### 5.3 Projects (`/projects`) — five representative case studies

Page header — Eyebrow: `PROJECTS`. H1: `Representative engagements.`
Lede: `Selected project experience, described in general terms. Addresses and parties are withheld as a matter of course.`

Each case renders as a full-width section: image, sector + region + scope tags (pill chips, blueprint tint), H2 title, three short paragraphs. Copy:

**Case 1 — Strata remediation, Inner West — 48 lots** · Sector: Residential strata · Tags: Concrete repair, Waterproofing, Superintendency · Image: project-1
`A four-storey walk-up complex presented with spalling concrete to balcony soffits and slab edges, and recurring leaks from planters over habitable rooms.`
`Investigation confirmed carbonation-driven reinforcement corrosion and failed planter membranes. A remedial design and specification covered concrete repair, cathodic-risk detailing at exposed edges, and full membrane replacement with revised falls and drainage.`
`The works were tendered competitively and delivered under an AS 4000 contract with independent superintendency through to practical completion and defects liability.`

**Case 2 — Façade investigation, North Shore — 12-storey residential tower** · Sector: Residential strata · Tags: Façade, Diagnostics, Reporting · Image: project-2
`An owners corporation sought a definitive account of façade condition after fragments of render were found at ground level.`
`Inspection from elevated work platforms, with targeted opening-up, mapped delaminated render, corroded lintels and displaced masonry ties across the elevations. Each defect was photographed, located and classified by severity.`
`The report gave the committee a prioritised, costed pathway: immediate make-safe items, a staged façade rectification scope, and a monitoring regime for the balance.`

**Case 3 — Podium waterproofing remediation, Eastern Suburbs — mixed-use building** · Sector: Mixed use · Tags: Waterproofing, Remedial design, Tender · Image: project-3
`A trafficable podium over commercial tenancies had leaked through successive patch repairs, with damage claims mounting below.`
`Diagnostic testing traced water paths to terminated membrane edges and failed movement joints rather than the field of the membrane. The remedial design replaced the system as a whole — membrane, joints, drainage and trafficable finishes — rather than repeating localised repairs.`
`A detailed specification and tender process gave the owners comparable prices and a warrantable outcome.`

**Case 4 — Balcony and balustrade rectification, Sutherland Shire — 24 townhouses** · Sector: Residential strata · Tags: Structural, Compliance, Contract administration · Image: project-1
`Timber-framed balconies showed deflection and decay, and glass balustrades did not comply with current loading and height requirements.`
`Assessment established which elements could be retained and which required replacement, with a rectification design bringing balustrades into compliance with the NCC and relevant Australian Standards.`
`Works were staged to keep residents in place, administered under contract with progressive inspection and certification.`

**Case 5 — Expert reporting, apartment building defects — NSW proceedings** · Sector: Residential strata · Tags: Expert report, Scott schedule, Litigation support · Image: project-2
`Proceedings concerning widespread defects in a recently completed apartment building required an independent expert account of cause, responsibility boundaries and rectification cost drivers.`
`The building was inspected, the defect population organised into a Scott schedule, and an expert report prepared in accordance with the Expert Witness Code of Conduct, including a report in response to opposing expert evidence.`
`The structured schedule let the parties narrow the genuinely contested items and resolve the balance.`

Page CTA band: H2 `Discuss a comparable building.` Button: `Contact DEFEX` → `/contact`.

### 5.4 DEFEX App (`/defex-app`)

Page header — Eyebrow: `THE PLATFORM`. H1: `DEFEX — field to issued document.`
Lede: `DEFEX is the in-house platform this practice is built on. It exists for one reason: so that what is observed on site becomes a defensible, standards-keyed document without anything being lost or retyped in between.`

Positioning paragraph:
`DEFEX is not for sale and has no pricing page. It is how DEFEX Engineering works — and, for clients, it is the login door to their own projects.`

Four feature rows (alternating layout; copy = app-features collection). Screenshots framed per §7:

**1. Capture on site, keep the chain of evidence** — screenshot: `defex-capture-settings.png`
`Defects are recorded in the field with photographs attached at the point of observation. Originals are retained at full resolution; every image stays tied to the defect, location and inspection it evidences.`

**2. Defects keyed to the standards they breach** — screenshot: null (typographic panel: a blueprint-tint card showing a sample defect line — "DEF-014 · Membrane termination — AS 4654.2" — rendered as styled HTML, not an image)
`Each defect is classified against a library keyed to Australian Standards and NCC provisions, so reports cite the actual clause — not a vague appeal to "industry practice".`

**3. Reports assembled from the record** — screenshot: `defex-command-board.png`
`Inspection reports, defect schedules and superintendent's documents are generated from the project record itself. Faster to issue, and consistent from the first page to the last annexure.`

**4. The whole project in one place** — screenshot: `defex-timesheets.png`
`Contract administration, correspondence, time and project status live alongside the technical record — one system from first site visit to final certificate.`

**Client access panel** (blueprint tint card):
H3: `Client access.` Body: `Clients of DEFEX Engineering receive access to their projects as part of an engagement — live defect registers, documents and progress, without waiting for a status email.`
If `appUrl` set: primary button `Open DEFEX` → appUrl. If null: render the panel with no button (design must not look broken — the text stands alone).

Page CTA band: H2 `Engage the practice, get the platform.` Button: `Contact DEFEX` → `/contact`.

### 5.5 About (`/about`)

Eyebrow: `ABOUT`. H1: `A deliberately small practice.`
Body (three paragraphs):
`DEFEX Engineering is a Sydney remedial consulting practice led by Andrew Fisher — BEng(Civil), MIEAust, CPEng, a NSW Registered Professional Engineer and NSW Registered Design Practitioner.`
`The practice is built on a simple structural choice: the engineer who inspects the building is the engineer who writes the report, prepares the design and superintends the works. Nothing is handed down a chain, and accountability never blurs.`
`That model is made viable by DEFEX, the in-house platform that carries every engagement from site capture to issued document — so a small practice can deliver documentation with the speed and consistency of a much larger one, without diluting who stands behind it.`

**Credential strip** (blueprint tint, three plain cells): `BEng(Civil), MIEAust, CPEng` · `NSW Registered Professional Engineer` · `NSW Registered Design Practitioner`.

**How engagements run** (four numbered steps, one line each):
1. `Contact — describe the building and the symptoms.`
2. `Proposal — a written scope and fee, in plain terms.`
3. `Investigation and reporting — photo-evidenced, standards-keyed.`
4. `Design and delivery — where rectification proceeds, through to completion.`

CTA band: H2 `Talk to the engineer directly.` Button: `Contact DEFEX` → `/contact`.

### 5.6 Contact (`/contact`)

Eyebrow: `CONTACT`. H1: `Discuss a defect.`
Lede: `Call or email directly, or send the details below. Engagements are accepted across Sydney metro and occasionally Greater NSW.`
Contact block: phone (tel: link), email (mailto: link). (Postal/ABN/entity: nullable slots, render nothing.)
Form fields: Name*, Email*, Phone, Building suburb, Message* (labelled `What's happening with the building?`). Submit button: `Send enquiry`. Success state: `Thanks — your enquiry has been sent. Andrew will be in touch.` Failure/unconfigured state: `The form couldn't send just now. Email Andrew directly:` + prefilled mailto link (subject `Website enquiry — {name}`, body = the typed message). `<noscript>`: show the mailto guidance instead of the form.

### 5.7 Privacy (`/privacy`)

H1: `Privacy.` Plain-prose policy, ~300 words, sentence case, covering: what is collected (contact details and enquiry content submitted via the form or email; basic technical logs from hosting), why (responding to enquiries, delivering engagements), no sale of personal information, no advertising trackers, storage with reputable hosting and email providers, access/correction requests via andrew@defex.engineering, and that the policy is issued by DEFEX Engineering. Reference the Australian Privacy Principles as the framework the practice has regard to. No entity line, no ABN. Date the policy `July 2026`.

### 5.8 404

H1: `Page not found.` Body: `The page you're after doesn't exist or has moved.` Button: `Back to home`.

### 5.9 SEO titles/descriptions (final)

| Page | `<title>` | Meta description |
|---|---|---|
| / | `DEFEX Engineering — Remedial Consulting Engineers, Sydney` | `Forensic remedial engineering for Sydney strata, owners and managers. Defect investigation, remedial design, superintendency and expert reporting. Defects Resolved.` |
| /services | `Services — DEFEX Engineering` | `Defect investigation, remedial and declared designs, specifications and tender, AS 4000 superintendency, expert reporting, façade and waterproofing assessment.` |
| /projects | `Projects — DEFEX Engineering` | `Representative remedial engagements across Sydney: strata remediation, façade investigation, waterproofing rectification and expert reporting.` |
| /defex-app | `The DEFEX Platform — DEFEX Engineering` | `DEFEX is our in-house field-to-issued-document platform — the reason reports are fast, photo-evidenced and standards-keyed. Client login included with every engagement.` |
| /about | `About — DEFEX Engineering` | `A deliberately small Sydney remedial practice led by Andrew Fisher — CPEng, NSW Registered Professional Engineer and Registered Design Practitioner.` |
| /contact | `Contact — DEFEX Engineering` | `Discuss a building defect with a registered remedial engineer. Sydney metro, occasionally Greater NSW.` |
| /privacy | `Privacy — DEFEX Engineering` | `How DEFEX Engineering handles personal information.` |

---

## 6. Design spec

### 6.1 Global

- **Header:** sticky, Canvas background with hairline bottom border; navy lockup at left (SVG mark + wordmark; on ≤480px, mark only); nav links (15px, medium, inkBody, active = Electric Blue with 2px underline offset); `Sign in` as an outline button (appUrl-conditional). Mobile: hamburger → full-height Canvas panel, links at 24px, staggered 150ms reveal.
- **Footer:** Navy surface. White lockup, contact block, nav column, credential line in Concrete, `© {year} DEFEX Engineering · Privacy`. Hairlines in Concrete at 24% opacity.
- **Buttons:** primary = Electric Blue fill, white text, 8px radius, 44px min height; hover blue-600; active scale 0.97. Outline = 1px border current colour. Ghost-on-dark = white text, 1px Concrete border.
- **Links in prose:** Electric Blue, underline on hover.
- **Reveal:** wrap section children; IO threshold 0.15, once; translate-y 12px → 0 + opacity, 300ms smooth-ease; no reveal under reduced motion.
- Every image: explicit dimensions, `loading="lazy"` except the hero (`fetchpriority="high"`), alt text describing the subject plainly.

### 6.2 Per page

- **Home:** full-bleed hero, min-height 80vh desktop / 70vh mobile; gradient over the photo; hero text max-width 640px, H1 at 46px desktop (37 mobile) weight 300 — except the tagline H1 `Defects Resolved.` renders weight 600 for authority; support line 18px Canvas at 90% opacity. Sections alternate Canvas / white; the Platform section is Navy full-bleed with the framed screenshot overlapping the section edge by 32px on desktop. Three "What we do" cards: white, 12px radius, hairline border, shadow-brand on hover only because they link.
- **Services:** single column, prose max-width 68ch; sticky in-page section nav on desktop (right rail, 13px, Steel; active anchor Electric Blue). Sections separated by hairlines, 64px padding.
- **Projects:** each case: image left / text right, alternating, stacking image-first on mobile; images 4:3, 12px radius; chips = blueprint tint, blueprintBorder, blueprintInk text, full-pill.
- **DEFEX App:** feature rows alternate text/screenshot sides; screenshots in ScreenshotFrame (§7); client-access panel full-width blueprint card, 16px radius.
- **About:** narrow prose column (60ch), credential strip full width, numbered steps as a simple 44px-row list with Electric Blue numerals (tabular).
- **Contact:** two columns desktop (contact block | form), stacked mobile; inputs 8px radius, 44px height, focus ring per tokens; labels 13px medium above inputs (no floating labels).
- **Privacy / 404:** narrow prose column.

### 6.3 Imagery treatment

- `hero-architecture.jpg` only on the home hero, always under the gradient.
- `project-1/2/3.jpg` on Projects (assignments in §5.3) — plain, no filters, no duotone.
- App screenshots only inside ScreenshotFrame, only on Home (one) and DEFEX App page.
- No stock imagery beyond the four supplied photos. No icons beyond Lucide-style 2px-stroke inline SVGs, used sparingly (nav toggle, external-link, phone/mail glyphs).

---

## 7. ScreenshotFrame component

Product-shot treatment for app screenshots: a Navy (#1A1A2E) frame, 16px radius, 8px padding, with a minimal window bar (three 8px dots in Concrete at 40% opacity, no traffic-light colours), the screenshot inside at 8px radius, `shadow-lg`, and an optional caption below (13px Steel, centred). On Navy sections invert: frame is white at 6% opacity with Concrete hairline. Screenshots are prototypes of the current best build — caption on the DEFEX App page's first frame: `DEFEX Command — project control.` etc. Never upscale; render at ≤ native resolution with 2× srcset from the supplied PNGs.

---

## 8. Contact form — Pages Function

`functions/api/contact.ts` (TypeScript, no SDK — plain `fetch` to Resend REST):

- Accepts `POST` JSON `{ name, email, phone?, suburb?, message, hp, t }`.
- Reject (400) if `hp` non-empty (honeypot) or `Date.now() - t < 3000` (time gate) or name/email/message fail basic validation (email regex, message 10–5000 chars). No CAPTCHA.
- Env: `RESEND_API_KEY`, `CONTACT_TO` (default `andrew@defex.engineering`), `CONTACT_FROM`. If `RESEND_API_KEY` or `CONTACT_FROM` missing → return `503 {"error":"unconfigured"}`.
- Send via `https://api.resend.com/emails`: subject `Website enquiry — {name}`, text body with all fields, `reply_to` = enquirer email. Return 200 on success, 502 on Resend failure.
- Client handler: progressive enhancement over a real `<form>`; on non-200 or network error, show the mailto fallback (§5.6). Never trap the user: the phone number and email remain visible on the page regardless.
- Note in LAUNCH_CHECKLIST: Resend domain verification for `defex.engineering` + env vars in Cloudflare Pages are launch steps; tonight the 503 path is the live path and must look intentional.

---

## 9. SEO baseline

- `Seo.astro`: per-page title/description (§5.9), canonical (`https://defex.engineering` + path — canonical may reference the future domain even on preview), OG tags (`og:image` per page from `/og/`, twitter:card `summary_large_image`).
- JSON-LD on Home only: `ProfessionalService` — `name: "DEFEX Engineering"`, `url`, `telephone: "+61 432 261 722"`, `email`, `areaServed: "Sydney, NSW, Australia"`, `founder: { "@type": "Person", "name": "Andrew Fisher", "honorificSuffix": "CPEng" }`, `slogan: "Defects Resolved."`. **Omit** ABN, address, legal name, aggregate ratings. Fields sourced from site.json; any null → key omitted from the JSON-LD object entirely.
- `@astrojs/sitemap` with the future domain as `site`; `public/robots.txt`: allow all, `Sitemap: https://defex.engineering/sitemap-index.xml`.
- Semantic landmarks, one `<h1>` per page, heading order strictly descending.

## 10. OG / social kit

`scripts/generate-og.mjs` — deterministic, offline, run at build via npm script (not on Cloudflare; outputs are committed):
- Method: compose an SVG template per artefact (Navy #1A1A2E field, white X-mark SVG at left, page title in Inter weight 600, `DEFEX ENGINEERING` eyebrow in Concrete with 0.1em tracking, thin Electric Blue rule) and rasterise with `@resvg/resvg-js`, embedding the committed Inter font file. No network.
- Outputs: `public/og/{home,services,projects,defex-app,about,contact,default}.png` at 1200×630; `public/social/linkedin-banner.png` 1584×396 (lockup left, tagline right, generous safe margins — LinkedIn crops aggressively on mobile, keep content within centre 1350×220); `public/social/avatar.png` 400×400 (white icon on Navy, mark at 62% of canvas).
- Commit the generated PNGs. Each OG title: Home → `Defects Resolved.`; others → page name.

## 11. Gate script, docs, and null-state tests

**`scripts/facts-gate.mjs`** — runs after `astro build`, scans every `dist/**/*.html`:
- Fail on regex: `\bTBC\b`, `XXX`, `lorem ipsum` (case-insensitive), `\[PLACEHOLDER\]`, `Placeholder — do not publish`.
- Fail if `PO Box` appears (postal is unconfirmed).
- Fail if `ABN` appears.
- Null-state assertions: fail if `Sign in` or `Open DEFEX` appears while `site.json:appUrl` is null; fail if the string `insurance` appears anywhere.
- Wire as `npm run build` = `astro build && node scripts/facts-gate.mjs && node scripts/verify-budget.mjs` (budget check: sum of HTML+CSS+JS+images requested on `/` under 1MB — a static analysis of the built home page's referenced assets is acceptable).

**`CONTENT_GUIDE.md`** (write in full, ~1–2 pages): how every piece of content is changed by editing files only — site.json field semantics (null renders nothing; exact effect of setting `appUrl`, `abn`, `postal`, `legalEntity`, `piInsurance`), how to add/edit a service, project, app feature; image conventions (drop into `src/assets/`, kebab-case names, projects 4:3 ≥1600px wide, screenshots native PNG); how to regenerate the OG kit; and a section **"Maintaining this site with Claude Code / Cowork"**: open the repo, read CONTENT_GUIDE.md and WEBSITE_BUILD_SPEC.md §1 hard rules first, make content edits in `src/content/` only, run `npm run build` locally so the facts gate passes, never bypass the gate, deploy previews before production.

**`LAUNCH_CHECKLIST.md`** (write in full) — ordered, each item with a checkbox and where the change lands:
1. Confirm legal entity → `site.json:legalEntity` (+ Privacy page wording review).
2. Confirm ABN → `site.json:abn` (footer renders it; JSON-LD may then include it).
3. Confirm postal (PO Box 106 Gymea NSW 2227 held from brand file — verify current) → `site.json:postal`.
4. Decide PI insurance line (only once certificate confirmed) → `site.json:piInsurance`.
5. Verify each Projects case study is defensible from Andrew's project history; edit or replace any that are not; swap in real photography where available.
6. Replace placeholder testimonials with real, permissioned quotes, or delete the collection usage.
7. Resend: verify `defex.engineering` sending domain; set `RESEND_API_KEY`, `CONTACT_FROM`, `CONTACT_TO` in Cloudflare Pages; test the form end-to-end.
8. Deploy DEFEX App to `app.defex.engineering` (separate task card) → set `site.json:appUrl` → rebuild → verify Sign in / Open DEFEX render and resolve.
9. Optional: Andrew headshot on About; LinkedIn profile URL → `site.json:social.linkedin`.
10. Cloudflare Pages: attach custom domain `defex.engineering` + `www` (redirect www → apex), DNS records, confirm HTTPS.
11. Final production QA: run §13 acceptance criteria against the production URL.
**Go-live is a manual Andrew-gated step. Nothing in this list is performed tonight.**

## 12. Ordered build tasks (one overnight run)

Commit after every task, message prefix `T{n}:`. If a task fails twice, note it in HANDOFF.md and continue where independence allows.

- **T0 — Scaffold.** Astro 5 + TS strict + Tailwind 4 + sitemap; copy brand-drop assets into `src/assets/`; write reconciled tokens (§2) to `src/styles/theme.css` and overwrite `/brand-drop/brand-tokens.json` as v2.1-website; self-hosted Inter; favicons.
- **T1 — Shell.** Base layout, Seo.astro, SiteHeader (both appUrl states), SiteFooter, Button, Eyebrow, SectionHeading, Reveal, global styles.
- **T2 — Content.** `content/config.ts` schemas, `site.json`, all services/projects/app-features/testimonial files with §5 copy verbatim, `lib/site.ts`.
- **T3 — Home.** Hero (gradient, image optimisation, fetchpriority), all sections, CTA band.
- **T4 — Services.** Anchored sections + sticky rail.
- **T5 — Projects.** Alternating cases, chips.
- **T6 — DEFEX App.** FeatureRow, ScreenshotFrame, typographic panel for feature 2, client-access panel (null state).
- **T7 — About.**
- **T8 — Contact.** Page, form, Pages Function, fallback paths, noscript.
- **T9 — Privacy + 404.**
- **T10 — OG/social kit.** Script + committed outputs, wire og:image per page.
- **T11 — Gates.** facts-gate.mjs, budget check, wire into `npm run build`; fix anything they catch.
- **T12 — Quality pass.** Axe/manual WCAG AA sweep (contrast: Steel on Canvas passes for ≥14px text — verify; Concrete on Navy for small text — verify, lift to white where it fails), Lighthouse all pages ≥95 all categories against `astro preview`, zero console errors, keyboard nav end-to-end, reduced-motion verified.
- **T13 — Docs + deploy.** CONTENT_GUIDE.md, LAUNCH_CHECKLIST.md; create Cloudflare Pages project `defex-website` (direct upload or git integration per available credentials), deploy `dist/` to preview; write HANDOFF.md with the `*.pages.dev` URL, task log, deviations, and anything needing Andrew's judgement. **Attach no custom domain. Do not touch the app repo.**

## 13. Acceptance criteria

1. Lighthouse ≥ 95 in all four categories, every page, mobile emulation.
2. WCAG AA: contrast, focus visibility, landmarks, labels, heading order, reduced-motion.
3. First load of `/` < 1MB total transferred; zero console errors/warnings on all pages.
4. Facts gate passes; `Sign in`/`Open DEFEX` absent from dist with appUrl null; no `ABN`, `PO Box`, `insurance`, `TBC`, `XXX`, lorem anywhere in dist.
5. Contact form: 503-unconfigured path shows the mailto fallback gracefully; validation and honeypot verified by direct function invocation locally.
6. No testimonial content in dist. No third-party requests of any kind (fonts, analytics, CDNs) — the site calls only itself.
7. All copy matches §5 verbatim; Australian English; no exclamation marks; banned superlatives absent.
8. Preview URL live and recorded in HANDOFF.md.

## 14. Andrew's morning QA checklist (goes in HANDOFF.md)

1. Open the pages.dev URL on your phone first — hero, nav, tap targets, form.
2. Read every page's copy once for factual comfort (it was locked, but you own the claims).
3. Confirm no Sign in button anywhere (appUrl is null).
4. Submit the contact form — confirm you see the graceful mailto fallback (Resend isn't configured yet), and that the mailto opens prefilled.
5. Check the five case studies against your actual project history — flag any you can't stand behind.
6. Review `/og/` and `/social/` images (open directly by URL).
7. Skim LAUNCH_CHECKLIST.md — it's now the go-live authority.
8. If satisfied: no action tonight's build requires. Go-live is your gated step later.

## 15. Kickoff prompt for Claude Code (verbatim)

```
You are building the DEFEX Engineering public website in this repo (defex-website),
in one unattended overnight run. Read WEBSITE_BUILD_SPEC.md in full before writing
anything — it is the sole authority and is self-sufficient. Where the spec and any
file in /brand-drop/ disagree, the spec wins.

Execute tasks T0–T13 in order, committing after each task with prefix "T{n}:".
Hard rules in §1 are absolute: the facts gate must pass, unconfirmed company facts
render nothing, copy in §5 is typed verbatim, one accent colour, no third-party
requests, no code ported from any other repo, and the DEFEX App repo is out of
scope — do not touch it.

Finish by deploying dist/ to a Cloudflare Pages preview (project: defex-website),
attaching NO custom domain, and writing HANDOFF.md with the *.pages.dev URL, the
task log, any deviations, and the morning QA checklist from spec §14.

Context-limit rule: if you approach your context limit, commit clean work, write
HANDOFF.md with exact state and next step, and stop. Never leave the repo in a
broken state.
```

---

*End of spec. Simple beats clever. Every claim defensible. Nothing that weakens operational clarity.*
