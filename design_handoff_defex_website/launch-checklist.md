# DEFEX website — launch checklist

Everything still needed to take the build from "machine complete" to a launched, multi-million-dollar-feeling site. Grouped by who acts. Tick top to bottom.

## Andrew — content and facts (nothing here is code)
- [ ] **ABN** — confirm registration; replace `XXX XXX XXX XXX` in `content/site.json` (or ACN if that is what is registered).
- [ ] **Hours** — confirm Mon–Fri 8:00am–5:00pm wording on Contact.
- [ ] **Social URLs** — real LinkedIn (company or personal), Facebook, Instagram profiles; current hrefs are placeholders.
- [ ] **Portrait** — headshot for the About "People" section (portrait crop, ~3:3.5).
- [ ] **Real project photography** — 2–4 photos per case study with one-line captions; replaces the brand-drop placeholders in the carousels and diagnostics scenarios.
- [ ] **Case-study fact check** — verify the Podium (Lower North Shore) and Expert reporting (South Sydney) write-ups; the Inner West strata case is from the live site.
- [ ] **Capability statement PDF** — supply or commission (can be generated from the DEFEX report templates in the brand workspace); wire to the footer link.
- [ ] **Testimonials** — collect 2–3 written permissions before the quote strip ships (role attribution is enough: "Strata manager, Inner West").
- [ ] **Google Business Profile** — create/claim for DEFEX Engineering (feeds the map card and the future reviews badge; reviews ask goes in the post-completion email, not the site).
- [ ] **Blog** — replace the three sample posts with real ones (or approve them as launch content).
- [ ] **Privacy page** — read the draft; confirm or amend (it is a plain-English draft, not legal advice).

## Claude Code — build tasks (all specified in README + specs)
- [ ] Build the 8 pages in Astro 5 from the prototypes; `content/` structure from day one (content-editing-spec.md).
- [ ] Mobile nav + responsive rules (mobile-nav-spec.md).
- [ ] `/api/enquiry` Pages Function: Turnstile + honeypot, R2 attachments, AI subject line w/ urgency triage + fallback, Resend relay + auto-acknowledgement, magic push-to-Command/CRM links, duplicate detection (form-endpoint-spec.md).
- [ ] `/api/ask` for the Ask DEFEX assistant; knowledge blob regenerated from page content at build.
- [ ] Google Places Autocomplete on the address field (session tokens, `country:au`).
- [ ] Auth: Supabase + TOTP MFA for the Log in button; portal scoping by project membership.
- [ ] SEO: per-page meta + canonical, XML sitemap, `robots.txt`, schema.org **LocalBusiness + Service + FAQPage** markup, per-page OG images generated at build.
- [ ] Favicon set + web manifest (X mark, navy/white variants).
- [ ] 404 page (same shell; "This page isn't here. The engineer is." + nav links — keep it dry).
- [ ] Analytics: Cloudflare Web Analytics (cookieless) — no consent banner needed.
- [ ] Email deliverability: SPF, DKIM, DMARC records for defex.engineering via Resend's domain setup.
- [ ] Redirects from any old rev1 URLs that change.
- [ ] LinkedIn share Action (content-editing-spec.md §LinkedIn) once a scheduler account exists.
- [ ] Lighthouse ≥95 across the board, CLS < 0.02, AA contrast pass, keyboard-only walkthrough.

## Post-launch (first month)
- [ ] Uptime monitor on the apex + `/api/enquiry` (Cloudflare or UptimeRobot free).
- [ ] Review Ask DEFEX question logs → tighten the knowledge blob; consider a static FAQ if patterns emerge.
- [ ] First real blog post shared via the pipeline end-to-end.
- [ ] Test a real enquiry end-to-end: form → email w/ AI subject → magic link → draft job on Command.
- [ ] Revisit reviews badge once ~10 Google reviews exist.
