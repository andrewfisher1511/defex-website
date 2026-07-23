"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentPropsWithRef, ElementType, Ref } from "react";
import { EASE_ENTRANCE, prefersReducedMotion } from "@/lib/motion";

type RevealProps<T extends ElementType> = {
  as?: T;
  delay?: number;
} & Omit<ComponentPropsWithRef<T>, "as">;

/**
 * Scroll-triggered fade/slide-up — mirrors the design file's [data-reveal]
 * IntersectionObserver behaviour. Fires once, threshold 0.15,
 * rootMargin "0px 0px -40px 0px"; skipped entirely under
 * prefers-reduced-motion (content is simply visible, no hidden flash).
 */
export function Reveal<T extends ElementType = "div">({
  as,
  delay = 0,
  style,
  ...rest
}: RevealProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(() => prefersReducedMotion());

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as Ref<never>}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s ${EASE_ENTRANCE} ${delay}ms, transform 0.7s ${EASE_ENTRANCE} ${delay}ms`,
      }}
      {...rest}
    />
  );
}
