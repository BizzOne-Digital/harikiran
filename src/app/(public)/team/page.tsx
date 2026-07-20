import type { Metadata } from "next";
import Link from "next/link";
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
          {members.length > 0 ? (
            <>
              <Reveal>
                <h2 className="font-display text-3xl">Meet the team</h2>
              </Reveal>
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {members.map((member, index) => (
                  <Reveal key={member.id} delay={index * 0.05}>
                    <article className="brand-card rounded-xl p-8">
                      <div className="flex size-20 items-center justify-center rounded-full bg-navy/50 font-display text-3xl text-gradient">
                        {member.name.charAt(0)}
                      </div>
                      <h2 className="mt-6 font-display text-2xl">
                        {member.name}
                      </h2>
                      <p className="text-sky">{member.role}</p>
                      {(member.fullBio || member.shortBio) && (
                        <p className="mt-4 text-sm text-text-secondary">
                          {member.fullBio ?? member.shortBio}
                        </p>
                      )}
                    </article>
                  </Reveal>
                ))}
              </div>
            </>
          ) : (
            <Reveal>
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0a1628] to-[#07101f] p-10 sm:p-12">
                <p className="text-sm font-semibold tracking-[0.22em] text-[#F4B44E] uppercase">
                  Lead advisor
                </p>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl">
                  {SITE_DEFAULTS.contactName}
                </h2>
                <p className="mt-2 text-sky">
                  TopAdvice4U Financial Services Inc.
                </p>
                <p className="mt-5 max-w-2xl text-text-secondary">
                  Detailed team profiles will appear here as they are published
                  in the admin panel. Until then, connect directly to start a
                  consultation about protection, financing or planning.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild variant="gold">
                    <Link href="/contact">{SITE_DEFAULTS.primaryCta}</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <a href={`mailto:${SITE_DEFAULTS.email}`}>Email us</a>
                  </Button>
                </div>
              </div>
            </Reveal>
          )}
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
