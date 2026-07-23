"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { Reveal } from "./Reveal";

const STEPS = [
  { number: "01", title: "Contact", body: "Describe the building and the symptoms." },
  { number: "02", title: "Proposal", body: "A written scope and fee, in plain terms." },
  { number: "03", title: "Investigation and reporting", body: "Photo-evidenced, standards-keyed." },
  { number: "04", title: "Design and delivery", body: "Where rectification proceeds, through to completion." },
];

/**
 * "How engagements run" — the connecting rule's fill height tracks scroll
 * position against a focal point 72% down the viewport, same formula as
 * the design file's lineRef logic.
 */
export function ProcessSection() {
  const listRef = useRef<HTMLOListElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      if (lineRef.current) lineRef.current.style.height = "100%";
      return;
    }

    const update = () => {
      if (!lineRef.current || !listRef.current) return;
      const rect = listRef.current.getBoundingClientRect();
      const focal = window.innerHeight * 0.72;
      const p = Math.max(0, Math.min(1, (focal - rect.top) / rect.height));
      lineRef.current.style.height = `${(p * 100).toFixed(1)}%`;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section
      id="process"
      className="border-t border-hairline bg-canvas px-6 py-24 min-[1100px]:px-8 min-[1100px]:py-[120px]"
    >
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="mb-5 flex items-center gap-4">
          <span className="block h-0.5 w-12 bg-blue-electric" />
          <span className="whitespace-nowrap text-[13px] font-semibold tracking-[0.32em] text-steel">
            PROCESS
          </span>
        </Reveal>
        <Reveal as="h2" delay={80} className="mb-16 text-[37px] font-semibold tracking-[-0.02em] text-navy-ink">
          How engagements run
        </Reveal>
        <ol ref={listRef} className="relative m-0 list-none pl-16">
          <span className="absolute left-6 top-2 bottom-2 w-0.5 bg-hairline" />
          <span
            ref={lineRef}
            className="absolute left-6 top-2 max-h-[calc(100%-16px)] w-0.5 bg-blue-electric transition-[height] duration-150 ease-linear"
            style={{ height: "0%" }}
          />
          {STEPS.map((step, i) => (
            <Reveal
              as="li"
              key={step.number}
              delay={i * 80}
              className={`grid grid-cols-[140px_minmax(0,1fr)] items-baseline gap-10 py-11 ${
                i < STEPS.length - 1 ? "border-b border-hairline" : ""
              }`}
            >
              <span className="text-[64px] font-light leading-none tabular-nums text-blue-electric">
                {step.number}
              </span>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-navy-ink">{step.title}</h3>
                <p className="max-w-[60ch] text-[15px] leading-relaxed text-steel">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
