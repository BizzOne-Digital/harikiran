import connectDB from "@/lib/db/mongoose";
import { Service } from "@/models/Service";
import { FAQ } from "@/models/FAQ";
import { BlogPost } from "@/models/Blog";
import { TeamMember } from "@/models/TeamMember";
import { SiteSettings } from "@/models/SiteSettings";
import { NavigationMenu } from "@/models/NavigationMenu";
import { Page } from "@/models/Page";
import { PAGE_MEDIA } from "@/config/page-media";
import { serviceImage } from "@/config/service-media";
import type { ServiceAudienceFilter, ServiceGroup } from "@/types";
import {
  FALLBACK_BLOG_POSTS,
  FALLBACK_FAQS,
  FALLBACK_FOOTER_NAV,
  FALLBACK_HEADER_NAV,
  FALLBACK_SERVICES,
  FALLBACK_SITE_SETTINGS,
  FALLBACK_TEAM_MEMBERS,
  type PublicBlogPost,
  type PublicFAQ,
  type PublicService,
  type PublicSiteSettings,
  type PublicTeamMember,
} from "./fallbacks";

function mapService(doc: {
  _id: { toString(): string };
  name: string;
  slug: string;
  shortDescription: string;
  summary: string;
  content: string;
  icon?: string;
  image?: { url?: string; alt?: string };
  group: ServiceGroup;
  audienceFilters: ServiceAudienceFilter[];
  targetAudience: string[];
  challenges: string[];
  benefits: string[];
  processSteps?: { title?: string; description?: string }[];
  featured: boolean;
  sortOrder: number;
  ctaLabel: string;
  ctaHref: string;
  seo?: { title?: string; description?: string };
}): PublicService {
  const img = serviceImage(doc.slug, doc.image);
  return {
    id: String(doc._id),
    name: doc.name,
    slug: doc.slug,
    shortDescription: doc.shortDescription,
    summary: doc.summary,
    content: doc.content,
    icon: doc.icon,
    image: img ? { url: img.url, alt: img.alt } : undefined,
    group: doc.group,
    audienceFilters: [...(doc.audienceFilters ?? [])],
    targetAudience: [...(doc.targetAudience ?? [])],
    challenges: [...(doc.challenges ?? [])],
    benefits: [...(doc.benefits ?? [])],
    processSteps: (doc.processSteps ?? []).map((step) => ({
      title: step.title ?? "",
      description: step.description ?? "",
    })),
    featured: Boolean(doc.featured),
    sortOrder: Number(doc.sortOrder ?? 0),
    ctaLabel: doc.ctaLabel,
    ctaHref: doc.ctaHref,
    seo: {
      title: doc.seo?.title,
      description: doc.seo?.description,
    },
  };
}

/** Ensures values are plain JSON-safe objects for Client Components */
function toPlain<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export async function getPublishedServices(): Promise<PublicService[]> {
  try {
    await connectDB();
    const docs = await Service.find({
      status: "published",
      deletedAt: null,
    })
      .sort({ sortOrder: 1 })
      .lean();
    if (!docs.length) {
      return toPlain(
        FALLBACK_SERVICES.map((s) => ({
          ...s,
          image: s.image ?? serviceImage(s.slug) ?? undefined,
        })),
      );
    }
    const fromDb = docs.map((doc) =>
      mapService(doc as Parameters<typeof mapService>[0]),
    );
    const dbSlugs = new Set(fromDb.map((s) => s.slug));
    const missing = FALLBACK_SERVICES.filter((s) => !dbSlugs.has(s.slug)).map(
      (s) => ({
        ...s,
        image: s.image ?? serviceImage(s.slug) ?? undefined,
      }),
    );
    return toPlain(
      [...fromDb, ...missing].sort((a, b) => a.sortOrder - b.sortOrder),
    );
  } catch {
    return toPlain(
      FALLBACK_SERVICES.map((s) => ({
        ...s,
        image: s.image ?? serviceImage(s.slug) ?? undefined,
      })),
    );
  }
}

export async function getPublishedServiceBySlug(
  slug: string,
): Promise<PublicService | null> {
  try {
    await connectDB();
    const doc = await Service.findOne({
      slug,
      status: "published",
      deletedAt: null,
    }).lean();
    if (!doc) {
      const fallback = FALLBACK_SERVICES.find((s) => s.slug === slug);
      if (!fallback) return null;
      return toPlain({
        ...fallback,
        image: fallback.image ?? serviceImage(slug) ?? undefined,
      });
    }
    return toPlain(mapService(doc as Parameters<typeof mapService>[0]));
  } catch {
    const fallback = FALLBACK_SERVICES.find((s) => s.slug === slug);
    if (!fallback) return null;
    return toPlain({
      ...fallback,
      image: fallback.image ?? serviceImage(slug) ?? undefined,
    });
  }
}

export async function getPublishedServicesByGroup(
  group: ServiceGroup,
): Promise<PublicService[]> {
  const services = await getPublishedServices();
  return services.filter((s) => s.group === group);
}

export async function getPublishedServicesByAudience(
  audience: ServiceAudienceFilter,
): Promise<PublicService[]> {
  const services = await getPublishedServices();
  return services.filter((s) => s.audienceFilters.includes(audience));
}

export async function getFeaturedServices(): Promise<PublicService[]> {
  const services = await getPublishedServices();
  return services.filter((s) => s.featured);
}

export async function getPublishedFaqs(): Promise<PublicFAQ[]> {
  try {
    await connectDB();
    const docs = await FAQ.find({
      status: "published",
      deletedAt: null,
    })
      .sort({ sortOrder: 1 })
      .lean();
    if (!docs.length) return FALLBACK_FAQS;
    return toPlain(
      docs.map((doc) => ({
        id: String(doc._id),
        question: doc.question,
        answer: doc.answer,
        category: doc.category,
        featured: Boolean(doc.featured),
        sortOrder: Number(doc.sortOrder ?? 0),
      })),
    );
  } catch {
    return FALLBACK_FAQS;
  }
}

export async function getPublishedBlogPosts(): Promise<PublicBlogPost[]> {
  try {
    await connectDB();
    const docs = await BlogPost.find({
      status: "published",
      deletedAt: null,
    })
      .sort({ publishedAt: -1 })
      .lean();
    if (!docs.length) return FALLBACK_BLOG_POSTS;
    return toPlain(
      docs.map((doc) => ({
        id: String(doc._id),
        title: doc.title,
        slug: doc.slug,
        excerpt: doc.excerpt,
        content: doc.content,
        coverImage: doc.coverImage?.url
          ? { url: doc.coverImage.url, alt: doc.coverImage.alt }
          : FALLBACK_BLOG_POSTS.find((p) => p.slug === doc.slug)?.coverImage,
        authorName: doc.authorName,
        featured: Boolean(doc.featured),
        readingTimeMinutes: Number(doc.readingTimeMinutes ?? 5),
        publishedAt: doc.publishedAt?.toISOString() ?? new Date().toISOString(),
        tags: [...(doc.tags ?? [])],
      })),
    );
  } catch {
    return FALLBACK_BLOG_POSTS;
  }
}

export async function getPublishedBlogPostBySlug(
  slug: string,
): Promise<PublicBlogPost | null> {
  try {
    await connectDB();
    const doc = await BlogPost.findOne({
      slug,
      status: "published",
      deletedAt: null,
    }).lean();
    if (!doc) {
      return FALLBACK_BLOG_POSTS.find((p) => p.slug === slug) ?? null;
    }
    return toPlain({
      id: String(doc._id),
      title: doc.title,
      slug: doc.slug,
      excerpt: doc.excerpt,
      content: doc.content,
      coverImage: doc.coverImage?.url
        ? { url: doc.coverImage.url, alt: doc.coverImage.alt }
        : FALLBACK_BLOG_POSTS.find((p) => p.slug === slug)?.coverImage,
      authorName: doc.authorName,
      featured: Boolean(doc.featured),
      readingTimeMinutes: Number(doc.readingTimeMinutes ?? 5),
      publishedAt: doc.publishedAt?.toISOString() ?? new Date().toISOString(),
      tags: [...(doc.tags ?? [])],
    });
  } catch {
    return FALLBACK_BLOG_POSTS.find((p) => p.slug === slug) ?? null;
  }
}

export async function getPublishedTeamMembers(): Promise<PublicTeamMember[]> {
  try {
    await connectDB();
    const docs = await TeamMember.find({
      status: "published",
      deletedAt: null,
    })
      .sort({ sortOrder: 1 })
      .lean();
    if (!docs.length) return FALLBACK_TEAM_MEMBERS;
    return toPlain(
      docs.map((doc) => ({
        id: String(doc._id),
        name: doc.name,
        role: doc.role,
        shortBio: doc.shortBio,
        fullBio: doc.fullBio,
        photoUrl: doc.photo?.url,
        featured: Boolean(doc.featured),
        sortOrder: Number(doc.sortOrder ?? 0),
      })),
    );
  } catch {
    return FALLBACK_TEAM_MEMBERS;
  }
}

export async function getSiteSettings(): Promise<PublicSiteSettings> {
  try {
    await connectDB();
    const doc = await SiteSettings.findOne().lean();
    if (!doc) return FALLBACK_SITE_SETTINGS;
    return {
      businessName: doc.businessName,
      shortName: doc.shortName,
      description: doc.description,
      tagline: doc.tagline,
      email: doc.email,
      phone: doc.phone,
      footer: {
        summary: doc.footer.summary,
        disclaimer: doc.footer.disclaimer,
        showNewsletter: doc.footer.showNewsletter,
      },
      social: {
        facebook: doc.social?.facebook,
        linkedin: doc.social?.linkedin,
        youtube: doc.social?.youtube,
        x: doc.social?.x,
      },
      seo: {
        title: doc.seo?.title,
        description: doc.seo?.description,
        titleTemplate: doc.seo?.titleTemplate,
        robotsIndex: doc.seo?.robotsIndex ?? true,
      },
    };
  } catch {
    return FALLBACK_SITE_SETTINGS;
  }
}

export async function getHeaderNavigation() {
  try {
    await connectDB();
    const doc = await NavigationMenu.findOne({ key: "header" }).lean();
    if (!doc) return FALLBACK_HEADER_NAV;

    const dbGroups = JSON.parse(
      JSON.stringify(doc.megaMenuGroups ?? []),
    ) as typeof FALLBACK_HEADER_NAV.megaMenuGroups;
    const hrefs = new Set(
      dbGroups.flatMap((g) => g.links.map((l) => l.href)),
    );
    const megaMenuGroups =
      hrefs.has("/services/private-mortgages") &&
      hrefs.has("/services/reverse-mortgage") &&
      hrefs.has("/services/pos-systems")
        ? dbGroups
        : FALLBACK_HEADER_NAV.megaMenuGroups;

    return {
      items: JSON.parse(
        JSON.stringify(
          doc.items.filter((i: { visible?: boolean }) => i.visible !== false),
        ),
      ),
      megaMenuGroups,
      ctaLabel: doc.ctaLabel ?? FALLBACK_HEADER_NAV.ctaLabel,
      ctaHref: doc.ctaHref ?? FALLBACK_HEADER_NAV.ctaHref,
    };
  } catch {
    return FALLBACK_HEADER_NAV;
  }
}

export async function getFooterNavigation() {
  try {
    await connectDB();
    const doc = await NavigationMenu.findOne({ key: "footer" }).lean();
    if (!doc) return FALLBACK_FOOTER_NAV;
    return {
      items: JSON.parse(
        JSON.stringify(
          doc.items.filter((i: { visible?: boolean }) => i.visible !== false),
        ),
      ),
    };
  } catch {
    return FALLBACK_FOOTER_NAV;
  }
}

export async function getServiceSlugs(): Promise<string[]> {
  const services = await getPublishedServices();
  return services.map((s) => s.slug);
}

export async function getBlogSlugs(): Promise<string[]> {
  const posts = await getPublishedBlogPosts();
  return posts.map((p) => p.slug);
}

export type PublicPageContent = {
  title: string;
  slug: string;
  hero: {
    eyebrow?: string;
    heading?: string;
    subheading?: string;
    backgroundImage?: string;
    primaryCtaLabel?: string;
    primaryCtaHref?: string;
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
  };
  bodyHtml: string;
  images: { url: string; alt?: string; caption?: string; order: number }[];
  seo: { title?: string; description?: string };
};

function pageFromMedia(slug: string): PublicPageContent | null {
  const media = PAGE_MEDIA.find((p) => p.slug === slug);
  if (!media) return null;
  return {
    title: slug,
    slug,
    hero: {
      backgroundImage: media.heroBg,
    },
    bodyHtml: media.bodyHtml,
    images: media.images.map((img, i) => ({ ...img, order: i })),
    seo: {},
  };
}

export async function getPublishedPageBySlug(
  slug: string,
): Promise<PublicPageContent | null> {
  const fallback = pageFromMedia(slug);
  try {
    await connectDB();
    const doc = await Page.findOne({
      slug,
      status: "published",
      deletedAt: null,
      visibility: true,
    }).lean();

    if (!doc) return fallback;

    const images =
      doc.images?.length
        ? doc.images.map(
            (
              img: {
                url: string;
                alt?: string;
                caption?: string;
                order?: number;
              },
              i: number,
            ) => ({
              url: img.url,
              alt: img.alt,
              caption: img.caption,
              order: img.order ?? i,
            }),
          )
        : fallback?.images ?? [];

    return toPlain({
      title: doc.title,
      slug: doc.slug,
      hero: {
        eyebrow: doc.hero?.eyebrow,
        heading: doc.hero?.heading,
        subheading: doc.hero?.subheading,
        backgroundImage:
          doc.hero?.backgroundImage || fallback?.hero.backgroundImage,
        primaryCtaLabel: doc.hero?.primaryCtaLabel,
        primaryCtaHref: doc.hero?.primaryCtaHref,
        secondaryCtaLabel: doc.hero?.secondaryCtaLabel,
        secondaryCtaHref: doc.hero?.secondaryCtaHref,
      },
      bodyHtml: doc.bodyHtml || fallback?.bodyHtml || "",
      images,
      seo: {
        title: doc.seo?.title,
        description: doc.seo?.description,
      },
    });
  } catch {
    return fallback;
  }
}
