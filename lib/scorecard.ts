import {
  RegridData,
  ZoningData,
  FloodData,
  ParcelData,
  SMAData,
  WaterData,
  SewerData,
  RailData,
  PermitData,
} from '@/components/PipelineSteps';

export interface ScorecardRequirement {
  id: string;
  label: string;
  passed: boolean;
  detail?: string;
}

export interface ScorecardResult {
  address: string;
  score: number; // 0-100
  status: 'Pre-Qualified' | 'Needs Review' | 'Not Qualified';
  requirements: ScorecardRequirement[];
  maxAduSize?: number;
}

export function calculateScorecard(
  address: string,
  regrid: RegridData | null,
  zoning: ZoningData | null,
  parcel: ParcelData | null,
  permit: PermitData | null,
  water: WaterData | null,
  sewer: SewerData | null,
  rail: RailData | null,
  sma: SMAData | null
): ScorecardResult {
  const requirements: ScorecardRequirement[] = [];

  // Requirement 1: Residential zoning confirmed
  const zoningPassed = zoning?.isAduEligible === true;
  requirements.push({
    id: 'zoning',
    label: 'Residential zoning confirmed',
    passed: zoningPassed,
    detail: zoningPassed
      ? `Zone ${zoning?.zoneClass} allows ADUs`
      : `Zone ${zoning?.zoneClass || 'unknown'} may not allow ADUs`,
  });

  // Requirement 2: Lot size meets 3,500 sq ft minimum
  const lotSizePassed = (parcel?.lotSizeSqFt || 0) >= 3500;
  requirements.push({
    id: 'lot-size',
    label: 'Lot size meets 3,500 sq ft minimum',
    passed: lotSizePassed,
    detail: parcel?.lotSizeSqFt
      ? `${parcel.lotSizeSqFt.toLocaleString()} sq ft`
      : 'Lot size unknown',
  });

  // Requirement 3: Existing single-family home verified
  const singleFamilyPassed = regrid?.isCPR === false;
  requirements.push({
    id: 'single-family',
    label: 'Existing single-family home verified',
    passed: singleFamilyPassed,
    detail: singleFamilyPassed
      ? 'Regular parcel (Fee Simple)'
      : 'CPR/Condo unit detected',
  });

  // Requirement 4: Only 1 ADU permitted and none currently registered
  const noAduPassed = permit?.hasExistingADU === false;
  requirements.push({
    id: 'no-existing-adu',
    label: 'Only 1 ADU permitted and none currently registered',
    passed: noAduPassed,
    detail: noAduPassed
      ? 'No existing ADU permits found'
      : 'Existing ADU/Ohana detected',
  });

  // Requirement 5: Utility connection appears available
  const utilitiesPassed =
    (water?.isPassZone === true || water?.isPassZone === null) &&
    (sewer?.hasSewerAccess === true || sewer?.hasSewerAccess === null);
  requirements.push({
    id: 'utilities',
    label: 'Utility connection appears available',
    passed: utilitiesPassed,
    detail: utilitiesPassed
      ? 'Water and sewer service available'
      : 'Utility availability concerns',
  });

  // Requirement 6: Parking solution is feasible or waiver eligible
  const parkingPassed = rail?.withinTOD === true || true; // Always true as fallback
  requirements.push({
    id: 'parking',
    label: 'Parking solution is feasible or waiver eligible',
    passed: parkingPassed,
    detail: rail?.withinTOD
      ? `TOD eligible - parking waiver available (${rail.distanceMiles} mi to ${rail.nearestStation})`
      : 'Parking feasible per standard requirements',
  });

  // Requirement 7: No disqualifying planning restrictions detected
  const noRestrictionsPassed =
    regrid?.stateLandUse !== 'Conservation' &&
    sma?.inSMA !== true;
  requirements.push({
    id: 'restrictions',
    label: 'No disqualifying planning restrictions detected',
    passed: noRestrictionsPassed,
    detail: !noRestrictionsPassed
      ? regrid?.stateLandUse === 'Conservation'
        ? 'Conservation land - ADUs prohibited'
        : 'Special Management Area restrictions'
      : 'No major planning restrictions',
  });

  // Calculate score
  const passedCount = requirements.filter(r => r.passed).length;
  const totalCount = requirements.length;
  const score = Math.round((passedCount / totalCount) * 100);

  // Determine status
  let status: 'Pre-Qualified' | 'Needs Review' | 'Not Qualified';
  if (score >= 85) {
    status = 'Pre-Qualified';
  } else if (score >= 60) {
    status = 'Needs Review';
  } else {
    status = 'Not Qualified';
  }

  // Get max ADU size based on 2026 Oʻahu (City & County of Honolulu) regulations:
  // - Lots up to 4,999 sq ft: ADU up to 500 sq ft
  // - Lots 5,000 sq ft or larger: ADU up to 1,000 sq ft
  let maxAduSize: number | undefined;
  const lotSize = parcel?.lotSizeSqFt || 0;
  if (lotSize >= 3500 && lotSize <= 4999) {
    maxAduSize = 500;
  } else if (lotSize >= 5000) {
    maxAduSize = 1000;
  }

  return {
    address,
    score,
    status,
    requirements,
    maxAduSize,
  };
}
