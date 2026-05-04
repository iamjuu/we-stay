import { NextRequest, NextResponse } from 'next/server';
import { chromium } from 'playwright';
import { DPP_PERMIT_URL } from '@/lib/constants';

interface PermitRecord {
  recordId: string;
  type: string;
  description: string;
  status: string;
  createdDate: string;
}

interface ViolationRecord {
  violationId: string;
  type: string;
  description: string;
  status: string;
  isOpen: boolean;
}

async function scrapePermitHistory(tmk: string) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(`${DPP_PERMIT_URL}global-search/${tmk}`, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    await page.waitForTimeout(3000);

    const permits: PermitRecord[] = [];
    const applications: PermitRecord[] = [];
    const violations: ViolationRecord[] = [];
    let hasExistingADU = false;

    const permitElements = await page.$$('[data-component-id*="Permit"]').catch(() => []);
    for (const element of permitElements) {
      const text = await element.textContent().catch(() => '');
      if (text) {
        const recordId = text.match(/\d{2}-\d{6}/)?.[0] || '';
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        
        permits.push({
          recordId,
          type: lines[0] || '',
          description: lines[1] || '',
          status: lines.find(l => l.includes('Status:'))?.replace('Status:', '').trim() || '',
          createdDate: lines.find(l => l.includes('Created:'))?.replace('Created:', '').trim() || '',
        });

        if (text.toLowerCase().includes('adu') || 
            text.toLowerCase().includes('accessory dwelling') ||
            text.toLowerCase().includes('ohana')) {
          hasExistingADU = true;
        }
      }
    }

    const applicationElements = await page.$$('[data-component-id*="Application"]').catch(() => []);
    for (const element of applicationElements) {
      const text = await element.textContent().catch(() => '');
      if (text) {
        const recordId = text.match(/\d{2}-\d{6}/)?.[0] || '';
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        
        applications.push({
          recordId,
          type: lines[0] || '',
          description: lines[1] || '',
          status: lines.find(l => l.includes('Status:'))?.replace('Status:', '').trim() || '',
          createdDate: lines.find(l => l.includes('Created:'))?.replace('Created:', '').trim() || '',
        });

        if (text.toLowerCase().includes('adu') || 
            text.toLowerCase().includes('accessory dwelling') ||
            text.toLowerCase().includes('ohana')) {
          hasExistingADU = true;
        }
      }
    }

    const violationElements = await page.$$('[data-component-id*="Violation"]').catch(() => []);
    const openStatuses = ['NOV ISSUED', 'NOO ISSUED', 'REFERRED', 'IN PROGRESS', 'PENDING'];
    
    for (const element of violationElements) {
      const text = await element.textContent().catch(() => '');
      if (text) {
        const violationId = text.match(/\d{2}-\d{6}/)?.[0] || '';
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        const status = lines.find(l => l.includes('Status:'))?.replace('Status:', '').trim() || '';
        const isOpen = openStatuses.some(s => status.toUpperCase().includes(s));
        
        violations.push({
          violationId,
          type: lines[0] || '',
          description: lines[1] || '',
          status,
          isOpen,
        });
      }
    }

    await browser.close();

    const openViolations = violations.filter(v => v.isOpen);

    return {
      tmk,
      permits,
      applications,
      violations,
      openViolations,
      hasExistingADU,
      totalPermits: permits.length,
      totalApplications: applications.length,
      totalViolations: violations.length,
      openViolationCount: openViolations.length,
    };
  } catch (error) {
    await browser.close();
    throw error;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tmk = searchParams.get('tmk');

  if (!tmk) {
    return NextResponse.json({ error: 'Missing TMK parameter' }, { status: 400 });
  }

  try {
    const data = await scrapePermitHistory(tmk);

    return NextResponse.json({
      success: true,
      ...data,
      message: data.hasExistingADU 
        ? 'Existing ADU/Ohana permit found - ADU may already exist'
        : data.openViolationCount > 0
        ? `${data.openViolationCount} open violation(s) - Must resolve before ADU application`
        : 'No ADU permits or open violations found',
    });
  } catch (error) {
    console.error('Permit API error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch permit data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
