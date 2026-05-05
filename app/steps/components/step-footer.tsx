"use client";

import type { ReactNode } from "react";

type StepFooterProps = {
  currentStep: number;
  totalSteps?: number;
};

const STEP_ICON_ACTIVE = 45;
const STEP_ICON_INACTIVE = 30;

function Step1Icon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={(size * 26) / 32}
      viewBox="0 0 32 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path
        d="M13.3243 18.1336C13.9813 18.7906 14.8091 19.0994 15.8078 19.06C16.8064 19.0206 17.5291 18.6592 17.9759 17.9759L26.8062 4.7305L13.5608 13.5608C12.8775 14.0338 12.503 14.75 12.4373 15.7092C12.3716 16.6685 12.6672 17.4766 13.3243 18.1336ZM4.88819 25.2294C4.31002 25.2294 3.77783 25.1045 3.29164 24.8549C2.80545 24.6052 2.41781 24.2307 2.12873 23.7314C1.44543 22.4962 0.91982 21.215 0.551892 19.8878C0.183964 18.5607 0 17.1875 0 15.7684C0 13.5871 0.413919 11.5372 1.24176 9.61869C2.0696 7.70021 3.19309 6.03139 4.61224 4.61224C6.03139 3.19309 7.70021 2.0696 9.61869 1.24176C11.5372 0.413919 13.5871 0 15.7684C0 13.5871 0.413919 11.5372 1.24176 9.61869C2.0696 7.70021 3.19309 6.03139 4.61224 4.61224C6.03139 3.19309 7.70021 2.0696 9.61869 1.24176C11.5372 0.413919 13.5871 0 15.7684C0 17.9234 0 19.947 0.407349 21.8392 1.22205C23.7314 2.03675 25.387 3.1471 26.8062 4.55311C28.2253 5.95912 29.3554 7.60166 30.1964 9.48072C31.0374 11.3598 31.471 13.3768 31.4973 15.5318C31.5236 16.9773 31.3593 18.3898 31.0045 19.7696C30.6497 21.1493 30.1044 22.4699 29.3686 23.7314C29.0795 24.2307 28.6918 24.6052 28.2056 24.8549C27.7194 25.1045 27.1873 25.2294 26.6091 25.2294H4.88819Z"
        fill="currentColor"
      />
    </svg>
  );
}

function StepGaugeIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 45 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path
        d="M21.2927 35.122C17.7805 34.939 14.8171 33.5854 12.4024 31.061C9.98781 28.5366 8.78049 25.5 8.78049 21.9512C8.78049 18.2927 10.061 15.1829 12.622 12.622C15.1829 10.061 18.2927 8.78049 21.9512 8.78049C25.5 8.78049 28.5366 9.98781 31.061 12.4024C33.5854 14.8171 34.939 17.7805 35.122 21.2927L30.5122 19.9207C30.0366 17.9451 29.0122 16.3262 27.439 15.064C25.8659 13.8018 24.0366 13.1707 21.9512 13.1707C19.5366 13.1707 17.4695 14.0305 15.75 15.75C14.0305 17.4695 13.1707 19.5366 13.1707 21.9512C13.1707 24.0366 13.8018 25.8659 15.064 27.439C16.3262 29.0122 17.9451 30.0366 19.9207 30.5122L21.2927 35.122ZM23.9268 43.7927C23.5976 43.8659 23.2683 43.9024 22.939 43.9024C22.6098 43.9024 22.2805 43.9024 21.9512 43.9024C18.9146 43.9024 16.061 43.3262 13.3902 42.1738C10.7195 41.0213 8.39634 39.4573 6.42073 37.4817C4.44512 35.5061 2.8811 33.1829 1.72866 30.5122C0.57622 27.8415 0 24.9878 0 21.9512C0 18.9146 0.57622 16.061 1.72866 13.3902C2.8811 10.7195 4.44512 8.39634 6.42073 6.42073C8.39634 4.44512 10.7195 2.8811 13.3902 1.72866C16.061 0.57622 18.9146 0 21.9512 0C24.9878 0 27.8415 0.57622 30.5122 1.72866C33.1829 2.8811 35.5061 4.44512 37.4817 6.42073C39.4573 8.39634 41.0213 10.7195 42.1738 13.3902C43.3262 16.061 43.9024 18.9146 43.9024 21.9512C43.9024 22.2805 43.9024 22.6098 43.9024 22.939C43.9024 23.2683 43.8659 23.5976 43.7927 23.9268L39.5122 22.6098V21.9512C39.5122 17.0488 37.811 12.8963 34.4085 9.4939C31.0061 6.09146 26.8537 4.39024 21.9512 4.39024C17.0488 4.39024 12.8963 6.09146 9.4939 9.4939C6.09146 12.8963 4.39024 17.0488 4.39024 21.9512C4.39024 26.8537 6.09146 31.0061 9.4939 34.4085C12.8963 37.811 17.0488 39.5122 21.9512 39.5122C22.061 39.5122 22.1707 39.5122 22.2805 39.5122C22.3902 39.5122 22.5 39.5122 22.6098 39.5122L23.9268 43.7927ZM40.6646 45L31.2805 35.6159L28.5366 43.9024L21.9512 21.9512L43.9024 28.5366L35.6159 31.2805L45 40.6646L40.6646 45Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Maps wizard step → which of the three footer icons is active (icons stay fixed at 3). */
function segmentIndex(currentStep: number, totalSteps: number): 1 | 2 | 3 {
  const safeTotal = Math.max(1, totalSteps);
  const clamped = Math.min(Math.max(1, currentStep), safeTotal);
  const idx = Math.ceil((clamped * 3) / safeTotal);
  return Math.min(3, Math.max(1, idx)) as 1 | 2 | 3;
}

/** Always three visuals: gauge, then two target icons — independent of totalSteps. */
const VISUAL_ICON_RENDERERS: ((size: number) => ReactNode)[] = [
  (size) => <StepGaugeIcon size={size} />,
  (size) => <Step1Icon size={size} />,
  (size) => <Step1Icon size={size} />,
];

const VISUAL_STEPS = VISUAL_ICON_RENDERERS.length;

export function StepFooter({ currentStep, totalSteps = 7 }: StepFooterProps) {
  const activeSegment = segmentIndex(currentStep, totalSteps);

  return (
    <div className="w-full flex flex-col items-center gap-3 pt-2 pb-6">
      {/* Step label */}
      <p className="text-slate-400 text-xs tracking-wide">
        Step {currentStep} of {totalSteps}
      </p>

      {/* Icon row — fixed three milestones */}
      <div className="flex items-center w-full ">
        {Array.from({ length: VISUAL_STEPS }).map((_, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === activeSegment;
          const isDone = stepNum < activeSegment;
          const iconSize = isActive ? STEP_ICON_ACTIVE : STEP_ICON_INACTIVE;
          const circleSize = isActive ? STEP_ICON_ACTIVE : STEP_ICON_INACTIVE;

          return (
            <div key={stepNum} className="flex items-center flex-1 last:flex-none">
              {/* Circle */}
              <div
                className="flex items-center justify-center rounded-full shrink-0 transition-all duration-300 bg-[#4DB6AC4D]"
                style={{ width: circleSize, height: circleSize }}
              >
                <span
                  className={`flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "text-[#4DB6AC]/30"
                      : isDone
                        ? "text-teal-300"
                        : "text-white/60"
                  }`}
                >
                  {VISUAL_ICON_RENDERERS[i]?.(iconSize)}
                </span>
              </div>

              {/* Connector line — not after last */}
              {stepNum < VISUAL_STEPS && (
                <div className="flex-1 h-px mx-1.5 bg-white/10">
                  <div
                    className="h-full bg-teal-400/50 transition-all duration-500"
                    style={{ width: isDone ? "100%" : "0%" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
