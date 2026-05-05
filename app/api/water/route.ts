import { NextRequest, NextResponse } from 'next/server';
import { BWS_WATER_URL } from '@/lib/constants';

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
      outFields: 'PASS,pass',
      returnGeometry: 'false',
      f: 'json',
      inSR: '4326',
    });

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const response = await fetch(`${BWS_WATER_URL}?${params}`);
    const data = await response.json();
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';

    if (data.features && data.features.length > 0) {
      const attrs = data.features[0].attributes;
      const passValue = attrs.PASS ?? attrs.pass;
      const isPassZone = passValue === 1;
      
      return NextResponse.json({
        success: true,
        isPassZone,
        passValue,
        message: isPassZone 
          ? 'City water service available (Pass Zone)'
          : 'No-Pass Zone - may require private well or water catchment',
      });
    }

    return NextResponse.json({
      success: true,
      isPassZone: null,
      message: 'No BWS data for this location - may be outside service area',
    });
  } catch (error) {
    console.error('Water API error:', error);
    return NextResponse.json({ error: 'Failed to fetch water data' }, { status: 500 });
  }
}
