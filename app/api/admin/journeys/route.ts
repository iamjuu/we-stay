import { NextResponse } from "next/server";
import { getAdminSessionUsername } from "@/lib/admin-auth";
import { adminUnauthorizedResponse, journeyToAdminRow } from "@/lib/admin-journey-list";
import type { JourneyDocument } from "@/lib/journey-types";
import { getUserDatasCollection } from "@/lib/mongodb";

const PAGE_SIZE = 10;

export async function GET(req: Request) {
  const username = await getAdminSessionUsername();
  if (!username) return adminUnauthorizedResponse();

  const col = await getUserDatasCollection();
  if (!col) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const [total, docs] = await Promise.all([
    col.countDocuments({}),
    col
      .find({})
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(PAGE_SIZE)
      .toArray(),
  ]);

  const items = docs.map((d) => journeyToAdminRow(d as unknown as JourneyDocument));
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return NextResponse.json({
    items,
    page,
    pageSize: PAGE_SIZE,
    total,
    totalPages,
  });
}
