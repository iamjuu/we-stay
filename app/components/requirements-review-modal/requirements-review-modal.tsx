'use client';

import Image from 'next/image';
import { createPortal } from 'react-dom';
import { useLayoutEffect, useRef, useState } from 'react';

import { AlertTriangle, CheckCircle, Info, Loader2, MapPin } from 'lucide-react';

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

type RequirementsReviewModalProps = {
  open: boolean;
  onClose: () => void;
  onGamePlan: () => void;
  /** While pipeline runs — blur overlay + spinner; CTA disabled. */
  isRunning?: boolean;
  /** Set when runEligibilityPipeline fails — shows error; CTA disabled. */
  errorMessage?: string | null;
  score?: number;
  issuesFoundCount?: number | null;
  variant?: 'centered' | 'below-anchor';
};

export default function RequirementsReviewModal({
  open,
  onClose,
  onGamePlan,
  isRunning = false,
  errorMessage = null,
  score = 60,
  issuesFoundCount = null,
  variant = 'centered',
}: RequirementsReviewModalProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const [subtitlePadLeft, setSubtitlePadLeft] = useState(0);

  useLayoutEffect(() => {
    if (!open) {
      setSubtitlePadLeft(0);
      return;
    }

    function getTextLeft(el: HTMLElement): number | null {
      const doc = el.ownerDocument;
      const walker = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const node = walker.nextNode() as Text | null;
      if (!node?.data?.length) return null;
      const r = doc.createRange();
      r.setStart(node, 0);
      r.setEnd(node, 0);
      return r.getBoundingClientRect().left;
    }

    function measure() {
      const titleEl = titleRef.current;
      const subEl = subtitleRef.current;
      if (!titleEl || !subEl) return;

      const titleLeft = getTextLeft(titleEl);

      // Zero dynamic padding before measuring subtitle base position,
      // then restore — prevents oscillation on resize.
      const savedPad = subEl.style.paddingLeft;
      subEl.style.paddingLeft = '0px';
      const subtitleLeft = getTextLeft(subEl);
      subEl.style.paddingLeft = savedPad;

      if (titleLeft == null || subtitleLeft == null) return;
      const next = Math.max(0, Math.round(titleLeft - subtitleLeft));
      setSubtitlePadLeft((prev) => (prev === next ? prev : next));
    }

    measure();
    window.addEventListener('resize', measure);

    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      if (titleRef.current) ro.observe(titleRef.current);
    }

    return () => {
      window.removeEventListener('resize', measure);
      ro?.disconnect();
    };
  }, [open]);

  if (!open) return null;

  const pipelineOk = !isRunning && !errorMessage;
  const ctaDisabled = isRunning || !!errorMessage;

  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * score) / 100;
  const knobDeg = (score / 100) * 360 - 90;

  const badgeIssuesText =
    typeof issuesFoundCount === 'number'
      ? `${issuesFoundCount} ISSUES FOUND`
      : isRunning
        ? 'CHECKING…'
        : '—';

  const blurredBody = (
    <div className="flex min-h-[200px] w-full gap-0">
      {/* LEFT — score strip (same visual weight as before; blurred with the body) */}
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

      {/* RIGHT — static requirement rows (illustrative) */}
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
      className="relative   isolate flex w-full flex-col  overflow-hidden rounded-[16.72px] border border-white/12 p-[15.83px] backdrop-blur-2xl"
      style={{
        maxWidth: '643.568px',
        minHeight: '369.903px',
        backgroundColor: '#0C1B2A33',
        boxShadow: '4.18px 8.36px 16.72px 0px #0000001A',
      }}
    >
      {/* Title stays right-aligned in column like original; subtitle block anchors right (ms-auto), lines wrap with text-left */}
      <div className="flex w-full shrink-0 flex-wrap items-start justify-end gap-[16.72px]">
        <div className="min-w-0 max-w-[calc(100%-8rem)] text-right">
          <h2
            ref={titleRef}
            id="requirements-review-title"
            className="font-dm-sans font-medium tracking-normal text-right text-white"
            style={{
              fontSize: '20.06px',
              lineHeight: '16.72px',
              letterSpacing: '0px',
              fontVariationSettings: "'opsz' 14",
            }}
          >
            Requirements Review
          </h2>
          <p
            ref={subtitleRef}
            className="font-dm-sans mt-2 max-w-[340px] text-left font-normal tracking-normal"
            style={{
              fontSize: '13.37px',
              lineHeight: '18.39px',
              letterSpacing: '0px',
              color: '#C4C7C8',
              fontVariationSettings: "'opsz' 14",
              paddingLeft: subtitlePadLeft,
            }}
          >
            Review the following requirements. Items marked with ✗ or ⚠ need attention.
          </p>
        </div>
        <div
          className="inline-flex h-[31.701px] min-w-fit shrink-0 cursor-default items-center gap-[8.36px] rounded-[10.03px] border border-[#E65100] px-[10.03px] py-[3.34px]"
          style={{ backgroundColor: '#E6510033' }}
          aria-live="polite"
        >
          <span className="inline-flex size-[18px] shrink-0 items-center justify-center rounded-full border border-[#E65100]/90 bg-transparent text-[#FFA473]">
            <Info className="size-[11px]" strokeWidth={2.25} aria-hidden />
          </span>
          <span
            className="font-dm-sans font-semibold tracking-wide whitespace-nowrap text-[#FFA473]"
            style={{ fontSize: '11px', lineHeight: '14px', fontVariationSettings: "'opsz' 14" }}
          >
            {badgeIssuesText}
          </span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        {errorMessage ? (
          <div
            className="rounded-[10px] border border-red-500/45 bg-red-950/35 px-3 py-3 text-[13px] leading-snug text-red-100"
            role="alert"
          >
            {errorMessage}
          </div>
        ) : (
          <div className="relative min-h-0 flex-1 overflow-hidden">
            <div className="pointer-events-none select-none blur-lg" aria-hidden>
              {blurredBody}
            </div>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-[16px] bg-black/8 px-5">
              <div className="flex max-w-[min(100%,400px)] flex-row flex-wrap items-center justify-center gap-3 gap-y-2 text-center">
                <Image
                  src="/images/Lock-icon.svg"
                  alt=""
                  width={17}
                  height={21}
                  className="shrink-0"
                  unoptimized
                  aria-hidden
                />
                <p
                  className="font-dm-sans font-medium text-white"
                  style={{
                    fontSize: '13.37px',
                    lineHeight: '18.39px',
                    fontVariationSettings: "'opsz' 14",
                  }}
                >
                  Preparing your report click the below button
                </p>
              </div>
              {isRunning ? (
                <p className="font-dm-sans flex items-center justify-center gap-[7.52px] text-[13px] text-white/90" style={{ fontVariationSettings: "'opsz' 14" }}>
                  <Loader2 className="size-[18px] shrink-0 animate-spin" aria-hidden />
                  Reviewing location details...
                </p>
              ) : pipelineOk ? (
                <span className="sr-only">Eligibility check complete.</span>
              ) : null}
            </div>
          </div>
        )}
      </div>

      <div className="flex shrink-0 justify-end  px-[20px] pt-[6px]">
        <button

          type="button"
          onClick={() => {
            if (!ctaDisabled) onGamePlan();
          }}
          disabled={ctaDisabled}
          style={{
            fontFamily: 'DM Sans, sans-serif',
            background: '#F05C4AE5',
            height: '42px',
          }}
          className={`inline-flex max-w-[392.082px] w-auto items-center justify-center gap-[1.88px] leading-[27px] rounded-[30px] px-[55px] py-[7px] font-dm-sans text-[14px] font-bold leading-none text-white transition-opacity ${
            ctaDisabled ? 'cursor-not-allowed opacity-45' : 'cursor-pointer hover:opacity-95'
          }`}
        >
          Build My ADU Game Plan
        </button>
      </div>
    </div>
  );

  const dialogAriaBusy = isRunning;

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
