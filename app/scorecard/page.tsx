'use client';

import { useState, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import AddressInput from '@/components/AddressInput';
import ScorecardDisplay from '@/components/ScorecardDisplay';
import {
  GeocodeData,
  ParcelData,
  ZoningData,
  FloodData,
  AssessorData,
  RegridData,
  SMAData,
  WaterData,
  SewerData,
  RailData,
  PermitData,
} from '@/components/PipelineSteps';
import { evaluateAllGates, FullEligibilityResult } from '@/lib/eligibility-gates';
import {
  mapGeocodeFullFromApi,
  mapParcelFromApi,
  mapRegridFromApi,
  mapZoningFromApi,
  mapFloodFromApi,
  mapAssessorFromApi,
  mapSmaFromApi,
  mapWaterFromApi,
  mapSewerFromApi,
  mapRailFromApi,
  mapPermitFromApi,
  mapRentFromApi,
  type RentalEstimateRow,
} from '@/lib/pipeline-api-mapper';

// Helper Functions for API Calls
async function fetchGeocode(address: string) {
  const startTime = performance.now();
  const res = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);
  const json = await res.json();
  return {
    ...json,
    responseTime: Math.round(performance.now() - startTime),
  };
}

async function fetchParcel(lat: number, lng: number) {
  const startTime = performance.now();
  const res = await fetch(`/api/parcel?lat=${lat}&lng=${lng}`);
  const json = await res.json();
  return {
    ...json,
    responseTime: Math.round(performance.now() - startTime),
  };
}

async function fetchRegrid(tmk: string) {
  const startTime = performance.now();
  const res = await fetch(`/api/regrid?tmk=${encodeURIComponent(tmk)}`);
  const json = await res.json();
  return {
    ...json,
    responseTime: Math.round(performance.now() - startTime),
  };
}

async function fetchZoning(lat: number, lng: number) {
  const startTime = performance.now();
  const res = await fetch(`/api/zoning?lat=${lat}&lng=${lng}`);
  const json = await res.json();
  return {
    ...json,
    responseTime: Math.round(performance.now() - startTime),
  };
}

async function fetchFlood(lat: number, lng: number) {
  const startTime = performance.now();
  const res = await fetch(`/api/flood?lat=${lat}&lng=${lng}`);
  const json = await res.json();
  return {
    ...json,
    responseTime: Math.round(performance.now() - startTime),
  };
}

async function fetchAssessor(tmk: string) {
  const startTime = performance.now();
  const res = await fetch(`/api/assessor?tmk=${encodeURIComponent(tmk)}`);
  const json = await res.json();
  return {
    ...json,
    responseTime: Math.round(performance.now() - startTime),
  };
}

async function fetchSMA(lat: number, lng: number) {
  const startTime = performance.now();
  const res = await fetch(`/api/sma?lat=${lat}&lng=${lng}`);
  const json = await res.json();
  return {
    ...json,
    responseTime: Math.round(performance.now() - startTime),
  };
}

async function fetchWater(lat: number, lng: number) {
  const startTime = performance.now();
  const res = await fetch(`/api/water?lat=${lat}&lng=${lng}`);
  const json = await res.json();
  return {
    ...json,
    responseTime: Math.round(performance.now() - startTime),
  };
}

async function fetchSewer(lat: number, lng: number) {
  const startTime = performance.now();
  const res = await fetch(`/api/sewer?lat=${lat}&lng=${lng}`);
  const json = await res.json();
  return {
    ...json,
    responseTime: Math.round(performance.now() - startTime),
  };
}

async function fetchRail(lat: number, lng: number) {
  const startTime = performance.now();
  const res = await fetch(`/api/rail?lat=${lat}&lng=${lng}`);
  const json = await res.json();
  return {
    ...json,
    responseTime: Math.round(performance.now() - startTime),
  };
}

async function fetchPermit(tmk: string) {
  const startTime = performance.now();
  const res = await fetch(`/api/permit?tmk=${encodeURIComponent(tmk)}`);
  const json = await res.json();
  return {
    ...json,
    responseTime: Math.round(performance.now() - startTime),
  };
}

async function fetchRent(zipCode: string) {
  const startTime = performance.now();
  const res = await fetch(`/api/rent?zipCode=${encodeURIComponent(zipCode)}`);
  const json = await res.json();
  return {
    ...json,
    responseTime: Math.round(performance.now() - startTime),
  };
}

// Helper to extract zip code from address
function extractZipCode(addressComponents: any[]): string | null {
  if (!addressComponents) return null;
  const zipComponent = addressComponents.find(component =>
    component.types.includes('postal_code')
  );
  return zipComponent?.short_name || null;
}

export default function ScorecardPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState<FullEligibilityResult | null>(null);
  const [address, setAddress] = useState<string>('');
  const [rentalData, setRentalData] = useState<{ zipCode: string; rentals: RentalEstimateRow[] } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const runPipeline = useCallback(
    async (inputAddress: string) => {
      setEligibilityResult(null);
      setRentalData(null);
      setError(null);
      setIsRunning(true);
      setAddress('');

      let geocodeData: GeocodeData | null = null;
      let parcelData: ParcelData | null = null;
      let regridData: RegridData | null = null;
      let zoningData: ZoningData | null = null;
      let floodData: FloodData | null = null;
      let assessorData: AssessorData | null = null;
      let smaData: SMAData | null = null;
      let waterData: WaterData | null = null;
      let sewerData: SewerData | null = null;
      let railData: RailData | null = null;
      let permitData: PermitData | null = null;

      try {
        // Sequential: Geocoding → Parcel
        const geocodeResult = await fetchGeocode(inputAddress);
        const geoMapped = mapGeocodeFullFromApi(geocodeResult);
        if (!geoMapped) {
          const msg =
            geocodeResult &&
            typeof geocodeResult === 'object' &&
            'error' in geocodeResult &&
            geocodeResult.error != null
              ? String(geocodeResult.error)
              : 'Geocoding failed';
          throw new Error(msg);
        }

        geocodeData = geoMapped.display;
        setAddress(geocodeData.formattedAddress);

        const zipCode = extractZipCode(geoMapped.addressComponents as { types: string[]; short_name?: string }[]);
        if (zipCode) {
          const rentResult = await fetchRent(zipCode);
          const rentMapped = mapRentFromApi(rentResult);
          if (rentMapped) setRentalData(rentMapped);
        }

        const parcelResult = await fetchParcel(geocodeData.lat, geocodeData.lng);
        const parcelMapped = mapParcelFromApi(parcelResult);
        if (!parcelMapped) {
          throw new Error(parcelResult.error || 'Parcel lookup failed');
        }

        parcelData = parcelMapped;

        // Parallel: All other API calls
        const [
          regridResult,
          zoningResult,
          floodResult,
          assessorResult,
          smaResult,
          waterResult,
          sewerResult,
          railResult,
          permitResult,
        ] = await Promise.allSettled([
          fetchRegrid(parcelData.tmk),
          fetchZoning(geocodeData.lat, geocodeData.lng),
          fetchFlood(geocodeData.lat, geocodeData.lng),
          parcelData.qpublicTmk ? fetchAssessor(parcelData.qpublicTmk) : Promise.reject(new Error('No TMK')),
          fetchSMA(geocodeData.lat, geocodeData.lng),
          fetchWater(geocodeData.lat, geocodeData.lng),
          fetchSewer(geocodeData.lat, geocodeData.lng),
          fetchRail(geocodeData.lat, geocodeData.lng),
          fetchPermit(parcelData.tmk),
        ]);

        if (regridResult.status === 'fulfilled') {
          regridData = mapRegridFromApi(regridResult.value);
        }

        if (zoningResult.status === 'fulfilled') {
          zoningData = mapZoningFromApi(zoningResult.value);
        }

        if (floodResult.status === 'fulfilled') {
          floodData = mapFloodFromApi(floodResult.value);
        }

        if (assessorResult.status === 'fulfilled') {
          assessorData = mapAssessorFromApi(assessorResult.value);
        }

        if (smaResult.status === 'fulfilled') {
          smaData = mapSmaFromApi(smaResult.value);
        }

        if (waterResult.status === 'fulfilled') {
          waterData = mapWaterFromApi(waterResult.value);
        }

        if (sewerResult.status === 'fulfilled') {
          sewerData = mapSewerFromApi(sewerResult.value);
        }

        if (railResult.status === 'fulfilled') {
          railData = mapRailFromApi(railResult.value);
        }

        if (permitResult.status === 'fulfilled') {
          permitData = mapPermitFromApi(permitResult.value);
        }

        // Evaluate all 11 gates
        const result = evaluateAllGates(
          regridData,
          zoningData,
          floodData,
          parcelData,
          smaData,
          waterData,
          sewerData,
          railData,
          permitData,
          assessorData
        );

        setEligibilityResult(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsRunning(false);
      }
    },
    []
  );

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
