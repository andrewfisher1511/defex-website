import type { Metadata } from "next";
import { requireAdmitted } from "@/lib/auth/dal";
import { DbpNav } from "@/components/dbp/DbpNav";
import { DbpHero } from "@/components/dbp/DbpHero";
import { DbpGuideSection } from "@/components/dbp/DbpGuideSection";
import { DbpQuizSection } from "@/components/dbp/DbpQuizSection";
import { DbpDefectMapSection } from "@/components/dbp/DbpDefectMapSection";
import { DbpCta } from "@/components/dbp/DbpCta";
import { DbpFooter } from "@/components/dbp/DbpFooter";

export const metadata: Metadata = {
  title: "The DBP Act, explained — DEFEX Engineering",
  description:
    "A plain-English guide to the NSW Design and Building Practitioners Act 2020, an 8-question check for owners-corporation committees, and where class 2 buildings fail.",
};

export default async function DbpActPage() {
  // Same access as the main site pre-launch (README "Routes").
  await requireAdmitted();

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <DbpNav />
      <DbpHero />
      <DbpGuideSection />
      <DbpQuizSection />
      <DbpDefectMapSection />
      <DbpCta />
      <DbpFooter />
    </div>
  );
}
