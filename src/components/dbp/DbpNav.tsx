import Link from "next/link";
import { DefexLockup } from "@/components/brand/DefexLockup";

/** Sticky nav for /dbp-act — DEFEX DBP Hub.dc.html's own "Nav" screen. */
export function DbpNav() {
  return (
    <nav className="sticky top-0 z-[100] border-b border-hairline bg-white/92 backdrop-blur-md">
      <div className="mx-auto flex h-[84px] max-w-[1400px] items-center justify-between gap-8 px-6 min-[900px]:px-8">
        <Link href="/site" aria-label="DEFEX Engineering home" className="flex min-h-11 items-center">
          <span className="min-[900px]:hidden">
            <DefexLockup size={21} tone="light" />
          </span>
          <span className="hidden min-[900px]:inline-flex">
            <DefexLockup size={30} tone="light" />
          </span>
        </Link>
        <div className="flex items-center gap-3 min-[900px]:gap-5">
          <a
            href="#quiz"
            className="inline-flex min-h-11 items-center text-sm font-medium text-ink-muted transition-colors hover:text-blue-electric"
          >
            The 3-minute check
          </a>
          <a
            href="#anatomy"
            className="hidden min-h-11 items-center text-sm font-medium text-ink-muted transition-colors hover:text-blue-electric min-[640px]:inline-flex"
          >
            Defect map
          </a>
          <Link
            href="/site"
            className="inline-flex min-h-11 items-center text-sm font-medium text-ink-muted transition-colors hover:text-blue-electric"
          >
            ← Back to site
          </Link>
        </div>
      </div>
    </nav>
  );
}
