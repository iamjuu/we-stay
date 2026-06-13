import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "westay-admin-session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type SessionPayload = {
  u: string;
  exp: number;
};

function sessionSecret(): string {
  const fromEnv = (process.env.ADMIN_SESSION_SECRET ?? "").trim();
  if (fromEnv) return fromEnv;
  const mail = (process.env.ADMIN_MAIL ?? "").trim();
  const pass = (process.env.APP_PASSWORD ?? "").trim();
  if (mail && pass) return `${mail}:${pass}:westay-admin`;
  return "westay-admin-dev-secret-change-in-production";
}

function signPayload(encoded: string): string {
  return createHmac("sha256", sessionSecret()).update(encoded).digest("base64url");
}

export function createAdminSessionToken(username: string): string {
  const payload: SessionPayload = {
    u: username,
    exp: Date.now() + SESSION_TTL_MS,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = signPayload(encoded);
  return `${encoded}.${sig}`;
}

function parseSessionToken(token: string): SessionPayload | null {
  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return null;
  const expected = signPayload(encoded);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;
    if (!payload.u || typeof payload.exp !== "number") return null;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getAdminSessionUsername(): Promise<string | null> {
  const jar = await cookies();
  const token = jar.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = parseSessionToken(token);
  return payload?.u ?? null;
}

export async function setAdminSessionCookie(username: string): Promise<void> {
  const jar = await cookies();
  jar.set(ADMIN_SESSION_COOKIE, createAdminSessionToken(username), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(ADMIN_SESSION_COOKIE);
}
