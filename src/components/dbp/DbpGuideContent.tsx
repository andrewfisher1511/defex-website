const REGULATED_CATEGORIES = [
  { title: "Structure", body: "Slabs, columns, walls, footings, roofs" },
  { title: "Waterproofing", body: "Balconies, bathrooms, planter boxes, facades" },
  { title: "Fire safety", body: "Sprinklers, alarms, fire-rated construction" },
  { title: "Safety & egress", body: "Balustrades, stairs, exits, doors" },
  { title: "Building services", body: "Mechanical, plumbing, electrical systems" },
];

const FOUR_RULES = [
  {
    n: "01",
    title: "No ticket, no tools.",
    body: "Everyone designing or building on your block must be registered. Check them on the NSW register before they touch a thing.",
  },
  {
    n: "02",
    title: "Designs before diggers.",
    body: "Regulated designs must be declared and lodged before work starts, not after.",
  },
  {
    n: "03",
    title: "Small jobs aren’t always small.",
    body: "Structure, waterproofing, balustrades and fire safety are never minor, repairs included.",
  },
  {
    n: "04",
    title: "Do it right, do it once.",
    body: "Bundle your works, engage registered practitioners, and ask before acting. One conversation beats an unwound contract.",
  },
];

/** The plain-English guide itself — revealed once <DbpGuideGate/> opens. Copy verbatim. */
export function DbpGuideContent() {
  return (
    <div className="flex flex-col gap-11">
      <div className="flex flex-col gap-3.5">
        <h2 className="m-0 text-[28px] font-light tracking-[-0.02em] text-navy-ink min-[900px]:text-[32px]">
          What is the DBP Act?
        </h2>
        <p className="m-0 text-base leading-[1.75]">
          After some very public building failures in NSW, the government decided apartment buildings deserved
          the same rigour as bridges: the people who design and build them must be{" "}
          <strong className="text-navy-ink">registered, accountable, and on the record</strong>. The Design
          and Building Practitioners Act 2020 does exactly that. Anyone designing or building certain work on
          your building must be registered with NSW Fair Trading, and must formally declare their work
          complies with the National Construction Code — before the work starts.
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        <h2 className="m-0 text-[28px] font-light tracking-[-0.02em] text-navy-ink min-[900px]:text-[32px]">
          Does it apply to my building?
        </h2>
        <p className="m-0 text-base leading-[1.75]">
          Almost certainly, if you’re reading this. The Act covers <strong className="text-navy-ink">class 2 buildings</strong> —
          the technical name for apartment buildings where people live above, below or beside each other.
          Townhouses over a shared carpark count too. The simple test:{" "}
          <strong className="text-navy-ink">if your property is a strata plan, assume the Act applies.</strong>
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        <h2 className="m-0 text-[28px] font-light tracking-[-0.02em] text-navy-ink min-[900px]:text-[32px]">
          What’s a &quot;regulated design&quot;?
        </h2>
        <p className="m-0 text-base leading-[1.75]">
          Think of it as the formal recipe for the repair: proper drawings and specifications, prepared by a
          registered design practitioner, declared to comply with the building code, and lodged on the NSW
          Planning Portal <strong className="text-navy-ink">before construction begins</strong>. Your building
          needs one whenever work touches the serious stuff:
        </p>
        <div className="mt-1 grid grid-cols-1 gap-3 min-[560px]:grid-cols-2 min-[900px]:grid-cols-3">
          {REGULATED_CATEGORIES.map((cat) => (
            <div key={cat.title} className="rounded-card border border-hairline bg-white px-[18px] py-4">
              <p className="m-0 mb-1 text-sm font-semibold text-navy-ink">{cat.title}</p>
              <p className="m-0 text-[13.5px] leading-[1.55] text-steel">{cat.body}</p>
            </div>
          ))}
        </div>
        <p className="m-0 text-base leading-[1.75]">
          And here’s the part that surprises committees: <strong className="text-navy-ink">repairs count.</strong> Replacing
          a failed balcony membrane, fixing spalling concrete, upgrading a balustrade — these can all trigger
          the Act, and small repairs can even trigger upgrades of old building elements to today’s standards.
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        <h2 className="m-0 text-[28px] font-light tracking-[-0.02em] text-navy-ink min-[900px]:text-[32px]">
          What doesn’t need one?
        </h2>
        <p className="m-0 text-base leading-[1.75]">
          Genuinely minor, cosmetic work — repainting, patching render, re-pointing mortar, small concrete
          repairs to balcony edges — generally doesn’t trigger the Act, provided it isn’t structural, doesn’t
          involve waterproofing, and doesn’t touch something already non-compliant. The catch is that
          &quot;minor&quot; is narrower than most people think, and the same job can be exempt on one building
          and regulated on the next. When in doubt, ask before you sign anything.
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        <h2 className="m-0 text-[28px] font-light tracking-[-0.02em] text-navy-ink min-[900px]:text-[32px]">
          What about emergencies?
        </h2>
        <p className="m-0 text-base leading-[1.75]">
          There is an emergency exemption, but it’s deliberately narrow: the problem must need{" "}
          <strong className="text-navy-ink">immediate action</strong>, be causing (or about to cause){" "}
          <strong className="text-navy-ink">serious damage</strong>, and the works must be limited to{" "}
          <strong className="text-navy-ink">stopping the bleeding</strong> — stabilise now, do the proper
          repair under a regulated design later. Even genuine emergency work carries paperwork obligations.
          Get advice the same day, not after the builder’s invoice.
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        <h2 className="m-0 text-[28px] font-light tracking-[-0.02em] text-navy-ink min-[900px]:text-[32px]">
          Planning approval — the other gate
        </h2>
        <p className="m-0 text-base leading-[1.75]">
          Separate from the DBP Act, works may also need planning approval. Three lanes:{" "}
          <strong className="text-navy-ink">exempt</strong> (minor cosmetic work — no approval), a{" "}
          <strong className="text-navy-ink">Complying Development Certificate</strong> (small structural works
          that don’t change the building’s exterior — issued by a certifier), or a full{" "}
          <strong className="text-navy-ink">Development Application</strong> to Council (bigger works,
          exterior changes, heritage sites). Many repair projects need both a planning approval{" "}
          <em>and</em> regulated designs — which is exactly why sequencing matters.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-tile bg-navy-ink px-8 py-9 min-[900px]:px-10">
        <p className="m-0 text-[13px] font-semibold tracking-[0.24em] text-blue-electric">DEFEX RECOMMENDS</p>
        <h2 className="m-0 text-[26px] font-light tracking-[-0.01em] text-white min-[900px]:text-[28px]">
          Fix once. Fix together.
        </h2>
        <p className="m-0 text-base leading-[1.75] text-white/80">
          Since the Act, one-off repairs carry real overhead — approvals, declarations, consultants, scaffold.
          If your balconies have spalling, tired membranes <em>and</em> old balustrades, rectifying them in
          one coordinated project costs meaningfully less than three separate jobs, and residents get
          disrupted once instead of three times. Assess everything coming in the next few years, then bundle.
        </p>
      </div>

      <div className="flex flex-col gap-[18px]">
        <h2 className="m-0 text-[28px] font-light tracking-[-0.02em] text-navy-ink min-[900px]:text-[32px]">
          Four rules to remember
        </h2>
        <div className="grid grid-cols-1 gap-3.5 min-[560px]:grid-cols-2">
          {FOUR_RULES.map((rule) => (
            <div key={rule.n} className="rounded-card border border-hairline bg-white p-[22px]">
              <p className="m-0 mb-2 text-2xl font-light text-blue-electric">{rule.n}</p>
              <p className="m-0 mb-1.5 text-[15px] font-semibold text-navy-ink">{rule.title}</p>
              <p className="m-0 text-sm leading-[1.6] text-steel">{rule.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
