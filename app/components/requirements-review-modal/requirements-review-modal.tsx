'use client';

import Image from 'next/image';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

import { AlertTriangle, CheckCircle, Loader2, MapPin, X } from 'lucide-react';

type Requirement = {
  status: 'pass' | 'warning' | 'fail';
  title: string;
  description: string;
};

/** Static rows behind blur — illustrative only (not API data). */
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

const LOADING_PHASES = [
  'Reviewing location details',
  'Checking zoning',
  'Measuring property potential',
  'Preparing your report',
] as const;

const LOADING_ROTATE_MS = 2800;

/** Fake metrics behind blur — ticks for “data generating” feel. */
function GeneratingDataBackdrop() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setTick((n) => (n + 1) % 100000), 420);
    return () => window.clearInterval(id);
  }, []);
  const rows = [
    { label: 'PARCEL', seed: 1 },
    { label: 'ZONING', seed: 3 },
    { label: 'LOT SQFT', seed: 7 },
    { label: 'RENT IDX', seed: 11 },
  ] as const;
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-1.5 px-8 py-8 font-mono text-[9px] leading-tight text-[#F05C4A]/40">
      {rows.map(({ label, seed }, i) => (
        <div
          key={label}
          className="flex justify-between gap-3 motion-safe:animate-pulse"
          style={{ animationDelay: `${i * 180}ms`, animationDuration: '1.4s' }}
        >
          <span className="tracking-wider">{label}</span>
          <span className="tabular-nums opacity-80">
            {((tick + seed) * 7919) % 999999}
          </span>
        </div>
      ))}
    </div>
  );
}

type RequirementsReviewModalProps = {
  open: boolean;
  onClose: () => void;
  onGamePlan: () => void;
  /** While pipeline runs — blur overlay + loading indicator. */
  isRunning?: boolean;
  /** Set when runEligibilityPipeline fails — shows error; CTA disabled. */
  errorMessage?: string | null;
  /** Legacy — parent still passes it; status animation runs whenever the modal is open (no error). */
  gamePlanReady?: boolean;
  score?: number;
  variant?: 'centered' | 'below-anchor';
};

export default function RequirementsReviewModal({
  open,
  onClose,
  onGamePlan: _onGamePlan,
  isRunning = false,
  errorMessage = null,
  gamePlanReady: _gamePlanReadyProp,
  score = 60,
  variant = 'centered',
}: RequirementsReviewModalProps) {
  const [loadingPhaseIndex, setLoadingPhaseIndex] = useState(0);

  useEffect(() => {
    if (!open) {
      setLoadingPhaseIndex(0);
      return;
    }
    if (errorMessage) {
      setLoadingPhaseIndex(0);
      return;
    }
    const id = window.setInterval(() => {
      setLoadingPhaseIndex((i) => (i + 1) % LOADING_PHASES.length);
    }, LOADING_ROTATE_MS);
    return () => window.clearInterval(id);
  }, [open, errorMessage]);

  if (!open) return null;

  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * score) / 100;
  const knobDeg = (score / 100) * 360 - 90;

  const blurredBody = (
    <div className="flex min-h-[200px] w-full gap-0">
      <div className="flex w-[32%] shrink-0 flex-col items-center gap-2.5 pb-4 pr-2 pt-3">
        <div className="flex w-full items-start gap-1.5">
          <MapPin className="mt-0.5 size-3 shrink-0 text-white/35" />
          <p className="text-[10px] font-semibold uppercase leading-snug tracking-wider text-white/35">
            Arizona Memorial Pl, Hawaii<br />96701, USA
          </p>
        </div>
        <div className="relative my-1 flex items-center justify-center">
          <svg width={140} height={140} viewBox="0 0 160 160">
            <circle cx={80} cy={80} r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth={10} fill="none" />
            <circle
              cx={80}
              cy={80}
              r={radius}
              stroke="#E65100"
              strokeWidth={10}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 80 80)"
            />
          </svg>
          <div
            className="absolute size-3.5 rounded-full border-[2.5px] border-[#1c222c] bg-orange-400"
            style={{
              top: '50%',
              left: '50%',
              transform: `translate(-50%,-50%) rotate(${knobDeg}deg) translateY(-${radius}px)`,
            }}
          />
          <div className="absolute text-center">
            <p className="text-2xl font-bold leading-none text-white">{score}%</p>
            <p className="mt-1 text-[11px] text-white/45">Your Score</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-orange-600/50 bg-[#3a2016] px-3.5 py-1.5">
          <AlertTriangle className="size-3 text-orange-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400">
            Needs Review
          </span>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 pb-4 pl-4 pt-3">
        {requirements.map((req, i) => (
          <div
            key={i}
            className={`flex items-center gap-2.5 rounded-[10px] border border-white/8 bg-white/5 px-3 py-2.5 ${
              req.status === 'pass'
                ? 'border-l-[3px] border-l-green-500'
                : 'border-l-[3px] border-l-orange-500'
            }`}
          >
            <div
              className={`flex size-[30px] shrink-0 items-center justify-center rounded-full border ${
                req.status === 'pass'
                  ? 'border-green-500/30 bg-green-500/15'
                  : 'border-orange-500/30 bg-orange-500/15'
              }`}
            >
              {req.status === 'pass' ? (
                <CheckCircle className="size-4 text-green-400" />
              ) : (
                <AlertTriangle className="size-4 text-orange-400" />
              )}
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
  );

  const panelInner = (
    <div
      className="relative flex w-full flex-col overflow-hidden rounded-[16.72px] border border-white/12 p-[15.83px] backdrop-blur-2xl"
      style={{
        maxWidth: '643.568px',
        minHeight: '369.903px',
        backgroundColor: '#0C1B2A33',
        boxShadow: '4.18px 8.36px 16.72px 0px #0000001A',
      }}
    >
      <h2 id="requirements-review-title" className="sr-only">
        Requirements review
      </h2>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute right-2 top-2 z-20 flex size-9 items-center justify-center rounded-full text-white/85 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300/80"
        aria-label="Close"
      >
        <X className="size-5" strokeWidth={2} />
      </button>

      <div className="flex min-h-0 flex-1 flex-col">
        {errorMessage ? (
          <div
            className="rounded-[10px] border border-red-500/45 bg-red-950/35 px-3 py-3 text-[13px] leading-snug text-red-100"
            role="alert"
          >
            {errorMessage}
          </div>
        ) : (
          <div className="relative z-0 min-h-0 flex-1 overflow-hidden rounded-[12px]">
            {/* Orange ring + ticking “data” behind blurred preview */}
            <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-[12px]">
              <div className="absolute left-1/2 top-1/2 size-[min(72%,220px)] -translate-x-1/2 -translate-y-1/2">
                <div className="absolute inset-0 rounded-full border-2 border-white/[0.07]" aria-hidden />
                <div
                  className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#F05C4A] border-r-[#ff8a65]/90 motion-safe:animate-spin"
                  style={{ animationDuration: '2.4s' }}
                  aria-hidden
                />
                <div
                  className="absolute inset-[10px] rounded-full border border-dashed border-orange-500/25 motion-safe:animate-spin"
                  style={{ animationDuration: '4.5s', animationDirection: 'reverse' }}
                  aria-hidden
                />
              </div>
              <GeneratingDataBackdrop />
            </div>
            <div className="pointer-events-none relative z-[2] select-none blur-lg" aria-hidden>
              {blurredBody}
            </div>
            <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-black/25 px-5 pt-8 backdrop-blur-[2px]">
                <div className="flex w-full max-w-[min(100%,440px)] flex-col items-center justify-center gap-4 text-center">
                  <Image
                    src="/gif/house-stats.gif"
                    alt=""
                    width={112}
                    height={112}
                    unoptimized
                    className="size-[104px] shrink-0 rounded-lg object-contain sm:size-[112px]"
                    aria-hidden
                  />
                  <div className="flex flex-row items-center justify-center gap-2">
                    <Loader2
                      className="size-[18px] shrink-0 animate-spin text-white/90"
                      aria-hidden
                    />
                    <p
                      className="font-dm-sans font-medium text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]"
                      style={{
                        fontSize: '13.37px',
                        lineHeight: '18.39px',
                        fontVariationSettings: "'opsz' 14",
                      }}
                      aria-live="polite"
                    >
                      {LOADING_PHASES[loadingPhaseIndex]}
                    </p>
                  </div>
                </div>
              </div>
          </div>
        )}
      </div>

      <p className="sr-only">Eligibility complete. Continuing to your game plan shortly.</p>
    </div>
  );

  const dialogAriaBusy = !!isRunning && !errorMessage;

  if (variant === 'below-anchor') {
    const scrimMount =
      typeof document !== 'undefined'
        ? document.getElementById('home-hero-modal-scrim-mount')
        : null;

    const scrim = (
      <button
        type="button"
        className={
          scrimMount
            ? 'pointer-events-auto absolute inset-0 z-0 h-full w-full bg-black/50'
            : 'pointer-events-auto fixed inset-0 z-[90] bg-black/50'
        }
        onClick={onClose}
        aria-label="Close"
      />
    );

    return (
      <>
        {scrimMount ? createPortal(scrim, scrimMount) : scrim}
        <div
          className="absolute left-0 right-0 top-[calc(100%+9px)] z-[100] flex w-full justify-end overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="requirements-review-title"
          aria-busy={dialogAriaBusy}
        >
          {panelInner}
        </div>
      </>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="requirements-review-title"
      aria-busy={dialogAriaBusy}
    >
      <button type="button" className="absolute inset-0 bg-black/50" onClick={onClose} aria-label="Close" />
      <div className="relative z-10 mx-auto flex w-full max-w-[643.568px] justify-center px-2 sm:px-0">{panelInner}</div>
    </div>
  );
}
