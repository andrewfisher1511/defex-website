import { DbpGuideGate } from "./DbpGuideGate";
import { DbpGuideContent } from "./DbpGuideContent";

/** DEFEX DBP Hub.dc.html's "Guide" screen. */
export function DbpGuideSection() {
  return (
    <section id="guide" className="px-6 py-16 min-[900px]:px-8 min-[900px]:py-[88px]">
      <div className="mx-auto flex max-w-[820px] flex-col gap-11">
        <DbpGuideGate>
          <DbpGuideContent />
        </DbpGuideGate>
      </div>
    </section>
  );
}
