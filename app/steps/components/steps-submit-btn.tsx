"use client";

import type { ButtonHTMLAttributes } from "react";

const baseClassName =
  "w-full py-4 rounded-full text-white font-semibold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg";

export type StepsSubmitBtnProps = {
  loading?: boolean;
  loadingText?: string;
  idleText?: string;
  isComplete?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function StepsSubmitBtn({
  loading = false,
  loadingText = "Preparing…",
  idleText = "Reveal My Score",
  isComplete = false,
  className = "",
  children,
  disabled,
  type = "button",
  ...props
}: StepsSubmitBtnProps) {
  const isDisabled = disabled || loading;
  const bgColor = isComplete ? "#4DB6AC" : "#F05C4A";

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`${baseClassName} ${className}`.trim()}
      style={{ backgroundColor: bgColor, boxShadow: `0 8px 24px ${bgColor}40` }}
      {...props}
    >
      {loading ? (
        <>
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          {loadingText}
        </>
      ) : (
        children ?? (
          <>
            {idleText}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </>
        )
      )}
    </button>
  );
}
