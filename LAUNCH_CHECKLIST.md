# LAUNCH_CHECKLIST.md — DEFEX Engineering website go-live

This is the go-live authority. **Nothing in this list was performed on the
overnight build.** Go-live is a manual, Andrew-gated step. Work top to bottom;
each item names exactly where the change lands. After any content change, run
`npm run build` locally (the facts gate must pass) and deploy a preview before
production.

---

- [ ] **1. Confirm legal entity.** Set `src/content/site.json:legalEntity`, and
      review the Privacy page wording (`src/pages/privacy.astro`) so the issuing
      entity reads correctly. Until set, no entity line renders anywhere.

- [ ] **2. Confirm ABN.** Set `src/content/site.json:abn`. The footer will render
      it and the Home JSON-LD may then include it. Note: the facts gate currently
      **fails on the string "ABN"** — once the ABN is genuinely confirmed, add the
      footer markup and relax that specific gate rule in `scripts/facts-gate.mjs`.

- [ ] **3. Confirm postal address.** `PO Box 106 Gymea NSW 2227` is held from the
      brand file — **verify it is current** — then set
      `src/content/site.json:postal`. It renders in the footer and Contact page.
      (The gate also fails on "PO Box" until this is intentionally enabled.)

- [ ] **4. Decide the PI insurance line.** Only once the certificate is confirmed,
      set `src/content/site.json:piInsurance` and add the display markup. Until
      then the site makes **no insurance claim of any kind** (gate fails on
      "insurance").

- [ ] **5. Verify the five Projects case studies** against Andrew's actual project
      history (`src/content/projects/*.md`). Edit or replace any you cannot stand
      behind. Swap in **real high-res photography** (4:3, ≥1600px) where available
      — the current photos are brand-supplied placeholders.

- [ ] **6. Replace placeholder testimonials** (`src/content/testimonials/*.md`)
      with real, permissioned quotes (set `placeholder: false` and add a page
      section to render them), **or** delete the collection usage. No fabricated
      testimonials or invented client names may ship.

- [ ] **7. Configure Resend** for the contact form:
      verify `defex.engineering` as a sending domain in Resend; set
      `RESEND_API_KEY`, `CONTACT_FROM`, and `CONTACT_TO` in the Cloudflare Pages
      project (Settings → Environment variables); then test the form end-to-end.
      Until configured, the form gracefully shows the mailto fallback (503 path).

- [ ] **8. Deploy the DEFEX App** to `app.defex.engineering` (a **separate task
      card** — do not touch the app repo from here). Then set
      `src/content/site.json:appUrl`, rebuild, and verify the **Sign in** (header)
      and **Open DEFEX** (DEFEX App page) buttons render and resolve.

- [ ] **9. Optional:** add an Andrew headshot to the About page; set
      `src/content/site.json:social.linkedin` to the LinkedIn profile URL.

- [ ] **10. Attach the custom domain in Cloudflare Pages:** add `defex.engineering`
      and `www` (redirect `www` → apex), create the DNS records, and confirm HTTPS.

- [ ] **11. Final production QA:** run the §13 acceptance criteria (and a real
      Lighthouse ≥95 / axe pass) against the production URL.

**Go-live is a manual Andrew-gated step. Nothing in this list is performed
tonight.**
