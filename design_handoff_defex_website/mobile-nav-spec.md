# Spec: Mobile navigation variant

The prototypes are desktop-first (≥1100px). Implement this variant below **900px**; between 900–1100px the desktop nav may compress (reduce link padding to 8px) before switching.

## Bar
- Fixed top bar, 64px high, same translucent treatment (`rgba(255,255,255,0.82)` + `backdrop-blur(12px)`, hairline border after 8px scroll). Scroll-progress bar stays, 3px, above it.
- Left: lockup at 30px high. Right: a 44×44px menu button — Lucide `menu` (24px, `#1A1A2E`), no label. Becomes `x` when open.

## Drawer
- Full-screen overlay under the bar: white, opaque. Body scroll locked while open.
- Links stacked, left-aligned, 24px gutters: each row 56px min-height, 18px Medium, `#1A1A2E`, 1px `#F0F2F5` row rules. Active page: Semibold with a 3px Electric Blue left rule and blueprint-tint (`#EFF4FE`) row wash.
- Order: Home / Services / Projects / DEFEX App / About, then a full-width primary **Contact** button (48px, blue) with 24px top margin.
- Below the links, small footer block: phone (tel:) and email (mailto:) in Steel 14px.
- Open/close animation: drawer fades + slides down 12px, 0.25s `cubic-bezier(0.16, 1, 0.3, 1)`; links stagger 30ms. Menu icon cross-fades. All skipped under `prefers-reduced-motion`.
- Accessibility: button `aria-expanded` + `aria-controls`; focus trapped in drawer; Esc closes; focus returns to the button.

## Page-level mobile rules (summary)
- Containers: 24px gutters; grids collapse to single column (sticky rails become in-flow, above or below content as noted per page).
- Hero H1 scales via `clamp(40px, 11vw, 76px)`; heroes shrink to ~560px; SCROLL cue hidden.
- Services: "On this page" rail becomes a horizontal scroll chip row under the header; numeral column narrows to 72px.
- Projects: image stacks above text every case.
- Contact: left rail renders above the form; form card padding 24px; Email/Phone grid stacks.
- Process/timeline: horizontal timeline (Services) becomes the vertical drawn-line variant (as About).
- Tap targets stay ≥44px throughout; defect-pin cards on Home anchor to the bottom edge full-width.
