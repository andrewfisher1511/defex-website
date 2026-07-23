import { DefectMap } from "./DefectMap";
import { DefectMapPlacecard } from "./DefectMapPlacecard";

/** Server-flag equivalent of the design file's `showDefectMap` (default false). */
const SHOW_DEFECT_MAP = false;

/** DEFEX DBP Hub.dc.html's "Defect map" screen. */
export function DbpDefectMapSection() {
  return (
    <section id="anatomy" className="px-6 py-16 min-[900px]:px-8 min-[900px]:py-24">
      <div className="mx-auto max-w-[1160px]">
        <div className="mb-5 flex items-center gap-4">
          <span className="block h-0.5 w-12 bg-blue-electric" />
          <span className="text-[13px] font-semibold tracking-[0.32em] text-steel">THE DEFECT MAP</span>
        </div>
        <h2 className="mb-2.5 text-3xl font-light tracking-[-0.02em] text-navy-ink min-[900px]:text-[40px]">
          Where class 2 buildings fail
        </h2>
        <p className="mb-11 max-w-[640px] text-base leading-relaxed text-steel">
          Eight defects account for most of the remedial work we see in Sydney strata buildings.
        </p>

        {SHOW_DEFECT_MAP ? <DefectMap /> : <DefectMapPlacecard />}
      </div>
    </section>
  );
}
