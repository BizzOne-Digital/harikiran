import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Briefcase,
  Building2,
  GraduationCap,
  Handshake,
  HeartPulse,
  Home,
  Landmark,
  ScrollText,
  LineChart,
  MonitorSmartphone,
  PiggyBank,
  RefreshCw,
  Shield,
  ShieldCheck,
  Globe,
  Share2,
  FileText,
  Bot,
  Video,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { PageHero } from "@/components/public/PageHero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AUDIENCE_FILTER_LABELS,
  SERVICE_GROUP_LABELS,
} from "@/lib/data/fallbacks";
import {
  getPublishedServiceBySlug,
  getPublishedServices,
  getServiceSlugs,
} from "@/lib/data";

const iconMap: Record<string, LucideIcon> = {
  Shield,
  ShieldCheck,
  Building2,
  Home,
  Landmark,
  Briefcase,
  HeartPulse,
  GraduationCap,
  ScrollText,
  LineChart,
  PiggyBank,
  Handshake,
  RefreshCw,
  MonitorSmartphone,
  Globe,
  Share2,
  FileText,
  Bot,
  Video,
};

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getPublishedServiceBySlug(slug);
  if (!service) return {};
  return {
    title: service.seo.title ?? service.name,
    description: service.seo.description ?? service.summary,
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const [service, allServices] = await Promise.all([
    getPublishedServiceBySlug(slug),
    getPublishedServices(),
  ]);

  if (!service) notFound();

  const Icon = iconMap[service.icon ?? "Shield"] ?? Shield;
  const related = allServices
    .filter(
      (s) =>
        s.slug !== service.slug &&
        (s.group === service.group ||
          s.audienceFilters.some((a) => service.audienceFilters.includes(a))),
    )
    .slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={SERVICE_GROUP_LABELS[service.group]}
        title={service.name}
        description={service.summary}
        backgroundImage={service.image?.url}
        primaryCtaLabel={service.ctaLabel || "Book a Free Consultation"}
        primaryCtaHref={service.ctaHref || "/contact"}
      />

      <section className="section-padding">
        <div className="container-wide grid gap-12 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            {service.image?.url ? (
              <Reveal>
                <div className="relative aspect-[21/9] overflow-hidden rounded-2xl border border-white/10">
                  <Image
                    src={service.image.url}
                    alt={service.image.alt || service.name}
                    fill
                    priority
                    sizes="(max-width:1024px) 100vw, 66vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            ) : null}

            <Reveal>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-navy/50 text-cyan">
                  <Icon className="size-6" />
                </span>
                {service.audienceFilters.map((audience) => (
                  <Badge key={audience} variant="outline">
                    {AUDIENCE_FILTER_LABELS[audience]}
                  </Badge>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <div
                className="prose prose-invert max-w-none prose-headings:font-display prose-headings:text-text-primary prose-p:text-text-secondary"
                dangerouslySetInnerHTML={{ __html: service.content }}
              />
            </Reveal>

            {service.targetAudience.length > 0 ? (
              <Reveal delay={0.06}>
                <div className="glass-panel rounded-xl p-6">
                  <h2 className="font-display text-xl">Who this is for</h2>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {service.targetAudience.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-sm text-text-secondary"
                      >
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-sky" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ) : null}

            <Reveal delay={0.08}>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="glass-panel rounded-xl p-6">
                  <h2 className="font-display text-xl">Common challenges</h2>
                  <ul className="mt-4 space-y-2">
                    {service.challenges.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-sm text-text-secondary"
                      >
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="glass-panel rounded-xl p-6">
                  <h2 className="font-display text-xl">How we help</h2>
                  <ul className="mt-4 space-y-2">
                    {service.benefits.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-sm text-text-secondary"
                      >
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="font-display text-2xl">Our process</h2>
              <div className="mt-6 space-y-4">
                {service.processSteps.map((step, index) => (
                  <div
                    key={step.title}
                    className="glass-panel flex gap-4 rounded-xl p-5"
                  >
                    <span className="font-display text-2xl text-gold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-lg">{step.title}</h3>
                      <p className="mt-1 text-sm text-text-secondary">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="rounded-xl border border-white/10 bg-white/[0.02] p-5 text-sm text-text-secondary">
                Information on this page is educational. Availability,
                eligibility, rates and terms depend on individual circumstances
                and the relevant provider’s underwriting and approvals.
              </p>
            </Reveal>
          </div>

          <aside className="space-y-8">
            <Reveal>
              <ConsultationForm
                services={allServices}
                defaultService={service.name}
              />
            </Reveal>

            {related.length > 0 && (
              <Reveal delay={0.08}>
                <div className="glass-panel rounded-xl p-6">
                  <h2 className="font-display text-lg">Related solutions</h2>
                  <ul className="mt-4 space-y-4">
                    {related.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/services/${item.slug}`}
                          className="group flex gap-3"
                        >
                          {item.image?.url ? (
                            <span className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-white/10">
                              <Image
                                src={item.image.url}
                                alt=""
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            </span>
                          ) : null}
                          <span className="text-sm text-text-secondary group-hover:text-cyan">
                            {item.name}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="mt-6 w-full" variant="secondary">
                    <Link href="/services">View all solutions</Link>
                  </Button>
                </div>
              </Reveal>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
