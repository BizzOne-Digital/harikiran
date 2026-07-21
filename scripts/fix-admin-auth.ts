/**
 * Fix Better Auth admin user/account id mismatch and recreate credentials.
 * Usage: npx tsx scripts/fix-admin-auth.ts
 */
import dotenv from "dotenv";
import { resolve } from "path";
import { randomUUID } from "crypto";
import { MongoClient } from "mongodb";
import { hashPassword } from "better-auth/crypto";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
  const uri = process.env.MONGODB_URI;
  const email = (process.env.ADMIN_EMAIL || "").toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Harkiran Panesar";

  if (!uri || !email || !password || password.length < 10) {
    console.error("Need MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD (min 10)");
    process.exit(1);
  }

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
  await client.connect();
  const db = client.db();
  const users = db.collection("user");
  const accounts = db.collection("account");

  const existing = await users.find({ email }).toArray();
  const existingIds = existing
    .map((u) => u.id || u._id?.toString?.() || String(u._id))
    .filter(Boolean);

  await users.deleteMany({ email });
  if (existingIds.length) {
    await accounts.deleteMany({
      $or: [
        { userId: { $in: existingIds } },
        { accountId: { $in: existingIds } },
      ],
    });
  }
  // Also clear orphan credential accounts for this email flow
  await accounts.deleteMany({ providerId: "credential", userId: { $in: existingIds } });

  const userId = randomUUID();
  const now = new Date();
  // Better Auth Mongo adapter treats `_id` as `id` — keep them aligned.
  await users.insertOne({
    _id: userId as unknown as import("mongodb").ObjectId,
    name,
    email,
    emailVerified: true,
    createdAt: now,
    updatedAt: now,
    role: "super_admin",
  });

  const hashed = await hashPassword(password);
  await accounts.insertOne({
    _id: randomUUID() as unknown as import("mongodb").ObjectId,
    accountId: userId,
    providerId: "credential",
    userId,
    password: hashed,
    createdAt: now,
    updatedAt: now,
  });

  console.log("Admin auth repaired for", email);
  console.log("userId", userId);
  await client.close();
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
