/** CTA — DEFEX DBP Hub.dc.html's "CTA" screen. */
export function DbpCta() {
  return (
    <section className="bg-navy-ink px-6 py-14 min-[900px]:px-8 min-[900px]:py-[72px]">
      <div className="mx-auto flex max-w-[1100px] flex-col items-start justify-between gap-8 min-[900px]:flex-row min-[900px]:items-center min-[900px]:gap-8">
        <div>
          <h2 className="m-0 mb-2 text-[28px] font-light tracking-[-0.01em] text-white min-[900px]:text-[32px]">
            Not sure where your building stands?
          </h2>
          <p className="m-0 text-base text-white/72">
            One conversation with a registered practitioner beats six months of committee guesswork.
          </p>
        </div>
        <a
          href="/site#contact"
          className="inline-flex min-h-[52px] items-center whitespace-nowrap rounded-control bg-blue-electric px-8 text-[15px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-electric-hover hover:shadow-blue-lift active:scale-[0.97]"
        >
          Contact DEFEX
        </a>
      </div>
    </section>
  );
}
