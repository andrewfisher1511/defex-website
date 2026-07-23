"use client";

import { useState } from "react";
import { DBP_QUESTIONS, scoreBandFor } from "./dbpQuizData";

const TOTAL = DBP_QUESTIONS.length;
const SHOW_CHECKLIST = true;
const SHOW_EMAIL_CAPTURE = true;

const CHECKLIST_ITEMS = [
  "Are all practitioners on our current or planned works registered? (Check verify.licence.nsw.gov.au)",
  "Do we have declared regulated designs lodged before any works start?",
  "Is our next \"minor\" repair actually minor, or does it touch structure, waterproofing or balustrades?",
  "Can upcoming repairs be bundled into one planning approval and one project?",
  "Do we have an independent engineer's report before signing a builder's scope of works?",
];

interface OptionStyle {
  bg: string;
  border: string;
  color: string;
  weight: string;
}

function optionStyle(index: number, correct: number, picked: number | null): OptionStyle {
  if (picked === null) {
    return { bg: "#FFFFFF", border: "#E4E7EC", color: "#44505F", weight: "500" };
  }
  if (index === correct) {
    return { bg: "#ECFDF3", border: "#12B76A", color: "#067647", weight: "600" };
  }
  if (index === picked) {
    return { bg: "#FEF3F2", border: "#F04438", color: "#B42318", weight: "600" };
  }
  return { bg: "#FFFFFF", border: "#E4E7EC", color: "#98A2B3", weight: "500" };
}

/**
 * The 3-minute check — DEFEX DBP Hub.dc.html's "Quiz" screen. One question
 * at a time; scoring, bands and missed-question assists match the source
 * script's renderVals() exactly (progress-bar math included).
 */
export function DbpQuiz() {
  const [qIndex, setQIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [missed, setMissed] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const question = DBP_QUESTIONS[qIndex];
  const answered = picked !== null;
  const isCorrect = answered && picked === question.correct;

  const handlePick = (i: number) => {
    if (picked === null) setPicked(i);
  };

  const handleNext = () => {
    const newMissed = picked === question.correct ? missed : [...missed, qIndex];
    if (qIndex === TOTAL - 1) {
      setMissed(newMissed);
      setDone(true);
      setPicked(null);
    } else {
      setMissed(newMissed);
      setQIndex(qIndex + 1);
      setPicked(null);
    }
  };

  const handleRestart = () => {
    setQIndex(0);
    setPicked(null);
    setMissed([]);
    setDone(false);
  };

  const handleSendEmail = () => {
    if (email.includes("@")) setEmailSent(true);
  };

  if (!done) {
    const progressPct = (((qIndex + (answered ? 1 : 0)) / TOTAL) * 100).toFixed(0);

    return (
      <div className="rounded-tile border border-hairline bg-canvas px-6 py-9 min-[900px]:px-10">
        <div className="mb-2.5 flex items-center justify-between gap-4">
          <p className="m-0 text-[13px] font-semibold tracking-[0.1em] text-grey-400">
            QUESTION {qIndex + 1} OF {TOTAL}
          </p>
          <div className="h-1 w-40 overflow-hidden rounded-full bg-hairline">
            <div
              className="h-full rounded-full bg-blue-electric transition-[width] duration-300 ease-in-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
        <h3 className="m-0 mb-6 text-xl font-semibold leading-[1.4] text-navy-ink">{question.q}</h3>
        <div className="flex flex-col gap-2.5">
          {question.opts.map((opt, i) => {
            const style = optionStyle(i, question.correct, picked);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => handlePick(i)}
                style={{ borderColor: style.border, backgroundColor: style.bg, color: style.color, fontWeight: style.weight }}
                className="min-h-[52px] rounded-control border px-[18px] py-3.5 text-left font-sans text-[15px] leading-snug transition-all duration-150 hover:border-blue-electric active:scale-[0.99]"
              >
                {opt}
              </button>
            );
          })}
        </div>
        {answered && (
          <>
            <div
              className="mt-5 rounded-r-lg bg-white px-5 py-4"
              style={{ borderLeft: `3px solid ${isCorrect ? "#067647" : "#B42318"}` }}
            >
              <p className="m-0 mb-1.5 text-sm font-bold" style={{ color: isCorrect ? "#067647" : "#B42318" }}>
                {isCorrect ? "Correct" : "Not quite"}
              </p>
              <p className="m-0 text-[14.5px] leading-relaxed text-ink-muted">{question.explain}</p>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="min-h-12 rounded-control bg-blue-electric px-7 font-sans text-[15px] font-semibold text-white transition-all duration-200 hover:bg-blue-electric-hover active:scale-[0.97]"
              >
                {qIndex === TOTAL - 1 ? "See my result" : "Next question"}
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  const finalScore = TOTAL - missed.length;
  const band = scoreBandFor(finalScore);
  const missedAssists = missed.map((qIdx, idx) => ({ n: idx + 1, text: DBP_QUESTIONS[qIdx].assist }));

  return (
    <div>
      <div className="flex flex-col gap-2 rounded-tile bg-navy-ink px-6 py-10 min-[900px]:px-11">
        <p className="m-0 text-[13px] font-semibold tracking-[0.24em] text-blue-electric">YOUR RESULT</p>
        <h3 className="m-0 text-[34px] font-light text-white">{band.title}</h3>
        <p className="m-0 mb-2 text-base text-white/75">
          You scored {finalScore} out of {TOTAL}.
        </p>
        <p className="m-0 text-[15.5px] leading-[1.7] text-white/85">{band.blurb}</p>
      </div>

      {missedAssists.length > 0 && (
        <div className="mt-6 rounded-tile border border-hairline bg-canvas px-6 py-8 min-[900px]:px-9">
          <h4 className="m-0 mb-4 text-lg font-semibold text-navy-ink">Where DEFEX can help you specifically</h4>
          <div className="flex flex-col gap-3">
            {missedAssists.map((line) => (
              <div key={line.n} className="flex items-start gap-3">
                <span className="mt-px flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-blueprint text-xs font-bold text-blue-electric">
                  {line.n}
                </span>
                <p className="m-0 text-[14.5px] leading-relaxed">{line.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {SHOW_CHECKLIST && (
        <div className="mt-6 rounded-tile border border-hairline bg-white px-6 py-8 min-[900px]:px-9">
          <h4 className="m-0 mb-1 text-lg font-semibold text-navy-ink">
            Five questions to ask your strata manager this week
          </h4>
          <p className="m-0 mb-[18px] text-[13.5px] text-grey-400">
            Screenshot this for your next committee meeting.
          </p>
          <div className="flex flex-col gap-2.5">
            {CHECKLIST_ITEMS.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded border-2 border-concrete" />
                <p className="m-0 text-[14.5px] leading-[1.6]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {SHOW_EMAIL_CAPTURE && (
        <div className="mt-6 rounded-tile border border-blueprint-chip-border bg-blueprint px-6 py-8 min-[900px]:px-9">
          {!emailSent ? (
            <>
              <h4 className="m-0 mb-1.5 text-lg font-semibold text-navy-ink">Want your results and the full guide?</h4>
              <p className="m-0 mb-[18px] text-[14.5px] leading-relaxed text-ink-muted">
                Optional. We&apos;ll email your score plus the DEFEX Simple Guide to the DBP Act (PDF). No
                newsletter, no spam.
              </p>
              <div className="flex flex-wrap gap-2.5">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@example.com"
                  className="min-h-[50px] min-w-[240px] flex-1 rounded-control border border-concrete bg-white px-4 font-sans text-base text-navy-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-electric focus-visible:outline-offset-1"
                />
                <button
                  type="button"
                  onClick={handleSendEmail}
                  className="min-h-[50px] rounded-control bg-blue-electric px-[26px] font-sans text-[15px] font-semibold text-white transition-all duration-200 hover:bg-blue-electric-hover active:scale-[0.97]"
                >
                  Email me the guide
                </button>
              </div>
            </>
          ) : (
            <>
              <h4 className="m-0 mb-1.5 text-lg font-semibold text-navy-ink">On its way.</h4>
              <p className="m-0 text-[14.5px] leading-relaxed text-ink-muted">
                Your score and the DEFEX Simple Guide to the DBP Act are headed to {email || "your inbox"}.
                (In production this sends via Resend and records the lead for follow-up.)
              </p>
            </>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleRestart}
          className="min-h-11 bg-transparent px-1 font-sans text-sm font-medium text-steel underline decoration-solid underline-offset-[3px] transition-colors hover:text-blue-electric"
        >
          Retake the check
        </button>
        <a
          href="/site#contact"
          className="inline-flex min-h-12 items-center rounded-control bg-navy-ink px-[26px] text-[15px] font-semibold text-white transition-all duration-200 hover:bg-blue-electric active:scale-[0.97]"
        >
          Talk to DEFEX about your building
        </a>
      </div>
    </div>
  );
}
