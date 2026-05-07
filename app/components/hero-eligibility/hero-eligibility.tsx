'use client';

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import AddressInput, { type AddressInputHandle } from '@/components/AddressInput';
import CtaButton from '@/app/components/ctaButton/ctaButton';
import RequirementsReviewModal from '@/app/components/requirements-review-modal/requirements-review-modal';
import { useEligibilitySession } from '@/app/context/eligibility-session';
import { runEligibilityPipeline } from '@/lib/eligibility-pipeline';

export default function HeroEligibility() {
  const router = useRouter();
  const addressRef = useRef<AddressInputHandle>(null);
  const { setSnapshot, clearSnapshot } = useEligibilitySession();

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

      setSnapshot({
        address: outcome.address,
        eligibilityResult: outcome.eligibilityResult,
        rentalData: outcome.rentalData,
        computedAt: Date.now(),
      });
    },
    [clearSnapshot, setSnapshot]
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

  const handleGamePlan = useCallback(() => {
    router.push('/steps/step-1');
  }, [router]);

  return (
    <>
      <div className="flex w-full flex-col items-center gap-6 px-4">
        <div className="relative z-[100] w-full max-w-[570px]">
          <div
            className="flex w-full flex-col gap-3 rounded-full bg-black/50 p-2 shadow-[0px_3px_10px_0px_rgba(0,0,0,0.15)] backdrop-blur-2xl sm:flex-row sm:items-center sm:gap-4 sm:pl-5"
            data-node-id="11:8243"
          >
            <div className="min-w-0 flex-1">
              <AddressInput
                ref={addressRef}
                onAddressSelect={handleAddressSelect}
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

        {inlineError && (
          <p className="max-w-[570px] text-center font-dm-sans text-sm text-red-300 md:text-left">
            {inlineError}
          </p>
        )}
        <p className="section-paragraph text-center  max-w-[570px]  font-[400] font-dm-sans text-white ">
          Check your ADU eligibility,
   
          explore your options, and
  
          move forward with
  
          guidance you can trust.
        </p>
      </div>
    </>
  );
}
