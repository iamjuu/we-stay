'use client';

import { useState, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import AddressInput from '@/components/AddressInput';
import ScorecardDisplay from '@/components/ScorecardDisplay';
import type { FullEligibilityResult } from '@/lib/eligibility-gates';
import { runEligibilityPipeline, type EligibilityRentalPayload } from '@/lib/eligibility-pipeline';

export default function ScorecardPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState<FullEligibilityResult | null>(null);
  const [address, setAddress] = useState<string>('');
  const [rentalData, setRentalData] = useState<EligibilityRentalPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runPipeline = useCallback(async (inputAddress: string) => {
    setEligibilityResult(null);
    setRentalData(null);
    setError(null);
    setIsRunning(true);
    setAddress('');

    const outcome = await runEligibilityPipeline(inputAddress);
    setIsRunning(false);

    if (!outcome.ok) {
      setError(outcome.error);
      return;
    }

    setAddress(outcome.address);
    setEligibilityResult(outcome.eligibilityResult);
    setRentalData(outcome.rentalData);
  }, []);

  return (
    <div className="min-h-screen bg-transparent py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Show Me What&apos;s Possible
            </h1>
            <Sparkles className="h-6 w-6 text-white shrink-0" aria-hidden strokeWidth={1.75} />
          </div>
          <p className="text-white/70">
            Enter your O&apos;ahu, Hawai&apos;i address
          </p>
        </div>

        {/* Address Input */}
        <div className="mb-6 sm:mb-8">
          <AddressInput
            onAddressSelect={runPipeline}
            disabled={isRunning}
            darkMode={true}
          />
        </div>

        {/* Loading State */}
        {isRunning && (
          <div className="text-center py-12 animate-fadeIn">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#42B0A8] border-t-transparent shadow-lg"></div>
            <p className="mt-4 text-white font-medium">Analyzing property eligibility...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-transparent border border-red-500 rounded-lg p-4 text-red-400 shadow-md animate-fadeIn">
            <p className="font-semibold">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Scorecard Display */}
        {eligibilityResult && !isRunning && (
          <div className="animate-fadeIn">
            <ScorecardDisplay
              result={eligibilityResult}
              address={address}
              zipCode={rentalData?.zipCode ?? null}
              rentals={rentalData?.rentals ?? null}
            />
          </div>
        )}
      </div>
    </div>
  );
}
