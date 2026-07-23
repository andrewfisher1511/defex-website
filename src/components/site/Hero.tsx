"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { EASE_ENTRANCE, prefersReducedMotion } from "@/lib/motion";

/**
 * Hero — DEFEX Website rev3.dc.html, "Hero" screen. Parallax translate on
 * the image wrap (up to 90px over one hero-height of scroll), staggered
 * entrance on the eyebrow/H1/sub (750ms, 140ms apart) and a slow 6s image
 * scale-in on mount. mobile-nav-spec.md: hero shrinks to ~560px below
 * 1100px, H1 via clamp, SCROLL cue hidden. All motion skipped under
 * prefers-reduced-motion.
 */
export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const seqRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const reduced = prefersReducedMotion();

    const applyParallax = () => {
      if (reduced || !heroRef.current || !wrapRef.current) return;
      const h = heroRef.current.offsetHeight || 1;
      const y = window.scrollY || 0;
      const p = Math.min(1, y / h);
      wrapRef.current.style.transform = `translateY(${(p * 90).toFixed(1)}px)`;
    };

    applyParallax();
    window.addEventListener("scroll", applyParallax, { passive: true });
    window.addEventListener("resize", applyParallax, { passive: true });

    if (!reduced) {
      seqRefs.current.forEach((el, i) => {
        if (!el) return;
        el.animate(
          [
            { opacity: 0, transform: "translateY(28px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          { duration: 750, delay: 150 + i * 140, easing: EASE_ENTRANCE, fill: "both" }
        );
      });
      if (imgRef.current) {
        imgRef.current.animate([{ transform: "scale(1.06)" }, { transform: "scale(1)" }], {
          duration: 6000,
          easing: EASE_ENTRANCE,
          fill: "both",
        });
      }
    }

    return () => {
      window.removeEventListener("scroll", applyParallax);
      window.removeEventListener("resize", applyParallax);
    };
  }, []);

  return (
    <header
      id="top"
      ref={heroRef}
      className="relative h-[560px] overflow-hidden bg-navy-ink min-[1100px]:h-[760px]"
    >
      <div ref={wrapRef} className="absolute inset-x-0 -top-[90px] -bottom-[90px] will-change-transform">
        <Image
          ref={imgRef}
          src="/assets/hero-architecture.jpg"
          alt="Architectural concrete facade"
          fill
          priority
          sizes="100vw"
          className="object-cover will-change-transform"
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(155deg, rgba(26,26,46,0.92) 0%, rgba(26,26,46,0.62) 48%, rgba(37,99,235,0.42) 100%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 pb-16 min-[1100px]:pb-24">
        <div className="mx-auto max-w-[1400px] px-6 min-[1100px]:px-8">
          <div
            ref={(el) => {
              seqRefs.current[0] = el;
            }}
            className="mb-5 flex items-center gap-4 min-[1100px]:mb-7"
          >
            <span className="block h-0.5 w-12 bg-blue-electric" />
            <span className="whitespace-nowrap text-[13px] font-semibold tracking-[0.32em] text-concrete">
              ABOUT
            </span>
          </div>
          <h1
            ref={(el) => {
              seqRefs.current[1] = el;
            }}
            className="mb-5 max-w-[1100px] text-[clamp(2.5rem,11vw,4.75rem)] font-light uppercase leading-[1.02] tracking-[-0.02em] text-white min-[1100px]:mb-7 min-[1100px]:text-[92px]"
          >
            A deliberately small practice.
          </h1>
          <p
            ref={(el) => {
              seqRefs.current[2] = el;
            }}
            className="max-w-[560px] text-lg leading-relaxed text-white/78"
          >
            Remedial consulting engineers. Sydney metro, occasionally Greater NSW.
          </p>
        </div>
      </div>
      <div className="absolute bottom-24 right-10 z-10 hidden min-[1100px]:flex flex-col items-center gap-3.5">
        <span
          className="text-[11px] font-semibold tracking-[0.3em] text-white/60"
          style={{ writingMode: "vertical-rl" }}
        >
          SCROLL
        </span>
        <span className="block h-14 w-px bg-white/35" />
      </div>
    </header>
  );
}
