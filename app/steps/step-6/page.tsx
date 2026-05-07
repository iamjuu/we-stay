"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/navbar/navbar";
import { StepsSubmitBtn } from "../components/steps-submit-btn";
import { StepFooter } from "../components/step-footer";
import { useBuildPath } from "@/app/context/build-path-session";
import { Gauge, PenTool } from "lucide-react";

const paths = [
  {
    id: "fast-track",
    title: "Fast Track",
    description: "Choose from standardized plans for a faster and simpler process.",
    icon: Gauge,
  },
  {
    id: "custom",
    title: "Custom",
    description: "Work toward a more tailored design based on your property and goals.",
    icon: PenTool,
  },
];

function SelectionToggle({ selected }: { selected: boolean }) {
  return selected ? (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#42B0A8] shadow-[0_0_12px_rgba(66,176,168,0.45)]">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M3 8L6.5 11.5L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  ) : (
    <div className="h-8 w-8 shrink-0 rounded-full border-2 border-white/30 bg-transparent" />
  );
}

export default function StepSixBuildPreference() {
  const router = useRouter();
  const { setSelections } = useBuildPath();
  const [selected, setSelected] = useState<"fast-track" | "custom">("fast-track");

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-[#1a2a3a] via-[#1e3448] to-[#162534] px-4">
      <div className="flex w-full flex-col">
        <Navbar />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center pt-[80px]">
          <div className="h-[400px] w-[500px] rounded-full bg-teal-400/10 blur-[130px]" />
        </div>

        <div className="relative mx-auto flex w-full max-w-[640px] flex-col items-center gap-8 pb-10 pt-[100px] lg:max-w-4xl">
          <div className="space-y-2 text-center">
            <h1 className="font-dm-sans text-2xl font-bold tracking-tight text-white md:text-[26px]">
              How Would You Like to Build?
            </h1>
          </div>

          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
            {paths.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selected === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelected(opt.id as typeof selected)}
                  className={`relative flex min-h-[170px] flex-col rounded-2xl border px-5 py-5 text-left transition-all duration-200 ${
                    isSelected
                      ? "border-[#42B0A8] bg-white shadow-[0_0_0_1px_rgba(66,176,168,0.35)]"
                      : "border-white/12 bg-white/5 hover:border-white/22 hover:bg-white/[0.07]"
                  }`}
                >
                  <div className="mb-4 flex items-start justify-between gap-2">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-full ${
                        isSelected ? "bg-slate-900 text-white" : "bg-white/10 text-slate-400"
                      }`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                    </div>
                    <SelectionToggle selected={isSelected} />
                  </div>
                  <p className={`font-dm-sans text-lg font-bold ${isSelected ? "text-slate-900" : "text-white"}`}>{opt.title}</p>
                  <p className={`mt-2 font-dm-sans text-sm leading-relaxed ${isSelected ? "text-slate-600" : "text-slate-400"}`}>
                    {opt.description}
                  </p>
                </button>
              );
            })}
          </div>

          <StepsSubmitBtn
            className="!bg-[#F05C4A] !text-white hover:!bg-[#e04d3f]"
            idleText="Choose My Path"
            onClick={() => {
              setSelections({ buildPreferenceId: selected });
              router.push("/3dpage");
            }}
          />

          <div className="w-full pt-4">
            <StepFooter currentStep={6} totalSteps={7} />
          </div>
        </div>
      </div>
    </div>
  );
}
