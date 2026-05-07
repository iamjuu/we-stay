/**
 * Maps raw JSON bodies from adu-lookup `/api/*` routes into UI / gate models.
 * Field names align with production captures (e.g. browser HAR against
 * `adu-lookup-production.up.railway.app`).
 */

import type {
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
  BuildingInfo,
} from '@/components/PipelineSteps';

function asRecord(v: unknown): Record<string, unknown> | null {
  if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
    return v as Record<string, unknown>;
  }
  return null;
}

function str(v: unknown, fallback = ''): string {
  if (v === null || v === undefined) return fallback;
  return String(v);
}

function num(v: unknown): number | null {
  if (typeof v === 'number' && !Number.isNaN(v)) return v;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    return Number.isNaN(n) ? null : n;
  }
  return null;
}

function bool(v: unknown): boolean {
  return v === true;
}

function optionalBool(v: unknown): boolean | null {
  if (v === null || v === undefined) return null;
  if (typeof v === 'boolean') return v;
  return null;
}

/** Geocode + components (used for ZIP → rent). */
export interface GeocodeMapped {
  display: GeocodeData;
  addressComponents: unknown[];
}

export function mapGeocodeFullFromApi(json: unknown): GeocodeMapped | null {
  const o = asRecord(json);
  if (!o || o.success !== true) return null;
  const lat = num(o.lat);
  const lng = num(o.lng);
  const formattedAddress = str(o.formattedAddress);
  if (lat === null || lng === null || !formattedAddress) return null;
  const ac = o.addressComponents;
  const addressComponents = Array.isArray(ac) ? ac : [];
  return {
    display: { formattedAddress, lat, lng },
    addressComponents,
  };
}

export function mapParcelFromApi(json: unknown): ParcelData | null {
  const o = asRecord(json);
  if (!o || o.success !== true) return null;
  const tmk = str(o.tmk);
  if (!tmk) return null;
  const lotSq = num(o.lotSizeSqFt);
  const acres = num(o.lotSizeAcres);
  const calculatedLotSizeSqFt =
    lotSq ?? (acres !== null ? Math.round(acres * 43560) : null);
  return {
    tmk,
    qpublicTmk: o.qpublicTmk == null ? null : str(o.qpublicTmk),
    formattedTmk: o.formattedTmk == null ? null : str(o.formattedTmk),
    lotSizeSqFt: calculatedLotSizeSqFt,
    lotSizeAcres: acres,
    zone: o.zone == null ? null : str(o.zone),
    assessorLink: o.assessorLink == null ? null : str(o.assessorLink),
  };
}

export function mapRegridFromApi(json: unknown): RegridData | null {
  const o = asRecord(json);
  if (!o || o.success !== true) return null;
  const tmk = str(o.tmk);
  if (!tmk) return null;
  return {
    tmk,
    usecode: str(o.usecode),
    usedesc: str(o.usedesc),
    stateLandUse: str(o.stateLandUse),
    suffix: str(o.suffix),
    isCPR: bool(o.isCPR),
    numunits: str(o.numunits),
    address: str(o.address),
    message: str(o.message),
  };
}

export function mapZoningFromApi(json: unknown): ZoningData | null {
  const o = asRecord(json);
  if (!o || o.success !== true) return null;
  return {
    zoneClass: str(o.zoneClass),
    zoningDescription: str(o.zoningDescription),
    isAduEligible: o.isAduEligible === true,
    aduNote: str(o.aduNote),
  };
}

export function mapFloodFromApi(json: unknown): FloodData | null {
  const o = asRecord(json);
  if (!o || o.success !== true) return null;
  return {
    floodZone: str(o.floodZone),
    isSfha: o.isSfha === true,
    sfhaStatus: str(o.sfhaStatus),
    riskLevel: str(o.riskLevel),
    description: str(o.description),
    baseFloodElevation: o.baseFloodElevation == null ? null : str(o.baseFloodElevation),
    insuranceNote: str(o.insuranceNote),
    estimatedGroundElevationFt:
      o.estimatedGroundElevationFt === undefined || o.estimatedGroundElevationFt === null
        ? null
        : num(o.estimatedGroundElevationFt),
    elevationSource:
      o.elevationSource === undefined || o.elevationSource === null
        ? null
        : str(o.elevationSource),
    thumbsUp10ftRule: optionalBool(o.thumbsUp10ftRule),
    elevationNote:
      o.elevationNote === undefined || o.elevationNote === null ? null : str(o.elevationNote),
    _debug: o._debug as FloodData['_debug'],
  };
}

function mapBuildings(raw: unknown): BuildingInfo[] {
  if (!Array.isArray(raw)) return [];
  const out: BuildingInfo[] = [];
  for (const b of raw) {
    const r = asRecord(b);
    if (!r) continue;
    const type = r.type === 'commercial' ? 'commercial' : 'residential';
    const living = num(r.livingAreaSqFt);
    const bn = num(r.buildingNumber);
    if (living === null || bn === null) continue;
    out.push({
      buildingNumber: bn,
      livingAreaSqFt: living,
      type,
      occupancy: r.occupancy == null ? undefined : str(r.occupancy),
      yearBuilt: r.yearBuilt == null ? undefined : num(r.yearBuilt) ?? undefined,
    });
  }
  return out;
}

export function mapAssessorFromApi(json: unknown): AssessorData | null {
  const o = asRecord(json);
  if (!o || o.success !== true) return null;
  const tmk = str(o.tmk);
  if (!tmk) return null;
  const total = num(o.totalLivingAreaSqFt);
  if (total === null) return null;
  return {
    tmk,
    buildings: mapBuildings(o.buildings),
    totalLivingAreaSqFt: total,
  };
}

export function mapSmaFromApi(json: unknown): SMAData | null {
  const o = asRecord(json);
  if (!o || o.success !== true) return null;
  return {
    inSMA: o.inSMA === true,
    smareaValue: o.smareaValue === undefined ? undefined : num(o.smareaValue) ?? undefined,
    message: str(o.message),
  };
}

export function mapWaterFromApi(json: unknown): WaterData | null {
  const o = asRecord(json);
  if (!o || o.success !== true) return null;
  return {
    isPassZone: optionalBool(o.isPassZone),
    passValue: o.passValue === undefined ? undefined : num(o.passValue) ?? undefined,
    message: str(o.message),
  };
}

export function mapSewerFromApi(json: unknown): SewerData | null {
  const o = asRecord(json);
  if (!o || o.success !== true) return null;
  const nearby = num(o.sewerMainsNearby);
  return {
    hasSewerAccess: o.hasSewerAccess === true,
    sewerMainsNearby: nearby ?? 0,
    message: str(o.message),
  };
}

export function mapRailFromApi(json: unknown): RailData | null {
  const o = asRecord(json);
  if (!o || o.success !== true) return null;
  const dm = num(o.distanceMiles);
  const df = num(o.distanceFeet);
  const tr = num(o.todRadiusMiles);
  const ts = num(o.totalStations);
  return {
    nearestStation: str(o.nearestStation),
    distanceMiles: dm ?? 0,
    distanceFeet: df ?? 0,
    withinTOD: o.withinTOD === true,
    todRadiusMiles: tr ?? 0,
    totalStations: ts ?? 0,
    message: str(o.message),
  };
}

export function mapPermitFromApi(json: unknown): PermitData | null {
  const o = asRecord(json);
  if (!o || o.success !== true) return null;
  const tmk = str(o.tmk);
  if (!tmk) return null;
  const openViolations = Array.isArray(o.openViolations) ? o.openViolations : [];
  return {
    tmk,
    hasExistingADU: o.hasExistingADU === true,
    openViolations,
    openViolationCount: num(o.openViolationCount) ?? 0,
    totalPermits: num(o.totalPermits) ?? 0,
    totalApplications: num(o.totalApplications) ?? 0,
    totalViolations: num(o.totalViolations) ?? 0,
    message: str(o.message),
  };
}

export interface RentalEstimateRow {
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  estimate: number;
  min: number;
  max: number;
  comparableCount: number;
  lastUpdated: string;
}

export function mapRentFromApi(
  json: unknown
): { zipCode: string; rentals: RentalEstimateRow[] } | null {
  const o = asRecord(json);
  if (!o || o.success !== true) return null;
  const zipCode = str(o.zipCode);
  if (!zipCode || !Array.isArray(o.rentals)) return null;
  const rentals: RentalEstimateRow[] = [];
  for (const row of o.rentals) {
    const r = asRecord(row);
    if (!r) continue;
    const bedrooms = num(r.bedrooms);
    const bathrooms = num(r.bathrooms);
    const estimate = num(r.estimate);
    const min = num(r.min);
    const max = num(r.max);
    const comparableCount = num(r.comparableCount);
    if (
      bedrooms === null ||
      bathrooms === null ||
      estimate === null ||
      min === null ||
      max === null ||
      comparableCount === null
    ) {
      continue;
    }
    rentals.push({
      bedrooms,
      bathrooms,
      propertyType: str(r.propertyType),
      estimate,
      min,
      max,
      comparableCount,
      lastUpdated: str(r.lastUpdated),
    });
  }
  return { zipCode, rentals };
}
