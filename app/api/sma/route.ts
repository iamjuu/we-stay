import { NextRequest, NextResponse } from 'next/server';
import { HAWAII_SMA_URL } from '@/lib/constants';

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
      outFields: 'smarea,SMAREA',
      returnGeometry: 'false',
      f: 'json',
      inSR: '4326',
    });

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const response = await fetch(`${HAWAII_SMA_URL}?${params}`);
    const data = await response.json();
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';

    if (data.features && data.features.length > 0) {
      const attrs = data.features[0].attributes;
      const inSMA = attrs.smarea === 1 || attrs.SMAREA === 1;
      
      return NextResponse.json({
        success: true,
        inSMA,
        smareaValue: attrs.smarea || attrs.SMAREA,
        message: inSMA 
          ? 'Property is in Special Management Area - additional coastal zone permits may be required'
          : 'Property is not in Special Management Area',
      });
    }

    return NextResponse.json({
      success: true,
      inSMA: false,
      message: 'Property is not in Special Management Area',
    });
  } catch (error) {
    console.error('SMA API error:', error);
    return NextResponse.json({ error: 'Failed to fetch SMA data' }, { status: 500 });
  }
}
