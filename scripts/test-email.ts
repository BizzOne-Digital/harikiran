/**
 * Quick SMTP smoke test — run before going live.
 * Usage: npx tsx scripts/test-email.ts
 */
import dotenv from "dotenv";
import { resolve } from "path";
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import nodemailer from "nodemailer";

const user = process.env.GMAIL_USER;
const pass = process.env.GMAIL_APP_PASSWORD;

if (!user || !pass) {
  console.error("❌  GMAIL_USER or GMAIL_APP_PASSWORD missing in .env.local");
  process.exit(1);
}

// Strip any accidental spaces from the app password
const cleanPass = pass.replace(/\s/g, "");

async function main() {
  console.log(`\n📧  Testing Gmail SMTP for: ${user}`);
  console.log(`🔑  App password length: ${cleanPass.length} chars (expected 16)\n`);

  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass: cleanPass },
  });

  // Step 1 — verify credentials
  try {
    await transport.verify();
    console.log("✅  SMTP credentials verified — connection successful");
  } catch (err) {
    console.error("❌  SMTP verification failed:", err);
    console.log("\nCommon causes:");
    console.log("  • 2-Step Verification not enabled on the Google account");
    console.log("  • App password copied with spaces (we strip them, but double-check)");
    console.log("  • Wrong app password — re-generate at https://myaccount.google.com/apppasswords");
    transport.close();
    process.exit(1);
  }

  // Step 2 — send a real test email
  try {
    const info = await transport.sendMail({
      from: `TopAdvice4U Test <${user}>`,
      to: user, // send to yourself
      subject: "✅ TopAdvice4U — SMTP Test Email",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #e2e8f0;border-radius:8px;">
          <h2 style="color:#001f3f;margin-top:0;">SMTP Test Successful</h2>
          <p style="color:#4a5568;">This confirms that Gmail SMTP is correctly configured for <strong>TopAdvice4U</strong>.</p>
          <p style="color:#4a5568;">When visitors submit the contact form, you will receive a notification email like this.</p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;" />
          <p style="font-size:12px;color:#a0aec0;">Sent from scripts/test-email.ts</p>
        </div>
      `,
      text: "SMTP Test Successful — Gmail SMTP is correctly configured for TopAdvice4U.",
    });
    console.log(`✅  Test email sent! Message ID: ${info.messageId}`);
    console.log(`📥  Check your inbox at: ${user}`);
  } catch (err) {
    console.error("❌  Email send failed:", err);
  } finally {
    transport.close();
  }
}

main();
