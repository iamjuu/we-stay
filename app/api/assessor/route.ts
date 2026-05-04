import { NextRequest, NextResponse } from 'next/server';
import { chromium } from 'playwright';
import Anthropic from '@anthropic-ai/sdk';
import { QPUBLIC_BASE_URL, QPUBLIC_APP_ID, CLAUDE_HAIKU_MODEL } from '@/lib/constants';

interface BuildingInfo {
  buildingNumber: number;
  livingAreaSqFt: number;
  type: 'residential' | 'commercial';
  occupancy?: string;
  yearBuilt?: number;
}

interface AssessorResponse {
  success: boolean;
  tmk: string;
  buildings: BuildingInfo[];
  totalLivingAreaSqFt: number;
  error?: string;
}

const EXTRACTION_PROMPT = `You are extracting building/improvement information from a Hawaii property assessor webpage.

Extract ALL buildings with their living area square footage. Look for:
1. "Residential Improvement Information" sections - extract "Living Area" for each building
2. "Commercial Improvement Information" sections - extract "Area" for each floor/section and sum them per building

Return a JSON object with this exact structure:
{
  "buildings": [
    {
      "buildingNumber": 1,
      "livingAreaSqFt": 1664,
      "type": "residential",
      "occupancy": "SINGLE-FAMILY",
      "yearBuilt": 1940
    }
  ]
}

Rules:
- For residential buildings, use the "Living Area" field directly
- For commercial buildings, sum all "Area" values for each building card
- buildingNumber should match the "Building Number" field
- type should be "residential" or "commercial" based on which section it came from
- If no buildings are found, return {"buildings": []}
- Only return valid JSON, no other text

Here is the page content:
`;

async function extractWithHaiku(pageContent: string): Promise<BuildingInfo[]> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const response = await anthropic.messages.create({
    model: CLAUDE_HAIKU_MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: EXTRACTION_PROMPT + pageContent,
      },
    ],
  });

  // Extract the text content from the response
  const textContent = response.content.find((block) => block.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response from Haiku');
  }

  // Parse the JSON response
  const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse JSON from Haiku response');
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return parsed.buildings || [];
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tmk = searchParams.get('tmk');

  if (!tmk) {
    return NextResponse.json({ error: 'Missing tmk parameter' }, { status: 400 });
  }

  // Validate TMK format (should be numeric, typically 12 digits for Honolulu)
  if (!/^\d+$/.test(tmk)) {
    return NextResponse.json({ error: 'Invalid TMK format' }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
  }

  let browser = null;

  try {
    // Construct the qPublic URL
    const qpublicUrl = `${QPUBLIC_BASE_URL}?AppID=${QPUBLIC_APP_ID}&PageTypeID=4&KeyValue=${tmk}`;

    // Launch browser
    browser = await chromium.launch({
      headless: true,
    });

    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    const page = await context.newPage();

    // Navigate to the qPublic page
    await page.goto(qpublicUrl, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    // Wait for the main content to load
    await page.waitForSelector('main', { timeout: 10000 }).catch(() => {
      // Main might not exist, continue anyway
    });

    // Get the page content - we'll extract the relevant sections
    const pageContent = await page.evaluate(() => {
      // Get text content from the main sections we care about
      const sections: string[] = [];

      // Look for Residential Improvement Information
      const residentialSections = document.querySelectorAll(
        '[class*="Residential"], [id*="Residential"]'
      );
      residentialSections.forEach((section) => {
        sections.push(section.textContent || '');
      });

      // Look for Commercial Improvement Information
      const commercialSections = document.querySelectorAll(
        '[class*="Commercial"], [id*="Commercial"]'
      );
      commercialSections.forEach((section) => {
        sections.push(section.textContent || '');
      });

      // If no specific sections found, get the whole main content
      if (sections.length === 0) {
        const main = document.querySelector('main');
        if (main) {
          sections.push(main.textContent || '');
        } else {
          // Fallback to body
          sections.push(document.body.textContent || '');
        }
      }

      return sections.join('\n\n---\n\n');
    });

    await browser.close();
    browser = null;

    // Check if we got blocked or got an error page
    if (
      pageContent.includes('blocked') ||
      pageContent.includes('Access Denied') ||
      pageContent.length < 100
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Could not access assessor page - may be blocked or TMK not found',
          tmk,
          buildings: [],
          totalLivingAreaSqFt: 0,
        } as AssessorResponse,
        { status: 503 }
      );
    }

    // Extract building info using Haiku
    const buildings = await extractWithHaiku(pageContent);

    // Calculate total living area
    const totalLivingAreaSqFt = buildings.reduce((sum, b) => sum + (b.livingAreaSqFt || 0), 0);

    const response: AssessorResponse = {
      success: true,
      tmk,
      buildings,
      totalLivingAreaSqFt,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Assessor API error:', error);

    if (browser) {
      await browser.close().catch(() => {});
    }

    const rawMessage = error instanceof Error ? error.message : String(error);
    const anthropicAuthFail =
      /invalid x-api-key|authentication_error|401/i.test(rawMessage);

    return NextResponse.json(
      {
        success: false,
        error: anthropicAuthFail
          ? 'Invalid or unauthorized ANTHROPIC_API_KEY. Create or rotate a key at https://console.anthropic.com/ and set it in .env.local.'
          : rawMessage || 'Failed to fetch assessor data',
        tmk: tmk || '',
        buildings: [],
        totalLivingAreaSqFt: 0,
        ...(anthropicAuthFail ? { code: 'ANTHROPIC_AUTH' as const } : {}),
      } as AssessorResponse,
      { status: anthropicAuthFail ? 401 : 500 }
    );
  }
}

























