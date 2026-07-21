import type { Metadata } from "next";
import Link from "next/link";
import {
  Clock,
  CreditCard,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { PageHero } from "@/components/public/PageHero";
import { ImageSplit } from "@/components/public/ImageSplit";
import { RichHtml } from "@/components/shared/RichHtml";
import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { Reveal } from "@/components/animations/Reveal";
import { SITE_DEFAULTS } from "@/config/site";
import { getPublishedPageBySlug, getPublishedServices } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublishedPageBySlug("contact");
  return {
    title: page?.seo.title || "Book a Free Consultation",
    description:
      page?.seo.description ||
      "Tell us what you are planning, protecting or financing. We will help you understand the next step.",
  };
}

export default async function ContactPage() {
  const [services, page] = await Promise.all([
    getPublishedServices(),
    getPublishedPageBySlug("contact"),
  ]);
  const imgs = page?.images ?? [];

  return (
    <>
      <PageHero
        eyebrow={page?.hero.eyebrow || "Contact"}
        title={page?.hero.heading || "Let’s start the conversation"}
        description={
          page?.hero.subheading ||
          "Share a little about your goals and we will follow up with clear next steps."
        }
        backgroundImage={page?.hero.backgroundImage}
        primaryCtaLabel={page?.hero.primaryCtaLabel}
        primaryCtaHref={page?.hero.primaryCtaHref}
      />

      <ImageSplit
        image={imgs[0]}
        eyebrow="Before you write"
        title="A consultation is a conversation — not an approval"
        description="Tell us what you are protecting, financing or planning. We respond with clarity on suitable next steps. Nothing here is a quotation, rate guarantee or product commitment."
      >
        {page?.bodyHtml ? <RichHtml html={page.bodyHtml} /> : null}
      </ImageSplit>

      <section className="section-padding pt-0">
        <div className="container-wide grid gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="space-y-6">
              <h2 className="font-display text-3xl">Reach us directly</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    icon: Phone,
                    label: "Phone",
                    value: SITE_DEFAULTS.phone,
                    href: SITE_DEFAULTS.phoneHref,
                  },
                  {
                    icon: Mail,
                    label: "Email",
                    value: SITE_DEFAULTS.email,
                    href: `mailto:${SITE_DEFAULTS.email}`,
                  },
                  {
                    icon: Clock,
                    label: "Response",
                    value: "We typically reply within 1–2 business days",
                  },
                  {
                    icon: ShieldCheck,
                    label: "Privacy",
                    value: "No SINs, bank logins or ID uploads via web forms",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                    >
                      <Icon className="size-5 text-sky" />
                      <p className="mt-3 text-xs tracking-wide text-text-secondary uppercase">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="mt-1 block text-sm text-white hover:text-sky"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="mt-1 text-sm text-white">{item.value}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {SITE_DEFAULTS.locations.map((loc) => (
                  <div
                    key={loc.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                  >
                    <MapPin className="size-5 text-sky" />
                    <p className="mt-3 text-xs tracking-wide text-text-secondary uppercase">
                      {loc.label}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-white">
                      {loc.lines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </p>
                  </div>
                ))}
              </div>

              <div className="glass-panel rounded-xl p-6">
                <h3 className="font-display text-xl">
                  Speaking with {SITE_DEFAULTS.contactName}
                </h3>
                <p className="mt-1 text-sm text-sky">{SITE_DEFAULTS.contactRole}</p>
                <p className="mt-3 text-sm text-text-secondary">
                  Prefer email, phone, or our digital business card? Share a
                  short note about your situation and we will follow up with
                  clear next steps.
                </p>
                <div className="mt-4 flex flex-wrap gap-4">
                  <a
                    href={SITE_DEFAULTS.digitalCardUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-sky hover:underline"
                  >
                    <CreditCard className="size-4" />
                    Digital business card
                    <ExternalLink className="size-3.5 opacity-70" />
                  </a>
                  <Link
                    href="/faq"
                    className="inline-block text-sm font-semibold text-sky hover:underline"
                  >
                    Browse FAQs first →
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <ConsultationForm services={services} />
          </Reveal>
        </div>
      </section>

      {imgs[1] ? (
        <ImageSplit
          image={imgs[1]}
          reverse
          eyebrow="What happens next"
          title="Listen → clarify → outline options"
          description="We review what you share, ask clarifying questions where needed, and help you understand which pathway fits — insurance, financing, benefits, education or legacy coordination."
        />
      ) : null}
    </>
  );
}
