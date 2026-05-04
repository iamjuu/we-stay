"use client";

import { useState } from "react";
import Navbar from "@/app/components/navbar/navbar";
import { StepsSubmitBtn } from "../components/steps-submit-btn";

const options = [
  {
    id: "long-term",
    label: "Long-Term Rental",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    id: "short-term",
    label: "Short-Term Rental",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.5L12 4l9 5.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    id: "family",
    label: "Family Living",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="9" cy="7" r="2.5" strokeLinecap="round" />
        <circle cx="16" cy="9" r="2" strokeLinecap="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 14c2.5 0 5 1.5 5 4" />
      </svg>
    ),
  },
  {
    id: "live-rent",
    label: "Live In It, Rent the Main House",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.5L12 4l9 5.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 21v-5h4v5" />
        <circle cx="17" cy="17" r="3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 17h3M17 15.5v3" />
      </svg>
    ),
  },
  {
    id: "not-sure",
    label: "Not Sure Yet",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 9.5a2.5 2.5 0 115 0c0 1.5-2.5 2-2.5 3.5" />
        <circle cx="12" cy="17" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
];

export default function GoalSelection() {
  const [selected, setSelected] = useState("long-term");

  const rows: (typeof options)[] = [
    options.slice(0, 2),
    options.slice(2, 4),
    options.slice(4),
  ];

  return (
    <div className="min-h-screen flex  bg-gradient-to-br from-[#1a2a3a] via-[#1e3448] to-[#162534] px-4">

      <div className="flex  flex-col w-full">
      <div className="">
        <Navbar />
      </div>

      {/* Ambient glow */}
      <div className= " pt-[120px]">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[400px] rounded-full bg-teal-400/10 blur-[130px]" />
      </div>

      <div className="w-full max-w-[550px] mx-auto flex flex-col items-center gap-6 py-10">
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
              {row.map((opt) => {
                const isSelected = selected === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelected(opt.id)}
                    className={`
                      flex-1 flex items-center justify-between gap-3
                      px-4 py-4 rounded-2xl text-left
                      border transition-all duration-200
                      ${
                        isSelected
                          ? "bg-white/10 border-teal-400/80 shadow-[0_0_0_1px_rgba(45,212,191,0.3)]"
                          : "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Icon container */}
                      <div
                        className={`
                          flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                          ${isSelected ? "bg-teal-400/20 text-teal-400" : "bg-white/10 text-slate-400"}
                          transition-colors duration-200
                        `}
                      >
                        {opt.icon}
                      </div>
                      <span
                        className={`text-sm font-medium leading-tight ${
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
                        <svg
                          className="w-3 h-3 text-slate-900"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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
        <StepsSubmitBtn  className="!bg-[#F05C4A]" idleText="Continue" />
      </div>
      </div>
      </div>
    </div>
  );
}