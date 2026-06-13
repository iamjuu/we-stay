import { getMongoClient, MONGO_DB_NAME } from "@/lib/mongodb";
import { hashAdminPassword, verifyAdminPassword } from "@/lib/admin-password";

export const ADMINISTRATOR_COLLECTION = "administrator";

export const DEFAULT_ADMIN_USERNAME = "westayhome";
export const DEFAULT_ADMIN_PASSWORD = "westay@#123456";

export type AdministratorDocument = {
  username: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function getAdministratorCollection() {
  const client = await getMongoClient();
  if (!client) return null;
  return client.db(MONGO_DB_NAME).collection<AdministratorDocument>(ADMINISTRATOR_COLLECTION);
}

export async function ensureDefaultAdmin(): Promise<void> {
  const col = await getAdministratorCollection();
  if (!col) return;
  const existing = await col.findOne({ username: DEFAULT_ADMIN_USERNAME });
  if (existing) return;
  const now = new Date();
  await col.insertOne({
    username: DEFAULT_ADMIN_USERNAME,
    passwordHash: hashAdminPassword(DEFAULT_ADMIN_PASSWORD),
    createdAt: now,
    updatedAt: now,
  });
}

export async function verifyAdministratorLogin(
  username: string,
  password: string
): Promise<boolean> {
  await ensureDefaultAdmin();
  const col = await getAdministratorCollection();
  if (!col) return false;
  const doc = await col.findOne({ username: username.trim() });
  if (!doc) return false;
  return verifyAdminPassword(password, doc.passwordHash);
}

export async function updateAdministratorPassword(
  username: string,
  currentPassword: string,
  newPassword: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const col = await getAdministratorCollection();
  if (!col) return { ok: false, error: "Database not configured" };

  const doc = await col.findOne({ username });
  if (!doc) return { ok: false, error: "Admin not found" };
  if (!verifyAdminPassword(currentPassword, doc.passwordHash)) {
    return { ok: false, error: "Current password is incorrect" };
  }
  if (newPassword.length < 8) {
    return { ok: false, error: "New password must be at least 8 characters" };
  }

  await col.updateOne(
    { username },
    { $set: { passwordHash: hashAdminPassword(newPassword), updatedAt: new Date() } }
  );
  return { ok: true };
}
