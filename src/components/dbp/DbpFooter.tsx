import Link from "next/link";

/** Footer — DEFEX DBP Hub.dc.html's own (simpler) footer, distinct from SiteFooter. */
export function DbpFooter() {
  return (
    <footer className="border-t border-hairline bg-white px-6 py-7 min-[900px]:px-8">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-6">
        <p className="m-0 text-[13px] text-grey-400">
          © DEFEX Engineering Pty Ltd 2026. All rights reserved. · ABN 31 700 169 580
        </p>
        <p className="m-0 max-w-[560px] text-[12.5px] leading-[1.5] text-grey-400">
          General information only — not engineering or legal advice for any specific building.{" "}
          <Link href="/terms" className="text-grey-400 underline transition-colors hover:text-blue-electric">
            Terms
          </Link>{" "}
          ·{" "}
          <Link href="/privacy" className="text-grey-400 underline transition-colors hover:text-blue-electric">
            Privacy
          </Link>
        </p>
      </div>
    </footer>
  );
}
