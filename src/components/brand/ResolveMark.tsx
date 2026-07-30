import type { ReactNode } from "react";
import type { LockupTone } from "./DefexLockup";

/**
 * "The resolve" — Rev 4 motion identity (export/resolve/resolve-animation.html
 * is the reference implementation). Frame stroke draws 0.8s → arms scale in
 * from centre-out origins, 150ms stagger from 0.55s → diamond snaps at 1.45s
 * (40% overshoot) → one glow pulse at 1.95s → tagline fades up at 2.1s.
 * Total ~2.5s, master ease cubic-bezier(0.16,1,0.3,1).
 *
 * Pure CSS (keyframes live in globals.css under "dfx-"), so it animates
 * before hydration and stays a server component. Under prefers-reduced-motion
 * every animation is disabled and the base styles are exactly the final
 * frame — the static lockup renders instead.
 */
export function ResolveMark({
  tone = "navy",
  size,
  tagline = null,
  className,
}: {
  /** Background the mark sits on: "navy" (white ink) or "light" (navy ink). */
  tone?: LockupTone;
  /** Fixed square size in px; omit to fill the container width (w-full). */
  size?: number;
  /** Brand line fading up as the diamond lands; null renders the mark alone. */
  tagline?: ReactNode;
  className?: string;
}) {
  const ink = tone === "navy" ? "#FFFFFF" : "#1A1A2E";
  const taglineColor = tone === "navy" ? "text-white/85" : "text-steel";
  return (
    <div
      className={`flex flex-col items-center gap-6 ${className ?? ""}`}
      aria-hidden={tagline === null ? true : undefined}
    >
      <svg
        viewBox="0 0 120 120"
        {...(size ? { width: size, height: size } : {})}
        className={size ? undefined : "h-auto w-full"}
        aria-hidden="true"
      >
        <rect
          className="dfx-frame"
          x="10"
          y="10"
          width="100"
          height="100"
          rx="18"
          fill="none"
          stroke={ink}
          strokeWidth="7"
          strokeDasharray="400"
        />
        <g transform="rotate(45 60 60)" fill={ink}>
          <rect className="dfx-a1" x="72" y="53" width="40" height="14" />
          <rect className="dfx-a2" x="8" y="53" width="40" height="14" />
          <rect className="dfx-a3" x="53" y="72" width="14" height="40" />
          <rect className="dfx-a4" x="53" y="8" width="14" height="40" />
        </g>
        <rect className="dfx-diamond" x="52.5" y="52.5" width="15" height="15" fill="#2563EB" />
      </svg>
      {tagline !== null && (
        <div
          className={`dfx-fade-up whitespace-nowrap text-[13px] font-light uppercase tracking-[0.3em] ${taglineColor}`}
        >
          {tagline}
        </div>
      )}
    </div>
  );
}
