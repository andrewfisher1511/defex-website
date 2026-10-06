import type { CSSProperties } from "react";
import Link from "next/link";
import { GhostMark } from "@/components/brand/GhostMark";
import { LEVEL_LINE_GEOMETRY as G, LevelLineLogo } from "@/components/brand/LevelLineLogo";
import type { SignInNotice } from "@/lib/auth/sign-in-notice";
import { SignInLink } from "./SignInLink";
import { SignOutButton } from "./SignOutButton";

export type GateAuthState =
  | { status: "signed-out" }
  | { status: "signed-in-not-admitted"; email: string }
  | { status: "signed-in-admitted"; email: string };

interface ComingSoonGateProps {
  authState?: GateAuthState;
  /** From the callback's `?auth_error=`; null shows nothing. */
  notice?: SignInNotice | null;
}

const NOTICE_TEXT: Record<SignInNotice, string> = {
  "not-permitted": "That account can't sign in here. This site is private.",
  failed: "Sign-in didn't complete. Please try again.",
};

/*
 * The datum and the level-line laser are HTML, positioned from the logo's own
 * geometry so they stay welded to it at every breakpoint. All three scale from
 * --logo-h; --pad-x and --pad-t are where the logo sits.
 */
const datumTop = `calc(var(--pad-t) + var(--logo-h) * ${G.datumTop / G.height})`;
const datumHeight = `calc(var(--logo-h) * ${G.datumThickness / G.height})`;
const dotSize = `calc(var(--logo-h) * ${14.88 / G.height})`; // the kit's laser dot, r = 7.44

const lineStyle: CSSProperties = { top: datumTop, height: datumHeight };
const datumStyle: CSSProperties = {
  ...lineStyle,
  left: `calc(var(--pad-x) + var(--logo-h) * ${G.datumLeft / G.height})`,
};
const logoStyle: CSSProperties = {
  height: "var(--logo-h)",
  width: `calc(var(--logo-h) * ${G.width / G.height})`,
};

/** The credentials in their locked order (TRUST-01). Never CPEng, NER or PI insurance. */
const CREDENTIALS = [
  "Andrew Fisher",
  "BEng(Civil)",
  "MIEAust",
  "NSW Registered Professional Engineer",
  "NSW Registered Design Practitioner",
];

const linkClass =
  "inline-flex min-h-11 items-center text-white underline decoration-white/35 underline-offset-4 transition-colors duration-150 hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-electric";

/**
 * The landing page — brand kit v2.0, set as a cover (owner's choice,
 * 6 October 2026: the capability-statement cover as a web page).
 *
 *  - Flat Navy Ink; no photograph, no gradient.
 *  - The reversed logo top-left. Its datum runs from under the D off the
 *    right edge of the screen, and arrives with the level-line motion.
 *  - The ghosted mark cropped by the right edge, never behind the logo or the
 *    title: on a desktop it keeps to the right of the words; below that it
 *    sits in the space between the logo and the words, sized to fit it.
 *  - No blue text on navy (owner's ruling): Electric Blue on Navy Ink is
 *    3.3 : 1, under the 4.5 : 1 text minimum. Blue is kept for the datum,
 *    the diamond and focus rings, which need only 3 : 1.
 *  - Contact details for visitors, no call-to-action button; the owner's
 *    sign-in is a quiet link at the foot.
 *
 * A server component: the state comes from the verified session, so the page
 * never flashes the wrong state. Only the sign-in link is a client component.
 */
export function ComingSoonGate({ authState = { status: "signed-out" }, notice = null }: ComingSoonGateProps) {
  return (
    <div className="dfx-ll relative isolate flex min-h-dvh flex-col overflow-hidden bg-navy-ink text-white [--logo-h:40px] [--pad-t:28px] [--pad-x:20px] sm:[--logo-h:48px] sm:[--pad-t:40px] sm:[--pad-x:40px] lg:[--logo-h:56px] lg:[--pad-t:56px] lg:[--pad-x:64px] xl:[--pad-x:96px]">
      {/* Desktop: the ghosted mark on the right, clear of the words (they stop at 54vw). */}
      <GhostMark className="pointer-events-none absolute right-0 top-[9vh] -z-10 hidden aspect-square h-[min(78vh,52vw)] translate-x-[16%] lg:block" />

      <header className="relative pl-[var(--pad-x)] pt-[var(--pad-t)]">
        {/* The level line: sweeps the full width, then trims back to the datum. */}
        <div aria-hidden="true" className="ll-laser pointer-events-none absolute inset-x-0 bg-blue-electric" style={lineStyle} />
        <div aria-hidden="true" className="ll-rider pointer-events-none absolute inset-x-0" style={lineStyle}>
          <span
            className="ll-dot absolute right-0 top-1/2 block -translate-y-1/2 translate-x-1/2 rounded-full bg-[#9DB9FF]"
            style={{ width: dotSize, height: dotSize }}
          />
        </div>
        {/* The datum: from under the D to the right edge of the screen. */}
        <div aria-hidden="true" className="ll-datum pointer-events-none absolute right-0 bg-blue-electric" style={datumStyle} />
        <LevelLineLogo className="relative block" style={logoStyle} />
      </header>

      {/* Below desktop: the space between the logo and the words, holding the ghosted mark. */}
      <div aria-hidden="true" className="relative min-h-[160px] flex-1">
        <GhostMark className="pointer-events-none absolute right-0 top-1/2 aspect-square h-[min(100%,380px)] -translate-y-1/2 translate-x-[22%] lg:hidden" />
      </div>

      <main className="ll-reveal relative px-[var(--pad-x)] lg:max-w-[54vw] lg:pr-0">
        <p className="whitespace-nowrap text-[12px] font-semibold uppercase tracking-[0.2em] text-concrete">
          Coming soon
        </p>
        <h1 className="mt-4 text-[44px] font-normal uppercase leading-[1.02] tracking-[-0.01em] text-white lg:mt-5 lg:text-[60px]">
          Defects Resolved.
        </h1>
        <div className="mt-8 h-px w-full bg-white/15 lg:mt-10" />
        <p className="mt-8 max-w-[34rem] text-[16px] leading-[1.6] text-white/80 lg:mt-10 lg:text-[18px]">
          DEFEX Engineering is a Sydney remedial engineering consultancy. We investigate building defects, design
          the fix, and administer the works, from first inspection to practical completion.
        </p>
        <dl className="mt-8 grid grid-cols-1 gap-y-3 sm:grid-cols-[auto_auto] sm:justify-start sm:gap-x-14 lg:mt-10">
          <div>
            <dt className="text-[12px] font-semibold uppercase tracking-[0.12em] text-white/60">Email</dt>
            <dd>
              <a href="mailto:andrew@defex.engineering" className={`${linkClass} text-[16px]`}>
                andrew@defex.engineering
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-[12px] font-semibold uppercase tracking-[0.12em] text-white/60">Phone</dt>
            <dd>
              <a href="tel:+61432261722" className={`${linkClass} text-[16px] tabular-nums`}>
                0432 261 722
              </a>
            </dd>
          </div>
        </dl>
      </main>

      <footer
        className="ll-reveal relative mt-12 flex flex-col gap-4 border-t border-white/10 px-[var(--pad-x)] pb-[max(24px,env(safe-area-inset-bottom))] pt-5 md:flex-row md:items-end md:justify-between md:gap-10 lg:mt-16"
        style={{ "--reveal-delay": "1.05s" } as CSSProperties}
      >
        <div className="text-[12px] leading-[1.7] text-white/60">
          <p>{CREDENTIALS.join(" · ")}</p>
          <p>© DEFEX Engineering Pty Ltd 2026 · ABN 31 700 169 580 · PO Box 148, Gymea NSW 2227</p>
        </div>

        <div className="shrink-0 md:text-right">
          {authState.status === "signed-out" && <SignInLink />}

          {authState.status === "signed-in-not-admitted" && (
            <div className="flex flex-col items-start gap-1 text-[13px] text-white/70 md:items-end">
              <p>Signed in as {authState.email}. This account doesn&apos;t have access.</p>
              <SignOutButton className={`${linkClass} text-[13px] font-medium`} />
            </div>
          )}

          {authState.status === "signed-in-admitted" && (
            <div className="flex flex-col items-start gap-1 text-[13px] text-white/70 md:items-end">
              <p>Signed in as {authState.email}</p>
              <div className="flex gap-6">
                <Link href="/" className={`${linkClass} text-[13px] font-medium`}>
                  Open the site
                </Link>
                <SignOutButton className={`${linkClass} text-[13px] font-medium`} />
              </div>
            </div>
          )}

          {notice && (
            <p role="status" className="mt-1 max-w-[300px] text-[13px] leading-relaxed text-white/80 md:ml-auto">
              {NOTICE_TEXT[notice]}
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}
