import { NextRequest, NextResponse } from 'next/server';
import { GOOGLE_GEOCODING_URL } from '@/lib/constants';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Missing address parameter' }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Google API key not configured' }, { status: 500 });
  }

  try {
    const params = new URLSearchParams({
      address,
      key: apiKey,
    });

    const response = await fetch(`${GOOGLE_GEOCODING_URL}?${params}`);
    const data = await response.json();

    if (data.status === 'OK' && data.results?.length > 0) {
      const result = data.results[0];
      const location = result.geometry.location;
      
      return NextResponse.json({
        success: true,
        formattedAddress: result.formatted_address,
        lat: location.lat,
        lng: location.lng,
        placeId: result.place_id,
        addressComponents: result.address_components,
      });
    }

    return NextResponse.json({
      success: false,
      error: data.status === 'ZERO_RESULTS' ? 'Address not found' : data.status,
    });
  } catch (error) {
    console.error('Geocoding API error:', error);
    return NextResponse.json({ error: 'Failed to geocode address' }, { status: 500 });
  }
}




