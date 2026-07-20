import { Hero } from "@/components/public/home/Hero";
import { JourneySection } from "@/components/public/home/JourneySection";
import { SolutionsUniverse } from "@/components/public/home/SolutionsUniverse";
import { CalculatorsSection } from "@/components/public/home/CalculatorsSection";
import { BentoWhy } from "@/components/public/home/BentoWhy";
import { CoordinationSection } from "@/components/public/home/CoordinationSection";
import { ProcessTimeline } from "@/components/public/home/ProcessTimeline";
import { TeamPreview } from "@/components/public/home/TeamPreview";
import { BlogPreview } from "@/components/public/home/BlogPreview";
import { FinalCTA } from "@/components/public/home/FinalCTA";
import { ImageSplit } from "@/components/public/ImageSplit";
import {
  getPublishedBlogPosts,
  getPublishedPageBySlug,
  getPublishedServices,
  getPublishedTeamMembers,
} from "@/lib/data";

export default async function HomePage() {
  const [page, services, posts, team] = await Promise.all([
    getPublishedPageBySlug("home"),
    getPublishedServices(),
    getPublishedBlogPosts(),
    getPublishedTeamMembers(),
  ]);
  const imgs = page?.images ?? [];

  return (
    <>
      <Hero
        backgroundImage={
          page?.hero.backgroundImage || "/images/hero-bg.png"
        }
        eyebrow={page?.hero.eyebrow || "Life. Property. Business. Legacy."}
        heading={
          page?.hero.heading || "Protect What Matters.\nFinance What’s Next."
        }
        subheading={page?.hero.subheading}
        primaryCtaLabel={page?.hero.primaryCtaLabel}
        primaryCtaHref={page?.hero.primaryCtaHref}
        secondaryCtaLabel={page?.hero.secondaryCtaLabel}
        secondaryCtaHref={page?.hero.secondaryCtaHref}
      />
      <JourneySection />
      <SolutionsUniverse services={services} />
      <CalculatorsSection />
      <BentoWhy />
      <CoordinationSection />
      {imgs[0] ? (
        <ImageSplit
          image={imgs[0]}
          eyebrow="Built around your priorities"
          title="One relationship across protection, financing and planning"
          description="Families, property owners and businesses rarely have one isolated need. We help connect the conversations so next steps stay clear."
        />
      ) : null}
      <ProcessTimeline />
      {imgs[1] ? (
        <ImageSplit
          image={imgs[1]}
          reverse
          eyebrow="Educational clarity"
          title="No fabricated rates. No pressure."
          description="Estimators and articles on this site are educational. Final terms always depend on providers, underwriting and approvals."
        />
      ) : null}
      <TeamPreview members={team} />
      <BlogPreview posts={posts} />
      <FinalCTA />
    </>
  );
}
