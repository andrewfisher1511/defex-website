import { Award, ShieldCheck, PencilRuler } from "lucide-react";
import { Reveal } from "./Reveal";

const CREDENTIAL_CHIPS = [
  { Icon: Award, label: "BEng(Civil), MIEAust" },
  { Icon: ShieldCheck, label: "NSW Registered Professional Engineer" },
  { Icon: PencilRuler, label: "NSW Registered Design Practitioner" },
];

export function PracticeSection() {
  return (
    <section id="practice" className="bg-white px-6 py-24 min-[1100px]:px-8 min-[1100px]:py-[120px]">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-start gap-16 min-[1100px]:grid-cols-[minmax(0,1fr)_400px] min-[1100px]:gap-24">
        <div>
          <Reveal className="mb-10 flex items-center gap-4">
            <span className="block h-0.5 w-12 bg-blue-electric" />
            <span className="whitespace-nowrap text-[13px] font-semibold tracking-[0.32em] text-steel">
              THE PRACTICE
            </span>
          </Reveal>
          <Reveal as="p" delay={80} className="mb-8 max-w-[62ch] text-2xl font-light leading-[1.55] text-navy-ink">
            DEFEX Engineering is a Sydney remedial consulting practice led by Andrew Fisher — BEng(Civil),
            MIEAust, a NSW Registered Professional Engineer and NSW Registered Design Practitioner.
          </Reveal>
          <Reveal as="p" delay={160} className="mb-7 max-w-[65ch] text-lg leading-[1.75] text-ink-body">
            The practice is built on a simple structural choice:{" "}
            <strong className="font-semibold text-navy-ink">
              the engineer who inspects the building is the engineer who writes the report
            </strong>
            , prepares the design and superintends the works. Nothing is handed down a chain, and
            accountability never blurs.
          </Reveal>
          <Reveal as="p" delay={240} className="max-w-[65ch] text-lg leading-[1.75] text-ink-body">
            That model is made viable by DEFEX, the in-house platform that carries every engagement from
            site capture to issued document — so a small practice can deliver documentation with the speed
            and consistency of a much larger one, without diluting who stands behind it.
          </Reveal>
        </div>
        <Reveal as="aside" delay={200} className="flex flex-col gap-4 min-[1100px]:sticky min-[1100px]:top-[104px]">
          <div className="rounded-tile bg-navy-ink px-8 py-9">
            <span className="mb-6 block h-0.5 w-10 bg-blue-electric" />
            <p className="text-[26px] font-light leading-[1.4] text-white">
              The engineer you meet is the engineer who signs.
            </p>
          </div>
          {CREDENTIAL_CHIPS.map(({ Icon, label }) => (
            <div
              key={label}
              className="flex min-h-11 items-center gap-3.5 rounded-card border border-blueprint-border bg-blueprint px-5 py-4"
            >
              <Icon className="h-5 w-5 shrink-0 text-blue-electric" strokeWidth={2} />
              <span className="text-sm font-semibold text-navy-ink">{label}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
