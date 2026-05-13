"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/app/components/navbar/navbar";
import { StepsSubmitBtn } from "../components/steps-submit-btn";
import { StepFooter } from "../components/step-footer";
import { useBuildPath } from "@/app/context/build-path-session";
import { useJourneyProgress, useWizardRouteGuard } from "@/app/context/journey-progress";
import { flowIndexFromPath, nextWizardPath, prevWizardPath } from "@/lib/wizard-flow";
import clockIcon from "@/content/icons/clock.svg";
import penIcon from "@/content/icons/pen.svg";
import type { StaticImageData } from "next/image";

const paths = [
  {
    id: "fast-track",
    title: "Fast Track",
    description: "Choose from standardized plans for a faster and simpler process.",
    icon: clockIcon,
  },
  {
    id: "custom",
    title: "Custom",
    description: "Work toward a more tailored design based on your property and goals.",
    icon: penIcon,
  },
] as const satisfies {
  id: "fast-track" | "custom";
  title: string;
  description: string;
  icon: StaticImageData;
}[];

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
  const pathname = usePathname();
  const flowIdx = flowIndexFromPath(pathname) ?? 4;
  const { maxNavIndex, recordFlowComplete } = useJourneyProgress();
  useWizardRouteGuard(flowIdx);
  const { setSelections, selections, hydrated: buildPathHydrated } = useBuildPath();
  const [selected, setSelected] = useState<"fast-track" | "custom" | "">("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!buildPathHydrated) return;
    const id = selections.buildPreferenceId;
    if (id !== "fast-track" && id !== "custom") return;
    setSelected((prev) => (prev === "" ? id : prev));
  }, [buildPathHydrated, selections.buildPreferenceId]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#1a2a3a] via-[#1e3448] to-[#162534] px-4">
      <div className="relative w-full">
        <Navbar />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[500px] w-[500px] rounded-full bg-teal-400/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl">
          <div className="mx-auto flex w-full max-w-[550px] flex-col items-center gap-6 py-10 lg:max-w-4xl">
            <div className="space-y-2 text-center mt-36 w-full">
              <h1 className="steps-heading text-balance !text-white">
                How Would You Like to Build?
              </h1>
            </div>

          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
            {paths.map((opt) => {
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
                        isSelected ? "bg-[#0C1B2A]" : "bg-white/10"
                      }`}
                    >
                      <Image
                        src={opt.icon}
                        alt=""
                        width={17}
                        height={14}
                        className={
                          isSelected
                            ? "opacity-100 [filter:brightness(0)_saturate(100%)_invert(100%)_sepia(0%)_saturate(1%)_hue-rotate(332deg)_brightness(102%)_contrast(101%)]"
                            : "opacity-85"
                        }
                        aria-hidden
                      />
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
            isComplete={Boolean(selected)}
            idleText="Choose My Path"
            disabled={!selected}
            loading={submitting}
            loadingText="Opening configurator…"
            onClick={async () => {
              if (!selected) return;
              setSubmitting(true);
              try {
                setSelections({ buildPreferenceId: selected });
                await recordFlowComplete(4, {
                  buildSelections: {
                    ...selections,
                    buildPreferenceId: selected,
                  },
                });
                router.push("/3dpage");
              } catch {
                setSubmitting(false);
              }
            }}
          />

          <div className="w-full pt-4">
            <StepFooter
              currentStep={6}
              totalSteps={7}
              variant="step6"
              onBack={() => router.push(prevWizardPath(flowIdx))}
              onForward={() => {
                const n = nextWizardPath(flowIdx);
                if (n) router.push(n);
              }}
              canGoForward={maxNavIndex > flowIdx}
            />
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
