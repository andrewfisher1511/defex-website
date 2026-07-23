/** Shown instead of <DefectMap/> while showDefectMap is false. */
export function DefectMapPlacecard() {
  return (
    <div className="flex flex-col items-start gap-2.5 rounded-tile border border-dashed border-concrete bg-white p-8 min-[900px]:p-12">
      <span className="whitespace-nowrap rounded-full border border-blueprint-chip-border bg-blueprint px-3.5 py-1.5 text-xs font-bold tracking-[0.2em] text-blue-electric">
        IN DEVELOPMENT
      </span>
      <h3 className="mt-2 text-2xl font-semibold text-navy-ink">
        An interactive map of where class 2 buildings fail
      </h3>
      <p className="m-0 max-w-[640px] text-[15px] leading-relaxed text-steel">
        Tap through a blueprint section of a typical strata building: spalling concrete, failed membranes,
        non-compliant balustrades, cavity flashings, magnesite, missing overflows, drainage falls and cracking
        brickwork. Each one explained: what it is, the risk, and how it gets fixed properly.
      </p>
      <p className="m-0 mt-1.5 text-sm text-grey-400">
        Coming soon. Take the check above and leave your email to hear when it lands.
      </p>
    </div>
  );
}
