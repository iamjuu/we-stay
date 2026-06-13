import type { JourneyDocument } from "@/lib/journey-types";

export type AdminJourneyRow = {
  journeyId: string;
  updatedAt: string;
  createdAt: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  planId: string;
  hasConfigurator: boolean;
};

function addressFromSnapshot(raw: unknown): string {
  if (!raw || typeof raw !== "object") return "—";
  const address = (raw as Record<string, unknown>).address;
  return typeof address === "string" && address.trim() ? address.trim() : "—";
}

export function journeyToAdminRow(doc: JourneyDocument): AdminJourneyRow {
  const first = doc.contact?.firstName?.trim() ?? "";
  const last = doc.contact?.lastName?.trim() ?? "";
  const contactName = `${first} ${last}`.trim() || "—";

  return {
    journeyId: doc.journeyId,
    updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : String(doc.updatedAt ?? ""),
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt ?? ""),
    contactName,
    email: doc.contact?.email?.trim() || "—",
    phone: doc.contact?.phone?.trim() || "—",
    address: addressFromSnapshot(doc.eligibilitySnapshot),
    planId: doc.configuratorSummary?.planId?.trim() || "—",
    hasConfigurator: Boolean(doc.configuratorSummary),
  };
}

export function adminUnauthorizedResponse() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
