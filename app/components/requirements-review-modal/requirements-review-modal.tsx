'use client';

import { AlertTriangle, CheckCircle, Info, MapPin } from 'lucide-react';

type Requirement = {
  status: 'pass' | 'warning' | 'fail';
  title: string;
  description: string;
};

const requirements: Requirement[] = [
  {
    status: 'pass',
    title: 'Minimum Lot Size',
    description: '226,357 sq ft meets 3,500 sq ft minimum',
  },
  {
    status: 'warning',
    title: 'City Zoning',
    description:
      'F-1 – verify ADU eligibility with DPP\nNon-residential zone – verify ADU eligibility with DPP',
  },
];

type RequirementsReviewModalProps = {
  open: boolean;
  onClose: () => void;
  onGamePlan: () => void;
  score?: number;
  issuesFoundCount?: number;
  variant?: 'centered' | 'below-anchor';
};

export default function RequirementsReviewModal({
  open,
  onClose,
  onGamePlan,
  score = 60,
  issuesFoundCount = 3,
  variant = 'centered',
}: RequirementsReviewModalProps) {
  if (!open) return null;

  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * score) / 100;
  const knobDeg = (score / 100) * 360 - 90;

  const panelInner = (
    <div className="relative overflow-hidden rounded-[24px] border border-white/12 bg-[#0c1420] shadow-2xl">
      <div className="flex gap-0 px-[18px] pt-[18px]">

        {/* LEFT: Score Panel */}
        <div className="flex w-[32%] flex-col items-center justify-between gap-2.5 pb-4 pr-2 pt-1.5">

          {/* Location */}
          <div className="flex w-full items-start gap-1.5">
            <MapPin className="mt-0.5 size-3 shrink-0 text-white/35" />
            <p className="text-[10px] font-semibold uppercase leading-snug tracking-wider text-white/35">
              Arizona Memorial Pl, Hawaii<br />96701, USA
            </p>
          </div>

          {/* Score Ring */}
          <div className="relative flex items-center justify-center my-2">
            <svg width={140} height={140} viewBox="0 0 160 160">
              <circle cx={80} cy={80} r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth={10} fill="none" />
              <circle
                cx={80} cy={80} r={radius}
                stroke="#E65100" strokeWidth={10} fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform="rotate(-90 80 80)"
              />
            </svg>
            {/* Knob */}
            <div
              className="absolute size-3.5 rounded-full border-[2.5px] border-[#1c222c] bg-orange-400"
              style={{ top: '50%', left: '50%', transform: `translate(-50%,-50%) rotate(${knobDeg}deg) translateY(-${radius}px)` }}
            />
            {/* Center */}
            <div className="absolute text-center">
              <p className="text-2xl font-bold text-white leading-none">{score}%</p>
              <p className="mt-1 text-[11px] text-white/45">Your Score</p>
            </div>
          </div>

          {/* Needs Review Badge */}
          <div className="flex items-center gap-1.5 rounded-full border border-orange-600/50 bg-[#3a2016] px-3.5 py-1.5">
            <AlertTriangle className="size-3 text-orange-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400">
              Needs Review
            </span>
          </div>
        </div>

        {/* RIGHT: Content */}
        <div className="flex flex-1 flex-col gap-3 pl-4 pt-2">

          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-[20px] font-bold tracking-tight text-white">
                Requirements Review
              </h2>
              <p className="mt-1.5 max-w-[260px] text-[13px] leading-snug text-white/50">
                Review the following requirements. Items marked with ✘ or ⚠ need attention.
              </p>
            </div>
            {/* Issues badge */}
            <div className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-[10px] border border-orange-600/55 bg-orange-900/25 px-2.5 py-1.5">
              <Info className="size-3.5 text-[#FFA473]" />
              <div className="flex flex-col items-center leading-tight">
                <span className="text-[13px] font-bold text-[#FFA473]">{issuesFoundCount}</span>
                <span className="text-[9px] uppercase tracking-wider text-white/40">Issues Found</span>
              </div>
            </div>
          </div>

          {/* Requirement rows */}
          <div className="flex flex-col gap-2 pb-1">
            {requirements.map((req, i) => (
              <div
                key={i}
                className={`flex items-center gap-2.5 rounded-[10px] border border-white/8 bg-white/[0.05] px-3 py-2.5 ${
                  req.status === 'pass' ? 'border-l-[3px] border-l-green-500' : 'border-l-[3px] border-l-orange-500'
                }`}
              >
                <div className={`flex size-[30px] shrink-0 items-center justify-center rounded-full border ${
                  req.status === 'pass'
                    ? 'border-green-500/30 bg-green-500/15'
                    : 'border-orange-500/30 bg-orange-500/15'
                }`}>
                  {req.status === 'pass'
                    ? <CheckCircle className="size-4 text-green-400" />
                    : <AlertTriangle className="size-4 text-orange-400" />
                  }
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white">{req.title}</p>
                  <p className="mt-0.5 whitespace-pre-line text-[11px] leading-snug text-white/45">
                    {req.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-[18px] pb-[18px] pt-3.5">
        <button
          onClick={onGamePlan}
          className="w-full rounded-full py-3.5 text-[15px] font-bold text-white"
          style={{ background: 'linear-gradient(90deg,#E65100,#c44a00)' }}
        >
          Build My ADU Game Plan
        </button>
      </div>
    </div>
  );

  if (variant === 'below-anchor') {
    return (
      <>
        <button type="button" className="fixed inset-0 z-[90] bg-black/40" onClick={onClose} aria-label="Close" />
        <div className="absolute left-0 right-0 top-[calc(100%+9px)] z-[100] w-full overflow-y-auto" role="dialog" aria-modal="true">
          {panelInner}
        </div>
      </>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Close" />
      <div className="relative z-10 w-full max-w-lg">{panelInner}</div>
    </div>
  );
}