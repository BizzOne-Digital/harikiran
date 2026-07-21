/**
 * Dev helper: POST sign-in using env credentials (password not logged).
 * Usage: npx tsx scripts/test-sign-in.ts
 */
import dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
  const base =
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3002";
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.error("Missing ADMIN_EMAIL / ADMIN_PASSWORD");
    process.exit(1);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch(`${base}/api/auth/sign-in/email`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: base,
        referer: `${base}/admin/login`,
      },
      body: JSON.stringify({ email, password }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    const text = await res.text();
    console.log("status:", res.status);
    console.log("set-cookie:", res.headers.getSetCookie?.() ?? res.headers.get("set-cookie"));
    console.log("body:", text.slice(0, 500));
  } catch (e) {
    clearTimeout(timer);
    console.error("request failed:", e instanceof Error ? e.message : e);
    process.exit(1);
  }
}

main();
