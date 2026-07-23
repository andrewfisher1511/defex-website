"use client";

import Image from "next/image";
import { PrivatePreviewSignInButton } from "./PrivatePreviewSignInButton";

export type GateAuthState =
  | { status: "signed-out" }
  | { status: "signed-in-not-admitted"; email: string }
  | { status: "signed-in-admitted"; email: string };

interface ComingSoonGateProps {
  authState?: GateAuthState;
  onSignIn?: () => void;
  onSignOut?: () => void;
  onEnterWorkspace?: () => void;
}

/**
 * Full-screen private-preview gate — design_files/Defex-website-preview.dc.html,
 * option 1a (photographic). Auth is stubbed until Phase 5 wires
 * @supabase/ssr — see onSignIn/onSignOut/onEnterWorkspace.
 */
export function ComingSoonGate({
  authState = { status: "signed-out" },
  onSignIn,
  onSignOut,
  onEnterWorkspace,
}: ComingSoonGateProps) {
  const eyebrow = "PRIVATE PREVIEW";

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
              DEFEX is currently in private preview.
            </h1>
            <p className="mb-8 max-w-[480px] text-[15px] leading-relaxed text-white/72 sm:mb-10 sm:text-base">
              If you have been invited, you can sign in below.
            </p>
            <PrivatePreviewSignInButton label="Sign in to private preview" onClick={onSignIn} />
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
              This preview is invite-only.
            </h1>
            <p className="mb-2 text-[15px] leading-relaxed text-white/72 sm:text-base">
              Signed in as {authState.email}
            </p>
            <button
              type="button"
              onClick={onSignOut ?? (() => console.log("[ComingSoonGate] sign-out clicked (stub)"))}
              className="mt-6 min-h-11 text-[14px] font-medium text-white/72 underline decoration-concrete underline-offset-4 transition-colors duration-200 hover:text-white sm:mt-8"
            >
              Sign out
            </button>
          </>
        )}

        {authState.status === "signed-in-admitted" && (
          <>
            <p className="mb-2 text-[15px] text-white/78">Welcome back.</p>
            <p className="mb-8 text-[15px] leading-relaxed text-white/72 sm:mb-10">
              Signed in as {authState.email}
            </p>
            <PrivatePreviewSignInButton label="Enter DEFEX workspace" onClick={onEnterWorkspace} />
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
