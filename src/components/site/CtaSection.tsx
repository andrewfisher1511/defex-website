import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

export function CtaSection() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-navy-ink px-6 py-24 min-[1100px]:px-8 min-[1100px]:py-32"
    >
      <Image
        src="/assets/defex-mark-white.svg"
        alt=""
        aria-hidden="true"
        width={460}
        height={460}
        className="pointer-events-none absolute right-[-70px] top-1/2 hidden w-[460px] -translate-y-1/2 rotate-[8deg] opacity-5 min-[1100px]:block"
      />
      <div className="relative mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-10 min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:gap-16">
        <Reveal>
          <h2 className="mb-5 max-w-[720px] text-4xl font-light leading-[1.1] tracking-[-0.02em] text-white min-[1100px]:text-[52px]">
            Talk to the engineer directly.
          </h2>
          <p className="m-0 flex flex-wrap items-center gap-3 text-[15px] text-concrete">
            <a href="tel:+61432261722" className="tabular-nums text-concrete transition-colors hover:text-white">
              0432 261 722
            </a>
            <span className="text-steel">·</span>
            <a href="mailto:andrew@defex.engineering" className="text-concrete transition-colors hover:text-white">
              andrew@defex.engineering
            </a>
          </p>
        </Reveal>
        <Reveal
          as="a"
          delay={120}
          href="mailto:andrew@defex.engineering"
          className="inline-flex min-h-11 items-center gap-2.5 whitespace-nowrap rounded-control bg-blue-electric px-[30px] py-4 text-[15px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-electric-hover hover:shadow-blue-lift active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
        >
          Contact DEFEX <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </Reveal>
      </div>
    </section>
  );
}
