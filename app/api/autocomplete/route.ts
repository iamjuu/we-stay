import { NextRequest, NextResponse } from 'next/server';
import { GOOGLE_PLACES_AUTOCOMPLETE_URL } from '@/lib/constants';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const input = searchParams.get('input');

  if (!input) {
    return NextResponse.json({ error: 'Missing input parameter' }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Google API key not configured' }, { status: 500 });
  }

  try {
    const params = new URLSearchParams({
      input,
      key: apiKey,
      types: 'address',
      components: 'country:us',
      // Bias results toward Hawaii
      location: '21.3069,-157.8583',
      radius: '50000',
      strictbounds: 'false',
    });

    const response = await fetch(`${GOOGLE_PLACES_AUTOCOMPLETE_URL}?${params}`);
    const data = await response.json();

    // Filter to only Hawaii addresses
    const hawaiiPredictions = data.predictions?.filter((p: { description: string }) =>
      p.description.includes('HI') || p.description.includes('Hawaii')
    ) || [];

    return NextResponse.json({
      predictions: hawaiiPredictions,
      status: data.status,
    });
  } catch (error) {
    console.error('Autocomplete API error:', error);
    return NextResponse.json({ error: 'Failed to fetch autocomplete suggestions' }, { status: 500 });
  }
}




