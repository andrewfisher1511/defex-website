import type { Metadata } from "next";
import { ScrollProgressBar } from "@/components/site/ScrollProgressBar";
import { SiteNav } from "@/components/site/SiteNav";
import { Hero } from "@/components/site/Hero";
import { PracticeSection } from "@/components/site/PracticeSection";
import { ProcessSection } from "@/components/site/ProcessSection";
import { CtaSection } from "@/components/site/CtaSection";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "DEFEX Engineering — A deliberately small practice",
};

/**
 * Temporary route for the rev3 main site (DEFEX Website rev3.dc.html).
 * Phase 5 middleware will decide gate vs. main site at "/" based on
 * session + role; this page moves there once that's wired.
 */
export default function MainSitePage() {
  return (
    <>
      <ScrollProgressBar />
      <SiteNav />
      <Hero />
      <PracticeSection />
      <ProcessSection />
      <CtaSection />
      <SiteFooter />
    </>
  );
}
