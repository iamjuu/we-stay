"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

const inputClassName =
  "w-full px-4 py-4 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-slate-400 text-sm border border-white/10 outline-none focus:border-teal-400/60 focus:bg-white/15 transition-all duration-200";

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
