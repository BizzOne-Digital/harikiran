import type { Metadata } from "next";
import { LegalPageView } from "@/components/public/LegalPageView";
import { getPublishedPageBySlug } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublishedPageBySlug("disclaimer");
  return {
    title: page?.seo.title || "Disclaimer",
    description:
      page?.seo.description ||
      "Important educational and eligibility disclaimers for TopAdvice4U website content.",
  };
}

export default async function DisclaimerPage() {
  return (
    <LegalPageView
      slug="disclaimer"
      fallbackTitle="Disclaimer"
      fallbackDescription="Important educational and eligibility disclaimers for TopAdvice4U website content."
      fallbackHtml={`<p>Information on this website is general and educational. Availability and eligibility depend on individual circumstances.</p><p>Mortgage and insurance examples and calculators are estimates only and are not quotations, approvals, guarantees or financial advice.</p><p>Final terms are subject to relevant providers, underwriting and approvals. Legal and accounting matters should be addressed by qualified professionals. TopAdvice4U coordinates introductions where appropriate and does not itself provide legal or accounting advice.</p>`}
    />
  );
}
