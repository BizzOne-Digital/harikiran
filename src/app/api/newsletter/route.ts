import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import { NewsletterSubscriber } from "@/models/NewsletterSubscriber";
import { newsletterSchema } from "@/lib/validation/forms";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
    }

    const data = parsed.data;
    if (data.honeypot) {
      return NextResponse.json({ success: true });
    }

    await connectDB();
    await NewsletterSubscriber.findOneAndUpdate(
      { email: data.email.toLowerCase() },
      {
        email: data.email.toLowerCase(),
        name: data.name || undefined,
        consent: data.consent,
        status: "active",
        source: "website",
      },
      { upsert: true, new: true },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Unable to subscribe. Please try again later." },
      { status: 500 },
    );
  }
}
