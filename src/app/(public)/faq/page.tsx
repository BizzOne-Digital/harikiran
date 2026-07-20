import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/public/PageHero";
import { ImageSplit } from "@/components/public/ImageSplit";
import { RichHtml } from "@/components/shared/RichHtml";
import { Reveal } from "@/components/animations/Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getPublishedFaqs, getPublishedPageBySlug } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublishedPageBySlug("faq");
  return {
    title: page?.seo.title || "Frequently Asked Questions",
    description:
      page?.seo.description ||
      "Answers to common questions about consultations, insurance, mortgages and planning.",
  };
}

export default async function FAQPage() {
  const [faqs, page] = await Promise.all([
    getPublishedFaqs(),
    getPublishedPageBySlug("faq"),
  ]);
  const categories = [...new Set(faqs.map((faq) => faq.category))];
  const imgs = page?.images ?? [];

  return (
    <>
      <PageHero
        eyebrow={page?.hero.eyebrow || "FAQ"}
        title={page?.hero.heading || "Questions, answered clearly"}
        description={
          page?.hero.subheading ||
          "Browse common topics about consultations, insurance, mortgages and planning."
        }
        backgroundImage={page?.hero.backgroundImage}
        primaryCtaLabel={page?.hero.primaryCtaLabel || "Contact us"}
        primaryCtaHref={page?.hero.primaryCtaHref || "/contact"}
      />

      <ImageSplit
        image={imgs[0]}
        eyebrow="Start here"
        title="Clear answers before you book"
        description="These FAQs cover how consultations work, what we discuss, and what we never promise on this website. Still unsure? Reach out anytime."
      >
        {page?.bodyHtml ? <RichHtml html={page.bodyHtml} /> : null}
      </ImageSplit>

      <section className="section-padding pt-0">
        <div className="container-narrow space-y-12">
          {categories.map((category, categoryIndex) => {
            const categoryFaqs = faqs.filter((faq) => faq.category === category);
            return (
              <Reveal key={category} delay={categoryIndex * 0.05}>
                <div>
                  <h2 className="font-display text-2xl">{category}</h2>
                  <Accordion type="single" collapsible className="mt-4">
                    {categoryFaqs.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {imgs[1] ? (
        <ImageSplit
          image={imgs[1]}
          reverse
          eyebrow="Still have a question?"
          title="Bring it to a consultation"
          description="If your question is specific to your family, property or business, we can walk through it together — with educational clarity and no pressure."
        >
          <Link
            href="/contact"
            className="text-sm font-semibold text-sky hover:underline"
          >
            Book a free consultation →
          </Link>
        </ImageSplit>
      ) : null}
    </>
  );
}
