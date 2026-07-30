import type { Metadata } from "next";
import { requireAdmitted } from "@/lib/auth/dal";
import { ScrollProgressBar } from "@/components/site/ScrollProgressBar";
import { SiteNav } from "@/components/site/SiteNav";
import { Hero } from "@/components/site/Hero";
import { PracticeSection } from "@/components/site/PracticeSection";
import { ProcessSection } from "@/components/site/ProcessSection";
import { CtaSection } from "@/components/site/CtaSection";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "DEFEX Engineering — Defects Resolved.",
};

/**
 * The rev3 main site (DEFEX Website rev3.dc.html).
 *
 * Served under `/` — the proxy rewrites there for an admitted viewer. A
 * direct request to `/site` is redirected back to `/` so the site has one
 * canonical URL and one guarded entry point. The guard below is the
 * independent page-level check, in case the proxy is ever bypassed.
 */
export default async function MainSitePage() {
  await requireAdmitted();

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
