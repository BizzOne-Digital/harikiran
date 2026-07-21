/**
 * Dev helper: verify admin credential hash (no password printed).
 * Usage: npx tsx scripts/verify-admin-login.ts
 */
import dotenv from "dotenv";
import { resolve } from "path";
import { MongoClient } from "mongodb";
import { verifyPassword } from "better-auth/crypto";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
  const uri = process.env.MONGODB_URI;
  const email = (process.env.ADMIN_EMAIL || "").toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!uri || !email || !password) {
    console.error("Missing MONGODB_URI / ADMIN_EMAIL / ADMIN_PASSWORD");
    process.exit(1);
  }

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  await client.connect();
  const db = client.db();
  const user = await db.collection("user").findOne({ email });
  if (!user) {
    console.log("userFound: false");
    await client.close();
    process.exit(2);
  }
  const account = await db.collection("account").findOne({
    userId: user.id || String(user._id),
    providerId: "credential",
  });
  if (!account?.password) {
    console.log("userFound: true");
    console.log("accountFound: false");
    await client.close();
    process.exit(3);
  }
  const ok = await verifyPassword({ hash: account.password, password });
  console.log("userFound: true");
  console.log("accountFound: true");
  console.log("passwordMatches:", ok);
  await client.close();
  process.exit(ok ? 0 : 4);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
