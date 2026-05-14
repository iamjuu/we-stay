"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/app/components/navbar/navbar";
import { StepFooter } from "../components/step-footer";
import { useEligibilitySession } from "@/app/context/eligibility-session";
import { useJourneyProgress, useWizardRouteGuard } from "@/app/context/journey-progress";
import { flowIndexFromPath, nextWizardPath, prevWizardPath } from "@/lib/wizard-flow";
import type { EligibilityGate } from "@/lib/eligibility-gates";
import type { FullEligibilityResult } from "@/lib/eligibility-gates";
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

function CriterionFailIcon() {
  return (
    <svg width={30} height={30} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="30" height="30" rx="15" fill="#C62828" />
      <path d="M11 11L19 19M19 11L11 19" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function gateDetail(gate: EligibilityGate): string {
  const base = gate.message?.trim() || "";
  const extra = gate.details?.trim();
  if (extra) return `${base} ${extra}`.trim();
  return base || "—";
}

function eligibilityScorePercent(result: FullEligibilityResult): number {
  const n = result.gates.length;
  if (n === 0) return 0;
  return Math.round((result.passCount / n) * 100);
}

function summaryCopy(address: string, result: FullEligibilityResult): string {
  if (result.status === "ELIGIBLE") {
    return "Excellent news. Your lot meets all primary zoning criteria. You are well-positioned to maximize property value through an ADU addition.";
  }
  if (result.status === "NEEDS_REVIEW") {
    return "Needs review. Your lot does not fully meet primary zoning criteria. Further assessment is required before planning an ADU.";
  }
  const short = address.split(",")[0]?.trim() || "This property";
  return `Based on preliminary screening, ${short} may face significant eligibility constraints. Review failed gates below and consult DPP before proceeding.`;
}

function StatusBadge({ result }: { result: FullEligibilityResult }) {
  if (result.status === "ELIGIBLE") {
    return (
      <div className="flex items-center gap-2 rounded-full border border-[#2E7D32] bg-[#2E7D3233]/20 px-[30px] py-[10px] text-[14px] font-medium leading-4 text-[#69AF6C]">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path
            d="M6.45 10.95L11.7375 5.6625L10.6875 4.6125L6.45 8.85L4.3125 6.7125L3.2625 7.7625L6.45 10.95ZM7.5 15C6.4625 15 5.4875 14.8031 4.575 14.4094C3.6625 14.0156 2.86875 13.4812 2.19375 12.8062C1.51875 12.1312 0.984375 11.3375 0.590625 10.425C0.196875 9.5125 0 8.5375 0 7.5C0 6.4625 0.196875 5.4875 0.590625 4.575C0.984375 3.6625 1.51875 2.86875 2.19375 2.19375C2.86875 1.51875 3.6625 0.984375 4.575 0.590625C5.4875 0.196875 6.4625 0 7.5 0C8.5375 0 9.5125 0.196875 10.425 0.590625C11.3375 0.984375 12.1312 1.51875 12.8062 2.19375C13.4812 2.86875 14.0156 3.6625 14.4094 4.575C14.8031 5.4875 15 6.4625 15 7.5C15 8.5375 14.8031 9.5125 14.4094 10.425C14.0156 11.3375 13.4812 12.1312 12.8062 12.8062C12.1312 13.4812 11.3375 14.0156 10.425 14.4094C9.5125 14.8031 8.5375 15 7.5 15Z"
            fill="#69AF6C"
          />
        </svg>
        Eligible
      </div>
    );
  }
  if (result.status === "NEEDS_REVIEW") {
    return (
      <div className="flex items-center gap-2 rounded-full border border-amber-500/70 bg-amber-500/15 px-[30px] py-[10px] text-[14px] font-medium leading-4 text-amber-200">
        Needs review
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 rounded-full border border-red-500/70 bg-red-500/15 px-[30px] py-[10px] text-[14px] font-medium leading-4 text-red-200">
      Not eligible
    </div>
  );
}

function GateCard({ gate }: { gate: EligibilityGate }) {
  const isPass = gate.status === "pass";
  const isFlag = gate.status === "flag";
  const isFail = gate.status === "fail";
  const isPending = gate.status === "pending";

  const icon =
    isPass ? (
      <CriterionPassIcon />
    ) : isFail ? (
      <CriterionFailIcon />
    ) : (
      <CriterionWarnIcon />
    );

  const shell = isPass
    ? "bg-white/95 border-slate-200"
    : isFail
      ? "bg-red-50/95 border-red-200"
      : isFlag
        ? "bg-amber-50/95 border-amber-200"
        : "bg-white/90 border-slate-200";

  const titleClass =
    isPass ? "text-slate-900" : isFail ? "text-red-900" : isFlag ? "text-amber-950" : "text-slate-600";

  const detailClass =
    isPass ? "text-slate-600" : isFail ? "text-red-800/90" : isFlag ? "text-amber-900/90" : "text-slate-500";

  return (
    <div
      className={`flex min-h-[88px] items-center gap-3 rounded-xl border px-4 py-4 ${shell}`}
    >
      <div className="flex flex-shrink-0 items-center justify-center [&_svg]:block">{icon}</div>
      <div className="flex min-w-0 flex-col">
        <span className={`text-[13px] font-semibold leading-tight ${titleClass}`}>{gate.name}</span>
        <span className={`mt-1 text-[11px] leading-tight ${detailClass}`}>{gateDetail(gate)}</span>
        {isPending && (
          <span className="mt-0.5 text-[10px] uppercase tracking-wide text-slate-500">Pending data</span>
        )}
      </div>
    </div>
  );
}

function CircleProgress({
  score,
  gradientId,
  status,
}: {
  score: number;
  gradientId: string;
  status: FullEligibilityResult["status"];
}) {
  const [animated, setAnimated] = useState(0);
  const radius = 70;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const offset = circumference - (animated / 100) * circumference;
  const markerDeg = (animated / 100) * 360;
  const ringStops =
    status === "NEEDS_REVIEW"
      ? { from: "#E65100", mid: "#FF8A4B", to: "#E65100" }
      : { from: "#4DB6AC", mid: "#35AEA2", to: "#26A69A" };

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
        aria-hidden
      >
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke="rgba(15,23,42,0.12)"
          strokeWidth={stroke}
        />
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
        />
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%" gradientTransform="rotate(320.92)">
            <stop offset="18.07%" stopColor={ringStops.from} />
            <stop offset="50.05%" stopColor={ringStops.mid} />
            <stop offset="82.03%" stopColor={ringStops.to} />
          </linearGradient>
        </defs>
      </svg>
      <div
        className="pointer-events-none absolute rounded-full"
        style={{
          width: 15.00000286102295,
          height: 15.00000286102295,
          border: "1.5px solid #FFFFFFB2",
          backgroundColor: status === "NEEDS_REVIEW" ? "#E65100" : "#4DB6AC",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) rotate(${markerDeg}deg) translateY(-${normalizedRadius}px)`,
          transition: "transform 1.2s cubic-bezier(0.4,0,0.2,1)",
        }}
      />
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-bold leading-none text-slate-900">{score}%</span>
        <span className="mt-1 text-xs tracking-wide text-slate-500">Your Score</span>
      </div>
    </div>
  );
}

export default function PropertyScorePage() {
  const router = useRouter();
  const pathname = usePathname();
  const flowIdx = flowIndexFromPath(pathname) ?? 1;
  const { maxNavIndex, recordFlowComplete } = useJourneyProgress();
  useWizardRouteGuard(flowIdx);
  const gradientId = useId().replace(/:/g, "");
  const { snapshot, hydrated } = useEligibilitySession();
  const [continueLoading, setContinueLoading] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!snapshot) {
      router.replace("/");
    }
  }, [hydrated, snapshot, router]);

  const score = useMemo(
    () => (snapshot ? eligibilityScorePercent(snapshot.eligibilityResult) : 0),
    [snapshot]
  );

  const result = snapshot?.eligibilityResult;

  if (!hydrated) {
    return (
      <div className="flex h-dvh max-h-dvh items-center justify-center overflow-hidden bg-transparent">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-teal-400 border-t-transparent" />
      </div>
    );
  }

  if (!snapshot || !result) {
    return null;
  }

  const addressLine = snapshot.address;
  const summary = summaryCopy(addressLine, result);

  return (
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-transparent">
      <Navbar />

      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
        <div className="h-[400px] w-[500px] rounded-full bg-teal-400/10 blur-[130px]" />
      </div>

      {/* Results scroll only between navbar and CTA — full page does not scroll */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div className="scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain px-4 pb-2 pt-24 sm:px-6 sm:pt-32">
          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-6 py-6 sm:py-8">
            <h1 className="text-center font-dm-sans text-2xl font-bold tracking-tight text-slate-900">
              Your Property Potential
            </h1>

            <p className="max-w-3xl text-balance px-2 text-center font-dm-sans text-sm leading-snug text-slate-600 sm:text-base md:text-lg">
              {addressLine}
            </p>

            <div className="flex w-full flex-col items-center gap-5">
              <CircleProgress score={score} gradientId={gradientId} status={result.status} />
              <StatusBadge result={result} />
              <p className="max-w-xl text-center font-dm-sans text-sm leading-relaxed text-slate-600">{summary}</p>
            </div>

            <div className="my-2 h-px w-full max-w-4xl bg-slate-300/70" />

            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {result.gates.map((gate) => (
                <GateCard key={gate.id} gate={gate} />
              ))}
            </div>

            {result.aduSize && (
              <div className="w-full max-w-4xl rounded-xl border border-slate-200 bg-white/95 px-5 py-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-400/15">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V9.5Z" stroke="#4DB6AC" strokeWidth="1.8" strokeLinejoin="round"/>
                      <path d="M9 21V15H15V21" stroke="#4DB6AC" strokeWidth="1.8" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-dm-sans text-sm font-bold text-slate-900">Maximum ADU Size</span>
                    <span className="font-dm-sans text-sm text-slate-700">
                      <span className="font-semibold text-[#4DB6AC]">{result.aduSize.maxAduSizeSqFt.toLocaleString()} sq ft</span>
                      {' '}based on lot size
                    </span>
                  </div>
                </div>
                {result.aduSize.sizeNote ? (
                  <div className="mt-3 flex items-center gap-2 rounded-full border border-orange-500 bg-[#E6510033] px-4 py-2">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <circle cx="7" cy="7" r="6" stroke="#f97316" strokeWidth="1.4"/>
                      <path d="M7 4.5V7.5" stroke="#f97316" strokeWidth="1.4" strokeLinecap="round"/>
                      <circle cx="7" cy="9.5" r="0.7" fill="#f97316"/>
                    </svg>
                    <span className="font-dm-sans text-xs text-slate-800">{result.aduSize.sizeNote}</span>
                  </div>
                ) : null}
              </div>
            )}

            {result.flagCount > 0 && (
              <div className="flex w-full max-w-4xl items-start gap-3 rounded-lg border border-orange-500/45 bg-[#E6510033] px-4 py-3">
                <CriterionWarnIcon />
                <p className="font-dm-sans text-sm leading-snug text-orange-100/95">
                  Additional verification required for flagged requirements
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 border-t border-slate-200/90 bg-[#f2f0ec]/95 px-4 pt-3 backdrop-blur-md pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-3">
            <button
              type="button"
              disabled={continueLoading}
              onClick={async () => {
                setContinueLoading(true);
                try {
                  await recordFlowComplete(1);
                  router.push("/steps/step-3");
                } catch {
                  setContinueLoading(false);
                }
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-teal-400 py-4 text-sm font-semibold tracking-wide text-slate-900 shadow-lg shadow-teal-400/20 transition-all duration-200 hover:bg-teal-300 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {continueLoading ? (
                <>
                  <svg className="h-4 w-4 shrink-0 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Continuing…
                </>
              ) : (
                <>
                  Continue My Build Path
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
              currentStep={3}
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
