# DEFEX print artwork — Rev 4

Artwork specs live in the brand bundle (`design_handoff_brand_kit_v4/templates/`).
This folder holds the one piece that had to be generated rather than designed:
the live vCard QR that replaces the placeholder on the business-card back.

## vCard QR

- `andrew-fisher.vcf` — the payload, and the source of truth. Regenerate the QR
  if this changes.
- `vcard-qr.svg` — the code itself. Vector, navy `#1A1A2E` on white, zero quiet-zone
  margin built in (the card layout supplies the quiet zone — see below).

Verified: rasterised at 13 mm / 1200 dpi and decoded back to a byte-identical vCard.

**Placement.** 13 × 13 mm as specced, on the shared Navy back.

**One thing to raise with the printer.** The code is 57 modules square, so at
13 mm each module is **0.228 mm**. The usual floor for reliable phone scanning is
0.25 mm, and 350 gsm uncoated matte has real dot gain — ink spreads and adjacent
dark modules can bridge. It will very likely scan fine, but there is no margin in it.
Two ways to buy margin, in order of preference:

1. **Print it at 15 × 15 mm** → 0.263 mm per module, comfortably over the floor.
   Costs 2 mm of card back and nothing else.
2. Keep 13 mm and ask the printer to confirm they can hold 0.228 mm on this stock.

Do not shrink the payload further to gain modules — it is already trimmed to
name, org, title, mobile, email and site.

**Quiet zone.** The QR needs 4 modules of clear white on every side (≈0.9 mm at
13 mm, ≈1.05 mm at 15 mm). The SVG has no built-in margin, so the card layout must
provide it. Nothing — rule, mark or caption — may encroach.

## Everything else

Per the brief, the rest is artwork export from the bundle templates, not code:

| Item | Source | Spec |
|---|---|---|
| Business cards | `templates/business-cards.html` | 89 × 54 mm, 350 gsm uncoated matte, both Navy fronts share one back |
| Sticky pads | Brand Kit section 06 | 99 × 99 mm, 50 leaf — A (5 ruled lines), B (5 mm grid, no heading rule), C (plain) |
| Letterhead p1 + p2 | `templates/letterhead-classic.html`, `-p2.html` | p1 carries the right-aligned PROJECT NO. (format N0250001) |
| Engineering pad | `templates/engineering-pad.html` | Spec is commented at the top of that file: A4, 80 gsm bond, 50-leaf glued pads, grey backing board, PMS 5255C + `#2563EB` |
