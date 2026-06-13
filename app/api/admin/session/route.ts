import { NextResponse } from "next/server";
import { getAdminSessionUsername } from "@/lib/admin-auth";

export async function GET() {
  const username = await getAdminSessionUsername();
  if (!username) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, username });
}
