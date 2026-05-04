import { NextRequest, NextResponse } from 'next/server';
import { USGS_EPQS_URL } from '@/lib/constants';

export type ElevationSource = 'USGS_EPQS' | 'USGS_DEM' | 'UNKNOWN';

export interface ElevationDebug {
  epqs_response?: unknown;
  epqs_error?: string;
  epqs_url?: string;
  dem_response?: unknown;
  dem_error?: string;
  request_time_ms: number;
}

export interface ElevationResult {
  success: boolean;
  elevation_ft: number | null;
  source: ElevationSource;
  debug: ElevationDebug;
  error?: string;
}

/**
 * Elevation Lookup API
 * 
 * Priority order:
 * 1. USGS National Map Elevation Point Query Service (EPQS)
 * 2. (Future) USGS 3DEP DEM for Hawaii
 * 
 * Query params: lat, lng
 * Returns elevation in feet with debug info
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const startTime = performance.now();

  console.log('[ELEVATION-DEBUG] Request received:', { lat, lng });

  if (!lat || !lng) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Missing lat/lng parameters',
        elevation_ft: null,
        source: 'UNKNOWN' as ElevationSource,
        debug: { request_time_ms: Math.round(performance.now() - startTime) }
      } satisfies ElevationResult,
      { status: 400 }
    );
  }

  const debug: ElevationDebug = {
    request_time_ms: 0,
  };

  // Try USGS EPQS first
  try {
    console.log('[ELEVATION-DEBUG] Attempting USGS EPQS lookup...');
    
    // USGS EPQS API format: ?x={lng}&y={lat}&units=Feet&wkid=4326
    const epqsUrl = `${USGS_EPQS_URL}?x=${lng}&y=${lat}&units=Feet&wkid=4326`;
    debug.epqs_url = epqsUrl;
    
    console.log('[ELEVATION-DEBUG] EPQS URL:', epqsUrl);
    
    const epqsResponse = await fetch(epqsUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!epqsResponse.ok) {
      throw new Error(`EPQS HTTP error: ${epqsResponse.status} ${epqsResponse.statusText}`);
    }
    
    const epqsData = await epqsResponse.json();
    debug.epqs_response = epqsData;
    
    console.log('[ELEVATION-DEBUG] EPQS raw response:', JSON.stringify(epqsData, null, 2));
    
    // EPQS returns elevation in the 'value' field
    // Response format: { "value": 123.45, "unit": "Feet", ... }
    let elevation: number | null = null;
    
    if (epqsData && typeof epqsData.value === 'number' && epqsData.value !== -1000000) {
      // -1000000 is EPQS's "no data" value
      elevation = Math.round(epqsData.value * 10) / 10; // Round to 1 decimal
      console.log('[ELEVATION-DEBUG] EPQS elevation:', elevation, 'ft');
    } else if (epqsData && epqsData.USGS_Elevation_Point_Query_Service) {
      // Alternative response format
      const queryResult = epqsData.USGS_Elevation_Point_Query_Service.Elevation_Query;
      if (queryResult && typeof queryResult.Elevation === 'number' && queryResult.Elevation !== -1000000) {
        elevation = Math.round(queryResult.Elevation * 10) / 10;
        console.log('[ELEVATION-DEBUG] EPQS elevation (alt format):', elevation, 'ft');
      }
    }
    
    if (elevation !== null) {
      debug.request_time_ms = Math.round(performance.now() - startTime);
      
      console.log('[ELEVATION-DEBUG] Success! Elevation:', elevation, 'ft from USGS_EPQS');
      console.log('[ELEVATION-DEBUG] Request time:', debug.request_time_ms, 'ms');
      
      return NextResponse.json({
        success: true,
        elevation_ft: elevation,
        source: 'USGS_EPQS' as ElevationSource,
        debug,
      } satisfies ElevationResult);
    }
    
    // EPQS returned no valid data
    debug.epqs_error = 'No valid elevation data in response';
    console.log('[ELEVATION-DEBUG] EPQS returned no valid data');
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    debug.epqs_error = errorMessage;
    console.error('[ELEVATION-DEBUG] EPQS error:', errorMessage);
  }

  // Future: Try USGS 3DEP DEM as fallback
  // For now, we just return unknown if EPQS fails
  console.log('[ELEVATION-DEBUG] All elevation sources failed, returning UNKNOWN');
  
  debug.request_time_ms = Math.round(performance.now() - startTime);

  return NextResponse.json({
    success: false,
    elevation_ft: null,
    source: 'UNKNOWN' as ElevationSource,
    debug,
  } satisfies ElevationResult);
}


