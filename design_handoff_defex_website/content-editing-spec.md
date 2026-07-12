# Spec: Editing the site after launch — sandbox, AI, and LinkedIn sync

How Andrew updates the live site without touching code, using the pieces already in place (GitHub repo `andrewfisher1511/defex-website`, Cloudflare Pages, Claude Code).

## The core idea: content as files, previews as the sandbox

1. **All editable content lives as plain files in the repo**, separated from layout code:
   - `content/projects/*.md` — one file per case study (title, sector, tags, paragraphs, image list with captions)
   - `content/posts/*.md` — one file per blog post
   - `content/site.json` — hours, phone, email, ABN, service area, social URLs, hero copy, service one-liners
   - `content/diagnostics.json` — the defect-pin scenarios (image, pins, captions)
   The Astro pages render from these files. Changing content never touches a component.

2. **Cloudflare Pages preview deployments ARE the sandbox.** Every branch/PR automatically gets its own private preview URL (`<branch>.defex-website.pages.dev`). Edit on a branch → open the preview link → click around the full site with the change applied → merge to `main` to publish. Nothing goes live until merge; rollback = revert the commit.

3. **AI does the editing.** Two ways, same result:
   - **Claude Code (local)**: "add a project: podium remediation in Cronulla, tags waterproofing + superintendency, here are 4 photos and rough notes" → it writes the Markdown, resizes/places the images, opens the PR, and hands back the preview URL.
   - **Claude GitHub app (from the phone)**: open an issue or PR comment describing the change in plain English; Claude commits to a branch and the preview link appears in the PR. Good for copy tweaks and new posts from site.
   Guardrails: AI edits only under `content/`; the brand guardrails file (no PI claims, ABN placeholder, service-area wording) sits in the repo's CLAUDE.md so every AI edit obeys them.

## LinkedIn posts — recommended automation

LinkedIn's API is locked down for personal-profile posting, so full two-way sync is not practical. The reliable pattern, in order of preference:

1. **Site-first (recommended)**: write the post as `content/posts/*.md` (via Claude Code or the GitHub app — dictated notes are fine, AI drafts in the DEFEX voice). On merge, a GitHub Action posts the finished text + link to LinkedIn via a scheduling tool's API (Buffer/Typefully both support LinkedIn company pages). One write, two destinations, the site is canonical.
2. **Email-in fallback**: email the post text + images to a dedicated address (Cloudflare Email Worker) → it creates the Markdown, opens the PR, replies with the preview link. Approve by merging.
3. **Paste-in minimum**: if no tooling, pasting a LinkedIn post into an issue titled "new post" and letting the GitHub app do the rest is still a 2-minute job.

Company-page posts CAN be read via API with a LinkedIn app approval — if the page is used consistently, an inbound sync (LinkedIn → draft PR) can be added later; treat it as an enhancement, not the foundation.

## What this costs to run
Nothing beyond what exists: GitHub free, Cloudflare Pages free tier, Claude Code under the existing plan. The scheduling tool (if used) is the only new subscription.

## Explicitly rejected: a CMS admin panel
A hosted CMS (Sanity/Contentful/Decap) adds logins, schemas and a second UI to maintain — for a one-engineer practice the repo + preview + AI loop is simpler, fully versioned, and already brand-guarded. Revisit only if a non-technical staff member needs to edit without AI assistance.
