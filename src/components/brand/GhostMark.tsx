/**
 * The ghosted mark — brand kit v2.0: the DEFEX mark in white at about 7.5 %,
 * cropped by the right edge of a navy surface. It never sits behind the logo
 * or a title (the caller places it so).
 *
 * Built exactly as the kit's own (defex-mocks.js `ghost`): the survey frame
 * and the four arms only, with no diamond, so the centre reads as open.
 * Decorative, so it is hidden from assistive technology.
 */
export function GhostMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      style={{ opacity: 0.075 }}
      aria-hidden="true"
      focusable="false"
    >
      <rect x="10" y="10" width="100" height="100" rx="18" fill="none" stroke="#FFFFFF" strokeWidth="7" />
      <g transform="rotate(45 60 60)" fill="#FFFFFF">
        <rect x="72" y="53" width="40" height="14" />
        <rect x="8" y="53" width="40" height="14" />
        <rect x="53" y="72" width="14" height="40" />
        <rect x="53" y="8" width="14" height="40" />
      </g>
    </svg>
  );
}
