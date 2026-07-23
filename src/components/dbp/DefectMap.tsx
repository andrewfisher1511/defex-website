"use client";

import { useState } from "react";
import { DBP_DEFECTS } from "./dbpDefectMapData";

/**
 * The interactive defect map — DEFEX DBP Hub.dc.html's "Anatomy" screen,
 * ported in full per the phase brief. Not mounted by default: see
 * <DbpDefectMapSection/>, which renders the "IN DEVELOPMENT" placecard
 * instead until real defect photography lands and SHOW_DEFECT_MAP flips on.
 */
export function DefectMap() {
  const [selected, setSelected] = useState(0);
  const defect = DBP_DEFECTS[selected];

  return (
    <div className="grid grid-cols-1 items-start gap-12 min-[1024px]:grid-cols-[minmax(380px,520px)_1fr]">
      <div className="relative overflow-hidden rounded-tile bg-navy-ink p-6">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(37,99,235,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.09) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <p className="relative m-0 mb-2 text-[11px] font-semibold tracking-[0.24em] text-steel">
          TYPICAL CLASS 2 SECTION · NTS
        </p>
        <div className="relative">
          <svg viewBox="0 0 520 640" className="block h-auto w-full">
            <line x1="20" y1="600" x2="500" y2="600" stroke="#C9CFD8" strokeWidth="2" />
            <path
              d="M30 600 l14 14 M60 600 l14 14 M90 600 l14 14 M120 600 l14 14 M150 600 l14 14 M180 600 l14 14 M210 600 l14 14 M240 600 l14 14 M270 600 l14 14 M300 600 l14 14 M330 600 l14 14 M360 600 l14 14 M390 600 l14 14 M420 600 l14 14 M450 600 l14 14 M480 600 l14 14"
              stroke="#5C6B7F"
              strokeWidth="1.5"
            />
            <rect x="90" y="612" width="230" height="16" fill="none" stroke="#C9CFD8" strokeWidth="2" />
            <rect x="80" y="100" width="240" height="500" fill="rgba(239,244,254,0.06)" stroke="#EFF4FE" strokeWidth="2.5" />
            <line x1="70" y1="100" x2="330" y2="100" stroke="#EFF4FE" strokeWidth="3" />
            <line x1="80" y1="250" x2="320" y2="250" stroke="#EFF4FE" strokeWidth="2.5" />
            <line x1="80" y1="262" x2="320" y2="262" stroke="#EFF4FE" strokeWidth="1.5" />
            <line x1="80" y1="420" x2="320" y2="420" stroke="#EFF4FE" strokeWidth="2.5" />
            <line x1="80" y1="432" x2="320" y2="432" stroke="#EFF4FE" strokeWidth="1.5" />
            <rect x="320" y="250" width="120" height="14" fill="rgba(239,244,254,0.12)" stroke="#EFF4FE" strokeWidth="2" />
            <line x1="440" y1="252" x2="440" y2="180" stroke="#EFF4FE" strokeWidth="2.5" />
            <line x1="320" y1="185" x2="440" y2="185" stroke="#EFF4FE" strokeWidth="2" />
            <line x1="350" y1="185" x2="350" y2="250" stroke="#EFF4FE" strokeWidth="1" />
            <line x1="380" y1="185" x2="380" y2="250" stroke="#EFF4FE" strokeWidth="1" />
            <line x1="410" y1="185" x2="410" y2="250" stroke="#EFF4FE" strokeWidth="1" />
            <rect x="320" y="420" width="120" height="14" fill="rgba(239,244,254,0.12)" stroke="#EFF4FE" strokeWidth="2" />
            <line x1="440" y1="422" x2="440" y2="350" stroke="#EFF4FE" strokeWidth="2.5" />
            <line x1="320" y1="355" x2="440" y2="355" stroke="#EFF4FE" strokeWidth="2" />
            <line x1="350" y1="355" x2="350" y2="420" stroke="#EFF4FE" strokeWidth="1" />
            <line x1="380" y1="355" x2="380" y2="420" stroke="#EFF4FE" strokeWidth="1" />
            <line x1="410" y1="355" x2="410" y2="420" stroke="#EFF4FE" strokeWidth="1" />
            <rect x="296" y="180" width="24" height="70" fill="none" stroke="#EFF4FE" strokeWidth="1.5" />
            <rect x="296" y="350" width="24" height="70" fill="none" stroke="#EFF4FE" strokeWidth="1.5" />
            <rect x="120" y="150" width="70" height="70" fill="rgba(37,99,235,0.15)" stroke="#EFF4FE" strokeWidth="1.5" />
            <rect x="120" y="300" width="70" height="80" fill="rgba(37,99,235,0.15)" stroke="#EFF4FE" strokeWidth="1.5" />
            <rect x="120" y="470" width="70" height="80" fill="rgba(37,99,235,0.15)" stroke="#EFF4FE" strokeWidth="1.5" />
            <path d="M100 560 l18 -22 l10 12 l16 -20" stroke="#DC2626" strokeWidth="2" fill="none" />
            <line x1="80" y1="580" x2="320" y2="580" stroke="#EFF4FE" strokeWidth="1" />
          </svg>
          {DBP_DEFECTS.map((pin, i) => (
            <button
              key={pin.n}
              type="button"
              onClick={() => setSelected(i)}
              aria-label={pin.name}
              style={{
                left: pin.left,
                top: pin.top,
                backgroundColor: i === selected ? "#2563EB" : "#1A1A2E",
                borderColor: i === selected ? "#FFFFFF" : "#2563EB",
              }}
              className="absolute flex h-[34px] w-[34px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 font-sans text-[13px] font-bold text-white shadow-[0_2px_10px_rgba(0,0,0,0.35)] transition-all duration-200 hover:scale-[1.15] active:scale-95"
            >
              {pin.n}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3.5 rounded-tile border border-hairline bg-white px-[26px] py-[30px] min-[900px]:px-[34px]">
          <div className="flex items-center gap-3">
            <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-blue-electric text-sm font-bold text-white">
              {defect.n}
            </span>
            <h3 className="m-0 text-[22px] font-semibold text-navy-ink">{defect.name}</h3>
          </div>
          <p className="m-0 text-[13px] font-semibold tracking-[0.12em] text-grey-400">{defect.where}</p>
          <div className="flex flex-col gap-3">
            <div>
              <p className="m-0 mb-0.5 text-[13px] font-bold text-blue-electric">WHY IT HAPPENS</p>
              <p className="m-0 text-[14.5px] leading-relaxed">{defect.cause}</p>
            </div>
            <div>
              <p className="m-0 mb-0.5 text-[13px] font-bold text-warning-text">THE RISK IF IGNORED</p>
              <p className="m-0 text-[14.5px] leading-relaxed">{defect.risk}</p>
            </div>
            <div>
              <p className="m-0 mb-0.5 text-[13px] font-bold text-navy-ink">WHAT DEFEX DOES</p>
              <p className="m-0 text-[14.5px] leading-relaxed">{defect.fix}</p>
            </div>
          </div>
          <div className="mt-1 flex items-center gap-3.5">
            <a
              href="/site#contact"
              className="inline-flex min-h-[46px] items-center rounded-control bg-blue-electric px-6 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-electric-hover active:scale-[0.97]"
            >
              Get this inspected
            </a>
            <span className="text-[13px] text-grey-400">{defect.reg}</span>
          </div>
        </div>
        <div className="flex items-center gap-3.5 rounded-card border border-dashed border-concrete bg-canvas px-[22px] py-[18px]">
          <div className="flex h-[54px] w-[72px] shrink-0 items-center justify-center rounded bg-hairline text-[10px] font-semibold text-grey-400">
            PHOTO
          </div>
          <p className="m-0 text-[13px] leading-[1.55] text-grey-400">
            Real defect photo slot — drop your site photograph for &quot;{defect.name}&quot; here in the next
            pass.
          </p>
        </div>
      </div>
    </div>
  );
}
