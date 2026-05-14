"use client";

import Image from "next/image";
import { useEffect, useState, startTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/app/components/navbar/navbar";
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

export default function StepFiveBuildPreference() {
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
    startTransition(() => {
      setSelected((prev) => (prev === "" ? id : prev));
    });
  }, [buildPathHydrated, selections.buildPreferenceId]);

  const handleChoosePath = async () => {
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
  };

  return (
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-gradient-to-br from-[#1a2a3a] via-[#1e3448] to-[#162534]">
      <Navbar />

      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
        <div className="h-[400px] w-[500px] rounded-full bg-teal-400/10 blur-[130px]" />
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div className="scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain px-4 pb-2 pt-24 sm:px-6 sm:pt-32">
          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-6 py-6 sm:py-8">
            <div className="mx-auto flex w-full max-w-[550px] flex-col items-center gap-6 lg:max-w-4xl">
              <div className="w-full space-y-2 text-center mt-36">
                <h1 className="steps-heading text-balance !text-white">How Would You Like to Build?</h1>
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
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-white/10 bg-[#162534]/95 px-4 pt-3 backdrop-blur-md pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-3">
            <button
              type="button"
              disabled={submitting || !selected}
              onClick={() => void handleChoosePath()}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-teal-400 py-4 text-sm font-semibold tracking-wide text-slate-900 shadow-lg shadow-teal-400/20 transition-all duration-200 hover:bg-teal-300 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <svg className="h-4 w-4 shrink-0 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Opening configurator…
                </>
              ) : (
                <>
                  Choose My Path
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
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
  );
}
