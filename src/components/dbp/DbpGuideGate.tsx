"use client";

import { useState } from "react";
import type { ReactNode } from "react";

interface DbpGuideGateProps {
  /** Server-flag equivalent of the design file's `gateGuide` prop (default true). */
  gated?: boolean;
  children: ReactNode;
}

/**
 * Name + email gate in front of the plain-English guide —
 * DEFEX DBP Hub.dc.html's "Guide" screen, gateLocked/gateOpen states.
 * Lead write is stubbed (console.log) until Phase 6 wires Resend/Supabase;
 * source matches README: 'dbp_guide'.
 */
export function DbpGuideGate({ gated = true, children }: DbpGuideGateProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);

  const locked = gated && !open;

  if (!locked) {
    return <>{children}</>;
  }

  const handleSubmit = () => {
    const valid = name.trim().length > 1 && email.includes("@");
    if (!valid) {
      setError(true);
      return;
    }
    console.log("[DbpGuideGate] lead stub:", { source: "dbp_guide", name, email });
    setError(false);
    setOpen(true);
  };

  return (
    <div className="flex flex-col gap-2 rounded-tile border border-hairline bg-white px-6 py-10 min-[900px]:px-11 min-[900px]:py-10">
      <p className="m-0 text-[13px] font-semibold tracking-[0.24em] text-blue-electric">
        THE PLAIN-ENGLISH GUIDE
      </p>
      <h2 className="m-0 mb-1 text-2xl font-light tracking-[-0.02em] text-navy-ink min-[900px]:text-[30px]">
        Tell us who you are, and read the full guide
      </h2>
      <p className="m-0 mb-4 text-[15px] leading-relaxed text-steel">
        Your details are used to send you the PDF copy and nothing else. No newsletter, no spam.
      </p>
      <div className="flex flex-wrap gap-2.5">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Your name"
          className="min-h-[50px] min-w-[180px] flex-1 rounded-control border border-concrete bg-canvas px-4 font-sans text-base text-navy-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-electric focus-visible:outline-offset-1"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="you@example.com"
          className="min-h-[50px] min-w-[220px] flex-1 rounded-control border border-concrete bg-canvas px-4 font-sans text-base text-navy-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-electric focus-visible:outline-offset-1"
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="min-h-[50px] rounded-control bg-blue-electric px-[26px] font-sans text-[15px] font-semibold text-white transition-all duration-200 hover:bg-blue-electric-hover active:scale-[0.97]"
        >
          Read the guide
        </button>
      </div>
      {error && (
        <p className="m-0 mt-2.5 text-[13.5px] text-error-deep">
          Please add your name and a valid email address.
        </p>
      )}
    </div>
  );
}
