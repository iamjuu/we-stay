// API Endpoints
export const GOOGLE_GEOCODING_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
export const GOOGLE_PLACES_AUTOCOMPLETE_URL = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
export const HAWAII_PARCEL_URL = 'https://geodata.hawaii.gov/arcgis/rest/services/ParcelsZoning/MapServer/11/query';
export const HAWAII_ZONING_URL = 'https://geodata.hawaii.gov/arcgis/rest/services/ParcelsZoning/MapServer/3/query';
export const HAWAII_FLOOD_URL = 'https://geodata.hawaii.gov/arcgis/rest/services/Hazards/MapServer/5/query';
export const HAWAII_SMA_URL = 'https://geodata.hawaii.gov/arcgis/rest/services/ParcelsZoning/MapServer/21/query';
export const BWS_WATER_URL = 'https://services.arcgis.com/tNJpAOha4mODLkXz/arcgis/rest/services/Board_of_Water_Supply_Pass_Zone/FeatureServer/0/query';
export const SEWER_URL = 'https://services.arcgis.com/tNJpAOha4mODLkXz/arcgis/rest/services/Utilities/FeatureServer/1/query';
export const HART_RAIL_URL = 'https://services6.arcgis.com/2cZSk3EXXiOHcbOl/arcgis/rest/services/HART_Transit_Stations_PUBLIC/FeatureServer/0/query';

// Elevation API (USGS National Map)
export const USGS_EPQS_URL = 'https://epqs.nationalmap.gov/v1/json';

// Zone D elevation threshold (feet) - properties >= this elevation get preliminary clearance
export const ZONE_D_ELEVATION_THRESHOLD_FT = 10;

// Elevation sources for debug/display
export const ELEVATION_SOURCES = {
  USGS_EPQS: 'USGS National Map EPQS',
  USGS_DEM: 'USGS 3DEP DEM',
  HONOLULU_CONTOURS: 'Honolulu 5-ft Contours',
  UNKNOWN: 'Unknown',
} as const;

export type ElevationSourceType = keyof typeof ELEVATION_SOURCES;

// qPublic Assessor Site
export const QPUBLIC_BASE_URL = 'https://qpublic.schneidercorp.com/Application.aspx';
export const QPUBLIC_APP_ID = '1045'; // Honolulu County

// DPP Permit Portal
export const DPP_PERMIT_URL = 'https://honolulu.my.site.com/s/';

// Regrid CSV Path
export const REGRID_CSV_PATH = '../regrid/purchased_data/Regrid - Honolulu Data Room 3/hi_honolulu.csv';

// Claude Model
export const CLAUDE_HAIKU_MODEL = 'claude-haiku-4-5-20251001';

// ADU Eligible Zoning Codes (Oahu residential zones that allow ADUs per Honolulu LUO)
export const ADU_ELIGIBLE_ZONES = [
  'R-3.5',    // Residential 3,500 sq ft min lot
  'R-5',      // Residential 5,000 sq ft min lot
  'R-7.5',    // Residential 7,500 sq ft min lot
  'R-10',     // Residential 10,000 sq ft min lot
  'R-20',     // Residential 20,000 sq ft min lot
  'AG-1',     // Agricultural (restricted)
  'AG-2',     // Agricultural (general)
  'Country',  // Country district
];

// Flood zone risk levels
export const FLOOD_ZONE_INFO: Record<string, { risk: string; description: string }> = {
  'X': { risk: 'Low', description: 'Minimal flood hazard area' },
  'D': { risk: 'Undetermined', description: 'Possible but undetermined flood hazard' },
  'A': { risk: 'High', description: '100-year flood zone (no BFE)' },
  'AE': { risk: 'High', description: '100-year flood zone with base flood elevation' },
  'AH': { risk: 'High', description: 'Shallow flooding (1-3 ft)' },
  'AO': { risk: 'High', description: 'Sheet flow flooding (1-3 ft)' },
  'VE': { risk: 'Very High', description: 'Coastal flood zone with velocity wave action' },
};

// State Land Use categories (Gate 2)
export const STATE_LAND_USE_FAIL = ['conservation'];
export const STATE_LAND_USE_FLAG = ['agricultural'];
export const STATE_LAND_USE_PASS = ['urban', 'rural'];

// TOD eligibility radius (Gate 9)
export const TOD_RADIUS_MILES = 0.5;

// ADU Size Rules (Oʻahu / City & County of Honolulu 2026)
// Reference: Updated ADU regulations effective 2026
export const ADU_MIN_LOT_SIZE_SQFT = 3500;
export const ADU_SMALL_LOT_MAX_SQFT = 4999;
export const ADU_MAX_SIZE_SMALL_LOT = 500;  // For lots 3,500-4,999 sf → max 500 sq ft ADU
export const ADU_MAX_SIZE_LARGE_LOT = 1000;  // For lots >= 5,000 sf → max 1,000 sq ft ADU

// Data source metadata
export const DATA_SOURCES = {
  googleGeocoding: {
    name: 'Google Geocoding API',
    description: 'Converts addresses to geographic coordinates',
    url: 'https://developers.google.com/maps/documentation/geocoding',
    provider: 'Google Maps Platform'
  },
  hawaiiParcel: {
    name: 'Hawaii State GIS - Parcels',
    description: 'Tax Map Key (TMK) and parcel boundaries',
    url: 'https://geoportal.hawaii.gov',
    layerUrl: (lat: number, lng: number) => 
      `https://www.google.com/maps/@${lat},${lng},18z`,
    provider: 'Hawaii Statewide GIS Program'
  },
  regrid: {
    name: 'Regrid Parcel Database',
    description: 'Property ownership and land use classification',
    url: 'https://regrid.com',
    provider: 'Regrid Inc.'
  },
  hawaiiZoning: {
    name: 'Hawaii State GIS - Zoning',
    description: 'City & County zoning classifications',
    url: 'https://geoportal.hawaii.gov',
    layerUrl: (lat: number, lng: number) => 
      `https://www.google.com/maps/@${lat},${lng},18z`,
    provider: 'Hawaii Statewide GIS Program'
  },
  hawaiiFlood: {
    name: 'FEMA Flood Hazard Data',
    description: 'Federal flood zone classifications',
    url: 'https://msc.fema.gov/portal/home',
    layerUrl: (lat: number, lng: number) => 
      `https://msc.fema.gov/portal/search?AddressQuery=${lat},${lng}`,
    provider: 'FEMA via Hawaii State GIS'
  },
  qpublicAssessor: {
    name: 'Honolulu County Assessor',
    description: 'Building details and living area',
    url: 'https://qpublic.schneidercorp.com/Application.aspx?AppID=1045',
    recordUrl: (tmk: string) => 
      `https://qpublic.schneidercorp.com/Application.aspx?AppID=1045&PageTypeID=4&KeyValue=${tmk}`,
    provider: 'Honolulu Real Property Assessment Division'
  },
  hawaiiSMA: {
    name: 'Special Management Area',
    description: 'Coastal zone development restrictions',
    url: 'https://planning.hawaii.gov/czm/sma',
    provider: 'Hawaii Office of Planning and Sustainable Development'
  },
  bwsWater: {
    name: 'Board of Water Supply Pass Zones',
    description: 'City water service availability',
    url: 'https://www.boardofwatersupply.com',
    provider: 'Honolulu Board of Water Supply'
  },
  sewerService: {
    name: 'City Sewer Service Map',
    description: 'Wastewater infrastructure availability',
    url: 'https://www.honolulu.gov/dcs',
    provider: 'Honolulu Department of Design and Construction'
  },
  hartRail: {
    name: 'HART Rail Stations',
    description: 'Transit-Oriented Development (TOD) eligibility',
    url: 'https://www.honolulutransit.org',
    stationUrl: (stationName: string) => 
      `https://www.honolulutransit.org/stations`,
    provider: 'Honolulu Authority for Rapid Transportation'
  },
  dppPermits: {
    name: 'DPP Permit History',
    description: 'Building permits, violations, and applications',
    url: 'https://honolulu.my.site.com/s/',
    recordUrl: (tmk: string) => 
      `https://honolulu.my.site.com/s/`,
    provider: 'Honolulu Department of Planning & Permitting'
  }
};

// Helper function to get source info for each step
export function getStepSourceInfo(
  stepId: string, 
  data?: any
): { name: string; provider: string; description?: string; viewUrl?: string } | undefined {
  switch (stepId) {
    case 'geocode':
      return {
        name: DATA_SOURCES.googleGeocoding.name,
        provider: DATA_SOURCES.googleGeocoding.provider,
        description: DATA_SOURCES.googleGeocoding.description,
        viewUrl: data?.lat && data?.lng 
          ? `https://www.google.com/maps?q=${data.lat},${data.lng}` 
          : undefined
      };
    
    case 'parcel':
      return {
        name: DATA_SOURCES.hawaiiParcel.name,
        provider: DATA_SOURCES.hawaiiParcel.provider,
        description: DATA_SOURCES.hawaiiParcel.description,
        viewUrl: data?.lat && data?.lng 
          ? DATA_SOURCES.hawaiiParcel.layerUrl(data.lat, data.lng)
          : undefined
      };
    
    case 'regrid':
      return {
        name: DATA_SOURCES.regrid.name,
        provider: DATA_SOURCES.regrid.provider,
        description: `Purchased parcel data for TMK ${data?.tmk || 'lookup'}`
      };
    
    case 'zoning':
      return {
        name: DATA_SOURCES.hawaiiZoning.name,
        provider: DATA_SOURCES.hawaiiZoning.provider,
        description: DATA_SOURCES.hawaiiZoning.description,
        viewUrl: data?.lat && data?.lng
          ? DATA_SOURCES.hawaiiZoning.layerUrl(data.lat, data.lng)
          : undefined
      };
    
    case 'flood':
      return {
        name: DATA_SOURCES.hawaiiFlood.name,
        provider: DATA_SOURCES.hawaiiFlood.provider,
        description: DATA_SOURCES.hawaiiFlood.description,
        viewUrl: data?.lat && data?.lng
          ? DATA_SOURCES.hawaiiFlood.layerUrl(data.lat, data.lng)
          : undefined
      };
    
    case 'assessor':
      return {
        name: DATA_SOURCES.qpublicAssessor.name,
        provider: DATA_SOURCES.qpublicAssessor.provider,
        description: DATA_SOURCES.qpublicAssessor.description,
        viewUrl: data?.tmk 
          ? DATA_SOURCES.qpublicAssessor.recordUrl(data.tmk)
          : undefined
      };
    
    case 'sma':
      return {
        name: DATA_SOURCES.hawaiiSMA.name,
        provider: DATA_SOURCES.hawaiiSMA.provider,
        description: data?.inSMA 
          ? 'Property is in coastal management zone' 
          : 'Property outside SMA'
      };
    
    case 'water':
      return {
        name: DATA_SOURCES.bwsWater.name,
        provider: DATA_SOURCES.bwsWater.provider,
        description: data?.isPassZone === true
          ? 'City water available (Pass Zone)'
          : 'No-Pass Zone or outside service area'
      };
    
    case 'sewer':
      return {
        name: DATA_SOURCES.sewerService.name,
        provider: DATA_SOURCES.sewerService.provider,
        description: data?.hasSewerAccess
          ? `${data.sewerMainsNearby} sewer main(s) within 50m`
          : 'No city sewer within 50m'
      };
    
    case 'rail':
      return {
        name: DATA_SOURCES.hartRail.name,
        provider: DATA_SOURCES.hartRail.provider,
        description: data?.nearestStation
          ? `Nearest: ${data.nearestStation} (${data.distanceMiles} mi)`
          : 'Rail proximity calculated',
        viewUrl: DATA_SOURCES.hartRail.stationUrl(data?.nearestStation || '')
      };
    
    case 'permit':
      return {
        name: DATA_SOURCES.dppPermits.name,
        provider: DATA_SOURCES.dppPermits.provider,
        description: DATA_SOURCES.dppPermits.description,
        viewUrl: data?.tmk
          ? DATA_SOURCES.dppPermits.recordUrl(data.tmk)
          : undefined
      };
    
    default:
      return undefined;
  }
}
