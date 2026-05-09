'use client';

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import AddressInput, { type AddressInputHandle } from '@/components/AddressInput';
import CtaButton from '@/app/components/ctaButton/ctaButton';
import RequirementsReviewModal from '@/app/components/requirements-review-modal/requirements-review-modal';
import { eligibilityInputMatchesSnapshot, useEligibilitySession } from '@/app/context/eligibility-session';
import { useJourneyProgress } from '@/app/context/journey-progress';
import { runEligibilityPipeline } from '@/lib/eligibility-pipeline';

export default function HeroEligibility() {
  const router = useRouter();
  const addressRef = useRef<AddressInputHandle>(null);
  const { snapshot, setSnapshot, clearSnapshot } = useEligibilitySession();
  const { mergeJourney, syncJourneyForPropertyAddress } = useJourneyProgress();

  const [modalOpen, setModalOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [issuesFoundCount, setIssuesFoundCount] = useState<number | null>(null);
  const [inlineError, setInlineError] = useState<string | null>(null);

  const runCheck = useCallback(
    async (rawAddress: string) => {
      const trimmed = rawAddress.trim();
      if (trimmed.length < 5) {
        setInlineError('Enter an Oʻahu address or pick one from suggestions.');
        return;
      }

      setInlineError(null);

      // Same query as last successful run — reopen modal instantly, skip pipeline / APIs
      if (snapshot && eligibilityInputMatchesSnapshot(trimmed, snapshot)) {
        const issues = snapshot.eligibilityResult.failCount + snapshot.eligibilityResult.flagCount;
        setIssuesFoundCount(issues);
        setErrorMessage(null);
        setModalOpen(true);
        return;
      }

      clearSnapshot();
      setModalOpen(true);
      setErrorMessage(null);
      setIssuesFoundCount(null);
      setIsRunning(true);

      const outcome = await runEligibilityPipeline(trimmed);
      setIsRunning(false);

      if (!outcome.ok) {
        setErrorMessage(outcome.error);
        setIssuesFoundCount(null);
        return;
      }

      const issues = outcome.eligibilityResult.failCount + outcome.eligibilityResult.flagCount;
      setIssuesFoundCount(issues);

      syncJourneyForPropertyAddress(trimmed);
      setSnapshot({
        address: outcome.address,
        submittedAddress: trimmed,
        eligibilityResult: outcome.eligibilityResult,
        rentalData: outcome.rentalData,
        computedAt: Date.now(),
      });
    },
    [clearSnapshot, setSnapshot, snapshot, syncJourneyForPropertyAddress]
  );

  const handleAddressSelect = useCallback(
    (address: string) => {
      void runCheck(address);
    },
    [runCheck]
  );

  const handleCheckClick = useCallback(() => {
    const v = addressRef.current?.getValue() ?? '';
    void runCheck(v);
  }, [runCheck]);

  const handleGamePlan = useCallback(async () => {
    if (snapshot) {
      await mergeJourney({ eligibilitySnapshot: snapshot });
    }
    router.push('/steps/step-1');
  }, [router, snapshot, mergeJourney]);

  return (
    <>
      <div className="flex w-full flex-col items-center gap-6 px-4">
        <div
          className={`relative z-[100] w-full mx-auto ${modalOpen ? 'mb-[128.1px] max-w-[1100px]' : 'max-w-[570px]'}`}
        >
          {/* Pill + modal stay centered (570); wide wrapper only reserves space for lg tagline */}
          <div className="relative mx-auto w-full max-w-[570px]">
            <div className="relative w-full">
              <div
                className="flex w-full flex-col gap-3 rounded-full bg-black/50 p-2 shadow-[0px_3px_10px_0px_rgba(0,0,0,0.15)] backdrop-blur-2xl sm:flex-row sm:items-center sm:gap-4 sm:pl-5"
                data-node-id="11:8243"
              >
                <div className="min-w-0 flex-1">
                  <AddressInput
                    ref={addressRef}
                    onAddressSelect={handleAddressSelect}
                    onEnterCheck={(t) => void runCheck(t)}
                    disabled={isRunning}
                    darkMode
                    hideHelperText
                    inputClassName="!rounded-none !border-0 !bg-transparent !ring-0 !shadow-none px-4 py-3 text-center text-[clamp(18px,4vw,22px)] font-light leading-[1.2] text-[#adadad] placeholder:text-[#adadad] focus:!ring-0 sm:px-0 sm:py-0 sm:text-left"
                  />
                </div>
                <CtaButton
                  buttonName="Check Eligibility"
                  disabled={isRunning}
                  onClick={handleCheckClick}
                />
              </div>

              <RequirementsReviewModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                isRunning={isRunning}
                errorMessage={errorMessage}
                issuesFoundCount={issuesFoundCount}
                onGamePlan={handleGamePlan}
                variant="below-anchor"
              />
            </div>

            {modalOpen && (
              <div
                aria-hidden
                className="pointer-events-none w-full shrink-0"
                style={{ minHeight: 'calc(369.903px + 9px)' }}
              />
            )}
          </div>

          {/* lg + modal open: absolutely positioned bottom-left — does not shift pill/modal */}
          <p
            className={`w-full font-dm-sans font-normal text-white text-pretty ${
              modalOpen
                ? 'mt-0 text-center lg:absolute lg:bottom-0 lg:-left-36 lg:z-[101] lg:mt-0 lg:max-w-[280px] lg:text-left xl:max-w-[300px]'
                : 'mt-5 text-center'
            }`}
            style={{
              fontSize: 'clamp(13px, 2.06vw, 17px)',
              lineHeight: 1.45,
              fontVariationSettings: "'opsz' 14",
            }}
          >
            Check your ADU eligibility, explore your options, and move forward with guidance you can trust.
          </p>
        </div>

        {inlineError && (
          <p className="max-w-[570px] text-center font-dm-sans text-sm text-red-300 md:text-left">
            {inlineError}
          </p>
        )}
      </div>
    </>
  );
}
