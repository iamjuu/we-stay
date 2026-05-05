'use client';

import { Loader2, Lock } from 'lucide-react';

type RequirementsReviewModalProps = {
  open: boolean;
  onClose: () => void;
  isRunning: boolean;
  errorMessage: string | null;
  issuesFoundCount: number | null;
  onGamePlan: () => void;
  /** Centered overlay vs. anchored under hero search (9px gap, light dim — no viewport blur) */
  variant?: 'centered' | 'below-anchor';
};

export default function RequirementsReviewModal({
  open,
  onClose,
  isRunning,
  errorMessage,
  issuesFoundCount,
  onGamePlan,
  variant = 'centered',
}: RequirementsReviewModalProps) {
  if (!open) return null;

  const showIssuesBadge =
    !isRunning && errorMessage === null && issuesFoundCount !== null && issuesFoundCount > 0;

  const panelInner = (
    <div className="relative overflow-hidden rounded-[24px] border border-white/15 bg-[#0c1420]/95 shadow-2xl ring-1 ring-white/10">
      <div className="relative px-6 pb-6 pt-8 text-center">
        {showIssuesBadge && (
          <div className="absolute right-5 top-5 flex items-center gap-1.5 rounded-lg border border-[#c45c2d]/80 bg-[#5c2a14]/90 px-3 py-1.5">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-orange-400/90 text-[11px] font-bold text-orange-200">
              !
            </span>
            <span className="text-[11px] font-semibold tracking-wide text-orange-100">
              {issuesFoundCount} ISSUES FOUND
            </span>
          </div>
        )}

        <h2
          id="requirements-review-title"
          className="font-dm-sans text-xl font-bold tracking-tight text-white sm:text-[22px]"
        >
          Requirements Review
        </h2>
        <p className="mx-auto mt-3 max-w-sm font-dm-sans text-sm leading-snug text-white/65">
          Review the following requirements. Items marked with ✘ or ⚠ need attention.
        </p>

        <div className="relative mx-auto mt-8 min-h-[180px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06]">
          <div className="relative flex min-h-[180px] flex-col items-center justify-center gap-4 px-6 py-10">
            {errorMessage ? (
              <p className="max-w-xs text-center font-dm-sans text-sm text-red-300">{errorMessage}</p>
            ) : (
              <>
                <div className="flex items-center gap-2 text-white">
                  <Lock className="h-6 w-6 shrink-0 opacity-90" strokeWidth={1.75} aria-hidden />
                  <span className="font-dm-sans text-sm font-medium leading-snug text-white/90">
                    Preparing your report — click the button below
                  </span>
                </div>

                <div className="flex items-center gap-2 font-dm-sans text-xs text-white/55">
                  {isRunning ? (
                    <>
                      <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
                      <span>Reviewing location details...</span>
                    </>
                  ) : (
                    <span>Ready when you are.</span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            disabled={isRunning || !!errorMessage}
            onClick={onGamePlan}
            className="mx-auto flex h-[52px] w-full max-w-[340px] items-center justify-center rounded-[26px] bg-[#ff6b5c] px-6 font-dm-sans text-[15px] font-semibold text-white shadow-lg transition-colors hover:bg-[#f45c4d] disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/50"
          >
            Build My ADU Game Plan
          </button>
          <button
            type="button"
            onClick={onClose}
            className="font-dm-sans text-sm text-white/50 underline-offset-2 hover:text-white/75 hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  if (variant === 'below-anchor') {
    return (
      <>
        <button
          type="button"
          className="fixed inset-0 z-[90] bg-black/40"
          aria-label="Close dialog"
          onClick={onClose}
        />
        <div
          className="absolute left-0 right-0 top-[calc(100%+9px)] z-[100] w-full max-h-[min(70vh,calc(100vh-120px))] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="requirements-review-title"
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
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close dialog"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg">{panelInner}</div>
    </div>
  );
}
