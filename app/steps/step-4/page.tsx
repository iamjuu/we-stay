"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/navbar/navbar";
import { StepsSubmitBtn } from "../components/steps-submit-btn";
import { StepFooter } from "../components/step-footer";
import { useBuildPath } from "@/app/context/build-path-session";
import { CalendarClock } from "lucide-react";

const timelines = [
  {
    id: "soon",
    label: "Within 6 months",
    description: "You’re ready to prioritize permitting and design decisions soon.",
  },
  {
    id: "year",
    label: "6–18 months",
    description: "You’re budgeting and aligning financing before breaking ground.",
  },
  {
    id: "exploring",
    label: "Still exploring",
    description: "You want clarity first—timeline will follow once the path feels right.",
  },
];

function SelectionToggle({ selected }: { selected: boolean }) {
  return selected ? (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#42B0A8] ring-2 ring-[#42B0A8]/40">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path d="M2 7L5 10L12 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  ) : (
    <div className="h-7 w-7 shrink-0 rounded-full border-2 border-white/35 bg-transparent" />
  );
}

export default function StepFourTimeline() {
  const router = useRouter();
  const { setSelections } = useBuildPath();
  const [selected, setSelected] = useState(timelines[0].id);

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-[#1a2a3a] via-[#1e3448] to-[#162534] px-4">
      <div className="flex w-full flex-col">
        <Navbar />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center pt-[80px]">
          <div className="h-[400px] w-[500px] rounded-full bg-teal-400/10 blur-[130px]" />
        </div>

        <div className="relative mx-auto flex w-full max-w-[560px] flex-col items-center gap-6 pb-10 pt-[100px] lg:max-w-xl">
          <div className="space-y-2 text-center">
            <h1 className="font-dm-sans text-2xl font-bold tracking-tight text-white">
              What&apos;s Your Ideal Timeline?
            </h1>
            <p className="font-dm-sans text-sm text-slate-400">
              This helps us prioritize next steps and recommendations for your build path.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3">
            {timelines.map((opt) => {
              const isSelected = selected === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelected(opt.id)}
                  className={`flex w-full items-start gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-200 ${
                    isSelected
                      ? "border-[#42B0A8] bg-white shadow-[0_0_0_1px_rgba(66,176,168,0.35)]"
                      : "border-white/12 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]"
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                      isSelected ? "bg-slate-900 text-[#42B0A8]" : "bg-white/10 text-slate-300"
                    }`}
                  >
                    <CalendarClock className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className={`font-dm-sans text-base font-semibold ${isSelected ? "text-slate-900" : "text-white"}`}>
                      {opt.label}
                    </p>
                    <p className={`mt-1 font-dm-sans text-sm leading-snug ${isSelected ? "text-slate-600" : "text-slate-400"}`}>
                      {opt.description}
                    </p>
                  </div>
                  <div className="shrink-0 pt-1">
                    <SelectionToggle selected={isSelected} />
                  </div>
                </button>
              );
            })}
          </div>

          <StepsSubmitBtn
            className="!bg-[#F05C4A] !text-white hover:!bg-[#e04d3f]"
            idleText="Continue"
            onClick={() => {
              setSelections({ timelineId: selected });
              router.push("/steps/step-5");
            }}
          />

          <div className="w-full pt-6">
            <StepFooter currentStep={4} totalSteps={7} />
          </div>
        </div>
      </div>
    </div>
  );
}
