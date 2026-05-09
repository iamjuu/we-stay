export function getMongoUri(): string | null {
  const raw = process.env.MONGODB_URI ?? "";
  const t = raw.trim().replace(/^"|"$/g, "");
  if (!t) return null;
  let u = t;
  if (/\/$/.test(u) && !/\?/.test(u)) {
    u = `${u.replace(/\/$/, "")}/Westay`;
  }
  return u;
}

export function getSmtpConfig(): { from: string; user: string; pass: string } | null {
  const from = (process.env.ADMIN_MAIL ?? "").trim().replace(/^"|"$/g, "");
  const pass = (process.env.APP_PASSWORD ?? "").trim().replace(/^"|"$/g, "");
  if (!from || !pass) return null;
  return { from, user: from, pass };
}
