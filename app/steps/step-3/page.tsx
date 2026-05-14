"use client";

import Image from "next/image";
import { useEffect, useState, startTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/app/components/navbar/navbar";
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
];

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
    startTransition(() => {
      setSelected((prev) => (prev === "" ? id : prev));
    });
  }, [buildPathHydrated, selections.goalId]);

  const rows: (typeof options)[] = [
    options.slice(0, 2),
    options.slice(2, 4),
    options.slice(4),
  ];

  const handleContinue = async () => {
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
  };

  return (
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-transparent">
      <Navbar />

      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
        <div className="h-[400px] w-[500px] rounded-full bg-teal-400/10 blur-[130px]" />
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div className="scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain px-4 pb-2 pt-24 sm:px-6 sm:pt-32">
          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-6 py-6 sm:py-8">
            <h1 className="steps-heading text-center text-balance !text-[#1a2a3a]">
              What Are You Trying to Do?
            </h1>

            <p className="max-w-3xl text-balance px-2 text-center font-dm-sans text-sm leading-snug text-black sm:text-base md:text-lg">
              What Are You Hoping to Create?
            </p>

            <div className="flex w-full max-w-[550px] flex-col gap-3 lg:max-w-3xl">
              {rows.map((row, ri) => (
                <div key={ri} className="flex gap-3">
                  {row.map((opt, oi) => {
                    const isSelected = selected === opt.id;

                    const flexClass =
                      ri === 1
                        ? oi === 0
                          ? "w-[40%] flex-none"
                          : "flex-1"
                        : "flex-1";

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelected(opt.id)}
                        className={`
                          ${flexClass} flex items-center justify-between gap-3
                          rounded-full border px-4 py-4 text-left
                          transition-all duration-200
                          ${
                            isSelected
                              ? "border-2 border-[#4DB6AC] bg-white shadow-[0_0_0_1px_rgba(45,212,191,0.22)]"
                              : "border border-slate-200 bg-white/90 hover:border-slate-300 hover:bg-white"
                          }
                        `}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            className={`
                              flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
                              ${isSelected ? "bg-[#F5F7FA] text-[#4DB6AC]" : "border border-slate-200 bg-white text-black"}
                              transition-colors duration-200
                            `}
                            style={{ width: 40, height: 40, borderRadius: "9999px" }}
                          >
                            <Image
                              src={opt.icon}
                              alt=""
                              width={22}
                              height={22}
                              className={
                                isSelected
                                  ? "opacity-100 [filter:brightness(0)_saturate(100%)_invert(59%)_sepia(28%)_saturate(819%)_hue-rotate(124deg)_brightness(92%)_contrast(90%)]"
                                  : "opacity-70"
                              }
                              aria-hidden
                            />
                          </div>
                          <span
                            className="step-four-content text-sm font-medium leading-tight whitespace-nowrap !text-black"
                          >
                            {opt.label}
                          </span>
                        </div>

                        <div
                          className={`
                            flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2
                            transition-all duration-200
                            ${isSelected ? "border-[#4DB6AC] bg-[#4DB6AC]" : "border-slate-500 bg-transparent"}
                          `}
                        >
                          {isSelected ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                              <rect x="1" y="1" width="22" height="22" rx="11" fill="#4DB6AC" />
                              <rect x="1" y="1" width="22" height="22" rx="11" stroke="#4DB6AC" strokeWidth="2" />
                              <path
                                d="M10.3671 16.3146L6.26562 12.2131L7.52651 10.9522L10.3671 13.7928L16.4743 7.68555L17.7352 8.94643L10.3671 16.3146Z"
                                fill="white"
                              />
                            </svg>
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-slate-200/90 bg-[#f2f0ec]/95 px-4 pt-3 backdrop-blur-md pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-3">
            <button
              type="button"
              disabled={submitting || !selected}
              onClick={() => void handleContinue()}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-teal-400 py-4 text-sm font-semibold tracking-wide text-black shadow-lg shadow-teal-400/20 transition-all duration-200 hover:bg-teal-300 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <svg className="h-4 w-4 shrink-0 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Continuing…
                </>
              ) : (
                <>
                  Continue
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
  );
}