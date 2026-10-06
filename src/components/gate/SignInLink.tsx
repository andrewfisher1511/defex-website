"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { siteUrl } from "@/lib/supabase/env";
import { SIGN_IN_ALLOWLIST } from "@/lib/auth/allowlist";

interface SignInLinkProps {
  /** Where to land after the callback. Same-origin path only. */
  next?: string;
}

/**
 * The owner's quiet way in from the landing page: a text link, not a button,
 * because the public cannot sign in (allowlist.ts) and a prominent call to
 * action would be a dead end for every visitor.
 *
 * Google sign-in (Launch Pack A5):
 *   supabase.auth.signInWithOAuth({ provider: 'google',
 *                                   options: { redirectTo: siteUrl } })
 *
 * redirectTo points at our own /auth/callback, which exchanges the code for
 * a session and refuses any account not on the allowlist. The origin must be
 * listed under Supabase -> Authentication -> URL Configuration (Part A2.2) or
 * Supabase refuses the redirect.
 *
 * `login_hint` pre-selects the one permitted account in Google's account
 * chooser. It is a convenience only, never the control: the callback is.
 */
export function SignInLink({ next = "/" }: SignInLinkProps) {
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
        options: {
          redirectTo: redirectTo.toString(),
          queryParams: { login_hint: SIGN_IN_ALLOWLIST[0] },
        },
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
    <div className="flex flex-col items-start md:items-end">
      <button
        type="button"
        onClick={handleSignIn}
        disabled={pending}
        className="inline-flex min-h-11 min-w-11 cursor-pointer items-center whitespace-nowrap rounded-control text-[13px] font-medium text-white/70 underline decoration-white/30 underline-offset-4 transition-colors duration-150 hover:text-white hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-electric disabled:cursor-wait"
      >
        {pending ? "Opening Google…" : "Sign in"}
      </button>
      {failed && (
        <p role="status" className="max-w-[280px] text-[13px] leading-relaxed text-white/80 md:text-right">
          Sign-in could not start. Please try again.
        </p>
      )}
    </div>
  );
}
