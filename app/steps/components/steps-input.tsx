"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

const inputClassName =
  "w-full px-4 py-4 rounded-xl bg-white text-slate-900 placeholder-slate-400 text-sm border border-slate-200 outline-none focus:border-[#42B0A8] focus:ring-2 focus:ring-[#42B0A8]/20 transition-all duration-200";

type StepsInputProps = InputHTMLAttributes<HTMLInputElement>;

export const StepsInput = forwardRef<HTMLInputElement, StepsInputProps>(
  function StepsInput({ className = "", ...props }, ref) {
    return (
      <input
        ref={ref}
        className={`${inputClassName} ${className}`.trim()}
        {...props}
      />
    );
  }
);
