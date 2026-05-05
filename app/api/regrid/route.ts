import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Create a connection pool using the DATABASE_URL environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Non-blocking log function - doesn't slow down API response
function logRequest(tmkInput: string, success: boolean, result: object | null, errorMessage: string | null) {
  pool.query(
    `INSERT INTO api_logs (endpoint, tmk_input, success, result, error_message) 
     VALUES ($1, $2, $3, $4, $5)`,
    ['/api/regrid', tmkInput, success, result ? JSON.stringify(result) : null, errorMessage]
  ).catch(err => console.error('Failed to log request:', err));
}

async function lookupTMKInRegrid(tmk: string): Promise<any> {
  const cleanTMK = tmk.replace(/[-\s]/g, '');

  const query = `
    SELECT tmk, usecode, usedesc, numunits, suffix, parcelnumb, zoning, address
    FROM hi_honolulu
    WHERE REPLACE(REPLACE(tmk, '-', ''), ' ', '') = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [cleanTMK]);

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  return {
    tmk: row.tmk || '',
    usecode: row.usecode || '',
    usedesc: row.usedesc || '',
    numunits: row.numunits?.toString() || '',
    suffix: row.suffix || '',
    parcelnumb: row.parcelnumb || '',
    zoning: row.zoning || '',
    address: row.address || '',
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tmk = searchParams.get('tmk');

  if (!tmk) {
    logRequest('', false, null, 'Missing TMK parameter');
    return NextResponse.json({ error: 'Missing TMK parameter' }, { status: 400 });
  }

  try {
    const data = await lookupTMKInRegrid(tmk);

    if (!data) {
      logRequest(tmk, false, null, 'TMK not found in Regrid data');
      return NextResponse.json({
        success: false,
        error: 'TMK not found in Regrid data',
      }, { status: 404 });
    }

    const usedescLower = data.usedesc.toLowerCase();
    const isCPR = data.suffix && data.suffix !== '0000' && data.suffix !== '0' && data.suffix !== '';
    
    let stateLandUse = 'Unknown';
    if (usedescLower.includes('urban')) stateLandUse = 'Urban';
    else if (usedescLower.includes('agricultural')) stateLandUse = 'Agricultural';
    else if (usedescLower.includes('conservation')) stateLandUse = 'Conservation';
    else if (usedescLower.includes('rural')) stateLandUse = 'Rural';

    const responseData = {
      success: true,
      tmk: data.tmk,
      usecode: data.usecode,
      usedesc: data.usedesc,
      stateLandUse,
      suffix: data.suffix,
      isCPR,
      numunits: data.numunits,
      address: data.address,
      zoning: data.zoning,
      message: isCPR 
        ? 'CPR/Condo unit detected - ADUs typically not allowed'
        : stateLandUse === 'Conservation' 
        ? 'Conservation land - ADUs prohibited'
        : stateLandUse === 'Agricultural'
        ? 'Agricultural district - Verify Act 39 eligibility'
        : 'Property data retrieved from Regrid',
    };

    // Log successful request (non-blocking)
    logRequest(tmk, true, responseData, null);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Regrid API error:', error);
    logRequest(tmk, false, null, error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'Failed to fetch Regrid data' }, { status: 500 });
  }
}
