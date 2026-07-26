"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { siteUrl } from "@/lib/supabase/env";

interface PrivatePreviewSignInButtonProps {
  label?: string;
  /** Where to land after the callback. Same-origin path only. */
  next?: string;
  fullWidthOnMobile?: boolean;
}

/**
 * Google sign-in (Launch Pack A5):
 *   supabase.auth.signInWithOAuth({ provider: 'google',
 *                                   options: { redirectTo: siteUrl } })
 *
 * redirectTo points at our own /auth/callback, which exchanges the code for
 * a session. The origin must be listed under Supabase -> Authentication ->
 * URL Configuration (Part A2.2) or Supabase refuses the redirect.
 */
export function PrivatePreviewSignInButton({
  label = "Enter DEFEX workspace",
  next = "/",
  fullWidthOnMobile = true,
}: PrivatePreviewSignInButtonProps) {
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleSignIn = async () => {
    setPending(true);
    setFailed(false);
    try {
      const supabase = createClient();
      const redirectTo = new URL("/auth/callback", siteUrl(window.location.origin));
      redirectTo.searchParams.set("next", next);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirectTo.toString() },
      });

      if (error) {
        console.error("[gate] signInWithOAuth failed:", error.message);
        setFailed(true);
        setPending(false);
      }
      // On success the browser is navigating to Google; leave `pending` set.
    } catch (error) {
      console.error("[gate] signInWithOAuth threw:", error);
      setFailed(true);
      setPending(false);
    }
  };

  return (
    <div className={fullWidthOnMobile ? "flex w-full flex-col items-center" : "flex flex-col items-center"}>
      <button
        type="button"
        onClick={handleSignIn}
        disabled={pending}
        className={`min-h-[52px] ${
          fullWidthOnMobile ? "w-full max-w-[320px] sm:w-auto sm:max-w-none" : ""
        } px-6 sm:px-8 bg-blue-electric text-white font-sans text-base sm:text-[15px] font-semibold rounded-control border-none cursor-pointer transition-all duration-200 ease-in-out hover:bg-blue-electric-hover hover:-translate-y-px active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#93B4F8] disabled:cursor-wait disabled:opacity-80 disabled:hover:translate-y-0`}
      >
        {pending ? "Redirecting to Google…" : label}
      </button>
      {failed && (
        <p className="mt-3 max-w-[320px] text-[13px] leading-relaxed text-white/72">
          Sign-in could not start. Please try again, or email andrew@defex.engineering.
        </p>
      )}
    </div>
  );
}
