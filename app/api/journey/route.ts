import { NextResponse } from "next/server";
import { getJourneyByJourneyId, mergeJourney } from "@/lib/journey-db";
import type { JourneyDocument, JourneyPatch } from "@/lib/journey-types";

function ownedBy(doc: JourneyDocument, browserUserId: string): boolean {
  const owner = doc.browserUserId ?? doc.userId;
  if (!owner) return true;
  return owner === browserUserId;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const journeyId = searchParams.get("journeyId")?.trim();
  const browserUserId = searchParams.get("browserUserId")?.trim();
  if (!journeyId || !browserUserId) {
    return NextResponse.json({ error: "journeyId and browserUserId required" }, { status: 400 });
  }
  const doc = await getJourneyByJourneyId(journeyId);
  if (!doc) {
    return NextResponse.json({ journeyId, browserUserId, maxNavIndex: 0 });
  }
  if (!ownedBy(doc, browserUserId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({
    journeyId: doc.journeyId,
    browserUserId: doc.browserUserId ?? doc.userId,
    maxNavIndex: doc.maxNavIndex ?? 0,
    contact: doc.contact ?? null,
    buildSelections: doc.buildSelections ?? null,
    hasEligibility: Boolean(doc.eligibilitySnapshot),
    hasConfigurator: Boolean(doc.configuratorSummary),
  });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { journeyId?: string; browserUserId?: string } & JourneyPatch;
    const journeyId = body.journeyId?.trim();
    const browserUserId = body.browserUserId?.trim();
    if (!journeyId || !browserUserId) {
      return NextResponse.json({ error: "journeyId and browserUserId required" }, { status: 400 });
    }
    const existing = await getJourneyByJourneyId(journeyId);
    if (existing && !ownedBy(existing, browserUserId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const patch: JourneyPatch = {};
    if (typeof body.maxNavIndex === "number") patch.maxNavIndex = body.maxNavIndex;
    if (body.eligibilitySnapshot !== undefined) patch.eligibilitySnapshot = body.eligibilitySnapshot;
    if (body.contact !== undefined) patch.contact = body.contact;
    if (body.buildSelections !== undefined) patch.buildSelections = body.buildSelections;
    if (body.configuratorSummary !== undefined) patch.configuratorSummary = body.configuratorSummary;

    const ok = await mergeJourney(journeyId, browserUserId, patch);
    if (!ok) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }
    const doc = await getJourneyByJourneyId(journeyId);
    return NextResponse.json({
      ok: true,
      maxNavIndex: doc?.maxNavIndex ?? 0,
    });
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
}
