import { Resend } from "resend";
import { hasEmailConfigured } from "@/lib/env";
import { SITE_DEFAULTS } from "@/config/site";

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: SendEmailOptions) {
  if (!hasEmailConfigured()) {
    console.info(
      "[email] Provider not configured. Skipping send.",
      JSON.stringify({
        to: options.to,
        subject: options.subject,
      }),
    );
    return { success: true, skipped: true as const };
  }

  const resend = new Resend(process.env.EMAIL_PROVIDER_API_KEY);
  const from = process.env.EMAIL_FROM || SITE_DEFAULTS.email;

  try {
    await resend.emails.send({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    return { success: true, skipped: false as const };
  } catch (error) {
    console.error("[email] Failed to send:", error);
    return { success: false, skipped: false as const, error };
  }
}

export async function notifyAdminOfLead(lead: {
  name: string;
  email: string;
  phone?: string;
  serviceInterest?: string;
  message?: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || SITE_DEFAULTS.email;
  return sendEmail({
    to: adminEmail,
    subject: `New enquiry from ${lead.name}`,
    html: `
      <h2>New website enquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(lead.phone || "—")}</p>
      <p><strong>Service:</strong> ${escapeHtml(lead.serviceInterest || "—")}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(lead.message || "—")}</p>
    `,
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
      <p>Hi ${escapeHtml(lead.name)},</p>
      <p>Thank you for contacting TopAdvice4U Financial Services Inc. We have received your request and will be in touch shortly.</p>
      <p>If your matter is urgent, call us at ${SITE_DEFAULTS.phone}.</p>
      <p>— TopAdvice4U</p>
    `,
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
