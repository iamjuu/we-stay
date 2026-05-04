import { NextRequest, NextResponse } from 'next/server';
import { HART_RAIL_URL, TOD_RADIUS_MILES } from '@/lib/constants';

interface RailStation {
  name: string;
  id: string | number;
  lat: number;
  lng: number;
}

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function fetchAllRailStations(): Promise<RailStation[]> {
  const params = new URLSearchParams({
    where: '1=1',
    outFields: 'STATION,ID',
    returnGeometry: 'true',
    outSR: '4326',
    f: 'json'
  });

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  const response = await fetch(`${HART_RAIL_URL}?${params}`);
  const data = await response.json();
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';

  if (!data.features) {
    throw new Error('No rail stations found');
  }

  return data.features.map((f: any) => ({
    name: f.attributes.STATION,
    id: f.attributes.ID,
    lat: f.geometry.y,
    lng: f.geometry.x
  }));
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Missing lat/lng parameters' }, { status: 400 });
  }

  try {
    const stations = await fetchAllRailStations();
    const propertyLat = parseFloat(lat);
    const propertyLng = parseFloat(lng);

    let nearestStation: RailStation | null = null;
    let minDistance = Infinity;

    for (const station of stations) {
      const distance = haversineDistance(propertyLat, propertyLng, station.lat, station.lng);
      if (distance < minDistance) {
        minDistance = distance;
        nearestStation = station;
      }
    }

    if (!nearestStation) {
      return NextResponse.json({ error: 'Failed to calculate rail proximity' }, { status: 500 });
    }

    const withinTOD = minDistance <= TOD_RADIUS_MILES;

    return NextResponse.json({
      success: true,
      nearestStation: nearestStation.name,
      distanceMiles: parseFloat(minDistance.toFixed(2)),
      distanceFeet: Math.round(minDistance * 5280),
      withinTOD,
      todRadiusMiles: TOD_RADIUS_MILES,
      totalStations: stations.length,
      message: withinTOD 
        ? `Within TOD zone (${minDistance.toFixed(2)} mi to ${nearestStation.name}) - Parking reduction eligible`
        : `${minDistance.toFixed(2)} mi to nearest station (${nearestStation.name}) - Outside TOD zone`,
    });
  } catch (error) {
    console.error('Rail API error:', error);
    return NextResponse.json({ error: 'Failed to fetch rail data' }, { status: 500 });
  }
}
