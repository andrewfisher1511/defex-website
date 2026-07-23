import type { Metadata } from "next";
import { LegalPageShell, LegalSection } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Terms of Use — DEFEX Engineering",
};

export default function TermsPage() {
  return (
    <LegalPageShell
      eyebrow="LEGAL"
      title="Terms of Use"
      lastUpdated="Last updated 23 July 2026 · DEFEX Engineering Pty Ltd · ABN 31 700 169 580"
      crossLink={{ label: "Privacy", href: "/privacy" }}
    >
      <LegalSection heading="1. About these terms">
        This website is operated by DEFEX Engineering Pty Ltd (ABN 31 700 169
        580) (&quot;DEFEX&quot;, &quot;we&quot;, &quot;us&quot;). By accessing
        or using this website you agree to these Terms of Use. If you do not
        agree, do not use the site.
      </LegalSection>

      <LegalSection heading="2. General information only">
        Content on this website — including descriptions of defects,
        inspection methods, remediation approaches, compliance matters and
        any technical commentary — is provided as general information about
        our services. It is not engineering advice and must not be relied
        upon for any specific building, structure or project. Every
        structure is different; the condition of a building can only be
        assessed by inspection and investigation carried out under a written
        engagement.
      </LegalSection>

      <LegalSection heading="3. No engineer–client relationship">
        Using this website, contacting us, or signing in to any preview or
        client area does not create an engineer–client relationship.
        Professional services are provided only under a signed fee proposal
        or engagement agreement, which sets out the scope, limitations and
        terms that apply to that work.
      </LegalSection>

      <LegalSection heading="4. Intellectual property">
        All content on this website — text, reports, images, the DEFEX name,
        logo and branding — is owned by or licensed to DEFEX Engineering Pty
        Ltd and is protected by copyright and trade mark law. You may view
        and print pages for your own reference, but you must not reproduce,
        distribute or use any content for commercial purposes without our
        written consent.
      </LegalSection>

      <LegalSection heading="5. Project photography">
        Photographs of projects and buildings shown on this website are
        published with the consent of the relevant client under our
        engagement terms, or are otherwise used with permission. Images are
        illustrative of the type of work we perform and do not identify
        defects in any specific property for public comment.
      </LegalSection>

      <LegalSection heading="6. Third-party links">
        This site may link to third-party websites (for example, industry
        bodies or standards publishers). We do not control and are not
        responsible for their content.
      </LegalSection>

      <LegalSection heading="7. Liability">
        Nothing in these terms excludes rights you have under the Australian
        Consumer Law that cannot be excluded. Otherwise, to the maximum
        extent permitted by law, DEFEX is not liable for any loss arising
        from reliance on website content, from site unavailability, or from
        matters outside our reasonable control. Liability for professional
        services is governed solely by the applicable engagement agreement.
      </LegalSection>

      <LegalSection heading="8. Governing law">
        These terms are governed by the laws of New South Wales, Australia.
        Disputes are subject to the exclusive jurisdiction of the courts of
        New South Wales.
      </LegalSection>

      <LegalSection heading="9. Contact">
        Questions about these terms:{" "}
        <a href="mailto:andrew@defex.engineering">andrew@defex.engineering</a>{" "}
        · PO Box 148, Gymea NSW 2227.
      </LegalSection>
    </LegalPageShell>
  );
}
