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
  AssessorData,
  ADUSizeResult,
  NewRulesEligibility,
} from '@/components/PipelineSteps';

import {
  ADU_MIN_LOT_SIZE_SQFT,
  ADU_SMALL_LOT_MAX_SQFT,
  ADU_MAX_SIZE_SMALL_LOT,
  ADU_MAX_SIZE_LARGE_LOT,
} from '@/lib/constants';

export interface EligibilityResult {
  status: 'ELIGIBLE' | 'NEEDS_REVIEW' | 'INELIGIBLE';
  failures: string[];
  flags: string[];
  passes: string[];
}

// 12-Gate Eligibility Logic
export function determineEligibility(
  regrid: RegridData | null,
  zoning: ZoningData | null,
  flood: FloodData | null,
  parcel: ParcelData | null,
  sma: SMAData | null,
  water: WaterData | null,
  sewer: SewerData | null,
  rail: RailData | null,
  permit: PermitData | null
): EligibilityResult {
  const failures: string[] = [];
  const flags: string[] = [];
  const passes: string[] = [];

  // GATE 2: State Land Use District
  if (regrid) {
    if (regrid.stateLandUse === 'Conservation') {
      failures.push('Conservation land - ADUs prohibited by state law');
    } else if (regrid.stateLandUse === 'Agricultural') {
      flags.push('Agricultural district - Verify Act 39 eligibility for existing farms');
    } else if (regrid.stateLandUse === 'Urban' || regrid.stateLandUse === 'Rural') {
      passes.push(`State Land Use: ${regrid.stateLandUse} - ADU eligible`);
    }
  }

  // GATE 3: City Zoning
  if (zoning) {
    if (zoning.isAduEligible) {
      passes.push(`Zoning ${zoning.zoneClass} - typically allows ADUs`);
    } else {
      flags.push(`Zoning ${zoning.zoneClass} - may not allow ADUs, verify with DPP`);
    }
  }

  // GATE 4: Property Type (CPR Detection)
  if (regrid) {
    if (regrid.isCPR) {
      failures.push('CPR/Condo unit - ADUs not permitted on condominiums');
    } else {
      passes.push('Regular parcel (Fee Simple) - eligible for ADU');
    }
  }

  // GATE 5: Unit Count & Existing ADU
  if (permit) {
    if (permit.hasExistingADU) {
      failures.push('Existing ADU/Ohana permit found - only one ADU allowed per property');
    } else {
      passes.push('No existing ADU permits found');
    }
  }

  // GATE 6: Lot Size
  if (parcel?.lotSizeSqFt) {
    if (parcel.lotSizeSqFt >= 3500) {
      passes.push(`Lot size ${parcel.lotSizeSqFt.toLocaleString()} sq ft - meets minimum`);
    } else {
      failures.push(`Lot size ${parcel.lotSizeSqFt.toLocaleString()} sq ft - below 3,500 sq ft minimum for most zones`);
    }
  }

  // GATE 7: Flood Zone
  if (flood) {
    if (flood.isSfha) {
      flags.push(`SFHA Zone ${flood.floodZone} - Elevation certificate & flood insurance required`);
    } else if (flood.floodZone === 'D') {
      // Check 10ft elevation rule for Zone D
      if (flood.thumbsUp10ftRule === true) {
        passes.push(`Flood Zone D - Elevation ${flood.estimatedGroundElevationFt} ft passes 10ft threshold`);
      } else if (flood.thumbsUp10ftRule === false) {
        flags.push(`Flood Zone D - Elevation ${flood.estimatedGroundElevationFt} ft below 10ft threshold, survey required`);
      } else {
        flags.push('Flood Zone D - Elevation unknown, survey recommended');
      }
    } else {
      passes.push(`Flood Zone ${flood.floodZone} - ${flood.riskLevel} risk`);
    }
  }

  // GATE 8: SMA Check
  if (sma) {
    if (sma.inSMA) {
      flags.push('Special Management Area - Additional coastal zone permits required');
    } else {
      passes.push('Not in SMA - no coastal zone restrictions');
    }
  }

  // GATE 9: TOD Proximity
  if (rail) {
    if (rail.withinTOD) {
      flags.push(`✨ TOD Eligible (${rail.distanceMiles} mi to ${rail.nearestStation}) - Parking reduction available`);
    }
  }

  // GATE 11: Infrastructure
  if (water) {
    if (water.isPassZone === false) {
      flags.push('No-Pass Zone - May require private well or alternative water source');
    } else if (water.isPassZone === true) {
      passes.push('City water available (Pass Zone)');
    }
  }

  if (sewer) {
    if (!sewer.hasSewerAccess) {
      flags.push('No city sewer nearby - Verify septic capacity for additional unit');
    } else {
      passes.push('City sewer service available');
    }
  }

  // GATE 12: Permit History
  if (permit) {
    if (permit.openViolationCount > 0) {
      flags.push(`${permit.openViolationCount} open violation(s) - Must resolve before ADU application`);
    } else if (permit.totalViolations > 0) {
      passes.push('No open violations');
    }
  }

  // GATE 10: CC&Rs (manual check)
  flags.push('⚠️ CC&Rs not checked - Review recorded restrictions at Bureau of Conveyances');

  // Determine final status
  if (failures.length > 0) {
    return { status: 'INELIGIBLE', failures, flags, passes };
  } else if (flags.length > 0) {
    return { status: 'NEEDS_REVIEW', failures, flags, passes };
  } else {
    return { status: 'ELIGIBLE', failures, flags, passes };
  }
}

// New Rules (2025) - Richie's 5-Step ADU Eligibility Logic
export function determineNewRulesEligibility(
  regrid: RegridData | null,
  parcel: ParcelData | null,
  assessor: AssessorData | null,
  permit: PermitData | null
): NewRulesEligibility {
  const failures: string[] = [];
  const flags: string[] = [];
  const passes: string[] = [];
  let aduSize: ADUSizeResult | null = null;

  const lotSize = parcel?.lotSizeSqFt || 0;

  // STEP 1: Check Minimum Lot Size (≥ 3,500 sq ft)
  if (lotSize < ADU_MIN_LOT_SIZE_SQFT) {
    failures.push(`Lot size ${lotSize.toLocaleString()} sq ft is below ${ADU_MIN_LOT_SIZE_SQFT.toLocaleString()} sq ft minimum`);
  } else {
    passes.push(`Lot size ${lotSize.toLocaleString()} sq ft meets minimum of ${ADU_MIN_LOT_SIZE_SQFT.toLocaleString()} sq ft`);
  }

  // STEP 2: Confirm Single-Family Only (no ADU, Ohana, duplex, or multi-family)
  const numUnits = parseInt(regrid?.numunits || '1', 10);
  if (numUnits > 1) {
    failures.push(`Property has ${numUnits} units - multi-unit properties not eligible`);
  } else if (permit?.hasExistingADU) {
    failures.push('Existing ADU/Ohana permit found - only one ADU allowed per property');
  } else {
    // Check building types from assessor
    const buildings = assessor?.buildings || [];
    
    // Check if ANY building has ADU/Ohana/Duplex in occupancy (regardless of building count)
    const hasSecondaryUnitOccupancy = buildings.some(b => 
      b.occupancy?.toLowerCase().includes('ohana') || 
      b.occupancy?.toLowerCase().includes('adu') ||
      b.occupancy?.toLowerCase().includes('duplex')
    );
    
    // Check if there are multiple residential buildings
    const hasMultipleResidential = buildings.filter(b => b.type === 'residential').length > 1;
    
    if (hasSecondaryUnitOccupancy) {
      // Fail if any building is marked as ADU/Ohana/Duplex
      failures.push('Property has existing ADU/Ohana/duplex structure (per assessor occupancy data)');
    } else if (hasMultipleResidential) {
      // Flag if multiple residential buildings exist but no explicit ADU occupancy
      flags.push('Multiple residential buildings detected - verify no existing ADU/Ohana');
    } else {
      passes.push('Property contains single-family dwelling only');
    }
  }

  // STEP 3: Determine Max ADU Size by Lot Size
  let maxAduSize = 0;
  if (lotSize >= ADU_MIN_LOT_SIZE_SQFT && lotSize <= ADU_SMALL_LOT_MAX_SQFT) {
    maxAduSize = ADU_MAX_SIZE_SMALL_LOT;
    passes.push(`Lot 3,500-4,999 sq ft → Max ADU size: ${ADU_MAX_SIZE_SMALL_LOT} sq ft`);
  } else if (lotSize > ADU_SMALL_LOT_MAX_SQFT) {
    maxAduSize = ADU_MAX_SIZE_LARGE_LOT;
    passes.push(`Lot ≥ 5,000 sq ft → Max ADU size: ${ADU_MAX_SIZE_LARGE_LOT} sq ft`);
  }

  // STEP 4: Compare ADU Size to Primary Dwelling Size
  const primaryBuilding = assessor?.buildings?.find(b => b.type === 'residential');
  const primaryDwellingSize = primaryBuilding?.livingAreaSqFt || null;
  let isSizeVerified = false;
  let sizeNote = '';

  if (primaryDwellingSize !== null && maxAduSize > 0) {
    if (maxAduSize > primaryDwellingSize) {
      // Cap ADU size to primary dwelling size
      maxAduSize = primaryDwellingSize;
      sizeNote = `ADU capped to primary dwelling size (${primaryDwellingSize.toLocaleString()} sq ft)`;
      passes.push(sizeNote);
    } else {
      sizeNote = `Primary dwelling (${primaryDwellingSize.toLocaleString()} sq ft) > Max ADU (${maxAduSize} sq ft)`;
      passes.push(sizeNote);
    }
    isSizeVerified = true;
  } else if (maxAduSize > 0) {
    sizeNote = 'Primary dwelling size unknown - subject to verification';
    flags.push(sizeNote);
    isSizeVerified = false;
  }

  // Build ADU size result if eligible
  if (failures.length === 0 && maxAduSize > 0) {
    aduSize = {
      maxAduSizeSqFt: maxAduSize,
      primaryDwellingSizeSqFt: primaryDwellingSize,
      isSizeVerified,
      sizeNote,
    };
  }

  // Determine final status
  if (failures.length > 0) {
    return { status: 'INELIGIBLE', failures, flags, passes, aduSize: null };
  } else if (flags.length > 0) {
    return { status: 'NEEDS_REVIEW', failures, flags, passes, aduSize };
  } else {
    return { status: 'ELIGIBLE', failures, flags, passes, aduSize };
  }
}

// Tier classification for batch processing
export type TierLevel = 'TIER_1' | 'TIER_2' | 'TIER_3' | 'SKIP';

export function calculateTier(eligibility: EligibilityResult | null): TierLevel {
  if (!eligibility) return 'SKIP';
  
  switch (eligibility.status) {
    case 'ELIGIBLE':
      return 'TIER_1';
    case 'NEEDS_REVIEW':
      return 'TIER_2';
    case 'INELIGIBLE':
      return 'TIER_3';
    default:
      return 'SKIP';
  }
}


