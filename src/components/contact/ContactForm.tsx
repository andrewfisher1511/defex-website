"use client";

import { useState } from "react";
import type { FormEvent } from "react";

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

/**
 * Minimal contact form wired to Launch Pack D1.3/D1.4's email pair via
 * /api/contact. Not the full form-endpoint-spec.md design (Turnstile, file
 * uploads, AI subject line, magic links into DEFEX Command) — that spec is
 * explicit next-phase work for a page this handoff doesn't include a
 * design for. This is the honest minimum: a real lead is recorded and both
 * emails go out.
 */
export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setServerError(null);
    setFieldErrors({});

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, topic, message }),
      });

      const body = (await res.json().catch(() => null)) as
        | { ok: boolean; fieldErrors?: FieldErrors; error?: string }
        | null;

      if (res.status === 422 && body?.fieldErrors) {
        setFieldErrors(body.fieldErrors);
        return;
      }

      if (!res.ok || !body?.ok) {
        setServerError(
          body?.error ?? "Something went wrong sending the enquiry — call or email directly."
        );
        return;
      }

      setSubmitted(true);
    } catch (err) {
      console.error("[ContactForm] submission failed:", err);
      setServerError("Something went wrong sending the enquiry — call or email directly.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-tile border border-hairline bg-canvas px-6 py-10 min-[900px]:px-11">
        <h2 className="m-0 mb-2 text-2xl font-light tracking-[-0.02em] text-navy-ink">
          Thanks — that&apos;s with Andrew now.
        </h2>
        <p className="m-0 text-[15px] leading-relaxed text-steel">
          He reads every enquiry personally and replies within one business day. For anything
          urgent, call{" "}
          <a href="tel:+61432261722" className="text-blue-electric">
            0432 261 722
          </a>{" "}
          directly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-tile border border-hairline bg-white px-6 py-8 min-[900px]:px-9"
      noValidate
    >
      <div className="flex flex-wrap gap-4">
        <label className="flex min-w-[220px] flex-1 flex-col gap-1.5">
          <span className="text-sm font-medium text-navy-ink">Your name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            className="min-h-[50px] rounded-control border border-concrete bg-canvas px-4 font-sans text-base text-navy-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-electric focus-visible:outline-offset-1"
          />
          {fieldErrors.name && <span className="text-[13px] text-error-deep">{fieldErrors.name}</span>}
        </label>

        <label className="flex min-w-[220px] flex-1 flex-col gap-1.5">
          <span className="text-sm font-medium text-navy-ink">Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="min-h-[50px] rounded-control border border-concrete bg-canvas px-4 font-sans text-base text-navy-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-electric focus-visible:outline-offset-1"
          />
          {fieldErrors.email && <span className="text-[13px] text-error-deep">{fieldErrors.email}</span>}
        </label>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex min-w-[220px] flex-1 flex-col gap-1.5">
          <span className="text-sm font-medium text-navy-ink">Phone (optional)</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            className="min-h-[50px] rounded-control border border-concrete bg-canvas px-4 font-sans text-base text-navy-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-electric focus-visible:outline-offset-1"
          />
        </label>

        <label className="flex min-w-[220px] flex-1 flex-col gap-1.5">
          <span className="text-sm font-medium text-navy-ink">What&apos;s this about? (optional)</span>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            type="text"
            placeholder="e.g. Balcony waterproofing"
            className="min-h-[50px] rounded-control border border-concrete bg-canvas px-4 font-sans text-base text-navy-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-electric focus-visible:outline-offset-1"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-navy-ink">Tell us what&apos;s going on</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          className="rounded-control border border-concrete bg-canvas px-4 py-3 font-sans text-base leading-relaxed text-navy-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-electric focus-visible:outline-offset-1"
        />
        {fieldErrors.message && <span className="text-[13px] text-error-deep">{fieldErrors.message}</span>}
      </label>

      {serverError && <p className="m-0 text-[13.5px] text-error-deep">{serverError}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="min-h-[52px] self-start rounded-control bg-blue-electric px-8 font-sans text-[15px] font-semibold text-white transition-all duration-200 hover:bg-blue-electric-hover active:scale-[0.97] disabled:cursor-wait disabled:opacity-80"
      >
        {submitting ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
