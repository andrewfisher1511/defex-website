import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

interface LegalPageShellProps {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  crossLink: { label: string; href: string };
  children: ReactNode;
}

/**
 * Shared nav + footer for /terms and /privacy —
 * design_files/DEFEX Terms of Use.dc.html + DEFEX Privacy Policy.dc.html.
 */
export function LegalPageShell({
  eyebrow,
  title,
  lastUpdated,
  crossLink,
  children,
}: LegalPageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink-muted">
      <nav className="border-b border-hairline bg-white/92 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between gap-8 px-8">
          <Link
            href="/"
            aria-label="DEFEX Engineering home"
            className="flex min-h-11 items-center"
          >
            <Image
              src="/assets/defex-lockup-horizontal-navy.png"
              alt="DEFEX Engineering"
              width={220}
              height={46}
              className="h-[46px] w-auto"
            />
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center text-sm font-medium text-ink-muted transition-colors duration-200 hover:text-blue-electric"
          >
            ← Back to site
          </Link>
        </div>
      </nav>

      <main className="flex-1 px-8 py-18 sm:py-24">
        <div className="mx-auto flex max-w-[820px] flex-col gap-9">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3.5">
              <span className="block h-0.5 w-10 bg-blue-electric" />
              <span className="text-xs font-semibold tracking-[0.28em] text-steel">
                {eyebrow}
              </span>
            </div>
            <h1 className="m-0 text-[40px] font-light tracking-[-0.02em] text-navy-ink">
              {title}
            </h1>
            <p className="m-0 text-sm text-grey-400">{lastUpdated}</p>
          </div>

          {children}
        </div>
      </main>

      <footer className="border-t border-hairline bg-white px-8 py-6">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-6">
          <p className="m-0 text-[13px] text-grey-400">
            © DEFEX Engineering Pty Ltd 2026. All rights reserved.
          </p>
          <p className="m-0 flex gap-4 text-[13px] text-grey-400">
            <Link
              href={crossLink.href}
              className="text-grey-400 transition-colors duration-200 hover:text-blue-electric"
            >
              {crossLink.label}
            </Link>
            <Link
              href="/"
              className="text-grey-400 transition-colors duration-200 hover:text-blue-electric"
            >
              Home
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

interface LegalSectionProps {
  heading: string;
  children: ReactNode;
}

export function LegalSection({ heading, children }: LegalSectionProps) {
  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="m-0 text-lg font-semibold text-navy-ink">{heading}</h2>
      <p className="m-0 text-[15px] leading-[1.7]">{children}</p>
    </section>
  );
}
