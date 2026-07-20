import type { Metadata } from "next";
import { LegalPageView } from "@/components/public/LegalPageView";
import { getPublishedPageBySlug } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublishedPageBySlug("terms");
  return {
    title: page?.seo.title || "Terms of Use",
    description:
      page?.seo.description || "Terms governing use of the TopAdvice4U website.",
  };
}

export default async function TermsPage() {
  return (
    <LegalPageView
      slug="terms"
      fallbackTitle="Terms of Use"
      fallbackDescription="Terms governing use of the TopAdvice4U website."
      fallbackHtml={`<p>By using this website you agree to these terms. Content is provided for general educational purposes and does not constitute a commitment to provide products, rates or approvals.</p><p>You agree not to misuse the site, attempt unauthorized access, or submit false or harmful information through forms.</p><p>Website content may change without notice. Final wording should be reviewed by the business and legal counsel.</p>`}
    />
  );
}
