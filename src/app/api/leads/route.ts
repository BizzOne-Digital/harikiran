import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import { Lead } from "@/models/Lead";
import { leadFormSchema } from "@/lib/validation/forms";
import {
  notifyAdminOfLead,
  confirmVisitorEnquiry,
} from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = leadFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data.", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;

    if (data.honeypot) {
      return NextResponse.json({ success: true });
    }

    await connectDB();
    await Lead.create({
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      clientType: data.clientType,
      company: data.company || undefined,
      serviceInterest: data.serviceInterest || undefined,
      message: data.message || undefined,
      timeline: data.timeline || undefined,
      preferredContact: data.preferredContact,
      consent: data.consent,
      formType: data.formType,
      leadSource: data.leadSource ?? "website",
      landingPage: data.landingPage,
      utm: {
        source: data.utmSource,
        medium: data.utmMedium,
        campaign: data.utmCampaign,
      },
      status: "new",
      priority: "normal",
      internalNotes: [],
    });

    // Send emails in parallel — fire-and-forget so DB save already succeeded.
    // Errors are logged but do not fail the API response.
    Promise.all([
      notifyAdminOfLead({
        name: data.name,
        email: data.email,
        phone: data.phone,
        serviceInterest: data.serviceInterest,
        message: data.message,
      }),
      confirmVisitorEnquiry({
        name: data.name,
        email: data.email,
      }),
    ]).catch((err) => console.error("[leads] Email send error:", err));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json(
      { error: "Unable to submit your request. Please try again later." },
      { status: 500 },
    );
  }
}
