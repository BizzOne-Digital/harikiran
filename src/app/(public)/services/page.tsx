import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  Building2,
  GraduationCap,
  Handshake,
  HeartPulse,
  Home,
  Landmark,
  LineChart,
  MonitorSmartphone,
  PiggyBank,
  RefreshCw,
  ScrollText,
  Shield,
  ShieldCheck,
  Globe,
  Share2,
  FileText,
  Bot,
  Video,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/public/PageHero";
import { ImageSplit } from "@/components/public/ImageSplit";
import { RichHtml } from "@/components/shared/RichHtml";
import { Reveal } from "@/components/animations/Reveal";
import { Badge } from "@/components/ui/badge";
import { ServicesFilter } from "@/components/public/ServicesFilter";
import {
  AUDIENCE_FILTER_LABELS,
  SERVICE_GROUP_LABELS,
  type PublicService,
} from "@/lib/data/fallbacks";
import { getPublishedPageBySlug, getPublishedServices } from "@/lib/data";

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

interface ServicesPageProps {
  searchParams: Promise<{ filter?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublishedPageBySlug("services");
  return {
    title: page?.seo.title || "Financial Solutions",
    description:
      page?.seo.description ||
      "Explore life insurance, mortgages, business financing, employee benefits, education planning and estate-planning coordination.",
  };
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const params = await searchParams;
  const filter = params.filter as
    | "family"
    | "property"
    | "business"
    | "legacy"
    | undefined;

  const [services, page] = await Promise.all([
    getPublishedServices(),
    getPublishedPageBySlug("services"),
  ]);
  const filtered = filter
    ? services.filter((s) => s.audienceFilters.includes(filter))
    : services;
  const imgs = page?.images ?? [];

  return (
    <>
      <PageHero
        eyebrow={page?.hero.eyebrow || "Solutions"}
        title={
          page?.hero.heading ||
          "Solutions for life, property, business and legacy"
        }
        description={
          page?.hero.subheading ||
          "Filter by what you are planning and explore advisory pathways designed for clarity."
        }
        backgroundImage={page?.hero.backgroundImage}
        primaryCtaLabel={page?.hero.primaryCtaLabel || "Book a consultation"}
        primaryCtaHref={page?.hero.primaryCtaHref || "/contact"}
      />

      <ImageSplit
        image={imgs[0]}
        eyebrow="How we help"
        title="Clear pathways — not product pressure"
        description={
          page?.bodyHtml
            ? undefined
            : "Each solution page explains who it is for, common challenges, how we help, and what happens next. Final terms always depend on providers, underwriting and approvals."
        }
      >
        {page?.bodyHtml ? <RichHtml html={page.bodyHtml} /> : null}
      </ImageSplit>

      <section className="section-padding pt-0">
        <div className="container-wide">
          <Reveal>
            <h2 className="font-display text-3xl sm:text-4xl">
              Explore our solutions
            </h2>
            <p className="mt-3 max-w-2xl text-text-secondary">
              Select a pathway to read the full detail page — including process
              steps and a consultation form.
            </p>
          </Reveal>
          <div className="mt-8">
            <ServicesFilter activeFilter={filter} />
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((service, index) => (
              <ServiceCard key={service.slug} service={service} index={index} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="mt-10 text-center text-text-secondary">
              No services match this filter.{" "}
              <Link href="/services" className="text-sky hover:underline">
                View all solutions
              </Link>
            </p>
          )}
        </div>
      </section>

      {imgs[1] ? (
        <ImageSplit
          image={imgs[1]}
          reverse
          eyebrow="Next step"
          title="Not sure where to start?"
          description="Tell us what you are protecting, financing or planning. We will help you understand the most relevant pathway — without fabricated rates or guarantees."
        >
          <Link
            href="/contact"
            className="inline-flex text-sm font-semibold text-sky hover:underline"
          >
            Book a free consultation →
          </Link>
        </ImageSplit>
      ) : null}
    </>
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: PublicService;
  index: number;
}) {
  const Icon = iconMap[service.icon ?? "Shield"] ?? Shield;
  return (
    <Reveal delay={index * 0.04}>
      <Link
        href={`/services/${service.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-sky/40 hover:bg-white/[0.05]"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-navy/40">
          {service.image?.url ? (
            <Image
              src={service.image.url}
              alt={service.image.alt || service.name}
              fill
              sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 33vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Icon className="size-10 text-sky/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#000B18]/80 via-transparent to-transparent" />
          <Badge
            variant="secondary"
            className="absolute bottom-3 left-3 backdrop-blur-sm"
          >
            {SERVICE_GROUP_LABELS[service.group]}
          </Badge>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center gap-2">
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-sky/15 text-sky">
              <Icon className="size-4" />
            </span>
            <h2 className="font-display text-xl transition-colors group-hover:text-sky">
              {service.name}
            </h2>
          </div>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">
            {service.shortDescription}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {service.audienceFilters.map((audience) => (
              <Badge key={audience} variant="outline">
                {AUDIENCE_FILTER_LABELS[audience]}
              </Badge>
            ))}
          </div>
          <p className="mt-4 text-sm font-medium text-sky">View details →</p>
        </div>
      </Link>
    </Reveal>
  );
}
