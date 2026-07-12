# Spec: Contact form endpoint — Cloudflare Pages Function

Builds on the **existing rev1 setup**: Cloudflare Pages is already deployed and **Resend is already working** for email relay. This spec extends that pipeline; do not replace what works — extend it.

## Route
`POST /api/enquiry` (Pages Function, `functions/api/enquiry.ts`). Accepts `multipart/form-data`:
`name*, email*, phone, role, address, description*, hearAbout, files[]` (≤10 files, ≤10 MB each, images/PDF/doc types only — validate server-side).

## Pipeline (in order)
1. **Spam gate** — hidden honeypot field (reject silently if filled) + **Cloudflare Turnstile** (invisible widget on the form; verify token server-side via `siteverify`). Rate-limit per IP (e.g. 5/hour) with a KV counter.
2. **Validate** — same rules as the UI (name, email format, description non-empty). Return 422 with field errors; the front end maps them to the inline error styles.
3. **Store attachments** — upload files to **R2** under `enquiries/<id>/`; keep originals at full resolution (chain-of-evidence principle). Generate short-lived signed URLs for the email.
4. **AI subject line** — one Anthropic Messages API call (Haiku-class model, `max_tokens` ~100, temperature 0):
   - Prompt: produce exactly `New DEFEX Website enquiry - <role or company> (<name>) - <address> - <very short plain summary of the request>`; Australian English; no exclamation marks; ≤140 chars; output only the line.
   - **Timeout 3s; on any failure fall back** to the deterministic template (same format, description truncated at 80 chars). The email must never wait on or fail because of the AI call. Do not send attachment content to the model — form text only.
   - (The prototype's Contact success screen demonstrates this: `generateSubject()` in `pages/DEFEX Contact.dc.html`.)
5. **Persist the enquiry** — write the full record (id, timestamp, all fields, R2 keys, subject line) to the DEFEX platform database (Supabase) as an `enquiry` row with status `new`. This is the source of truth the magic links act on.
6. **Send email via Resend** (existing account/domain) to andrew@defex.engineering:
   - Subject: the AI/fallback line.
   - Body (brand-styled HTML, navy header with lockup): all fields in a definition table, attachment list with signed links, and the **action block** below.
   - `reply-to`: the enquirer's email, so a plain reply goes straight to them.
7. **Auto-acknowledgement** (optional, recommended): short Resend email to the enquirer — "Your enquiry has reached DEFEX" + Andrew's phone for urgent matters. Plain, no marketing.
8. Respond 200 to the front end (which shows the success state regardless of AI timing).

## Magic action links (push to Command / CRM)
Two buttons in the email to Andrew, as previewed in the prototype's success screen:

- **"Add to DEFEX Command as potential job"** → `https://app.defex.engineering/intake/<enquiryId>?token=<jwt>`
- **"Create CRM contact"** → same route with `mode=crm`

Mechanics:
- Token: short-lived (7 days) single-purpose JWT signed with a server secret, scoped to the enquiry id and action. The link requires Andrew's normal app login on top of the token — the token authorises the *import*, not the session.
- Handler behaviour (in the DEFEX app): create a **draft job** on the Command board — stage "Potential", auto job number, address, client contact from the enquiry, description into the Brief/Notes rich-text box, attachments copied from R2 into the job's Docs, `hearAbout` into the CRM lead-source field; create/match the **CRM contact** by email (dedupe on email, then phone). Land Andrew in the Quick View drawer of the new job for one-look confirmation. Nothing is created until the link is clicked — the email is the gate (consistent with the platform's confirm-before-write rule).
- Idempotent: clicking twice opens the already-created job instead of duplicating.

## Config
Secrets via Pages env vars: `RESEND_API_KEY` (existing), `ANTHROPIC_API_KEY`, `TURNSTILE_SECRET`, `INTAKE_JWT_SECRET`, R2 binding, Supabase service key. Never expose in client code.

## Front-end contract
The prototype form already produces every field this endpoint needs; wire `submit()` to `fetch('/api/enquiry', …)` with FormData, keep the optimistic success state, and surface a retry message on network failure (5xx): "Something went wrong sending the enquiry — call or email directly."

## Later (agreed backlog)
Google Places Autocomplete on the address field (session tokens, `country:au`) — the prototype ships a mocked suggestion dropdown showing the intended UX · **AI urgency triage**: the subject-line call also flags active water ingress / safety-risk language, prefixes the subject with `URGENT - `, and the email shows a red URGENT tag (prototyped — keyword fallback in `isUrgent()`, AI prompt instruction included) · **duplicate-enquiry detection**: before creating the draft job, match the enquiry email/phone/address against existing CRM contacts and open jobs; if matched, the email's action link says "Open existing job" instead of creating a duplicate · **service-area soft note**: the form shows a blueprint-tint note when the typed address matches regional-NSW markers (prototyped) — production should key this off the Places result's locality; always a soft note, never a hard reject.
