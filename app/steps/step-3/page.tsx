"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/navbar/navbar";
import { StepsSubmitBtn } from "../components/steps-submit-btn";
import { StepFooter } from "../components/step-footer";

const options = [
  {
    id: "long-term",
    label: "Long-Term Rental",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="22" height="22" rx="11" fill="#4DB6AC"/>
      <rect x="1" y="1" width="22" height="22" rx="11" stroke="#4DB6AC" stroke-width="2"/>
      <path d="M10.3671 16.3146L6.26562 12.2131L7.52651 10.9522L10.3671 13.7928L16.4743 7.68555L17.7352 8.94643L10.3671 16.3146Z" fill="white"/>
      </svg>
      
    ),
  },
  {
    id: "short-term",
    label: "Short-Term Rental",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="22" height="22" rx="11" fill="#4DB6AC"/>
      <rect x="1" y="1" width="22" height="22" rx="11" stroke="#4DB6AC" stroke-width="2"/>
      <path d="M10.3671 16.3146L6.26562 12.2131L7.52651 10.9522L10.3671 13.7928L16.4743 7.68555L17.7352 8.94643L10.3671 16.3146Z" fill="white"/>
      </svg>
      
    ),
  },
  {
    id: "family",
    label: "Family Living",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="22" height="22" rx="11" fill="#4DB6AC"/>
      <rect x="1" y="1" width="22" height="22" rx="11" stroke="#4DB6AC" stroke-width="2"/>
      <path d="M10.3671 16.3146L6.26562 12.2131L7.52651 10.9522L10.3671 13.7928L16.4743 7.68555L17.7352 8.94643L10.3671 16.3146Z" fill="white"/>
      </svg>
      
    ),
  },
  {
    id: "live-rent",
    label: "Live In It, Rent the Main House",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="22" height="22" rx="11" fill="#4DB6AC"/>
      <rect x="1" y="1" width="22" height="22" rx="11" stroke="#4DB6AC" stroke-width="2"/>
      <path d="M10.3671 16.3146L6.26562 12.2131L7.52651 10.9522L10.3671 13.7928L16.4743 7.68555L17.7352 8.94643L10.3671 16.3146Z" fill="white"/>
      </svg>
      
    ),
  },
  {
    id: "not-sure",
    label: "Not Sure Yet",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="22" height="22" rx="11" fill="#4DB6AC"/>
      <rect x="1" y="1" width="22" height="22" rx="11" stroke="#4DB6AC" stroke-width="2"/>
      <path d="M10.3671 16.3146L6.26562 12.2131L7.52651 10.9522L10.3671 13.7928L16.4743 7.68555L17.7352 8.94643L10.3671 16.3146Z" fill="white"/>
      </svg>
      
    ),
  },
];

export default function GoalSelection() {
  const router = useRouter();
  const [selected, setSelected] = useState("long-term");

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
              <h1 className="text-white text-2xl font-bold tracking-tight">
                What Are You Trying to Do?
              </h1>
              <p className="text-slate-400 text-sm">What Are You Hoping to Create?</p>
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
                              ? "bg-white/10 border-[#4DB6AC] shadow-[0_0_0_1px_rgba(45,212,191,0.3)]"
                              : "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20"
                          }
                        `}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Icon container */}
                          <div
                            className={`
                              flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                              ${isSelected ? "bg-[#4DB6AC]/20 text-[#4DB6AC]" : "bg-white/10 text-slate-400"}
                              transition-colors duration-200
                            `}
                          >
                            {opt.icon}
                          </div>
                          <span
                            className={` step-four-content text-sm font-medium leading-tight whitespace-nowrap ${
                              isSelected ? "text-white" : "text-slate-300"
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
                            ${isSelected ? "border-teal-400 bg-teal-400" : "border-slate-500 bg-transparent"}
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
            <StepsSubmitBtn className="!bg-[#F05C4A] text-white " idleText="Continue" onClick={() => router.push("/steps/step-4")} />
<div className="pt-[90px] bg-red-50 w-full">


            <StepFooter currentStep={3} />
</div>
          </div>
        </div>
      </div>
    </div>
  );
}