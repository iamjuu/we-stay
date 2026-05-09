/**
 * Server-only env helpers. Supports lowercase keys from .env.local.
 */

export function getMongoUri(): string | null {
  const raw = process.env.MONGODB_URI ?? process.env.mongodburl ?? "";
  const t = raw.trim().replace(/^"|"$/g, "");
  if (!t) return null;
  let u = t;
  /** Default DB `Westay` if URI ends with host only (no database path). */
  if (/\/$/.test(u) && !/\?/.test(u)) {
    u = `${u.replace(/\/$/, "")}/Westay`;
  }
  return u;
}

export function getSmtpConfig(): { from: string; user: string; pass: string } | null {
  const from = (process.env.ADMIN_MAIL ?? process.env.adminmail ?? "").trim().replace(/^"|"$/g, "");
  const pass = (process.env.APP_PASSWORD ?? process.env.apppassword ?? "").trim().replace(/^"|"$/g, "");
  if (!from || !pass) return null;
  return { from, user: from, pass };
}
