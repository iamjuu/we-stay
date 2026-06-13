import { NextResponse } from "next/server";
import { getAdminSessionUsername } from "@/lib/admin-auth";
import { updateAdministratorPassword } from "@/lib/admin-db";

export async function POST(req: Request) {
  const username = await getAdminSessionUsername();
  if (!username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    };
    const currentPassword = body.currentPassword ?? "";
    const newPassword = body.newPassword ?? "";
    const confirmPassword = body.confirmPassword ?? "";

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: "All password fields are required" }, { status: 400 });
    }
    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "New passwords do not match" }, { status: 400 });
    }

    const result = await updateAdministratorPassword(username, currentPassword, newPassword);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("admin/password", e);
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
  }
}
