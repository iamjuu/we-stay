'use client';

export type StepStatus = 'pending' | 'loading' | 'complete' | 'error';

export interface GeocodeData {
  formattedAddress: string;
  lat: number;
  lng: number;
}

export interface ParcelData {
  tmk: string;
  qpublicTmk: string | null;
  formattedTmk: string | null;
  lotSizeSqFt: number | null;
  lotSizeAcres: number | null;
  zone: string | null;
  assessorLink: string | null;
}

export interface ZoningData {
  zoneClass: string;
  zoningDescription: string;
  isAduEligible: boolean;
  aduNote: string;
}

// Debug info for Zone D elevation check
export interface FloodDebug {
  zoneDTriggered: boolean;
  elevationApiCalled: boolean;
  elevationRawResponse?: unknown;
  thresholdUsed: number;
  decisionLogic: string;
  floodApiRawResponse?: unknown;
}

export interface FloodData {
  floodZone: string;
  isSfha: boolean;
  sfhaStatus: string;
  riskLevel: string;
  description: string;
  baseFloodElevation: string | null;
  insuranceNote: string;
  // Zone D elevation fields
  estimatedGroundElevationFt?: number | null;
  elevationSource?: 'USGS_EPQS' | 'USGS_DEM' | 'HONOLULU_CONTOURS' | 'UNKNOWN' | string | null;
  thumbsUp10ftRule?: boolean | null;
  elevationNote?: string | null;
  // Debug payload
  _debug?: FloodDebug;
}

export interface BuildingInfo {
  buildingNumber: number;
  livingAreaSqFt: number;
  type: 'residential' | 'commercial';
  occupancy?: string;
  yearBuilt?: number;
}

export interface AssessorData {
  tmk: string;
  buildings: BuildingInfo[];
  totalLivingAreaSqFt: number;
}

export interface RegridData {
  tmk: string;
  usecode: string;
  usedesc: string;
  stateLandUse: string;
  suffix: string;
  isCPR: boolean;
  numunits: string;
  address: string;
  message: string;
}

export interface SMAData {
  inSMA: boolean;
  smareaValue?: number;
  message: string;
}

export interface WaterData {
  isPassZone: boolean | null;
  passValue?: number;
  message: string;
}

export interface SewerData {
  hasSewerAccess: boolean;
  sewerMainsNearby: number;
  message: string;
}

export interface RailData {
  nearestStation: string;
  distanceMiles: number;
  distanceFeet: number;
  withinTOD: boolean;
  todRadiusMiles: number;
  totalStations: number;
  message: string;
}

export interface PermitData {
  tmk: string;
  hasExistingADU: boolean;
  openViolations: any[];
  openViolationCount: number;
  totalPermits: number;
  totalApplications: number;
  totalViolations: number;
  message: string;
}

// ADU Size Rules (Richie's 2025 Rules)
export interface ADUSizeResult {
  maxAduSizeSqFt: number;
  primaryDwellingSizeSqFt: number | null;
  isSizeVerified: boolean;
  sizeNote: string;
}

export interface NewRulesEligibility {
  status: 'ELIGIBLE' | 'NEEDS_REVIEW' | 'INELIGIBLE';
  failures: string[];
  flags: string[];
  passes: string[];
  aduSize: ADUSizeResult | null;
}

export interface PipelineStep {
  id: string;
  name: string;
  status: StepStatus;
  data?: GeocodeData | ParcelData | ZoningData | FloodData | AssessorData | RegridData | SMAData | WaterData | SewerData | RailData | PermitData | null;
  error?: string;
  responseTime?: number;
  sourceInfo?: {
    name: string;
    provider: string;
    description?: string;
    viewUrl?: string;
  };
}

interface PipelineStepsProps {
  steps: PipelineStep[];
}

function StatusIcon({ status }: { status: StepStatus }) {
  switch (status) {
    case 'pending':
      return (
        <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
          <span className="text-gray-400 text-xs">○</span>
        </div>
      );
    case 'loading':
      return (
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      );
    case 'complete':
      return (
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    case 'error':
      return (
        <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      );
  }
}

function SourceInfo({ sourceInfo }: { sourceInfo?: PipelineStep['sourceInfo'] }) {
  if (!sourceInfo) return null;

  return (
    <div className="mt-3 pt-3 border-t border-gray-200">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-grow">
          <p className="text-xs text-gray-500">
            <span className="font-medium">Source:</span> {sourceInfo.name}
          </p>
          {sourceInfo.description && (
            <p className="text-xs text-gray-400 mt-0.5">
              {sourceInfo.description}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-0.5">
            {sourceInfo.provider}
          </p>
        </div>
        {sourceInfo.viewUrl && (
          <a
            href={sourceInfo.viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 flex-shrink-0"
          >
            View Source
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

function StepContent({ step }: { step: PipelineStep }) {
  if (step.status === 'pending') {
    return <p className="text-gray-400 italic">Waiting...</p>;
  }

  if (step.status === 'loading') {
    return <p className="text-blue-600">Fetching data...</p>;
  }

  if (step.status === 'error') {
    return <p className="text-red-600">{step.error || 'An error occurred'}</p>;
  }

  if (!step.data) {
    return <p className="text-gray-500">No data</p>;
  }

  // Render based on step type
  switch (step.id) {
    case 'geocode': {
      const data = step.data as GeocodeData;
      return (
        <>
          <div className="space-y-1">
            <p className="text-gray-700">
              <span className="font-medium">Address:</span> {data.formattedAddress}
            </p>
            <p className="text-gray-600 text-sm">
              <span className="font-medium">Coordinates:</span> {data.lat.toFixed(6)}, {data.lng.toFixed(6)}
            </p>
          </div>
          <SourceInfo sourceInfo={step.sourceInfo} />
        </>
      );
    }

    case 'parcel': {
      const data = step.data as ParcelData;
      return (
        <>
          <div className="space-y-1">
            <p className="text-gray-700">
              <span className="font-medium">TMK:</span> {data.formattedTmk || data.tmk}
            </p>
            <p className="text-gray-600 text-sm">
              <span className="font-medium">Lot Size:</span>{' '}
              {data.lotSizeSqFt ? `${data.lotSizeSqFt.toLocaleString()} sq ft` : 'N/A'}
              {data.lotSizeAcres ? ` (${data.lotSizeAcres.toFixed(3)} acres)` : ''}
            </p>
            {data.assessorLink && (
              <a
                href={data.assessorLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm inline-flex items-center gap-1"
              >
                View on Assessor Site
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
          <SourceInfo sourceInfo={step.sourceInfo} />
        </>
      );
    }

    case 'zoning': {
      const data = step.data as ZoningData;
      return (
        <>
          <div className="space-y-1">
            <p className="text-gray-700">
              <span className="font-medium">Zone:</span>{' '}
              <span className={`font-semibold ${data.isAduEligible ? 'text-green-600' : 'text-orange-600'}`}>
                {data.zoneClass}
              </span>
            </p>
            <p className="text-gray-600 text-sm">{data.zoningDescription}</p>
            <p className={`text-sm ${data.isAduEligible ? 'text-green-600' : 'text-orange-600'}`}>
              {data.isAduEligible ? '✓ ' : '⚠ '}
              {data.aduNote}
            </p>
          </div>
          <SourceInfo sourceInfo={step.sourceInfo} />
        </>
      );
    }

    case 'flood': {
      const data = step.data as FloodData;
      const riskColor = {
        'Low': 'text-green-600',
        'Undetermined': 'text-yellow-600',
        'High': 'text-orange-600',
        'Very High': 'text-red-600',
      }[data.riskLevel] || 'text-gray-600';

      return (
        <>
          <div className="space-y-1">
            <p className="text-gray-700">
              <span className="font-medium">Flood Zone:</span>{' '}
              <span className={`font-semibold ${riskColor}`}>{data.floodZone}</span>
              <span className={`ml-2 text-sm ${riskColor}`}>({data.riskLevel} Risk)</span>
            </p>
            <p className="text-gray-600 text-sm">{data.description}</p>
            <p className="text-gray-600 text-sm">
              <span className="font-medium">SFHA:</span> {data.sfhaStatus}
            </p>
            {data.baseFloodElevation && (
              <p className="text-gray-600 text-sm">
                <span className="font-medium">Base Flood Elevation:</span> {data.baseFloodElevation}
              </p>
            )}
            <p className="text-sm text-gray-500 italic">{data.insuranceNote}</p>
            
            {/* Zone D Elevation Check */}
            {data.floodZone === 'D' && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                <p className="text-sm font-semibold text-yellow-800 mb-2">
                  Zone D Elevation Check
                </p>
                {data.estimatedGroundElevationFt != null ? (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Estimated Elevation:</span>{' '}
                      <span className="font-bold text-blue-700">{data.estimatedGroundElevationFt} ft</span>
                      <span className="text-xs text-gray-500 ml-1">({data.elevationSource})</span>
                    </p>
                    <p className={`text-sm font-semibold ${
                      data.thumbsUp10ftRule ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {data.thumbsUp10ftRule 
                        ? '✓ Prelim Clearance (≥10 ft)' 
                        : '⚠ Review Required (<10 ft)'}
                    </p>
                    {data.elevationNote && (
                      <p className="text-xs text-gray-600 italic">{data.elevationNote}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-orange-600">
                    ⚠ Elevation unknown - manual verification required
                  </p>
                )}
                
                {/* DEBUG PANEL */}
                {data._debug && (
                  <details className="mt-3">
                    <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                      [DEBUG] Raw elevation data
                    </summary>
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto max-h-60 text-gray-700">
                      {JSON.stringify(data._debug, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}
          </div>
          <SourceInfo sourceInfo={step.sourceInfo} />
        </>
      );
    }

    case 'assessor': {
      const data = step.data as AssessorData;
      return (
        <>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-medium">Total Living Area:</span>{' '}
              <span className="font-semibold text-blue-600">
                {data.totalLivingAreaSqFt.toLocaleString()} sq ft
              </span>
            </p>
            {data.buildings.length > 1 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Buildings ({data.buildings.length}):
                </p>
                <div className="space-y-1 pl-2 border-l-2 border-gray-200">
                  {data.buildings.map((building, i) => (
                    <p key={i} className="text-sm text-gray-600">
                      <span className="font-medium">
                        {building.type === 'residential' ? '🏠' : '🏢'} Building {building.buildingNumber}:
                      </span>{' '}
                      {building.livingAreaSqFt.toLocaleString()} sq ft
                      {building.occupancy && ` (${building.occupancy})`}
                      {building.yearBuilt && ` • Built ${building.yearBuilt}`}
                    </p>
                  ))}
                </div>
              </div>
            )}
            {data.buildings.length === 1 && data.buildings[0].yearBuilt && (
              <p className="text-gray-600 text-sm">
                <span className="font-medium">Year Built:</span> {data.buildings[0].yearBuilt}
              </p>
            )}
          </div>
          <SourceInfo sourceInfo={step.sourceInfo} />
        </>
      );
    }

    case 'regrid': {
      const data = step.data as RegridData;
      const landUseColor = data.stateLandUse === 'Conservation' ? 'text-red-600' : 
                           data.stateLandUse === 'Agricultural' ? 'text-yellow-600' : 'text-green-600';
      return (
        <>
          <div className="space-y-1">
            <p className="text-gray-700">
              <span className="font-medium">State Land Use:</span>{' '}
              <span className={`font-semibold ${landUseColor}`}>{data.stateLandUse}</span>
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Property Type:</span>{' '}
              <span className={data.isCPR ? 'text-red-600 font-semibold' : 'text-green-600'}>
                {data.isCPR ? 'CPR/Condo Unit' : 'Regular Parcel (Fee Simple)'}
              </span>
            </p>
            {data.numunits && (
              <p className="text-gray-600 text-sm">
                <span className="font-medium">Units:</span> {data.numunits}
              </p>
            )}
            <p className="text-sm text-gray-500 italic">{data.message}</p>
          </div>
          <SourceInfo sourceInfo={step.sourceInfo} />
        </>
      );
    }

    case 'sma': {
      const data = step.data as SMAData;
      return (
        <>
          <div className="space-y-1">
            <p className="text-gray-700">
              <span className="font-medium">SMA Status:</span>{' '}
              <span className={`font-semibold ${data.inSMA ? 'text-yellow-600' : 'text-green-600'}`}>
                {data.inSMA ? 'IN Special Management Area' : 'NOT in SMA'}
              </span>
            </p>
            <p className="text-sm text-gray-600">{data.message}</p>
          </div>
          <SourceInfo sourceInfo={step.sourceInfo} />
        </>
      );
    }

    case 'water': {
      const data = step.data as WaterData;
      const statusColor = data.isPassZone === null ? 'text-gray-600' :
                         data.isPassZone ? 'text-green-600' : 'text-yellow-600';
      return (
        <>
          <div className="space-y-1">
            <p className="text-gray-700">
              <span className="font-medium">Water Service:</span>{' '}
              <span className={`font-semibold ${statusColor}`}>
                {data.isPassZone === null ? 'No Data' : 
                 data.isPassZone ? 'Pass Zone' : 'No-Pass Zone'}
              </span>
            </p>
            <p className="text-sm text-gray-600">{data.message}</p>
          </div>
          <SourceInfo sourceInfo={step.sourceInfo} />
        </>
      );
    }

    case 'sewer': {
      const data = step.data as SewerData;
      return (
        <>
          <div className="space-y-1">
            <p className="text-gray-700">
              <span className="font-medium">Sewer Service:</span>{' '}
              <span className={`font-semibold ${data.hasSewerAccess ? 'text-green-600' : 'text-yellow-600'}`}>
                {data.hasSewerAccess ? 'Available' : 'Not Found Nearby'}
              </span>
            </p>
            <p className="text-sm text-gray-600">{data.message}</p>
          </div>
          <SourceInfo sourceInfo={step.sourceInfo} />
        </>
      );
    }

    case 'rail': {
      const data = step.data as RailData;
      return (
        <>
          <div className="space-y-1">
            <p className="text-gray-700">
              <span className="font-medium">Nearest Station:</span> {data.nearestStation}
            </p>
            <p className="text-gray-600 text-sm">
              <span className="font-medium">Distance:</span> {data.distanceMiles} mi ({data.distanceFeet.toLocaleString()} ft)
            </p>
            <p className={`text-sm font-semibold ${data.withinTOD ? 'text-green-600' : 'text-gray-600'}`}>
              {data.withinTOD ? '✨ TOD Eligible - Parking reduction available' : 'Outside TOD zone'}
            </p>
          </div>
          <SourceInfo sourceInfo={step.sourceInfo} />
        </>
      );
    }

    case 'permit': {
      const data = step.data as PermitData;
      return (
        <>
          <div className="space-y-1">
            <p className="text-gray-700">
              <span className="font-medium">Existing ADU:</span>{' '}
              <span className={`font-semibold ${data.hasExistingADU ? 'text-red-600' : 'text-green-600'}`}>
                {data.hasExistingADU ? 'YES - ADU/Ohana found' : 'None found'}
              </span>
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Open Violations:</span>{' '}
              <span className={`font-semibold ${data.openViolationCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {data.openViolationCount}
              </span>
            </p>
            <p className="text-gray-600 text-sm">
              Permits: {data.totalPermits} • Applications: {data.totalApplications} • Violations: {data.totalViolations}
            </p>
            <p className="text-sm text-gray-500 italic">{data.message}</p>
          </div>
          <SourceInfo sourceInfo={step.sourceInfo} />
        </>
      );
    }

    default:
      return <p className="text-gray-500">Unknown step type</p>;
  }
}

export default function PipelineSteps({ steps }: PipelineStepsProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={`border rounded-lg p-4 transition-all duration-300 ${
            step.status === 'loading'
              ? 'border-blue-300 bg-blue-50'
              : step.status === 'complete'
              ? 'border-green-200 bg-green-50/50'
              : step.status === 'error'
              ? 'border-red-200 bg-red-50/50'
              : 'border-gray-200 bg-gray-50/50'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <StatusIcon status={step.status} />
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800">
                  Step {index + 1}: {step.name}
                </h3>
                {step.responseTime && (
                  <span className="text-xs text-gray-500">{step.responseTime}ms</span>
                )}
              </div>
              <StepContent step={step} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}



