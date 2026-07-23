/** Hero — DEFEX DBP Hub.dc.html's "Hero" screen: navy, blueprint grid. */
export function DbpHero() {
  return (
    <header className="relative overflow-hidden bg-navy-ink">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(37,99,235,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.08) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="relative mx-auto max-w-[1100px] px-6 py-16 min-[900px]:px-8 min-[900px]:py-24">
        <div className="mb-6 flex items-center gap-4">
          <span className="block h-0.5 w-12 bg-blue-electric" />
          <span className="text-[13px] font-semibold tracking-[0.32em] text-concrete">
            RESOURCES · NSW STRATA
          </span>
        </div>
        <h1 className="mb-6 max-w-[900px] text-[clamp(2.25rem,8vw,4rem)] font-light uppercase leading-[1.05] tracking-[-0.02em] text-white">
          The DBP Act,
          <br />
          explained.
        </h1>
        <p className="mb-9 max-w-[620px] text-lg leading-relaxed text-white/78">
          If you own a unit or sit on an owners-corporation committee, the Design and Building Practitioners
          Act 2020 changed what happens every time your building needs repairs. Here it is in plain English —
          from a registered practitioner, without the jargon.
        </p>
        <div className="flex flex-wrap gap-3.5">
          <a
            href="#quiz"
            className="inline-flex min-h-[52px] items-center rounded-control bg-blue-electric px-[30px] text-[15px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-electric-hover hover:shadow-blue-lift active:scale-[0.97]"
          >
            Take the 3-minute check
          </a>
          <a
            href="#guide"
            className="inline-flex min-h-[52px] items-center rounded-control border border-white/35 bg-transparent px-[30px] text-[15px] font-semibold text-white transition-all duration-200 hover:border-white hover:bg-white/8 active:scale-[0.97]"
          >
            Read the guide
          </a>
        </div>
      </div>
    </header>
  );
}
