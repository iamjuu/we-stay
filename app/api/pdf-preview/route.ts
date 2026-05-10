// TEMP ROUTE — delete after PDF design is finalised
import { buildJourneyReportPdf } from "@/lib/build-report-pdf";
import type { JourneyDocument } from "@/lib/journey-types";

const MOCK_JOURNEY: JourneyDocument = {
  journeyId: "preview-00000000",
  browserUserId: "preview-browser-user",
  maxNavIndex: 6,
  createdAt: new Date(),
  updatedAt: new Date(),
  contact: {
    firstName: "Kaleo",
    lastName: "Makoa",
    email: "kaleo.makoa@example.com",
    phone: "(808) 555-0147",
  },
  buildSelections: {
    goalId: "long-term",
    aduTypeId: "backyard",
    buildPreferenceId: "fast-track",
    timelineId: "6-12 months",
  },
  configuratorSummary: {
    planId: "two-bedroom",
    sidingId: "board-batten",
    claddingId: "coastal",
    roofStyle: "metal",
    interiorId: "kai",
    fundingId: "financing",
    features: { deck: true, lanai: true, shower: false },
    upgrades: {
      solar: true,
      premiumAppliances: false,
      ac: true,
      smartHome: false,
      evCharging: false,
    },
    chipLabels: [
      "Two Bedroom",
      "Board & Batten",
      "Coastal Milky White",
      "Kai",
      "Metal Roof",
      "Deck",
      "Covered Lanai",
      "Solar",
      "AC",
    ],
  },
  eligibilitySnapshot: {
    address: "91-234 Makakilo Drive, Kapolei, HI 96707",
    eligibilityResult: {
      status: "ELIGIBLE",
      passCount: 9,
      flagCount: 2,
      failCount: 1,
      aduSize: {
        maxAduSizeSqFt: 850,
        primaryDwellingSizeSqFt: 1620,
      },
      gates: [
        { name: "Lot size ≥ 3,500 SF",         status: "pass",    message: "Lot is 6,240 SF — meets minimum." },
        { name: "Single-family zoning",         status: "pass",    message: "Zoned R-5." },
        { name: "Existing dwelling on lot",     status: "pass",    message: "Primary structure confirmed." },
        { name: "No ADU already on lot",        status: "pass",    message: "No existing ADU detected." },
        { name: "Setback compliance",           status: "pass",    message: "Adequate rear setback." },
        { name: "Access to public sewer",       status: "pass",    message: "City sewer connection confirmed." },
        { name: "Not in SMA",                  status: "pass",    message: "Outside Special Management Area." },
        { name: "Flood zone",                   status: "pass",    message: "Zone X — minimal flood hazard." },
        { name: "Rail proximity",               status: "pass",    message: "Outside 300 ft rail corridor." },
        { name: "Historic district",            status: "flag",    message: "Parcel is adjacent to a historic overlay — verify with DPP before permitting." },
        { name: "Utility easement",             status: "flag",    message: "A utility easement runs along the rear 5 ft — may reduce usable build envelope." },
        { name: "Max lot coverage",             status: "fail",    message: "Proposed footprint may exceed 50 % lot coverage — site survey required." },
      ],
    },
    rentalData: {
      zip: "96707",
      rentals: [
        { bedrooms: 0, estimate: 1850, min: 1650, max: 2100, comparableCount: 14 },
        { bedrooms: 1, estimate: 2350, min: 2100, max: 2650, comparableCount: 22 },
        { bedrooms: 2, estimate: 2900, min: 2600, max: 3250, comparableCount: 18 },
      ],
    },
  },
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const download = searchParams.get("download") === "1";
  const pdf = await buildJourneyReportPdf(MOCK_JOURNEY);
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": download
        ? 'attachment; filename="westay-preview.pdf"'
        : "inline",
    },
  });
}
