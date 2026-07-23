"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";

export interface MobileNavLink {
  href: string;
  label: string;
  active?: boolean;
}

interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
  links: MobileNavLink[];
  triggerRef: RefObject<HTMLButtonElement | null>;
}

/**
 * Full-screen drawer under the 64px mobile bar — mobile-nav-spec.md.
 * Fade + slide-down 12px, 0.25s cubic-bezier(0.16,1,0.3,1); links
 * stagger in 30ms apart; all motion skipped under prefers-reduced-motion.
 */
export function MobileNavDrawer({ open, onClose, links, triggerRef }: MobileNavDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;

    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !drawerRef.current) return;

      const focusable = drawerRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [open, onClose, triggerRef]);

  return (
    <div
      ref={drawerRef}
      id="mobile-nav-drawer"
      aria-hidden={!open}
      className={`fixed inset-x-0 top-16 bottom-0 z-[190] flex flex-col bg-white transition-[opacity,transform] duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
        open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"
      }`}
    >
      <nav className="flex flex-1 flex-col overflow-y-auto px-6 pt-2" aria-label="Mobile">
        {links.map((link, i) => (
          <a
            key={link.label}
            ref={i === 0 ? firstLinkRef : undefined}
            href={link.href}
            onClick={onClose}
            aria-current={link.active ? "page" : undefined}
            tabIndex={open ? 0 : -1}
            style={{ transitionDelay: open ? `${i * 30}ms` : "0ms" }}
            className={`flex min-h-14 items-center border-b border-row-line px-2 text-lg transition-[opacity,transform] duration-200 motion-reduce:transition-none ${
              open ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
            } ${
              link.active
                ? "border-l-[3px] border-l-blue-electric bg-blueprint pl-[5px] font-semibold text-navy-ink"
                : "font-medium text-navy-ink"
            }`}
          >
            {link.label}
          </a>
        ))}
        <a
          href="#contact"
          onClick={onClose}
          tabIndex={open ? 0 : -1}
          className="mt-6 flex min-h-12 items-center justify-center rounded-control bg-blue-electric text-base font-semibold text-white transition-colors duration-200 hover:bg-blue-electric-hover"
        >
          Contact
        </a>
      </nav>
      <div className="flex flex-col gap-2 px-6 pb-8 pt-6 text-sm text-steel">
        <a href="tel:+61432261722" tabIndex={open ? 0 : -1} className="tabular-nums">
          0432 261 722
        </a>
        <a href="mailto:andrew@defex.engineering" tabIndex={open ? 0 : -1}>
          andrew@defex.engineering
        </a>
      </div>
    </div>
  );
}
