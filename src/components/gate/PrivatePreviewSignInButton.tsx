"use client";

interface PrivatePreviewSignInButtonProps {
  label: string;
  onClick?: () => void;
  fullWidthOnMobile?: boolean;
}

/**
 * Stub for now — Phase 5 wires this to
 * supabase.auth.signInWithOAuth({ provider: 'google' }).
 */
export function PrivatePreviewSignInButton({
  label,
  onClick,
  fullWidthOnMobile = true,
}: PrivatePreviewSignInButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick ?? (() => console.log("[PrivatePreviewSignInButton] sign-in clicked (stub)"))}
      className={`min-h-[52px] ${fullWidthOnMobile ? "w-full max-w-[320px] sm:w-auto sm:max-w-none" : ""} px-6 sm:px-8 bg-blue-electric text-white font-sans text-base sm:text-[15px] font-semibold rounded-control border-none cursor-pointer transition-all duration-200 ease-in-out hover:bg-blue-electric-hover hover:-translate-y-px active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#93B4F8]`}
    >
      {label}
    </button>
  );
}
