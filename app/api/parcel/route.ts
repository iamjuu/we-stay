import { NextRequest, NextResponse } from 'next/server';
import { HAWAII_PARCEL_URL } from '@/lib/constants';
import https from 'https';

// Create a custom fetch that ignores SSL errors (Hawaii GIS uses self-signed certs)
async function fetchWithSSLBypass(url: string): Promise<Response> {
  // In Node.js environment, we need to handle SSL differently
  const response = await fetch(url, {
    // @ts-expect-error - Node.js specific option
    agent: new https.Agent({ rejectUnauthorized: false }),
  });
  return response;
}

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
      outFields: 'tmk,tmk9txt,rec_area_sf,gisacres,qpub_link,zone,section,plat',
      returnGeometry: 'false',
      f: 'json',
      inSR: '4326',
    });

    // Disable SSL verification for this request
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    
    const response = await fetch(`${HAWAII_PARCEL_URL}?${params}`);
    const data = await response.json();

    // Re-enable SSL verification
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';

    if (data.features && data.features.length > 0) {
      const attrs = data.features[0].attributes;
      
      // qPublic uses TMK with trailing 0000
      const qpublicTmk = attrs.tmk ? `${attrs.tmk}0000` : null;
      
      return NextResponse.json({
        success: true,
        tmk: attrs.tmk,
        qpublicTmk: qpublicTmk,
        formattedTmk: attrs.tmk9txt ? `1${attrs.tmk9txt}` : null,
        lotSizeSqFt: attrs.rec_area_sf,
        lotSizeAcres: attrs.gisacres,
        zone: attrs.zone,
        section: attrs.section,
        plat: attrs.plat,
        assessorLink: qpublicTmk ? `https://qpublic.schneidercorp.com/Application.aspx?AppID=1045&PageTypeID=4&KeyValue=${qpublicTmk}` : null,
      });
    }

    return NextResponse.json({
      success: false,
      error: 'No parcel found at coordinates',
    });
  } catch (error) {
    console.error('Parcel API error:', error);
    return NextResponse.json({ error: 'Failed to fetch parcel data' }, { status: 500 });
  }
}
