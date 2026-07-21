import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { PageHero } from "@/components/public/PageHero";
import { ImageSplit } from "@/components/public/ImageSplit";
import { RichHtml } from "@/components/shared/RichHtml";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/button";
import { SITE_DEFAULTS } from "@/config/site";
import { getPublishedPageBySlug, getPublishedTeamMembers } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublishedPageBySlug("team");
  return {
    title: page?.seo.title || "Our Team",
    description:
      page?.seo.description || "Meet the TopAdvice4U advisory team.",
  };
}

export default async function TeamPage() {
  const [members, page] = await Promise.all([
    getPublishedTeamMembers(),
    getPublishedPageBySlug("team"),
  ]);
  const imgs = page?.images ?? [];

  return (
    <>
      <PageHero
        eyebrow={page?.hero.eyebrow || "Team"}
        title={page?.hero.heading || "People behind the advice"}
        description={
          page?.hero.subheading ||
          "Relationship-led guidance for families, property owners and businesses."
        }
        backgroundImage={page?.hero.backgroundImage}
        primaryCtaLabel={page?.hero.primaryCtaLabel || SITE_DEFAULTS.primaryCta}
        primaryCtaHref={page?.hero.primaryCtaHref || "/contact"}
      />

      <ImageSplit
        image={imgs[0]}
        eyebrow="How we show up"
        title="Advice that starts with your priorities"
        description="We believe clients deserve clear explanations, honest timelines and coordinated next steps — never pressure or fabricated promises."
      >
        {page?.bodyHtml ? <RichHtml html={page.bodyHtml} /> : null}
      </ImageSplit>

      <section className="section-padding pt-0">
        <div className="container-wide">
          <Reveal className="text-center">
            <h2 className="font-display text-3xl">Meet the team</h2>
          </Reveal>
          <div className="mt-10 flex flex-wrap justify-center gap-6">
            {members.map((member, index) => (
              <Reveal
                key={member.id}
                delay={index * 0.05}
                className="w-full max-w-[22rem]"
              >
                <article className="brand-card h-full rounded-xl p-8 text-center">
                  {member.photoUrl ? (
                    <div className="relative mx-auto size-24 overflow-hidden rounded-full border border-white/15">
                      <Image
                        src={member.photoUrl}
                        alt={member.name}
                        fill
                        unoptimized
                        sizes="96px"
                        className={
                          member.name.toLowerCase().includes("harkiran")
                            ? "object-cover object-[center_22%]"
                            : "object-cover object-top"
                        }
                      />
                    </div>
                  ) : (
                    <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-navy/50 font-display text-3xl text-gradient">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <h2 className="mt-6 font-display text-2xl">{member.name}</h2>
                  <p className="text-sky">{member.role}</p>
                  {(member.fullBio || member.shortBio) && (
                    <p className="mt-4 text-sm text-text-secondary">
                      {member.fullBio ?? member.shortBio}
                    </p>
                  )}
                  {member.name === SITE_DEFAULTS.contactName ? (
                    <a
                      href={SITE_DEFAULTS.digitalCardUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-sky hover:underline"
                    >
                      Digital business card
                      <ExternalLink className="size-3.5" />
                    </a>
                  ) : null}
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 flex justify-center">
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild variant="gold">
                <Link href="/contact">{SITE_DEFAULTS.primaryCta}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/about">Professionals we work with</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {imgs[1] ? (
        <ImageSplit
          image={imgs[1]}
          reverse
          eyebrow="Working together"
          title="One advisory relationship across life stages"
          description="Whether you are buying a home, growing a business or coordinating legacy plans, we help keep the financial conversations connected."
        />
      ) : null}
    </>
  );
}
