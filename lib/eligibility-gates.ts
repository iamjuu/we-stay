/**
 * Structured Eligibility Gates for Scorecard Display
 * Each gate is a named check with explicit pass/flag/fail status
 */

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
} from '@/components/PipelineSteps';

import {
  ADU_MIN_LOT_SIZE_SQFT,
  ADU_SMALL_LOT_MAX_SQFT,
  ADU_MAX_SIZE_SMALL_LOT,
  ADU_MAX_SIZE_LARGE_LOT,
} from '@/lib/constants';

export type GateStatus = 'pass' | 'flag' | 'fail' | 'pending';

export interface EligibilityGate {
  id: string;
  name: string;
  status: GateStatus;
  message: string;
  details?: string;
}

export interface FullEligibilityResult {
  status: 'ELIGIBLE' | 'NEEDS_REVIEW' | 'INELIGIBLE';
  gates: EligibilityGate[];
  aduSize: ADUSizeResult | null;
  passCount: number;
  flagCount: number;
  failCount: number;
}

export function evaluateAllGates(
  regrid: RegridData | null,
  zoning: ZoningData | null,
  flood: FloodData | null,
  parcel: ParcelData | null,
  sma: SMAData | null,
  water: WaterData | null,
  sewer: SewerData | null,
  rail: RailData | null,
  permit: PermitData | null,
  assessor: AssessorData | null
): FullEligibilityResult {
  const gates: EligibilityGate[] = [];
  const lotSize = parcel?.lotSizeSqFt || 0;

  // GATE 1: Lot Size (≥ 3,500 sq ft)
  if (lotSize > 0) {
    if (lotSize >= ADU_MIN_LOT_SIZE_SQFT) {
      gates.push({
        id: 'lot-size',
        name: 'Minimum Lot Size',
        status: 'pass',
        message: `${lotSize.toLocaleString()} sq ft meets ${ADU_MIN_LOT_SIZE_SQFT.toLocaleString()} sq ft minimum`,
      });
    } else {
      gates.push({
        id: 'lot-size',
        name: 'Minimum Lot Size',
        status: 'fail',
        message: `${lotSize.toLocaleString()} sq ft is below ${ADU_MIN_LOT_SIZE_SQFT.toLocaleString()} sq ft minimum`,
      });
    }
  } else {
    gates.push({
      id: 'lot-size',
      name: 'Minimum Lot Size',
      status: 'pending',
      message: 'Lot size data not available',
    });
  }

  // GATE 2: State Land Use District
  if (regrid?.stateLandUse) {
    if (regrid.stateLandUse === 'Conservation') {
      gates.push({
        id: 'state-land-use',
        name: 'State Land Use',
        status: 'fail',
        message: 'Conservation land - ADUs prohibited by state law',
      });
    } else if (regrid.stateLandUse === 'Agricultural') {
      gates.push({
        id: 'state-land-use',
        name: 'State Land Use',
        status: 'flag',
        message: 'Agricultural district',
        details: 'Verify Act 39 eligibility for existing farms',
      });
    } else {
      gates.push({
        id: 'state-land-use',
        name: 'State Land Use',
        status: 'pass',
        message: `${regrid.stateLandUse} district - ADU eligible`,
      });
    }
  } else {
    gates.push({
      id: 'state-land-use',
      name: 'State Land Use',
      status: 'pending',
      message: 'State land use data not available',
    });
  }

  // GATE 3: City Zoning
  if (zoning) {
    if (zoning.isAduEligible) {
      gates.push({
        id: 'zoning',
        name: 'City Zoning',
        status: 'pass',
        message: `${zoning.zoneClass} - typically allows ADUs`,
        details: zoning.zoningDescription,
      });
    } else {
      gates.push({
        id: 'zoning',
        name: 'City Zoning',
        status: 'flag',
        message: `${zoning.zoneClass} - verify ADU eligibility with DPP`,
        details: zoning.aduNote,
      });
    }
  } else {
    gates.push({
      id: 'zoning',
      name: 'City Zoning',
      status: 'pending',
      message: 'Zoning data not available',
    });
  }

  // GATE 4: Property Type (CPR Detection)
  if (regrid) {
    if (regrid.isCPR) {
      gates.push({
        id: 'property-type',
        name: 'Property Type',
        status: 'fail',
        message: 'CPR/Condo unit - ADUs not permitted',
      });
    } else {
      gates.push({
        id: 'property-type',
        name: 'Property Type',
        status: 'pass',
        message: 'Fee Simple parcel - eligible for ADU',
      });
    }
  } else {
    gates.push({
      id: 'property-type',
      name: 'Property Type',
      status: 'pending',
      message: 'Property type data not available',
    });
  }

  // GATE 5: Single-Family Only (no ADU, Ohana, duplex)
  const numUnits = parseInt(regrid?.numunits || '1', 10);
  const buildings = assessor?.buildings || [];
  const hasSecondaryUnitOccupancy = buildings.some(b =>
    b.occupancy?.toLowerCase().includes('ohana') ||
    b.occupancy?.toLowerCase().includes('adu') ||
    b.occupancy?.toLowerCase().includes('duplex')
  );
  const hasMultipleResidential = buildings.filter(b => b.type === 'residential').length > 1;

  if (numUnits > 1) {
    gates.push({
      id: 'single-family',
      name: 'Single-Family Only',
      status: 'fail',
      message: `Property has ${numUnits} units - multi-unit not eligible`,
    });
  } else if (permit?.hasExistingADU) {
    gates.push({
      id: 'single-family',
      name: 'Single-Family Only',
      status: 'fail',
      message: 'Existing ADU/Ohana permit found',
      details: 'Only one ADU allowed per property',
    });
  } else if (hasSecondaryUnitOccupancy) {
    gates.push({
      id: 'single-family',
      name: 'Single-Family Only',
      status: 'fail',
      message: 'Existing ADU/Ohana structure detected',
      details: 'Per assessor occupancy data',
    });
  } else if (hasMultipleResidential) {
    gates.push({
      id: 'single-family',
      name: 'Single-Family Only',
      status: 'flag',
      message: 'Multiple residential buildings detected',
      details: 'Verify no existing ADU/Ohana',
    });
  } else {
    gates.push({
      id: 'single-family',
      name: 'Single-Family Only',
      status: 'pass',
      message: 'Single-family dwelling confirmed',
    });
  }

  // GATE 6: Flood Zone
  if (flood) {
    if (flood.isSfha) {
      gates.push({
        id: 'flood-zone',
        name: 'Flood Zone',
        status: 'flag',
        message: `SFHA Zone ${flood.floodZone}`,
        details: 'Elevation certificate & flood insurance required',
      });
    } else if (flood.floodZone === 'D') {
      if (flood.thumbsUp10ftRule === true) {
        gates.push({
          id: 'flood-zone',
          name: 'Flood Zone',
          status: 'pass',
          message: `Zone D - ${flood.estimatedGroundElevationFt} ft elevation passes 10ft rule`,
        });
      } else if (flood.thumbsUp10ftRule === false) {
        gates.push({
          id: 'flood-zone',
          name: 'Flood Zone',
          status: 'flag',
          message: `Zone D - ${flood.estimatedGroundElevationFt} ft below 10ft threshold`,
          details: 'Survey recommended',
        });
      } else {
        gates.push({
          id: 'flood-zone',
          name: 'Flood Zone',
          status: 'flag',
          message: 'Zone D - Elevation unknown',
          details: 'Survey recommended',
        });
      }
    } else {
      gates.push({
        id: 'flood-zone',
        name: 'Flood Zone',
        status: 'pass',
        message: `Zone ${flood.floodZone} - ${flood.riskLevel} risk`,
      });
    }
  } else {
    gates.push({
      id: 'flood-zone',
      name: 'Flood Zone',
      status: 'pending',
      message: 'Flood zone data not available',
    });
  }

  // GATE 7: SMA (Special Management Area)
  if (sma) {
    if (sma.inSMA) {
      gates.push({
        id: 'sma',
        name: 'Coastal Zone (SMA)',
        status: 'flag',
        message: 'Inside Special Management Area',
        details: 'Additional coastal zone permits required',
      });
    } else {
      gates.push({
        id: 'sma',
        name: 'Coastal Zone (SMA)',
        status: 'pass',
        message: 'Not in SMA - no coastal restrictions',
      });
    }
  } else {
    gates.push({
      id: 'sma',
      name: 'Coastal Zone (SMA)',
      status: 'pending',
      message: 'SMA data not available',
    });
  }

  // GATE 8: Water Infrastructure
  if (water) {
    if (water.isPassZone === false) {
      gates.push({
        id: 'water',
        name: 'Water Infrastructure',
        status: 'flag',
        message: 'No-Pass Zone',
        details: 'May require private well or alternative water source',
      });
    } else if (water.isPassZone === true) {
      gates.push({
        id: 'water',
        name: 'Water Infrastructure',
        status: 'pass',
        message: 'City water available (Pass Zone)',
      });
    } else {
      gates.push({
        id: 'water',
        name: 'Water Infrastructure',
        status: 'pending',
        message: 'Water zone status unknown',
      });
    }
  } else {
    gates.push({
      id: 'water',
      name: 'Water Infrastructure',
      status: 'pending',
      message: 'Water data not available',
    });
  }

  // GATE 9: Sewer Infrastructure
  if (sewer) {
    if (sewer.hasSewerAccess) {
      gates.push({
        id: 'sewer',
        name: 'Sewer Infrastructure',
        status: 'pass',
        message: 'City sewer service available',
      });
    } else {
      gates.push({
        id: 'sewer',
        name: 'Sewer Infrastructure',
        status: 'flag',
        message: 'No city sewer nearby',
        details: 'Verify septic capacity for additional unit',
      });
    }
  } else {
    gates.push({
      id: 'sewer',
      name: 'Sewer Infrastructure',
      status: 'pending',
      message: 'Sewer data not available',
    });
  }

  // GATE 10: TOD Proximity
  if (rail) {
    if (rail.withinTOD) {
      gates.push({
        id: 'tod',
        name: 'Transit-Oriented (TOD)',
        status: 'pass',
        message: `${rail.distanceMiles} mi to ${rail.nearestStation}`,
        details: '✨ Parking reduction available',
      });
    } else {
      gates.push({
        id: 'tod',
        name: 'Transit-Oriented (TOD)',
        status: 'pass',
        message: 'Not in TOD zone',
        details: 'Standard parking requirements apply',
      });
    }
  } else {
    gates.push({
      id: 'tod',
      name: 'Transit-Oriented (TOD)',
      status: 'pending',
      message: 'TOD data not available',
    });
  }

  // GATE 11: Open Violations
  if (permit) {
    if (permit.openViolationCount > 0) {
      gates.push({
        id: 'violations',
        name: 'Permit Violations',
        status: 'flag',
        message: `${permit.openViolationCount} open violation(s)`,
        details: 'Must resolve before ADU application',
      });
    } else {
      gates.push({
        id: 'violations',
        name: 'Permit Violations',
        status: 'pass',
        message: 'No open violations',
      });
    }
  } else {
    gates.push({
      id: 'violations',
      name: 'Permit Violations',
      status: 'pending',
      message: 'Permit data not available',
    });
  }

  // Calculate ADU Size
  let aduSize: ADUSizeResult | null = null;
  const primaryBuilding = assessor?.buildings?.find(b => b.type === 'residential');
  const primaryDwellingSize = primaryBuilding?.livingAreaSqFt || null;

  let maxAduSize = 0;
  if (lotSize >= ADU_MIN_LOT_SIZE_SQFT && lotSize <= ADU_SMALL_LOT_MAX_SQFT) {
    maxAduSize = ADU_MAX_SIZE_SMALL_LOT;
  } else if (lotSize > ADU_SMALL_LOT_MAX_SQFT) {
    maxAduSize = ADU_MAX_SIZE_LARGE_LOT;
  }

  // Cap to primary dwelling size if known
  let isSizeVerified = false;
  let sizeNote = '';
  if (primaryDwellingSize !== null && maxAduSize > 0) {
    if (maxAduSize > primaryDwellingSize) {
      maxAduSize = primaryDwellingSize;
      sizeNote = `Capped to primary dwelling size (${primaryDwellingSize.toLocaleString()} sq ft)`;
    } else {
      sizeNote = `Based on lot size (primary is ${primaryDwellingSize.toLocaleString()} sq ft)`;
    }
    isSizeVerified = true;
  } else if (maxAduSize > 0) {
    sizeNote = 'Primary dwelling size unknown - subject to verification';
  }

  // Check if eligible before setting aduSize
  const failCount = gates.filter(g => g.status === 'fail').length;
  if (failCount === 0 && maxAduSize > 0) {
    aduSize = {
      maxAduSizeSqFt: maxAduSize,
      primaryDwellingSizeSqFt: primaryDwellingSize,
      isSizeVerified,
      sizeNote,
    };
  }

  // Calculate counts
  const passCount = gates.filter(g => g.status === 'pass').length;
  const flagCount = gates.filter(g => g.status === 'flag').length;

  // Determine final status
  let status: 'ELIGIBLE' | 'NEEDS_REVIEW' | 'INELIGIBLE';
  if (failCount > 0) {
    status = 'INELIGIBLE';
  } else if (flagCount > 0) {
    status = 'NEEDS_REVIEW';
  } else {
    status = 'ELIGIBLE';
  }

  return {
    status,
    gates,
    aduSize,
    passCount,
    flagCount,
    failCount,
  };
}
