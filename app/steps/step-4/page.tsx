"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/app/components/navbar/navbar";
import { StepsSubmitBtn } from "../components/steps-submit-btn";
import { StepFooter, StepLabel } from "../components/step-footer";
import { useBuildPath } from "@/app/context/build-path-session";
import { useJourneyProgress, useWizardRouteGuard } from "@/app/context/journey-progress";
import { flowIndexFromPath, nextWizardPath, prevWizardPath } from "@/lib/wizard-flow";
import backyardIcon from "@/content/icons/backyard.svg";
import attachedIcon from "@/content/icons/attached.svg";
import secondStoryIcon from "@/content/icons/seconsstory.svg";
import type { StaticImageData } from "next/image";
import type { IconType } from "react-icons";
import { MdOutlineMeetingRoom } from "react-icons/md";

type AduTypeId = "backyard" | "attached" | "second-story" | "interior-suite";

type AduTypeOption =
  | { id: AduTypeId; title: string; description: string; icon: StaticImageData }
  | { id: AduTypeId; title: string; description: string; Icon: IconType };

const aduTypes: AduTypeOption[] = [
  {
    id: "backyard",
    title: "Backyard Home",
    description: "A standalone structure built in your backyard, ideal for maximum privacy.",
    icon: backyardIcon,
  },
  {
    id: "interior-suite",
    title: "Interior Suite",
    description:
      "An ADU within your existing home that adds space and value without expanding the footprint.",
    Icon: MdOutlineMeetingRoom,
  },
  {
    id: "attached",
    title: "Attached Addition",
    description: "Shares a wall with your main home—great for seamlessly expanding living space.",
    icon: attachedIcon,
  },
  {
    id: "second-story",
    title: "Second Story Addition",
    description: "Built above an existing structure—perfect for smaller lots with limited ground space.",
    icon: secondStoryIcon,
  },
  
];

function AduTypeCardIcon({ opt, isSelected }: { opt: AduTypeOption; isSelected: boolean }) {
  if ("icon" in opt) {
    return (
      <Image
        src={opt.icon}
        alt=""
        width={19}
        height={16}
        className={
          isSelected
            ? "opacity-100 [filter:brightness(0)_saturate(100%)_invert(59%)_sepia(28%)_saturate(819%)_hue-rotate(124deg)_brightness(92%)_contrast(90%)]"
            : "opacity-85"
        }
        aria-hidden
      />
    );
  }
  const Icon = opt.Icon;
  return (
    <Icon
      className={
        isSelected ? "h-[22px] w-[22px] shrink-0 text-[#42B0A8]" : "h-[22px] w-[22px] shrink-0 text-slate-500 opacity-90"
      }
      aria-hidden
    />
  );
}

function SelectionToggle({ selected }: { selected: boolean }) {
  return selected ? (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#42B0A8] shadow-[0_0_12px_rgba(66,176,168,0.45)]">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M3 8L6.5 11.5L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  ) : (
    <div className="h-8 w-8 shrink-0 rounded-full border-2 border-slate-300 bg-transparent" />
  );
}

export default function StepFourAduType() {
  const router = useRouter();
  const pathname = usePathname();
  const flowIdx = flowIndexFromPath(pathname) ?? 3;
  const { maxNavIndex, recordFlowComplete } = useJourneyProgress();
  useWizardRouteGuard(flowIdx);
  const { setSelections, selections, hydrated: buildPathHydrated } = useBuildPath();
  const [selected, setSelected] = useState<AduTypeId | "">("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!buildPathHydrated) return;
    const id = selections.aduTypeId;
    if (!id || !aduTypes.some((t) => t.id === id)) return;
    setSelected((prev) => (prev === "" ? (id as AduTypeId) : prev));
  }, [buildPathHydrated, selections.aduTypeId]);

  return (
    <div className="relative min-h-screen bg-transparent px-4">
      <div className="relative w-full">
        <Navbar />

        <div className="relative mx-auto w-full max-w-7xl">
          <div className="mx-auto flex w-full max-w-[550px] flex-col items-center gap-6 py-10 lg:max-w-4xl">
            <div className="space-y-2 px-1 text-center  w-full">
              <h1 className=" text-[18px] md:text-[26px] mt-14 !text-[#1a2a3a] font-medium">
                How have you pictured your ADU?
              </h1>
              <p>pick what feel closet. we will help you confirm what actually fits during your site assesment</p>
            </div>

          <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
            {aduTypes.map((opt) => {
              const isSelected = selected === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelected(opt.id)}
                  className={`relative flex min-h-[140px] flex-col rounded-2xl border px-5 py-4 text-left transition-all duration-200 md:min-h-[160px] ${
                    isSelected
                      ? "border-[#42B0A8] bg-white shadow-[0_0_0_1px_rgba(66,176,168,0.35)]"
                      : "border-slate-200 bg-white/90 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-full ${
                        isSelected ? "bg-[#0C1B2A]" : "bg-slate-100"
                      }`}
                    >
                      <AduTypeCardIcon opt={opt} isSelected={isSelected} />
                    </div>
                    <SelectionToggle selected={isSelected} />
                  </div>
                  <p className={`font-dm-sans text-lg font-bold ${isSelected ? "text-[#000000]" : "text-slate-800"}`}>
                    {opt.title}
                  </p>
                  <p className={`mt-2 font-dm-sans text-sm leading-relaxed ${isSelected ? "text-[#93928E]" : "text-slate-600"}`}>
                    {opt.description}
                  </p>
                </button>
              );
            })}
          </div>

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
                setSelections({ aduTypeId: selected });
                await recordFlowComplete(3, {
                  buildSelections: {
                    ...selections,
                    aduTypeId: selected,
                  },
                });
                router.push("/steps/step-5");
              } catch {
                setSubmitting(false);
              }
            }}
          />

          <p className="text-center font-dm-sans text-xs leading-relaxed text-slate-400">
            Not sure? We&apos;ll help you determine the best fit during your{" "}
            <Link href="/about" className="text-[#6BB8FF] underline underline-offset-2 hover:text-[#9dceff]">
              Discovery Call
            </Link>
            .
          </p>

          <StepLabel currentStep={5} totalSteps={7} />
          <div className="w-full pt-0 ">
            <StepFooter
              currentStep={5}
              totalSteps={7}
              variant="step5"
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
