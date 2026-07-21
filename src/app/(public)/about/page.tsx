import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  Compass,
  Handshake,
  Heart,
  Home,
  Landmark,
  MessageCircle,
  Scale,
  Shield,
  Users,
} from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { PageHero } from "@/components/public/PageHero";
import { ImageSplit } from "@/components/public/ImageSplit";
import { RichHtml } from "@/components/shared/RichHtml";
import { Button } from "@/components/ui/button";
import { SITE_DEFAULTS } from "@/config/site";
import { getPublishedPageBySlug } from "@/lib/data";

const DEFAULT_BODY = `
<p>TopAdvice4U Financial Services Inc. was built for people who want clearer guidance — not more jargon. Whether you are protecting a family, financing a property, strengthening a business, or thinking about the next chapter of your legacy, we help you understand the options in front of you and take the next step with confidence.</p>
<p>Led by <strong>Harkiran Singh</strong>, our work sits at the intersection of life insurance, mortgages, business financing, employee benefits, education planning, investments and estate-planning coordination. Instead of sending you to five different conversations, we aim to give you one trusted advisory relationship that can grow with your needs over time.</p>
<p>We believe good advice starts with listening. Every consultation begins with your goals, your timeline and your constraints — then we translate product and financing pathways into plain language so you can decide what fits.</p>
`.trim();

const approach = [
  {
    icon: MessageCircle,
    title: "Listen first",
    text: "We start with what you are building — family security, a home, a growing business, or a longer-term plan — before recommending any pathway.",
  },
  {
    icon: Compass,
    title: "Explain clearly",
    text: "Coverage, financing and planning options are presented in practical language so you understand trade-offs, not just product names.",
  },
  {
    icon: Handshake,
    title: "Coordinate next steps",
    text: "When your situation touches insurance, lending, benefits or legacy professionals, we help keep the conversation organized and moving.",
  },
];

const focusAreas = [
  {
    icon: Shield,
    title: "Protection",
    text: "Family and corporate life insurance conversations focused on income replacement, obligations and peace of mind.",
  },
  {
    icon: Home,
    title: "Property financing",
    text: "Residential and commercial mortgage pathways — explained with realistic next steps, not pressure.",
  },
  {
    icon: Building2,
    title: "Business strength",
    text: "Business loans and financing discussions for owners who need capital clarity as they grow.",
  },
  {
    icon: Heart,
    title: "Employee benefits",
    text: "Group health and benefits planning that helps employers support teams without overcomplicating the process.",
  },
  {
    icon: Landmark,
    title: "Education planning",
    text: "RESP and education-savings conversations for families thinking ahead about tuition and opportunity.",
  },
  {
    icon: Scale,
    title: "Legacy coordination",
    text: "Estate-planning introductions and coordination with qualified professionals when legal or tax advice is required.",
  },
  {
    icon: Landmark,
    title: "Investments",
    text: "TFSA, RRSP, FHSA, segregated funds, ETFs and leverage-loan conversations — explained in plain language.",
  },
  {
    icon: Compass,
    title: "Retirement solutions",
    text: "Conversations about savings, income timing and the path from building wealth to drawing it down.",
  },
];

const audiences = [
  {
    icon: Users,
    title: "Families",
    text: "Parents and households planning protection, education goals and long-term security.",
  },
  {
    icon: Home,
    title: "Homebuyers & owners",
    text: "People financing a first home, refinancing, or aligning coverage with property goals.",
  },
  {
    icon: Building2,
    title: "Business owners",
    text: "Entrepreneurs exploring financing, key-person protection and employee benefits.",
  },
  {
    icon: Scale,
    title: "Legacy planners",
    text: "Clients who want thoughtful coordination around wills, estates and next-generation planning.",
  },
];

const professionalNetwork = [
  {
    icon: Home,
    title: "Experienced realtors",
    text: "Property professionals we can introduce when your plan involves buying, selling or aligning financing with a real-estate transaction.",
  },
  {
    icon: Landmark,
    title: "Chartered accountants",
    text: "Tax and accounting professionals for matters that require qualified accounting advice — we coordinate, we do not replace them.",
  },
  {
    icon: Scale,
    title: "Estate-planning lawyers",
    text: "Legal professionals for wills, estates and related documents. TopAdvice4U does not provide legal advice.",
  },
];

const steps = [
  {
    step: "01",
    title: "Share your goals",
    text: "Tell us what you are protecting, financing or planning — even if you are still figuring out the details.",
  },
  {
    step: "02",
    title: "Get clear options",
    text: "We walk through suitable pathways, questions to ask, and what typically happens next.",
  },
  {
    step: "03",
    title: "Move at your pace",
    text: "No fabricated rates or guarantees. Final terms always depend on providers, underwriting and approvals.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublishedPageBySlug("about");
  return {
    title: page?.seo.title || "About TopAdvice4U Financial Services",
    description:
      page?.seo.description ||
      "Learn how TopAdvice4U helps families, property owners and businesses protect, finance and plan with clarity.",
  };
}

export default async function AboutPage() {
  const page = await getPublishedPageBySlug("about");

  return (
    <>
      <PageHero
        eyebrow={page?.hero.eyebrow || "About us"}
        title={
          page?.hero.heading || "Advice built around what you are building"
        }
        description={
          page?.hero.subheading ||
          "TopAdvice4U Financial Services Inc. helps clients navigate protection, financing and long-term planning through one trusted advisory relationship."
        }
        backgroundImage={page?.hero.backgroundImage}
        primaryCtaLabel={page?.hero.primaryCtaLabel || SITE_DEFAULTS.primaryCta}
        primaryCtaHref={page?.hero.primaryCtaHref || "/contact"}
        secondaryCtaLabel={page?.hero.secondaryCtaLabel || "Explore solutions"}
        secondaryCtaHref={page?.hero.secondaryCtaHref || "/services"}
      />

      {/* Story */}
      <section className="section-padding pt-0">
        <div className="container-wide grid gap-12 lg:grid-cols-12 lg:items-start">
          <Reveal className="lg:col-span-5">
            <p className="text-sm font-semibold tracking-[0.22em] text-sky uppercase">
              Our story
            </p>
            <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
              One relationship. Many financial conversations.
            </h2>
            <p className="mt-4 text-text-secondary">
              Families, property owners and businesses rarely have one isolated
              need. Protection, financing and planning often connect — so advice
              should too.
            </p>
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-7">
            <RichHtml html={page?.bodyHtml || DEFAULT_BODY} />
          </Reveal>
        </div>
      </section>

      {page?.images?.[0] ? (
        <ImageSplit
          image={page.images[0]}
          eyebrow="Client conversations"
          title="Clarity-first guidance for real priorities"
          description="Every consultation begins with listening — then translating options into plain language so you can decide with confidence."
        />
      ) : null}

      {/* Approach */}
      <section className="section-padding pt-0">
        <div className="container-wide">
          <Reveal>
            <p className="text-sm font-semibold tracking-[0.22em] text-sky uppercase">
              How we work
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl sm:text-4xl">
              Clarity before complexity
            </h2>
            <p className="mt-4 max-w-2xl text-text-secondary">
              Our process is designed to reduce overwhelm — so you leave every
              conversation with a clearer picture of what matters next.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {approach.map((item, i) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={0.06 * i}>
                  <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                    <span className="inline-flex size-11 items-center justify-center rounded-xl bg-sky/15 text-sky">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-5 font-display text-xl">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      {item.text}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {page?.images?.[1] ? (
        <ImageSplit
          image={page.images[1]}
          reverse
          eyebrow="Family & business"
          title="Guidance that grows with what you are building"
          description="From first-home conversations to corporate coverage and legacy coordination — the relationship can evolve with your needs."
        />
      ) : null}

      {/* Focus areas */}
      <section className="section-padding pt-0">
        <div className="container-wide">
          <Reveal>
            <p className="text-sm font-semibold tracking-[0.22em] text-sky uppercase">
              What we help with
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl sm:text-4xl">
              Advice across life, property, business and legacy
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {focusAreas.map((item, i) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={0.04 * i}>
                  <div className="flex h-full gap-4 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-5">
                    <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-navy/60 text-[#F4B44E]">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg">{item.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <Reveal delay={0.1} className="mt-8">
            <Button asChild variant="outline">
              <Link href="/services">Explore all solutions</Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Who we serve */}
      <section className="section-padding pt-0">
        <div className="container-wide">
          <Reveal>
            <p className="text-sm font-semibold tracking-[0.22em] text-sky uppercase">
              Who we serve
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              Built for real-life priorities
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {audiences.map((item, i) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={0.05 * i}>
                  <div className="glass-panel h-full rounded-2xl p-6">
                    <Icon className="size-6 text-sky" />
                    <h3 className="mt-4 font-display text-xl">{item.title}</h3>
                    <p className="mt-2 text-sm text-text-secondary">
                      {item.text}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Professionals we work with */}
      <section className="section-padding pt-0">
        <div className="container-wide">
          <Reveal>
            <p className="text-sm font-semibold tracking-[0.22em] text-sky uppercase">
              Professionals we work with
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl sm:text-4xl">
              Coordinated introductions when your plan needs more than one desk
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-secondary">
              When your situation touches real estate, tax or legal documents, we
              can help coordinate conversations with experienced professionals.
              These partners are independent — TopAdvice4U does not provide legal
              or accounting advice.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {professionalNetwork.map((item, i) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={0.05 * i}>
                  <div className="glass-panel h-full rounded-2xl p-6">
                    <span className="inline-flex size-11 items-center justify-center rounded-xl bg-sky/15 text-sky">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-5 font-display text-xl">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      {item.text}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding pt-0">
        <div className="container-wide">
          <Reveal>
            <p className="text-sm font-semibold tracking-[0.22em] text-sky uppercase">
              Getting started
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              A simple path to clarity
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {steps.map((item, i) => (
              <Reveal key={item.step} delay={0.06 * i}>
                <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 p-6">
                  <span className="font-display text-5xl text-white/10">
                    {item.step}
                  </span>
                  <h3 className="mt-4 font-display text-xl">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {item.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Advisor + CTA */}
      <section className="section-padding pt-0">
        <div className="container-wide">
          <Reveal>
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0a1628] via-[#0c1f3a] to-[#07101f] p-8 sm:p-12">
              <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                <div>
                  <p className="text-sm font-semibold tracking-[0.22em] text-[#F4B44E] uppercase">
                    Your advisor
                  </p>
                  <h2 className="mt-3 font-display text-3xl sm:text-4xl">
                    {SITE_DEFAULTS.contactName}
                  </h2>
                  <p className="mt-2 text-sky">
                    TopAdvice4U Financial Services Inc.
                  </p>
                  <p className="mt-5 max-w-xl text-text-secondary">
                    Reach out when you are ready for a clear, educational
                    conversation about protection, financing or planning. We will
                    help you understand the next step — without fabricated
                    credentials, rates or guarantees.
                  </p>
                  <dl className="mt-6 space-y-2 text-sm">
                    <div className="flex flex-wrap gap-x-2">
                      <dt className="text-text-secondary">Email</dt>
                      <dd>
                        <a
                          href={`mailto:${SITE_DEFAULTS.email}`}
                          className="text-white hover:text-sky"
                        >
                          {SITE_DEFAULTS.email}
                        </a>
                      </dd>
                    </div>
                    <div className="flex flex-wrap gap-x-2">
                      <dt className="text-text-secondary">Phone</dt>
                      <dd>
                        <a
                          href={SITE_DEFAULTS.phoneHref}
                          className="text-white hover:text-sky"
                        >
                          {SITE_DEFAULTS.phone}
                        </a>
                      </dd>
                    </div>
                  </dl>
                </div>
                <div className="flex flex-col gap-3 sm:items-start lg:items-end">
                  <Button asChild variant="gold" size="lg">
                    <Link href="/contact">{SITE_DEFAULTS.primaryCta}</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/faq">Browse FAQs</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
