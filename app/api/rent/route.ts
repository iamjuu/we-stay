import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const dbUrl = process.env.DATABASE_URL;
const useDbSsl =
  !!dbUrl &&
  (process.env.NODE_ENV === 'production' ||
    process.env.DATABASE_SSL === '1' ||
    /\.railway\.app|proxy\.rlwy\.net|\.neon\.tech/i.test(dbUrl));

const pool = new Pool({
  connectionString: dbUrl,
  ...(useDbSsl ? { ssl: { rejectUnauthorized: false } } : {}),
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const zipCode = searchParams.get('zipCode');

  if (!zipCode) {
    return NextResponse.json({ error: 'Missing zipCode parameter' }, { status: 400 });
  }

  if (!dbUrl?.trim()) {
    return NextResponse.json(
      {
        error: 'DATABASE_URL is not configured',
        hint: 'Add DATABASE_URL to .env.local. For local dev use Railway’s public Postgres URL (not postgres.railway.internal).',
      },
      { status: 503 }
    );
  }

  try {
    const query = `
      SELECT
        zip_code,
        bedrooms,
        bathrooms,
        property_type,
        rent_estimate,
        rent_min,
        rent_max,
        comparable_count,
        last_updated
      FROM rental_rates
      WHERE zip_code = $1
      ORDER BY bedrooms, bathrooms
    `;

    const result = await pool.query(query, [zipCode]);

    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No rental data found for this zip code',
      }, { status: 404 });
    }

    // Group by bedroom/bathroom configuration
    const rentals = result.rows.map(row => ({
      bedrooms: row.bedrooms,
      bathrooms: row.bathrooms,
      propertyType: row.property_type,
      estimate: row.rent_estimate,
      min: row.rent_min,
      max: row.rent_max,
      comparableCount: row.comparable_count,
      lastUpdated: row.last_updated,
    }));

    return NextResponse.json({
      success: true,
      zipCode: zipCode,
      rentals,
    });
  } catch (error) {
    console.error('Rent API error:', error);
    const message = error instanceof Error ? error.message : String(error);
    const isDev = process.env.NODE_ENV === 'development';

    const hints: string[] = [];
    if (/railway\.internal/i.test(dbUrl || '') || /ENOTFOUND|getaddrinfo/i.test(message)) {
      hints.push(
        'postgres.railway.internal only works inside Railway. Use the public connection string from your Railway Postgres service for localhost.'
      );
    }
    if (/self-signed|SSL|certificate|ssl\"? rejected/i.test(message)) {
      hints.push('Set DATABASE_SSL=1 in .env.local if your host requires TLS.');
    }
    if (/relation\s+\"rental_rates\"/i.test(message) || /rental_rates.*does not exist/i.test(message)) {
      hints.push('Create the rental_rates table and load data (e.g. scripts/fetch-rental-data.ts with RENTCAST_API_KEY).');
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch rental data',
        ...(isDev && { details: message }),
        ...(hints.length > 0 ? { hints } : {}),
      },
      { status: 500 }
    );
  }
}
