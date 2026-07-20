import Link from "next/link";
import { PageHero } from "@/components/public/PageHero";
import { ImageSplit } from "@/components/public/ImageSplit";
import { RichHtml } from "@/components/shared/RichHtml";
import { Reveal } from "@/components/animations/Reveal";
import { getPublishedPageBySlug } from "@/lib/data";

export async function LegalPageView({
  slug,
  fallbackTitle,
  fallbackDescription,
  fallbackHtml,
}: {
  slug: string;
  fallbackTitle: string;
  fallbackDescription: string;
  fallbackHtml: string;
}) {
  const page = await getPublishedPageBySlug(slug);
  const imgs = page?.images ?? [];

  return (
    <>
      <PageHero
        eyebrow={page?.hero.eyebrow || "Legal"}
        title={page?.hero.heading || fallbackTitle}
        description={page?.hero.subheading || fallbackDescription}
        backgroundImage={page?.hero.backgroundImage}
      />

      <ImageSplit
        image={imgs[0]}
        eyebrow="Please read"
        title={page?.hero.heading || fallbackTitle}
        description="This page summarizes important information about how we present educational content and handle enquiries."
      />

      <section className="section-padding pt-0">
        <Reveal>
          <div className="container-narrow">
            <RichHtml html={page?.bodyHtml || fallbackHtml} />
            <p className="mt-8 text-sm text-text-secondary">
              Questions?{" "}
              <Link href="/contact" className="text-sky hover:underline">
                Contact us
              </Link>
              .
            </p>
          </div>
        </Reveal>
      </section>

      {imgs[1] ? (
        <ImageSplit
          image={imgs[1]}
          reverse
          eyebrow="Clarity"
          title="Educational content, honest boundaries"
          description="Nothing on this site is a quotation, approval, rate guarantee or personalized legal advice."
        />
      ) : null}
    </>
  );
}
