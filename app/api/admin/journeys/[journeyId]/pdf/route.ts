import { NextResponse } from "next/server";
import { getAdminSessionUsername } from "@/lib/admin-auth";
import { adminUnauthorizedResponse } from "@/lib/admin-journey-list";
import { buildJourneyReportPdf } from "@/lib/build-report-pdf";
import { getJourneyByJourneyId } from "@/lib/journey-db";

type RouteContext = { params: Promise<{ journeyId: string }> };

export async function GET(_req: Request, context: RouteContext) {
  const username = await getAdminSessionUsername();
  if (!username) return adminUnauthorizedResponse();

  const { journeyId } = await context.params;
  const id = journeyId?.trim();
  if (!id) {
    return NextResponse.json({ error: "Journey id required" }, { status: 400 });
  }

  const journey = await getJourneyByJourneyId(id);
  if (!journey) {
    return NextResponse.json({ error: "Journey not found" }, { status: 404 });
  }

  try {
    const pdfBuffer = await buildJourneyReportPdf(journey);
    const filename = `westay-adu-report-${id.slice(0, 8)}.pdf`;
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("admin/journeys/pdf", e);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
