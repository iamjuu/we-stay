import { NextRequest, NextResponse } from 'next/server';
import { HAWAII_ZONING_URL, ADU_ELIGIBLE_ZONES } from '@/lib/constants';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Missing lat/lng parameters' }, { status: 400 });
  }

  try {
    const params = new URLSearchParams({
      geometry: `${lng},${lat}`,
      geometryType: 'esriGeometryPoint',
      spatialRel: 'esriSpatialRelIntersects',
      outFields: 'zone_class,zoning_des,zoning_lab,loaddate',
      returnGeometry: 'false',
      f: 'json',
      inSR: '4326',
    });

    // Disable SSL verification for Hawaii GIS
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    
    const response = await fetch(`${HAWAII_ZONING_URL}?${params}`);
    const data = await response.json();

    // Re-enable SSL verification
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';

    if (data.features && data.features.length > 0) {
      const attrs = data.features[0].attributes;
      const zoneClass = attrs.zone_class || '';
      
      // Check if zone is ADU eligible
      const isAduEligible = ADU_ELIGIBLE_ZONES.some(zone => 
        zoneClass.toUpperCase().includes(zone.toUpperCase())
      );
      
      return NextResponse.json({
        success: true,
        zoneClass: attrs.zone_class,
        zoningDescription: attrs.zoning_des,
        zoningLabel: attrs.zoning_lab,
        loadDate: attrs.loaddate,
        isAduEligible,
        aduNote: isAduEligible 
          ? 'ADUs permitted subject to LUO ʻohana standards and site-specific compliance'
          : 'Non-residential zone - verify ADU eligibility with DPP',
      });
    }

    return NextResponse.json({
      success: false,
      error: 'No zoning data found at coordinates',
    });
  } catch (error) {
    console.error('Zoning API error:', error);
    return NextResponse.json({ error: 'Failed to fetch zoning data' }, { status: 500 });
  }
}




