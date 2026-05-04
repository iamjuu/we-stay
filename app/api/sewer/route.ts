import { NextRequest, NextResponse } from 'next/server';
import { SEWER_URL } from '@/lib/constants';

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
      distance: '50',
      units: 'esriSRUnit_Meter',
      outFields: '*',
      returnGeometry: 'false',
      f: 'json',
      inSR: '4326',
    });

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const response = await fetch(`${SEWER_URL}?${params}`);
    const data = await response.json();
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';

    const hasSewerAccess = data.features && data.features.length > 0;
    
    return NextResponse.json({
      success: true,
      hasSewerAccess,
      sewerMainsNearby: data.features?.length || 0,
      message: hasSewerAccess 
        ? `City sewer service available (${data.features.length} sewer main(s) within 50m)`
        : 'No city sewer within 50m - may require septic system or connection extension',
    });
  } catch (error) {
    console.error('Sewer API error:', error);
    return NextResponse.json({ error: 'Failed to fetch sewer data' }, { status: 500 });
  }
}
