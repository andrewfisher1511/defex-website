import Image from "next/image";
import { PrivatePreviewSignInButton } from "./PrivatePreviewSignInButton";
import { SignOutButton } from "./SignOutButton";

export type GateAuthState =
  | { status: "signed-out" }
  | { status: "signed-in-not-admitted"; email: string }
  | { status: "signed-in-admitted"; email: string };

/**
 * Status-mode config for the gate's eyebrow/headline/sign-in copy. Kept as
 * a live enum with both values, not deleted, so this can flip back to
 * "private-preview" later without re-threading copy. Code constant rather
 * than an env var — same pattern as showDefectMap/gateGuide elsewhere in
 * this repo — since nothing about it is deployment-environment-specific.
 * If this ever needs to change without a redeploy, promote it to an env
 * var at that point (e.g. NEXT_PUBLIC_GATE_STATUS_MODE); it is not one now.
 */
type GateStatusMode = "coming-soon" | "private-preview";

/** Default and only mode for now — private-preview is unused. */
const GATE_STATUS_MODE: GateStatusMode = "coming-soon";

const STATUS_COPY: Record<
  GateStatusMode,
  { eyebrow: string; headline: string; signInLabel: string }
> = {
  "coming-soon": {
    eyebrow: "COMING SOON",
    headline: "Our new engineering website and workspace is coming soon.",
    signInLabel: "Enter DEFEX workspace",
  },
  "private-preview": {
    eyebrow: "PRIVATE PREVIEW",
    headline: "DEFEX is currently in private preview.",
    signInLabel: "Sign in to private preview",
  },
};

interface ComingSoonGateProps {
  authState?: GateAuthState;
  /** Where an admitted user goes (Part A5). */
  workspaceHref?: string;
}

/**
 * Full-screen gate — design_files/Defex-website-preview.dc.html, option 1a
 * (photographic).
 *
 * A server component: the state is decided from the verified session
 * (@/lib/auth/dal) rather than fetched in the browser, so the gate never
 * flashes the wrong state. Only the sign-in button is a client component.
 */
export function ComingSoonGate({
  authState = { status: "signed-out" },
  workspaceHref = "/app",
}: ComingSoonGateProps) {
  const { eyebrow, headline, signInLabel } = STATUS_COPY[GATE_STATUS_MODE];

  return (
    <div className="relative min-h-screen overflow-hidden bg-navy-ink">
      <Image
        src="/assets/hero-architecture.jpg"
        alt="Architectural concrete facade"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(165deg, rgba(26,26,46,0.95) 0%, rgba(26,26,46,0.82) 52%, rgba(37,99,235,0.48) 100%)",
        }}
      />
      <div
        className="absolute inset-0 hidden sm:block"
        style={{
          background:
            "linear-gradient(155deg, rgba(26,26,46,0.94) 0%, rgba(26,26,46,0.78) 48%, rgba(37,99,235,0.45) 100%)",
        }}
      />

      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-8 text-center sm:px-16 sm:py-16">
        <Image
          src="/assets/defex-lockup-stacked-white.png"
          alt="DEFEX Engineering"
          width={440}
          height={150}
          priority
          className="mb-9 h-[150px] w-auto sm:mb-12 sm:h-[220px]"
        />

        {authState.status === "signed-out" && (
          <>
            <div className="mb-[18px] flex items-center gap-[10px] sm:mb-[22px] sm:gap-[14px]">
              <span className="block h-0.5 w-6 bg-blue-electric sm:w-10" />
              <span className="whitespace-nowrap text-[11px] font-semibold tracking-[0.28em] text-concrete sm:text-[13px] sm:tracking-[0.32em]">
                {eyebrow}
              </span>
              <span className="block h-0.5 w-6 bg-blue-electric sm:w-10" />
            </div>
            <h1 className="mb-3 max-w-full text-[26px] font-light leading-[1.25] tracking-[-0.01em] text-white sm:mb-3.5 sm:max-w-[720px] sm:text-[40px] sm:leading-[1.15] sm:tracking-[-0.02em]">
              {headline}
            </h1>
            <p className="mb-8 max-w-[480px] text-[15px] leading-relaxed text-white/72 sm:mb-10 sm:text-base">
              Sign in below to get started.
            </p>
            <PrivatePreviewSignInButton label={signInLabel} />
          </>
        )}

        {authState.status === "signed-in-not-admitted" && (
          <>
            <div className="mb-[18px] flex items-center gap-[10px] sm:mb-[22px] sm:gap-[14px]">
              <span className="block h-0.5 w-6 bg-blue-electric sm:w-10" />
              <span className="whitespace-nowrap text-[11px] font-semibold tracking-[0.28em] text-concrete sm:text-[13px] sm:tracking-[0.32em]">
                {eyebrow}
              </span>
              <span className="block h-0.5 w-6 bg-blue-electric sm:w-10" />
            </div>
            <h1 className="mb-3 max-w-full text-[26px] font-light leading-[1.25] tracking-[-0.01em] text-white sm:mb-3.5 sm:max-w-[720px] sm:text-[40px] sm:leading-[1.15] sm:tracking-[-0.02em]">
              Thanks for signing in.
            </h1>
            <p className="mb-2 text-[15px] leading-relaxed text-white/72 sm:text-base">
              Signed in as {authState.email}. We&apos;ll let you know when your workspace access is
              ready.
            </p>
            <div className="mt-6 sm:mt-8">
              <SignOutButton />
            </div>
          </>
        )}

        {authState.status === "signed-in-admitted" && (
          <>
            <p className="mb-2 text-[15px] text-white/78">Welcome back.</p>
            <p className="mb-8 text-[15px] leading-relaxed text-white/72 sm:mb-10">
              Signed in as {authState.email}
            </p>
            <a
              href={workspaceHref}
              className="inline-flex min-h-[52px] w-full max-w-[320px] items-center justify-center rounded-control bg-blue-electric px-6 font-sans text-base font-semibold text-white transition-all duration-200 ease-in-out hover:-translate-y-px hover:bg-blue-electric-hover active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#93B4F8] sm:w-auto sm:max-w-none sm:px-8 sm:text-[15px]"
            >
              Enter DEFEX workspace
            </a>
            <div className="mt-6">
              <SignOutButton className="min-h-11 text-[13px] font-medium text-white/60 underline decoration-concrete underline-offset-4 transition-colors duration-200 hover:text-white" />
            </div>
          </>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 flex justify-center px-4 py-[18px] sm:px-6 sm:py-6">
        <p className="text-center text-[10.5px] leading-relaxed text-white/50 sm:text-[12.5px] sm:tracking-[0.02em]">
          <span className="sm:hidden">
            © DEFEX Engineering Pty Ltd 2026 · ABN 31 700 169 580
            <br />
            PO Box 148, Gymea NSW 2227 · andrew@defex.engineering
          </span>
          <span className="hidden sm:inline">
            © DEFEX Engineering Pty Ltd 2026 · ABN 31 700 169 580 · PO Box 148, Gymea NSW 2227 ·
            andrew@defex.engineering
          </span>
        </p>
      </div>
    </div>
  );
}
