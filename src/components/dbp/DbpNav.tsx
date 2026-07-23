import Image from "next/image";
import Link from "next/link";

/** Sticky nav for /dbp-act — DEFEX DBP Hub.dc.html's own "Nav" screen. */
export function DbpNav() {
  return (
    <nav className="sticky top-0 z-[100] border-b border-hairline bg-white/92 backdrop-blur-md">
      <div className="mx-auto flex h-[84px] max-w-[1400px] items-center justify-between gap-8 px-6 min-[900px]:px-8">
        <Link href="/site" aria-label="DEFEX Engineering home" className="flex min-h-11 items-center">
          <Image
            src="/assets/defex-lockup-horizontal-navy.png"
            alt="DEFEX Engineering"
            width={320}
            height={68}
            className="h-12 w-auto min-[900px]:h-[68px]"
          />
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
