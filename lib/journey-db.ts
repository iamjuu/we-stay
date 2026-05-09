import type { JourneyDocument, JourneyPatch } from "@/lib/journey-types";
import { getUserDatasCollection } from "@/lib/mongodb";

function sanitizePatch(patch: JourneyPatch): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (patch.maxNavIndex !== undefined) out.maxNavIndex = patch.maxNavIndex;
  if (patch.eligibilitySnapshot !== undefined) out.eligibilitySnapshot = patch.eligibilitySnapshot;
  if (patch.contact !== undefined) out.contact = patch.contact;
  if (patch.buildSelections !== undefined) out.buildSelections = patch.buildSelections;
  if (patch.configuratorSummary !== undefined) out.configuratorSummary = patch.configuratorSummary;
  return out;
}

function ownerOf(doc: JourneyDocument): string | undefined {
  return doc.browserUserId ?? doc.userId;
}

export async function getJourneyByJourneyId(journeyId: string): Promise<JourneyDocument | null> {
  const col = await getUserDatasCollection();
  if (!col) return null;
  const doc = await col.findOne({ journeyId });
  return doc as unknown as JourneyDocument | null;
}

/** Returns false if the journey exists and belongs to another browser id. */
export async function mergeJourney(
  journeyId: string,
  browserUserId: string,
  patch: JourneyPatch
): Promise<boolean> {
  const col = await getUserDatasCollection();
  if (!col) return false;
  const existing = await col.findOne({ journeyId });
  const now = new Date();
  if (existing) {
    const owner = ownerOf(existing as unknown as JourneyDocument);
    if (owner && owner !== browserUserId) return false;
  }
  const prevMax = (existing?.maxNavIndex as number | undefined) ?? 0;
  const sanitized = sanitizePatch(patch) as Record<string, unknown>;
  if (patch.maxNavIndex !== undefined) {
    sanitized.maxNavIndex = Math.max(prevMax, patch.maxNavIndex);
  }
  /** Do not put `browserUserId` in `$set` — it is in `$setOnInsert` and Mongo rejects both (error 40). */
  const $set = { ...sanitized, updatedAt: now };
  await col.updateOne(
    { journeyId },
    {
      $set: $set,
      $setOnInsert: { journeyId, browserUserId, createdAt: now },
    },
    { upsert: true }
  );
  return true;
}
