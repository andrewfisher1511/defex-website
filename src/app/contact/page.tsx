import Link from "next/link";
import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { DefexLockup } from "@/components/brand/DefexLockup";

export const metadata: Metadata = {
  title: "Contact — DEFEX Engineering",
};

/**
 * Minimal, functional contact page — not part of the five pixel-specced
 * surfaces in this handoff (gate, main site, DBP hub, legal, resume), so
 * there is no design file to match here. Built to give Launch Pack D1's
 * email pair a real, testable trigger; not yet linked from nav/footer —
 * where this fits the site's IA is a follow-up design decision.
 */
export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink-muted">
      <nav className="border-b border-hairline bg-white/92 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between gap-8 px-8">
          <Link href="/" aria-label="DEFEX Engineering home" className="flex min-h-11 items-center">
            <DefexLockup size={22} tone="light" />
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
        <div className="mx-auto flex max-w-[680px] flex-col gap-9">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3.5">
              <span className="block h-0.5 w-10 bg-blue-electric" />
              <span className="text-xs font-semibold tracking-[0.28em] text-steel">CONTACT</span>
            </div>
            <h1 className="m-0 text-[40px] font-light tracking-[-0.02em] text-navy-ink">
              Talk to the engineer directly.
            </h1>
            <p className="m-0 text-[15px] leading-relaxed">
              Andrew reads and replies to every enquiry himself. For anything urgent — active water
              ingress, a safety concern — call{" "}
              <a href="tel:+61432261722" className="text-blue-electric">
                0432 261 722
              </a>{" "}
              rather than waiting on email.
            </p>
          </div>

          <ContactForm />
        </div>
      </main>

      <footer className="border-t border-hairline bg-white px-8 py-6">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-6">
          <p className="m-0 text-[13px] text-grey-400">
            © DEFEX Engineering Pty Ltd 2026. All rights reserved.
          </p>
          <p className="m-0 flex gap-4 text-[13px] text-grey-400">
            <Link href="/privacy" className="text-grey-400 transition-colors duration-200 hover:text-blue-electric">
              Privacy
            </Link>
            <Link href="/terms" className="text-grey-400 transition-colors duration-200 hover:text-blue-electric">
              Terms
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
