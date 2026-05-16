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
import calenderIcon from "@/content/icon-images/calender.svg";
import shortTermIcon from "@/content/icon-images/shortterm.svg";
import familyIcon from "@/content/icon-images/family.svg";
import liveInIcon from "@/content/icon-images/livein.svg";
import notSureIcon from "@/content/icon-images/notsure.svg";

const options = [
  {
    id: "long-term",
    label: "Long-Term Rental",
    icon: calenderIcon,
  },
  {
    id: "short-term",
    label: "Short-Term Rental",
    icon: shortTermIcon,
  },
  {
    id: "family",
    label: "Family Living",
    icon: familyIcon,
  },
  {
    id: "live-rent",
    label: "Live In It, Rent the Main House",
    icon: liveInIcon,
  },
  {
    id: "not-sure",
    label: "Not Sure Yet",
    icon: notSureIcon,
  },
] as const;

/** Calendar SVG uses #4DB6AC; other icons are gray and use the filter when selected. */
function goalOptionIconClass(optId: (typeof options)[number]["id"], isSelected: boolean): string {
  const tealFilter =
    "opacity-100 [filter:brightness(0)_saturate(100%)_invert(59%)_sepia(28%)_saturate(819%)_hue-rotate(124deg)_brightness(92%)_contrast(90%)]";
  if (isSelected) {
    return optId === "long-term" ? "opacity-100" : tealFilter;
  }
  return optId === "long-term" ? "opacity-100" : "opacity-70";
}

export default function GoalSelection() {
  const router = useRouter();
  const pathname = usePathname();
  const flowIdx = flowIndexFromPath(pathname) ?? 2;
  const { maxNavIndex, recordFlowComplete } = useJourneyProgress();
  useWizardRouteGuard(flowIdx);
  const { setSelections, selections, hydrated: buildPathHydrated } = useBuildPath();
  const [selected, setSelected] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!buildPathHydrated) return;
    const id = selections.goalId;
    if (!id || !options.some((o) => o.id === id)) return;
    setSelected((prev) => (prev === "" ? id : prev));
  }, [buildPathHydrated, selections.goalId]);

  return (
    <div className="relative min-h-screen bg-transparent px-4">
      <div className="relative w-full">
        <Navbar />

        <div className="relative mx-auto w-full max-w-7xl">
          <div className="mx-auto flex w-full max-w-full flex-col items-center gap-6 py-10 sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
            <div className="space-y-2 px-1 text-center mt-24 sm:mt-32 md:mt-36">
              <h1 className="steps-heading text-balance text-[#1a2a3a]">
                What Are You Trying to Do?
              </h1>
              <p className="steps-subheading text-sm leading-relaxed !text-slate-600">
                What Are You Hoping to Create?
              </p>
            </div>

            {/* Options: single column on narrow viewports, two columns when there is room */}
            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
              {options.map((opt) => {
                const isSelected = selected === opt.id;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelected(opt.id)}
                    className={`
                          flex min-h-[3.5rem] w-full min-w-0 items-center justify-between gap-3
                          rounded-full border px-4 py-3 text-left transition-all duration-200
                          sm:min-h-[4rem] sm:px-4 sm:py-4
                          ${
                            isSelected
                              ? "border-2 border-[#4DB6AC] bg-white shadow-[0_0_0_1px_rgba(45,212,191,0.22)]"
                              : "border-slate-200 bg-white/90 hover:border-slate-300 hover:bg-white"
                          }
                        `}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div
                        className={`
                              flex h-10 w-10 shrink-0 items-center justify-center rounded-full
                              ${isSelected ? "bg-[#F5F7FA] text-[#4DB6AC]" : "border border-slate-200 bg-white text-black"}
                              transition-colors duration-200
                            `}
                      >
                        <Image
                          src={opt.icon}
                          alt=""
                          width={22}
                          height={22}
                          className={goalOptionIconClass(opt.id, isSelected)}
                          aria-hidden
                        />
                      </div>
                      <span className="step-four-content min-w-0 text-pretty text-sm font-medium leading-snug !text-black sm:text-base">
                        {opt.label}
                      </span>
                    </div>

                    <div
                      className={`
                            flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200
                            ${isSelected ? "border-[#4DB6AC] bg-[#4DB6AC]" : "border-slate-500 bg-transparent"}
                          `}
                      aria-hidden
                    >
                      {isSelected && (
                        <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M2.5 6L5 8.5L9.5 3.5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* CTA */}
            <StepsSubmitBtn
              isComplete={Boolean(selected)}
              idleText="Continue"
              disabled={!selected}
              loading={submitting}
              loadingText="Continuing…"
              onClick={async () => {
                if (!selected) return;
                setSubmitting(true);
                try {
                  setSelections({ goalId: selected });
                  await recordFlowComplete(2, {
                    buildSelections: {
                      ...selections,
                      goalId: selected,
                    },
                  });
                  router.push("/steps/step-4");
                } catch {
                  setSubmitting(false);
                }
              }}
            />
            <div className="w-full pt-[10px]">
              <StepFooter
                currentStep={4}
                totalSteps={7}
                variant="step2"
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