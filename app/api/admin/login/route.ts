import { NextResponse } from "next/server";
import { setAdminSessionCookie } from "@/lib/admin-auth";
import { verifyAdministratorLogin } from "@/lib/admin-db";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { username?: string; password?: string };
    const username = body.username?.trim() ?? "";
    const password = body.password ?? "";
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    const ok = await verifyAdministratorLogin(username, password);
    if (!ok) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    await setAdminSessionCookie(username);
    return NextResponse.json({ ok: true, username });
  } catch (e) {
    console.error("admin/login", e);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
