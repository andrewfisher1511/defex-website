"use client";

import { useEffect, useRef } from "react";

export function ScrollProgressBar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const y = window.scrollY || 0;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (ref.current) {
        ref.current.style.width = `${(Math.min(1, y / max) * 100).toFixed(2)}%`;
      }
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
    <div
      ref={ref}
      className="fixed left-0 top-0 z-[300] h-[3px] bg-blue-electric"
      style={{ width: "0%" }}
    />
  );
}
