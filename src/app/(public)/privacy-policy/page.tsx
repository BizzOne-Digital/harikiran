import type { Metadata } from "next";
import { LegalPageView } from "@/components/public/LegalPageView";
import { getPublishedPageBySlug } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublishedPageBySlug("privacy-policy");
  return {
    title: page?.seo.title || "Privacy Policy",
    description:
      page?.seo.description ||
      "How TopAdvice4U collects, uses and protects personal information.",
  };
}

export default async function PrivacyPolicyPage() {
  return (
    <LegalPageView
      slug="privacy-policy"
      fallbackTitle="Privacy Policy"
      fallbackDescription="How TopAdvice4U collects, uses and protects personal information."
      fallbackHtml={`<p>TopAdvice4U Financial Services Inc. respects your privacy. Information submitted through this website is used to respond to enquiries and provide requested services.</p><p>We do not ask for Social Insurance Numbers, bank login credentials, detailed medical records, credit-card information or government ID uploads through public website forms.</p><p>If you contact us by phone or email, we use the details you share to follow up on your enquiry. We do not sell personal information.</p><p>This policy is editable in the admin panel and should be reviewed by the business before relying on it as final legal wording.</p>`}
    />
  );
}
