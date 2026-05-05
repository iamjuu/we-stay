"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/navbar/navbar";
import { StepFooter } from "../components/step-footer";

function CriterionPassIcon() {
  return (
    <svg width={30} height={30} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="30" height="30" rx="15" fill="#2E7D32" />
      <path
        d="M24.375 9.98436L12.5648 21.7947L5.625 14.8549L7.4041 13.0758L12.5648 18.2239L22.5959 8.20526L24.375 9.98436Z"
        fill="white"
      />
    </svg>
  );
}

function CriterionWarnIcon() {
  return (
    <svg width={30} height={30} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="30" height="30" rx="15" fill="#E65100" />
      <path
        d="M15.0342 16.9427C15.237 16.9427 15.4315 16.8622 15.5749 16.7188C15.7183 16.5754 15.7989 16.3809 15.7989 16.1781V12.6372C15.7989 12.4344 15.7183 12.2399 15.5749 12.0965C15.4315 11.9531 15.237 11.8726 15.0342 11.8726C14.8314 11.8726 14.6369 11.9531 14.4935 12.0965C14.3501 12.2399 14.2696 12.4344 14.2696 12.6372V16.1663C14.268 16.2677 14.2867 16.3684 14.3244 16.4626C14.3621 16.5567 14.4182 16.6424 14.4893 16.7146C14.5605 16.7869 14.6453 16.8443 14.7389 16.8834C14.8324 16.9226 14.9328 16.9428 15.0342 16.9427Z"
        fill="white"
      />
      <path
        d="M15.0047 19.5602C15.492 19.5602 15.887 19.1652 15.887 18.6779C15.887 18.1906 15.492 17.7956 15.0047 17.7956C14.5174 17.7956 14.1224 18.1906 14.1224 18.6779C14.1224 19.1652 14.5174 19.5602 15.0047 19.5602Z"
        fill="white"
      />
      <path
        d="M22.2866 19.4249L16.5577 8.8728C16.406 8.59412 16.182 8.3615 15.9092 8.19941C15.6365 8.03733 15.3251 7.95178 15.0078 7.95178C14.6905 7.95178 14.3791 8.03733 14.1064 8.19941C13.8336 8.3615 13.6096 8.59412 13.4579 8.8728L7.72308 19.4249C7.57298 19.6943 7.49612 19.9984 7.50015 20.3068C7.50419 20.6152 7.58898 20.9171 7.74608 21.1825C7.90318 21.4479 8.1271 21.6675 8.39553 21.8194C8.66395 21.9713 8.96749 22.0502 9.2759 22.0482H20.7338C21.0397 22.0485 21.3404 21.9693 21.6064 21.8183C21.8725 21.6673 22.0947 21.4498 22.2512 21.187C22.4078 20.9242 22.4934 20.6253 22.4996 20.3194C22.5058 20.0136 22.4324 19.7114 22.2866 19.4425V19.4249ZM21.2397 20.566C21.1876 20.6538 21.1136 20.7265 21.0249 20.7771C20.9362 20.8276 20.8359 20.8542 20.7338 20.8542H9.2759C9.17366 20.8545 9.07311 20.8281 8.98417 20.7777C8.89523 20.7272 8.82098 20.6545 8.76872 20.5666C8.71647 20.4787 8.68803 20.3788 8.6862 20.2765C8.68437 20.1743 8.70922 20.0734 8.7583 19.9837L14.4873 9.43158C14.5377 9.3382 14.6124 9.2602 14.7035 9.20583C14.7946 9.15147 14.8988 9.12276 15.0049 9.12276C15.111 9.12276 15.2151 9.15147 15.3062 9.20583C15.3973 9.2602 15.4721 9.3382 15.5225 9.43158L21.2514 19.9837C21.3002 20.0734 21.3247 20.1743 21.3227 20.2764C21.3206 20.3785 21.292 20.4783 21.2397 20.566Z"
        fill="white"
      />
    </svg>
  );
}

type Criterion = {
  label: string;
  detail: string;
  passing: boolean;
  icon: ReactNode;
};

const criteria: Criterion[] = [
  {
    label: "Minimum Lot Size",
    detail: "6,127 sq ft meets 5,000",
    passing: true,
    icon: <CriterionPassIcon />,
  },
  {
    label: "State Land Use",
    detail: "Urban district - ADU",
    passing: true,
    icon: <CriterionPassIcon />,
  },
  {
    label: "City Zoning",
    detail: "1 - Verify ADU eligibility",
    passing: false,
    icon: <CriterionWarnIcon />,
  },
];

function CircleProgress({ score }: { score: number }) {
  const [animated, setAnimated] = useState(0);
  const radius = 70;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const offset = circumference - (animated / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: radius * 2, height: radius * 2 }}>
      <svg
        width={radius * 2}
        height={radius * 2}
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        className="-rotate-90"
      >
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4DB6AC" />
            <stop offset="100%" stopColor="#4DB6AC" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-white text-3xl font-bold leading-none">{score}%</span>
        <span className="text-slate-400 text-xs mt-1 tracking-wide">Your Score</span>
      </div>
    </div>
  );
}

export default function PropertyScorePage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#1a2a3a] via-[#1e3448] to-[#162534] px-4">
      <div className="flex flex-col w-full">
        <div className="">
          <Navbar />
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[400px] rounded-full bg-teal-400/10 blur-[130px]" />
        </div>

        <div className="relative w-full max-w-xl lg:max-w-3xl mx-auto px-6 py-10 flex flex-col items-center gap-8 pt-[120px]">
          <h1 className="text-white text-2xl font-bold tracking-tight text-center">
            Your Property Potential Score
          </h1>
          <div className="w-full overflow-y-auto scrollbar-thin scrollbar-track-transparent max-h-[calc(100vh-200px)] px-2">
            <div className="flex flex-col items-center gap-5 w-full">
              <CircleProgress score={80} />

              <div className="flex bg-[#2E7D3233]/20 rounded-full border border-[#2E7D32] py-[10px] px-[30px] items-center gap-2 text-[#2E7D32] text-xs font-medium">

                <p>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.45 10.95L11.7375 5.6625L10.6875 4.6125L6.45 8.85L4.3125 6.7125L3.2625 7.7625L6.45 10.95ZM7.5 15C6.4625 15 5.4875 14.8031 4.575 14.4094C3.6625 14.0156 2.86875 13.4812 2.19375 12.8062C1.51875 12.1312 0.984375 11.3375 0.590625 10.425C0.196875 9.5125 0 8.5375 0 7.5C0 6.4625 0.196875 5.4875 0.590625 4.575C0.984375 3.6625 1.51875 2.86875 2.19375 2.19375C2.86875 1.51875 3.6625 0.984375 4.575 0.590625C5.4875 0.196875 6.4625 0 7.5 0C8.5375 0 9.5125 0.196875 10.425 0.590625C11.3375 0.984375 12.1312 1.51875 12.8062 2.19375C13.4812 2.86875 14.0156 3.6625 14.4094 4.575C14.8031 5.4875 15 6.4625 15 7.5C15 8.5375 14.8031 9.5125 14.4094 10.425C14.0156 11.3375 13.4812 12.1312 12.8062 12.8062C12.1312 13.4812 11.3375 14.0156 10.425 14.4094C9.5125 14.8031 8.5375 15 7.5 15Z" fill="#69AF6C" />
                  </svg>

                </p>
                <p className="text-[14px] leading-[16px]">

                  Eligible
                </p>
              </div>

              <div className="w-full max-w-sm">
                <div className="text-slate-300 text-sm text-center leading-relaxed">
                  Excellent news. Your lot meets all primary zoning criteria. You are well-positioned to
                  maximize property value through an ADU addition.
                  Excellent news. Your lot meets all primary zoning criteria. You are well-positioned to
                  maximize property value through an ADU addition.

                </div>
              </div>
            </div>

            <div className="w-full h-px bg-white/10 my-5" />

            <div className="grid grid-cols-3 gap-3 w-full pb-4">
              {criteria.map((c) => (
                <div
                  key={c.label}
                  className={`flex items-center gap-3 border rounded-xl px-4 py-4 ${c.passing
                      ? "bg-white/5 border-[#2E7D32]/60"
                      : "bg-orange-500/10 border-orange-500/50"
                    }`}
                >
                  <div className="flex-shrink-0 flex items-center justify-center [&_svg]:block">
                    {c.icon}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-white text-[13px] font-semibold leading-tight">
                      {c.label}
                    </span>
                    <span
                      className={`text-[11px] mt-1 leading-tight ${c.passing ? "text-slate-400" : "text-orange-400"
                        }`}
                    >
                      {c.detail}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => router.push("/steps/step-3")}
            className="
            w-full py-4 rounded-full
            bg-teal-400 hover:bg-teal-300
            text-slate-900 font-semibold text-sm tracking-wide
            flex items-center justify-center gap-2
            transition-all duration-200 active:scale-[0.98]
            shadow-lg shadow-teal-400/20
          ">
            Continue My Build Path
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          <StepFooter currentStep={2} />

        </div>
      </div>
    </div>
  );
}