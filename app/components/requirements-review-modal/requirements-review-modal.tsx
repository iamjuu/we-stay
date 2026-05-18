'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { Loader2, X } from 'lucide-react';

const LOADING_PHASES = [
  'Reviewing location details',
  'Checking zoning',
  'Measuring property potential',
  'Preparing your report',
] as const;

/** Time each loading line stays on screen during the one-shot sequence. */
export const LOADING_ROTATE_MS = 1200;

type RequirementsReviewModalProps = {
  open: boolean;
  onClose: () => void;
  onGamePlan: () => void;
  /** While pipeline runs — blur overlay + loading indicator. */
  isRunning?: boolean;
  /** Set when runEligibilityPipeline fails — shows error; CTA disabled. */
  errorMessage?: string | null;
  /** Fired once after all `LOADING_PHASES` have been shown in order (no loop). */
  onLoadingSequenceComplete?: () => void;
  score?: number;
  variant?: 'centered' | 'below-anchor';
};

export default function RequirementsReviewModal({
  open,
  onClose,
  onGamePlan: _onGamePlan,
  isRunning = false,
  errorMessage = null,
  onLoadingSequenceComplete,
  score: _score = 60,
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

    setLoadingPhaseIndex(0);
    const period = LOADING_ROTATE_MS;
    const stepTimeouts: number[] = [];

    for (let step = 1; step < LOADING_PHASES.length; step++) {
      stepTimeouts.push(
        window.setTimeout(() => {
          setLoadingPhaseIndex(step);
        }, period * step)
      );
    }

    const doneId = window.setTimeout(() => {
      onLoadingSequenceComplete?.();
    }, period * LOADING_PHASES.length);

    return () => {
      stepTimeouts.forEach((id) => window.clearTimeout(id));
      window.clearTimeout(doneId);
    };
  }, [open, errorMessage, onLoadingSequenceComplete]);

  if (!open) return null;

  const panelInner = (
    <div
      className="relative flex w-full flex-col overflow-hidden rounded-[999px] border border-white/12 bg-black/60 px-5 pb-6 pt-6 shadow-lg sm:pt-10"
      style={{
        maxWidth: '643.568px',
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
        className="absolute right-2 top-2 z-20 flex size-9 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300/80"
        aria-label="Close"
      >
        <X className="size-5" strokeWidth={2} />
      </button>

      <div className="flex min-h-0 flex-1 flex-col">
        {errorMessage ? (
          <div
            className="rounded-[20px] border border-red-500/45 bg-red-950/35 px-3 py-3 text-[13px] leading-snug text-red-100"
            role="alert"
          >
            {errorMessage}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 px-2 py-2 text-center sm:gap-5">
            <Image
              src="/gif/house-statsnew.gif"
              alt=""
              width={168}
              height={168}
              unoptimized
              className="size-[140px] shrink-0 object-contain sm:size-[156px]"
              aria-hidden
            />
            <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
              <Loader2
                className="size-8 shrink-0 animate-spin text-white/90 sm:size-9"
                aria-hidden
              />
              <p
                className="font-dm-sans font-medium text-white"
                style={{
                  fontSize: 'clamp(15px, 2.8vw, 17px)',
                  lineHeight: 1.35,
                  fontVariationSettings: "'opsz' 14",
                }}
                aria-live="polite"
              >
                {LOADING_PHASES[loadingPhaseIndex]}
              </p>
            </div>
          </div>
        )}
      </div>

      <p className="sr-only">Eligibility complete. Continuing to your game plan shortly.</p>
    </div>
  );

  const dialogAriaBusy = !!isRunning && !errorMessage;

  if (variant === 'below-anchor') {
    return (
      <>
        <button
          type="button"
          className="pointer-events-auto fixed inset-0 z-90 bg-black/50"
          onClick={onClose}
          aria-label="Close"
        />
        {/* Mobile: fixed full-screen centred; sm+: anchored below input */}
        <div
          className="fixed inset-0 z-100 flex items-center justify-center px-4 sm:absolute sm:inset-auto sm:left-0 sm:right-0 sm:top-[calc(100%+9px)] sm:flex sm:w-full sm:justify-end sm:px-0"
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
