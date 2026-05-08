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

function extractZipCode(
  addressComponents: { types: string[]; short_name?: string }[] | undefined
): string | null {
  if (!addressComponents) return null;
  const zipComponent = addressComponents.find(component =>
    component.types.includes('postal_code')
  );
  return zipComponent?.short_name || null;
}

export type EligibilityRentalPayload = {
  zipCode: string;
  rentals: RentalEstimateRow[];
};

export type EligibilityPipelineSuccess = {
  ok: true;
  address: string;
  eligibilityResult: FullEligibilityResult;
  rentalData: EligibilityRentalPayload | null;
};

export type EligibilityPipelineFailure = {
  ok: false;
  error: string;
};

export type EligibilityPipelineOutcome = EligibilityPipelineSuccess | EligibilityPipelineFailure;

export async function runEligibilityPipeline(inputAddress: string): Promise<EligibilityPipelineOutcome> {
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
      return { ok: false, error: msg };
    }

    geocodeData = geoMapped.display;
    const formattedAddress = geocodeData.formattedAddress;

    const zipCode = extractZipCode(geoMapped.addressComponents as { types: string[]; short_name?: string }[]);

    // Run rent + parcel in parallel — both only need geocode data
    const [rentSettled, parcelSettled] = await Promise.allSettled([
      zipCode ? fetchRent(zipCode) : Promise.resolve(null),
      fetchParcel(geocodeData.lat, geocodeData.lng),
    ]);

    let rentalData: EligibilityRentalPayload | null = null;
    if (rentSettled.status === 'fulfilled' && rentSettled.value) {
      const rentMapped = mapRentFromApi(rentSettled.value);
      if (rentMapped) rentalData = rentMapped;
    }

    if (parcelSettled.status === 'rejected') {
      return { ok: false, error: 'Parcel lookup failed' };
    }
    const parcelMapped = mapParcelFromApi(parcelSettled.value);
    if (!parcelMapped) {
      return { ok: false, error: parcelSettled.value?.error || 'Parcel lookup failed' };
    }

    parcelData = parcelMapped;

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

    const eligibilityResult = evaluateAllGates(
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

    return {
      ok: true,
      address: formattedAddress,
      eligibilityResult,
      rentalData,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'An error occurred',
    };
  }
}
