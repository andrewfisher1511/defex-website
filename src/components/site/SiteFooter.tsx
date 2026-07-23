import Image from "next/image";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";

const SITE_LINKS = [
  { href: "#top", label: "Services" },
  { href: "#top", label: "Projects" },
  { href: "#top", label: "DEFEX App" },
  { href: "#top", label: "About" },
  { href: "#contact", label: "Contact" },
];

const CREDENTIAL_LINKS = [
  {
    href: "https://verify.licence.nsw.gov.au/details/Professional%20Engineer/53509",
    label: "NSW Professional Engineer",
  },
  {
    href: "https://verify.licence.nsw.gov.au/details/Design%20Practitioner/53511",
    label: "NSW Design Practitioner",
  },
];

/**
 * Main-site footer — DEFEX Website rev3.dc.html. Keeps the phone number
 * (unlike the gate footer). The Resume credential link is omitted per
 * README "Known open items" — it ships with the /andrew-fisher page.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-canvas px-6 pb-10 pt-16 min-[1100px]:px-8 min-[1100px]:pt-[72px]">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 gap-12 pb-12 min-[1100px]:grid-cols-[1.5fr_1fr_1.2fr] min-[1100px]:gap-16">
          <div className="flex flex-col items-start gap-4">
            <Image
              src="/assets/defex-lockup-horizontal-navy.png"
              alt="DEFEX Engineering"
              width={245}
              height={52}
              className="h-[52px] w-auto"
            />
            <p className="m-0 text-[15px] font-semibold text-navy-ink">Defects Resolved.</p>
            <p className="m-0 flex items-center gap-2.5 text-sm text-steel">
              <a href="tel:+61432261722" className="tabular-nums text-steel transition-colors hover:text-blue-electric">
                0432 261 722
              </a>
              <span>·</span>
              <a href="mailto:andrew@defex.engineering" className="text-steel transition-colors hover:text-blue-electric">
                andrew@defex.engineering
              </a>
            </p>
            <p className="m-0 text-sm text-steel">PO Box 148, Gymea NSW 2227 · ABN 31 700 169 580</p>
          </div>

          <div>
            <p className="m-0 mb-5 text-xs font-semibold tracking-[0.18em] text-grey-400">SITE</p>
            <div className="flex flex-col gap-3">
              {SITE_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-ink-muted transition-colors hover:text-blue-electric"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="m-0 mb-5 text-xs font-semibold tracking-[0.18em] text-grey-400">PRACTICE</p>
            <p className="m-0 text-sm leading-[1.7] text-steel">
              Remedial consulting engineers.
              <br />
              Sydney metro, occasionally Greater NSW.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-6 border-t border-hairline pt-6 min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:justify-between min-[1100px]:gap-8">
          <div className="flex flex-wrap items-center gap-[18px]">
            <p className="m-0 text-[13px] text-grey-400">Andrew Fisher — BEng(Civil), MIEAust, CPEng</p>
            {CREDENTIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener"
                title="Verify on the NSW Government register"
                className="inline-flex min-h-11 items-center gap-[5px] whitespace-nowrap text-[13px] text-grey-400 underline decoration-concrete underline-offset-[3px] transition-colors duration-200 hover:text-blue-electric hover:decoration-blue-electric"
              >
                <BadgeCheck className="h-[13px] w-[13px] text-blue-electric" strokeWidth={2} />
                {link.label}
              </a>
            ))}
          </div>
          <p className="m-0 flex flex-wrap items-center gap-4 whitespace-nowrap text-[13px] text-grey-400">
            <span>© DEFEX Engineering Pty Ltd 2026. All rights reserved.</span>
            <Link href="/privacy" className="text-grey-400 transition-colors hover:text-blue-electric">
              Privacy
            </Link>
            <Link href="/terms" className="text-grey-400 transition-colors hover:text-blue-electric">
              Terms
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
