/**
 * Email module — Gmail SMTP via nodemailer (primary).
 *
 * Required env vars:
 *   GMAIL_USER         = topadvice4you@gmail.com
 *   GMAIL_APP_PASSWORD = <16-char Google App Password>
 *
 * How to generate a Gmail App Password:
 *   1. Enable 2-Step Verification on the Google account.
 *   2. Go to https://myaccount.google.com/apppasswords
 *   3. Create an app password — name it "TopAdvice4U Site".
 *   4. Copy the 16-character password (no spaces) into GMAIL_APP_PASSWORD.
 *
 * The legacy RESEND path (EMAIL_PROVIDER_API_KEY) remains as a fallback
 * so existing deployments keep working until env vars are updated.
 */

import nodemailer from "nodemailer";
import { SITE_DEFAULTS } from "@/config/site";

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

// ---------------------------------------------------------------------------
// Transport factory
// ---------------------------------------------------------------------------

function getGmailCredentials() {
  const user = process.env.GMAIL_USER?.trim();
  // Google App Passwords are often copied with spaces — strip them
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  if (!user || !pass) return null;
  return { user, pass };
}

function createGmailTransport() {
  const creds = getGmailCredentials();
  if (!creds) return null;

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // SSL
    auth: { user: creds.user, pass: creds.pass },
    pool: true,
    maxConnections: 3,
    // Increase timeouts for cold starts on serverless
    socketTimeout: 15_000,
    greetingTimeout: 15_000,
    connectionTimeout: 15_000,
  });
}

// ---------------------------------------------------------------------------
// Core send function
// ---------------------------------------------------------------------------

export async function sendEmail(
  options: SendEmailOptions,
): Promise<{ success: boolean; skipped?: boolean; error?: unknown }> {
  const gmailCreds = getGmailCredentials();
  const resendKey = process.env.EMAIL_PROVIDER_API_KEY;

  // ── Gmail SMTP path ──────────────────────────────────────────────────────
  if (gmailCreds) {
    const transport = createGmailTransport()!;
    const from =
      process.env.EMAIL_FROM?.trim() ||
      `TopAdvice4U Financial Services <${gmailCreds.user}>`;

    try {
      await transport.sendMail({
        from,
        to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
        replyTo: options.replyTo,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
      return { success: true, skipped: false };
    } catch (error) {
      console.error("[email:gmail] Failed to send:", error);
      return { success: false, skipped: false, error };
    } finally {
      transport.close();
    }
  }

  // ── Resend fallback (legacy) ─────────────────────────────────────────────
  if (resendKey) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);
      const from = process.env.EMAIL_FROM || SITE_DEFAULTS.email;
      await resend.emails.send({
        from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
      return { success: true, skipped: false };
    } catch (error) {
      console.error("[email:resend] Failed to send:", error);
      return { success: false, skipped: false, error };
    }
  }

  // ── Not configured ────────────────────────────────────────────────────────
  console.info(
    "[email] No provider configured. Set GMAIL_USER + GMAIL_APP_PASSWORD in .env.local to enable email.",
    JSON.stringify({ to: options.to, subject: options.subject }),
  );
  return { success: true, skipped: true };
}

// ---------------------------------------------------------------------------
// Named helpers
// ---------------------------------------------------------------------------

export async function notifyAdminOfLead(lead: {
  name: string;
  email: string;
  phone?: string;
  serviceInterest?: string;
  message?: string;
}) {
  const adminEmail =
    process.env.ADMIN_EMAIL ||
    process.env.GMAIL_USER ||
    SITE_DEFAULTS.email;

  return sendEmail({
    to: adminEmail,
    replyTo: lead.email,
    subject: `New enquiry from ${lead.name}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: Arial, sans-serif; color: #1a202c; background: #f7fafc; margin: 0; padding: 0; }
    .wrapper { max-width: 560px; margin: 32px auto; background: #fff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; }
    .header { background: #001f3f; padding: 24px 32px; }
    .header h1 { color: #fff; margin: 0; font-size: 18px; font-weight: 600; }
    .header p { color: #90cdf4; margin: 4px 0 0; font-size: 13px; }
    .body { padding: 28px 32px; }
    .field { margin-bottom: 16px; }
    .field label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #718096; margin-bottom: 4px; }
    .field p { margin: 0; font-size: 15px; color: #2d3748; }
    .message-box { background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 16px; margin-top: 4px; font-size: 14px; line-height: 1.6; color: #4a5568; white-space: pre-wrap; }
    .footer { padding: 20px 32px; background: #f7fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #a0aec0; text-align: center; }
    .cta { display: inline-block; margin-top: 20px; padding: 10px 24px; background: #f0a020; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>New Website Enquiry</h1>
      <p>TopAdvice4U Financial Services Inc.</p>
    </div>
    <div class="body">
      <div class="field">
        <label>Name</label>
        <p>${escapeHtml(lead.name)}</p>
      </div>
      <div class="field">
        <label>Email</label>
        <p><a href="mailto:${escapeHtml(lead.email)}">${escapeHtml(lead.email)}</a></p>
      </div>
      <div class="field">
        <label>Phone</label>
        <p>${escapeHtml(lead.phone || "—")}</p>
      </div>
      <div class="field">
        <label>Service of Interest</label>
        <p>${escapeHtml(lead.serviceInterest || "—")}</p>
      </div>
      <div class="field">
        <label>Message</label>
        <div class="message-box">${escapeHtml(lead.message || "No message provided.")}</div>
      </div>
      <a href="mailto:${escapeHtml(lead.email)}" class="cta">Reply to ${escapeHtml(lead.name)}</a>
    </div>
    <div class="footer">This notification was sent automatically from the TopAdvice4U website.</div>
  </div>
</body>
</html>
    `,
    text: [
      `New enquiry from ${lead.name}`,
      `Email: ${lead.email}`,
      `Phone: ${lead.phone || "—"}`,
      `Service: ${lead.serviceInterest || "—"}`,
      `Message: ${lead.message || "—"}`,
    ].join("\n"),
  });
}

export async function confirmVisitorEnquiry(lead: {
  name: string;
  email: string;
}) {
  return sendEmail({
    to: lead.email,
    subject: "We received your consultation request — TopAdvice4U",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: Arial, sans-serif; color: #1a202c; background: #f7fafc; margin: 0; padding: 0; }
    .wrapper { max-width: 560px; margin: 32px auto; background: #fff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; }
    .header { background: #001f3f; padding: 24px 32px; text-align: center; }
    .header h1 { color: #fff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.02em; }
    .header p { color: #90cdf4; margin: 6px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; }
    .body { padding: 32px; }
    .body p { margin: 0 0 16px; font-size: 15px; line-height: 1.7; color: #4a5568; }
    .body p strong { color: #2d3748; }
    .divider { height: 1px; background: #e2e8f0; margin: 24px 0; }
    .contact { background: #f7fafc; border-radius: 6px; padding: 16px 20px; font-size: 14px; color: #4a5568; }
    .contact a { color: #2b6cb0; }
    .footer { padding: 20px 32px; font-size: 12px; color: #a0aec0; text-align: center; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>TopAdvice4U</h1>
      <p>Financial Services Inc.</p>
    </div>
    <div class="body">
      <p>Hi <strong>${escapeHtml(lead.name)}</strong>,</p>
      <p>Thank you for reaching out to TopAdvice4U Financial Services Inc. We have received your consultation request and will be in touch with you shortly.</p>
      <p>Our team reviews all enquiries and typically responds within one business day.</p>
      <div class="divider"></div>
      <div class="contact">
        <p style="margin:0 0 8px;font-weight:600;color:#2d3748;">Need to reach us directly?</p>
        <p style="margin:0;">📞 <a href="tel:+16048373797">${SITE_DEFAULTS.phone}</a></p>
        <p style="margin:4px 0 0;">✉️ <a href="mailto:${SITE_DEFAULTS.email}">${SITE_DEFAULTS.email}</a></p>
      </div>
    </div>
    <div class="footer">
      TopAdvice4U Financial Services Inc. — Life. Property. Business. Legacy.<br/>
      This is an automated confirmation. Please do not reply directly to this email.
    </div>
  </div>
</body>
</html>
    `,
    text: [
      `Hi ${lead.name},`,
      "",
      "Thank you for reaching out to TopAdvice4U Financial Services Inc. We have received your consultation request and will be in touch shortly.",
      "",
      `Phone: ${SITE_DEFAULTS.phone}`,
      `Email: ${SITE_DEFAULTS.email}`,
      "",
      "— TopAdvice4U Financial Services Inc.",
    ].join("\n"),
  });
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
