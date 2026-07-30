# DEFEX print artwork — Rev 4

Artwork specs live in the brand bundle (`design_handoff_brand_kit_v4/templates/`).
This folder holds the one piece that had to be generated rather than designed:
the live vCard QR that replaces the placeholder on the business-card back.

## vCard QR

- `andrew-fisher.vcf` — the payload, and the source of truth. Regenerate the QR
  if this changes.
- `vcard-qr.svg` — the code itself. Vector, navy `#1A1A2E` on white, sized in real
  units (`width="15mm" height="15mm"`) so placement cannot rescale it by accident.

Verified: rasterised at 15 mm / 1200 dpi and decoded back to a byte-identical vCard.

**Placement. 15 × 15 mm** on the shared Navy back — *not* the 13 mm in the original
spec. The code is 57 modules square, so 13 mm would put each module at 0.228 mm,
under the ~0.25 mm floor usually quoted for reliable phone scanning. On 350 gsm
uncoated matte that matters: ink spreads and adjacent dark modules can bridge.
At 15 mm each module is **0.263 mm**, clear of the floor. The extra 2 mm costs
nothing but card-back space.

Do not shrink the payload to claw back modules — it is already trimmed to name,
org, title, mobile, email and site.

**Quiet zone.** The QR needs 4 modules of clear white on every side — **1.05 mm**
at this size, so the total reserved footprint is **17.11 mm square**. The SVG has
no built-in margin, so the card layout must provide it. Nothing — rule, mark or
caption — may encroach.

## Everything else

Per the brief, the rest is artwork export from the bundle templates, not code:

| Item | Source | Spec |
|---|---|---|
| Business cards | `templates/business-cards.html` | 89 × 54 mm, 350 gsm uncoated matte, both Navy fronts share one back |
| Sticky pads | Brand Kit section 06 | 99 × 99 mm, 50 leaf — A (5 ruled lines), B (5 mm grid, no heading rule), C (plain) |
| Letterhead p1 + p2 | `templates/letterhead-classic.html`, `-p2.html` | p1 carries the right-aligned PROJECT NO. (format N0250001) |
| Engineering pad | `templates/engineering-pad.html` | Spec is commented at the top of that file: A4, 80 gsm bond, 50-leaf glued pads, grey backing board, PMS 5255C + `#2563EB` |
