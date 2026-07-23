import type { Metadata } from "next";
import { LegalPageShell, LegalSection } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Privacy Policy — DEFEX Engineering",
};

export default function PrivacyPage() {
  return (
    <LegalPageShell
      eyebrow="LEGAL"
      title="Privacy Policy"
      lastUpdated="Last updated 23 July 2026 · DEFEX Engineering Pty Ltd · ABN 31 700 169 580"
      crossLink={{ label: "Terms", href: "/terms" }}
    >
      <LegalSection heading="1. Who we are">
        DEFEX Engineering Pty Ltd (ABN 31 700 169 580) is a Sydney-based
        remedial engineering consultancy. This policy explains how we
        collect, hold, use and disclose personal information in accordance
        with the Privacy Act 1988 (Cth) and the Australian Privacy
        Principles (APPs).
      </LegalSection>

      <LegalSection heading="2. What we collect">
        We collect personal information you provide directly — your name,
        email address, phone number, company and project details when you
        contact us, request a fee proposal, or correspond with us. If you
        sign in to the DEFEX workspace or private preview, we collect your
        sign-in identity (see section 3). We also collect limited technical
        data (browser type, pages visited) through standard analytics to
        understand how the site is used.
      </LegalSection>

      <LegalSection heading="3. Sign-in with Google and account data">
        When you sign in using Google, we receive your name, email address
        and profile picture from your Google account. We use this only to
        authenticate you, create and manage your account, and control access
        to the workspace. We do not receive your Google password, we do not
        access other Google services or data, and we do not sell or share
        Google user data with third parties. Use of information received
        from Google APIs complies with the Google API Services User Data
        Policy, including its Limited Use requirements.
      </LegalSection>

      <LegalSection heading="4. How we use your information">
        We use personal information to respond to enquiries, prepare fee
        proposals, deliver engineering services, operate and secure the
        workspace, meet legal and professional obligations, and improve the
        website. We do not use your information for direct marketing without
        your consent, and we never sell personal information.
      </LegalSection>

      <LegalSection heading="5. Storage and security">
        Information is stored on secure cloud infrastructure with access
        controls, encryption in transit, and authentication on all workspace
        access. Some providers may store data outside Australia; where they
        do, we take reasonable steps to ensure equivalent protection. We
        retain information only as long as needed for the purposes above or
        as required by law and our professional record-keeping obligations.
      </LegalSection>

      <LegalSection heading="6. Disclosure">
        We disclose personal information only to service providers that
        help us run the business (hosting, email, document management), to
        professional advisers, or where required by law. Service providers
        are bound to use information only to provide services to us.
      </LegalSection>

      <LegalSection heading="7. Cookies">
        The site uses essential cookies for sign-in sessions and basic
        analytics cookies to measure site usage. You can block cookies in
        your browser; sign-in will not function without essential cookies.
      </LegalSection>

      <LegalSection heading="8. Access, correction and complaints">
        You may request access to or correction of your personal
        information, or make a privacy complaint, by emailing{" "}
        <a href="mailto:andrew@defex.engineering">andrew@defex.engineering</a>.
        We will respond within a reasonable period. If you are not satisfied
        with our response, you may contact the Office of the Australian
        Information Commissioner (oaic.gov.au).
      </LegalSection>

      <LegalSection heading="9. Contact">
        Privacy Officer, DEFEX Engineering Pty Ltd · PO Box 148, Gymea NSW
        2227 ·{" "}
        <a href="mailto:andrew@defex.engineering">andrew@defex.engineering</a>
      </LegalSection>
    </LegalPageShell>
  );
}
