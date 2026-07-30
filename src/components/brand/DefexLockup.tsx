/**
 * DEFEX lockup system — Brand Kit v4 (Rev 4).
 *
 * Ratios are locked (design_handoff_brand_kit_v4/export/README-claude-code.md):
 * - Wordmark: Inter 900, letter-spacing -0.02em, X solid Electric Blue (no counter-diamond)
 * - ENGINEERING: weight 800, font-size = 0.318 × DEFEX size, top gap = 0.045 × DEFEX size
 *   (min 1px), letters justified space-between so the word runs flush D-to-X
 * - Icon-left: icon box = 1.72 × DEFEX font-size, gap = 0.45 × DEFEX size, centred
 * - H3 single-line lockup is retired — deliberately not implemented
 */

/** Background the lockup sits on: "light" (H2, navy ink) or "navy" (H1, white ink). */
export type LockupTone = "light" | "navy";

const BLUE = "#2563EB";
const NAVY = "#1A1A2E";
const STEEL = "#5C6B7F";

const ENGINEERING_LETTERS = "ENGINEERING".split("");

const ink = (tone: LockupTone) => (tone === "navy" ? "#FFFFFF" : NAVY);

export function DefexMark({
  tone = "light",
  size = 32,
  className,
}: {
  tone?: LockupTone;
  size?: number;
  className?: string;
}) {
  const stroke = ink(tone);
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className ? `shrink-0 ${className}` : "shrink-0"}
      aria-hidden="true"
    >
      <rect x="10" y="10" width="100" height="100" rx="18" fill="none" stroke={stroke} strokeWidth="7" />
      <g transform="rotate(45 60 60)" fill={stroke}>
        <rect x="72" y="53" width="40" height="14" />
        <rect x="8" y="53" width="40" height="14" />
        <rect x="53" y="72" width="14" height="40" />
        <rect x="53" y="8" width="14" height="40" />
      </g>
      <rect x="52.5" y="52.5" width="15" height="15" transform="rotate(45 60 60)" fill={BLUE} />
    </svg>
  );
}

/**
 * Wordmark only. Always decorative: the wordmark splits DEFEX into "DEFE" + a
 * blue "X" and sets ENGINEERING as eleven justified letter spans, which reads
 * as fragments to a screen reader. The accessible name belongs on the
 * container — DefexLockup below, or the caller's own role="img"/aria-label.
 */
export function DefexWordmark({ size, tone = "light" }: { size: number; tone?: LockupTone }) {
  const engineeringColor = tone === "navy" ? "rgba(255,255,255,0.85)" : STEEL;
  return (
    <span className="inline-flex flex-col" aria-hidden="true">
      <span
        className="whitespace-nowrap"
        style={{
          fontSize: size,
          fontWeight: 900,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          color: ink(tone),
        }}
      >
        DEFE<span style={{ color: BLUE }}>X</span>
      </span>
      <span
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: size * 0.318,
          fontWeight: 800,
          lineHeight: 1,
          marginTop: Math.max(size * 0.045, 1),
          color: engineeringColor,
        }}
      >
        {ENGINEERING_LETTERS.map((letter, i) => (
          <span key={i}>{letter}</span>
        ))}
      </span>
    </span>
  );
}

/**
 * Icon-left horizontal lockup — H1 (tone "navy", white ink) or H2 (tone
 * "light", navy ink). `size` is the DEFEX wordmark font-size in px; every
 * other dimension derives from it.
 */
export function DefexLockup({
  size = 28,
  tone = "light",
  className,
}: {
  size?: number;
  tone?: LockupTone;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label="DEFEX Engineering"
      className={className ? `inline-flex items-center ${className}` : "inline-flex items-center"}
      style={{ gap: size * 0.45 }}
    >
      <DefexMark tone={tone} size={size * 1.72} />
      <DefexWordmark size={size} tone={tone} />
    </span>
  );
}
