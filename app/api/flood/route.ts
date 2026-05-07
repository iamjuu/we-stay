import { NextRequest, NextResponse } from 'next/server';
import { HAWAII_FLOOD_URL, FLOOD_ZONE_INFO, ZONE_D_ELEVATION_THRESHOLD_FT, USGS_EPQS_URL } from '@/lib/constants';

// Types for elevation lookup
interface ElevationDebug {
  epqs_response?: unknown;
  epqs_error?: string;
  epqs_url?: string;
  request_time_ms: number;
}

interface ElevationResult {
  elevation_ft: number | null;
  source: 'USGS_EPQS' | 'USGS_DEM' | 'UNKNOWN';
  debug: ElevationDebug;
}

// Debug info for Zone D elevation check
interface FloodDebug {
  zoneDTriggered: boolean;
  elevationApiCalled: boolean;
  elevationRawResponse?: unknown;
  thresholdUsed: number;
  decisionLogic: string;
  floodApiRawResponse?: unknown;
}

/**
 * Fetch elevation from USGS EPQS
 */
async function fetchElevation(lat: string, lng: string): Promise<ElevationResult> {
  const startTime = performance.now();
  const debug: ElevationDebug = { request_time_ms: 0 };

  try {
    console.log('[FLOOD-DEBUG] Calling elevation API for Zone D...');
    
    const epqsUrl = `${USGS_EPQS_URL}?x=${lng}&y=${lat}&units=Feet&wkid=4326`;
    debug.epqs_url = epqsUrl;
    
    const response = await fetch(epqsUrl, {
      headers: { 'Accept': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error(`EPQS HTTP error: ${response.status}`);
    }
    
    const data = await response.json();
    debug.epqs_response = data;
    
    console.log('[FLOOD-DEBUG] USGS EPQS response:', JSON.stringify(data, null, 2));
    
    let elevation: number | null = null;
    
    // Try primary format: { "value": 123.45 }
    if (data && typeof data.value === 'number' && data.value !== -1000000) {
      elevation = Math.round(data.value * 10) / 10;
    }
    // Try alternative format
    else if (data?.USGS_Elevation_Point_Query_Service?.Elevation_Query?.Elevation) {
      const elev = data.USGS_Elevation_Point_Query_Service.Elevation_Query.Elevation;
      if (typeof elev === 'number' && elev !== -1000000) {
        elevation = Math.round(elev * 10) / 10;
      }
    }
    
    debug.request_time_ms = Math.round(performance.now() - startTime);
    
    if (elevation !== null) {
      console.log('[FLOOD-DEBUG] Elevation result:', elevation, 'ft from USGS_EPQS');
      return { elevation_ft: elevation, source: 'USGS_EPQS', debug };
    }
    
    debug.epqs_error = 'No valid elevation in response';
    return { elevation_ft: null, source: 'UNKNOWN', debug };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    debug.epqs_error = errorMessage;
    debug.request_time_ms = Math.round(performance.now() - startTime);
    console.error('[FLOOD-DEBUG] Elevation API error:', errorMessage);
    return { elevation_ft: null, source: 'UNKNOWN', debug };
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Missing lat/lng parameters' }, { status: 400 });
  }

  console.log('[FLOOD-DEBUG] Request for lat:', lat, 'lng:', lng);

  try {
    const params = new URLSearchParams({
      geometry: `${lng},${lat}`,
      geometryType: 'esriGeometryPoint',
      spatialRel: 'esriSpatialRelIntersects',
      outFields: 'fld_zone,sfha_tf,static_bfe,zone_subty,v_datum,depth,study_typ',
      returnGeometry: 'false',
      f: 'json',
      inSR: '4326',
    });

    // Disable SSL verification for Hawaii GIS
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    
    const response = await fetch(`${HAWAII_FLOOD_URL}?${params}`);
    const data = await response.json();

    // Re-enable SSL verification
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';

    console.log('[FLOOD-DEBUG] Hawaii flood API response:', JSON.stringify(data, null, 2));

    if (data.features && data.features.length > 0) {
      const attrs = data.features[0].attributes;
      const floodZone = attrs.fld_zone || 'X';
      const isSfha = attrs.sfha_tf === 'T';
      const zoneInfo = FLOOD_ZONE_INFO[floodZone] || { risk: 'Unknown', description: 'Unknown flood zone' };
      
      console.log('[FLOOD-DEBUG] Zone detected:', floodZone, '| SFHA:', isSfha);

      // Initialize debug object
      const _debug: FloodDebug = {
        zoneDTriggered: floodZone === 'D',
        elevationApiCalled: false,
        thresholdUsed: ZONE_D_ELEVATION_THRESHOLD_FT,
        decisionLogic: '',
        floodApiRawResponse: data,
      };

      // Base response
      const baseResponse = {
        success: true,
        floodZone,
        isSfha,
        sfhaStatus: isSfha 
          ? 'Yes - Special Flood Hazard Area' 
          : floodZone === 'D' 
            ? 'unknown' 
            : 'No - Outside SFHA',
        riskLevel: zoneInfo.risk,
        description: zoneInfo.description,
        baseFloodElevation: attrs.static_bfe !== -9999 ? `${attrs.static_bfe} ft` : null,
        depth: attrs.depth !== -9999 ? `${attrs.depth} ft` : null,
        zoneSubtype: attrs.zone_subty,
        verticalDatum: attrs.v_datum,
        studyType: attrs.study_typ,
        insuranceNote: isSfha 
          ? 'Flood insurance likely required for federally-backed mortgages'
          : 'Flood insurance recommended but may not be required',
        // New Zone D elevation fields (initialized as null)
        estimatedGroundElevationFt: null as number | null,
        elevationSource: null as string | null,
        thumbsUp10ftRule: null as boolean | null,
        elevationNote: null as string | null,
        _debug,
      };

      // Zone D: Trigger elevation lookup
      if (floodZone === 'D') {
        console.log('[FLOOD-DEBUG] Zone D detected - triggering elevation lookup...');
        _debug.elevationApiCalled = true;
        
        const elevationResult = await fetchElevation(lat, lng);
        _debug.elevationRawResponse = elevationResult.debug;
        
        baseResponse.estimatedGroundElevationFt = elevationResult.elevation_ft;
        baseResponse.elevationSource = elevationResult.source;
        
        if (elevationResult.elevation_ft !== null) {
          const passesThreshold = elevationResult.elevation_ft >= ZONE_D_ELEVATION_THRESHOLD_FT;
          baseResponse.thumbsUp10ftRule = passesThreshold;
          
          console.log('[FLOOD-DEBUG] 10ft rule result:', passesThreshold ? 'PASS' : 'FAIL', 
            `(${elevationResult.elevation_ft} ft vs ${ZONE_D_ELEVATION_THRESHOLD_FT} ft threshold)`);
          
          if (passesThreshold) {
            baseResponse.elevationNote = `Prelim clearance (${elevationResult.elevation_ft} ft >= ${ZONE_D_ELEVATION_THRESHOLD_FT} ft). Final elevation must be confirmed by survey/permit review.`;
            _debug.decisionLogic = `elevation ${elevationResult.elevation_ft} >= threshold ${ZONE_D_ELEVATION_THRESHOLD_FT} → thumbs_up`;
          } else {
            baseResponse.elevationNote = `Review required (${elevationResult.elevation_ft} ft < ${ZONE_D_ELEVATION_THRESHOLD_FT} ft threshold). Elevation survey recommended.`;
            _debug.decisionLogic = `elevation ${elevationResult.elevation_ft} < threshold ${ZONE_D_ELEVATION_THRESHOLD_FT} → review_required`;
          }
        } else {
          baseResponse.thumbsUp10ftRule = null;
          baseResponse.elevationNote = 'Elevation could not be determined - manual verification required.';
          _debug.decisionLogic = 'elevation_unknown → manual_verification_required';
          console.log('[FLOOD-DEBUG] Elevation unknown - manual verification required');
        }
        
        // Update description for Zone D
        baseResponse.description = 'Flood risk is undetermined (Zone D). We pulled an estimated ground elevation. If it\'s >= 10 ft we mark preliminary clearance; final elevation must be confirmed by survey/permit review.';
      } else {
        _debug.decisionLogic = `zone ${floodZone} != D → no elevation check needed`;
      }
      
      return NextResponse.json(baseResponse);
    }

    // No flood data usually means Zone X (minimal risk)
    console.log('[FLOOD-DEBUG] No flood data found - defaulting to Zone X');
    
    return NextResponse.json({
      success: true,
      floodZone: 'X',
      isSfha: false,
      sfhaStatus: 'No - Outside SFHA',
      riskLevel: 'Low',
      description: 'Minimal flood hazard area (no explicit flood data)',
      baseFloodElevation: null,
      insuranceNote: 'Flood insurance recommended but may not be required',
      estimatedGroundElevationFt: null,
      elevationSource: null,
      thumbsUp10ftRule: null,
      elevationNote: null,
      _debug: {
        zoneDTriggered: false,
        elevationApiCalled: false,
        thresholdUsed: ZONE_D_ELEVATION_THRESHOLD_FT,
        decisionLogic: 'no_flood_data → default_zone_x',
        floodApiRawResponse: data,
      },
    });
  } catch (error) {
    console.error('[FLOOD-DEBUG] Flood API error:', error);
    return NextResponse.json({ error: 'Failed to fetch flood data' }, { status: 500 });
  }
}
