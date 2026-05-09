"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/navbar/navbar";
import { StepsSubmitBtn } from "../components/steps-submit-btn";
import { StepFooter } from "../components/step-footer";
import { useBuildPath } from "@/app/context/build-path-session";
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
  const { setSelections } = useBuildPath();
  const [selected, setSelected] = useState("");

  const rows: (typeof options)[] = [
    options.slice(0, 2),
    options.slice(2, 4),
    options.slice(4),
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#1a2a3a] via-[#1e3448] to-[#162534] px-4">
      <div className="flex flex-col w-full">
        <div className="">
          <Navbar />
        </div>

        {/* Ambient glow */}
        <div className="pt-[120px]">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[500px] h-[400px] rounded-full bg-teal-400/10 blur-[130px]" />
          </div>

          <div className="w-full max-w-[550px] lg:max-w-3xl mx-auto flex flex-col items-center gap-6 py-10">
            {/* Heading */}
            <div className="text-center space-y-1.5">
              <h1
                className="font-dm-sans text-center align-middle font-semibold text-white"
                style={{
                  fontSize: "36px",
                  lineHeight: "36px",
                  letterSpacing: "-0.64px",
                }}
              >
                What Are You Trying to Do?
              </h1>
              <p
                className="font-dm-sans text-center align-middle font-normal"
                style={{
                  color: "#F5F7FA",
                  fontSize: "22px",
                  lineHeight: "28px",
                  letterSpacing: "0px",
                }}
              >
                What Are You Hoping to Create?
              </p>
            </div>

            {/* Options grid */}
            <div className="w-full flex flex-col gap-3">
              {rows.map((row, ri) => (
                <div key={ri} className="flex gap-3">
                  {row.map((opt, oi) => {
                    const isSelected = selected === opt.id;

                    // Row 2 (index 1): first button 20%, second button takes remaining 80%
                    const flexClass =
                      ri === 1
                        ? oi === 0
                          ? "w-[40%] flex-none"
                          : "flex-1"
                        : "flex-1";

                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSelected(opt.id)}
                        className={`
                          ${flexClass} flex items-center justify-between gap-3
                          px-4 py-4 rounded-full text-left
                          border transition-all duration-200
                          ${
                            isSelected
                              ? "bg-white border-2 border-[#4DB6AC] shadow-[0_0_0_1px_rgba(45,212,191,0.22)]"
                              : "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20"
                          }
                        `}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Icon container */}
                          <div
                            className={`
                              flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                              ${isSelected ? "bg-[#F5F7FA] text-[#4DB6AC]" : "bg-white/10 text-slate-400"}
                              transition-colors duration-200
                            `}
                            style={{ width: 40, height: 40, borderRadius: "9999px" }}
                          >
                            <Image
                              src={opt.icon}
                              alt=""
                              width={22}
                              height={22}
                              className={isSelected ? "opacity-100 [filter:brightness(0)_saturate(100%)_invert(59%)_sepia(28%)_saturate(819%)_hue-rotate(124deg)_brightness(92%)_contrast(90%)]" : "opacity-70"}
                              aria-hidden
                            />
                          </div>
                          <span
                            className={` step-four-content text-sm font-medium leading-tight whitespace-nowrap ${
                              isSelected ? "!text-black" : "text-slate-300"
                            }`}
                          >
                            {opt.label}
                          </span>
                        </div>

                        {/* Radio indicator */}
                        <div
                          className={`
                            flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
                            transition-all duration-200
                            ${isSelected ? "border-[#4DB6AC] bg-[#4DB6AC]" : "border-slate-500 bg-transparent"}
                          `}
                        >
                          {isSelected && (
                           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <rect x="1" y="1" width="22" height="22" rx="11" fill="#4DB6AC"/>
                           <rect x="1" y="1" width="22" height="22" rx="11" stroke="#4DB6AC" stroke-width="2"/>
                           <path d="M10.3671 16.3146L6.26562 12.2131L7.52651 10.9522L10.3671 13.7928L16.4743 7.68555L17.7352 8.94643L10.3671 16.3146Z" fill="white"/>
                           </svg>
                           
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* CTA */}
            <StepsSubmitBtn
              isComplete={Boolean(selected)}
              idleText="Continue"
              disabled={!selected}
              onClick={() => {
                if (!selected) return;
                setSelections({ goalId: selected });
                router.push("/steps/step-5");
              }}
            />
<div className="pt-[90px]  w-full">


            <StepFooter currentStep={4} totalSteps={7} variant="step2" />
</div>
          </div>
        </div>
      </div>
    </div>
  );
}