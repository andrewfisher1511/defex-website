import { DbpQuiz } from "./DbpQuiz";

/** DEFEX DBP Hub.dc.html's "Quiz" screen. */
export function DbpQuizSection() {
  return (
    <section
      id="quiz"
      className="border-y border-hairline bg-white px-6 py-16 min-[900px]:px-8 min-[900px]:py-[88px]"
    >
      <div className="mx-auto max-w-[760px]">
        <div className="mb-5 flex items-center gap-4">
          <span className="block h-0.5 w-12 bg-blue-electric" />
          <span className="text-[13px] font-semibold tracking-[0.32em] text-steel">THE 3-MINUTE CHECK</span>
        </div>
        <h2 className="mb-2.5 text-3xl font-light tracking-[-0.02em] text-navy-ink min-[900px]:text-[40px]">
          How well do you know the NSW Design and Building Practitioner’s Act (2020)?
        </h2>
        <p className="mb-10 text-base leading-[1.7] text-steel">
          Eight questions, no trick wording, straight answers. See where your committee stands before the next
          repair lands on the agenda.
        </p>
        <DbpQuiz />
      </div>
    </section>
  );
}
