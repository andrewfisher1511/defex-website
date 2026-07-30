"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { DefexLockup } from "@/components/brand/DefexLockup";
import { MobileNavDrawer, type MobileNavLink } from "./MobileNavDrawer";

const NAV_LINKS: MobileNavLink[] = [
  { href: "#top", label: "Home" },
  { href: "#practice", label: "Services" },
  { href: "#practice", label: "Projects" },
  { href: "#process", label: "DEFEX App" },
  { href: "#top", label: "About", active: true },
];

/**
 * Sticky site nav — DEFEX Website rev3.dc.html for >=900px (84px, 68px
 * logo, border/shadow after 8px scroll, compressed link padding 900-1100px);
 * mobile-nav-spec.md below 900px (64px bar, hamburger -> full drawer).
 */
export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const update = () => {
      const on = (window.scrollY || 0) > 8;
      setScrolled((prev) => (prev === on ? prev : on));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollClass = scrolled ? "border-hairline shadow-[0_1px_8px_rgba(16,24,40,0.05)]" : "border-transparent";

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-[200] border-b bg-white/82 backdrop-blur-md transition-[border-color,box-shadow] duration-200 ${scrollClass}`}
      >
        {/* Desktop >=900px */}
        <div className="mx-auto hidden h-[84px] max-w-[1400px] items-center justify-between gap-8 px-8 min-[900px]:flex">
          <a href="#top" aria-label="DEFEX Engineering home" className="flex min-h-11 items-center">
            <DefexLockup size={30} tone="light" />
          </a>
          <div className="flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-current={link.active ? "page" : undefined}
                className={
                  link.active
                    ? "inline-flex min-h-11 items-center border-b-2 border-blue-electric px-2 text-sm font-semibold text-navy-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-electric focus-visible:outline-offset-2 min-[1100px]:px-3.5"
                    : "inline-flex min-h-11 items-center rounded-control border-b-2 border-transparent px-2 text-sm font-medium text-ink-muted transition-all duration-200 hover:bg-[#F2F4F7] hover:text-navy-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-electric focus-visible:outline-offset-2 min-[1100px]:px-3.5"
                }
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="ml-3.5 inline-flex min-h-11 items-center whitespace-nowrap rounded-control bg-blue-electric px-5 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-electric-hover active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-electric focus-visible:outline-offset-2"
            >
              Contact
            </a>
          </div>
        </div>

        {/* Mobile <900px */}
        <div className="flex h-16 items-center justify-between px-6 min-[900px]:hidden">
          <a href="#top" aria-label="DEFEX Engineering home" className="flex min-h-11 items-center">
            <DefexLockup size={18} tone="light" />
          </a>
          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={drawerOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            onClick={() => setDrawerOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center"
          >
            {drawerOpen ? (
              <X className="h-6 w-6 text-navy-ink" strokeWidth={2} />
            ) : (
              <Menu className="h-6 w-6 text-navy-ink" strokeWidth={2} />
            )}
          </button>
        </div>
      </nav>

      <div className="min-[900px]:hidden">
        <MobileNavDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          links={NAV_LINKS}
          triggerRef={menuButtonRef}
        />
      </div>
    </>
  );
}
