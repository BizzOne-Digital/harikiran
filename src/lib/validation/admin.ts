import { z } from "zod";

export const seoSchema = z.object({
  title: z.string().max(160).optional(),
  description: z.string().max(320).optional(),
  keywords: z.array(z.string()).optional(),
  ogImage: z.string().optional(),
  canonicalUrl: z.string().optional(),
  noIndex: z.boolean().optional(),
});

export const contentStatusSchema = z.enum(["draft", "published", "archived"]);

export const pageSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(120),
  status: contentStatusSchema,
  visibility: z.boolean(),
  seo: seoSchema.optional(),
  bodyHtml: z.string().optional(),
  hero: z
    .object({
      heading: z.string().optional(),
      subheading: z.string().optional(),
      eyebrow: z.string().optional(),
      primaryCtaLabel: z.string().optional(),
      primaryCtaHref: z.string().optional(),
      secondaryCtaLabel: z.string().optional(),
      secondaryCtaHref: z.string().optional(),
      backgroundImage: z.string().optional(),
    })
    .optional(),
  images: z
    .array(
      z.object({
        url: z.string().min(1),
        alt: z.string().optional(),
        caption: z.string().optional(),
        order: z.coerce.number().optional(),
      }),
    )
    .max(5)
    .optional(),
});

export const serviceSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(120),
  shortDescription: z.string().min(1).max(500),
  summary: z.string().min(1),
  content: z.string().optional(),
  icon: z.string().optional(),
  image: z
    .object({
      url: z.string().min(1),
      alt: z.string().optional(),
    })
    .optional(),
  group: z.enum(["protection", "financing", "future-legacy"]),
  audienceFilters: z
    .array(z.enum(["family", "property", "business", "legacy"]))
    .optional(),
  targetAudience: z.array(z.string()).optional(),
  challenges: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.coerce.number().optional(),
  status: contentStatusSchema,
  seo: seoSchema.optional(),
});

export const offeringSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(120),
  type: z.enum(["service", "plan", "program", "product"]),
  shortDescription: z.string().min(1).max(500),
  fullDescription: z.string().optional(),
  priceDisplay: z.string().optional(),
  contactForDetails: z.boolean().optional(),
  features: z.array(z.string()).optional(),
  eligibilityNotes: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaUrl: z.string().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.coerce.number().optional(),
  status: contentStatusSchema,
  seo: seoSchema.optional(),
});

export const blogCategorySchema = z.object({
  name: z.string().min(1).max(120),
  slug: z.string().min(1).max(120),
  description: z.string().optional(),
  sortOrder: z.coerce.number().optional(),
});

export const blogPostSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(120),
  excerpt: z.string().min(1).max(500),
  content: z.string().optional(),
  coverImage: z
    .object({
      url: z.string().min(1),
      alt: z.string().optional(),
    })
    .optional(),
  authorName: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  readingTimeMinutes: z.coerce.number().optional(),
  status: contentStatusSchema,
  seo: seoSchema.optional(),
});

export const teamMemberSchema = z.object({
  name: z.string().min(1).max(120),
  role: z.string().min(1).max(120),
  shortBio: z.string().optional(),
  fullBio: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  linkedin: z.string().optional(),
  designations: z.array(z.string()).optional(),
  sortOrder: z.coerce.number().optional(),
  featured: z.boolean().optional(),
  status: contentStatusSchema,
});

export const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  category: z.string().min(1),
  sortOrder: z.coerce.number().optional(),
  featured: z.boolean().optional(),
  status: contentStatusSchema,
});

export const testimonialSchema = z.object({
  clientName: z.string().min(1).max(120),
  company: z.string().optional(),
  testimonial: z.string().min(1),
  rating: z.coerce.number().min(1).max(5).optional(),
  featured: z.boolean().optional(),
  approved: z.boolean().optional(),
  sortOrder: z.coerce.number().optional(),
});

export const leadUpdateSchema = z.object({
  status: z
    .enum([
      "new",
      "contacted",
      "qualified",
      "follow-up",
      "converted",
      "closed",
      "spam",
    ])
    .optional(),
  priority: z.enum(["low", "normal", "high"]).optional(),
  note: z.string().max(5000).optional(),
});

export const bulkLeadStatusSchema = z.object({
  ids: z.array(z.string()).min(1),
  status: z.enum([
    "new",
    "contacted",
    "qualified",
    "follow-up",
    "converted",
    "closed",
    "spam",
  ]),
});

export const navLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  openInNewTab: z.boolean().optional(),
  visible: z.boolean().optional(),
});

export const navigationSchema = z.object({
  key: z.enum(["header", "footer", "mobile"]),
  label: z.string().min(1),
  items: z.array(navLinkSchema),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
});

export const formDefinitionSchema = z.object({
  key: z.string().min(1).max(60),
  name: z.string().min(1).max(120),
  description: z.string().optional(),
  successMessage: z.string().optional(),
  notifyEmail: z.string().email().optional().or(z.literal("")),
  enabled: z.boolean(),
});

export const userUpdateSchema = z.object({
  name: z.string().min(1).max(120),
  role: z.enum(["super_admin", "admin", "editor", "lead_manager"]),
});

export const userCreateSchema = userUpdateSchema.extend({
  email: z.string().email(),
  password: z.string().min(10).max(128),
});

export const siteSettingsSchema = z.object({
  businessName: z.string().min(1),
  shortName: z.string().min(1),
  description: z.string().min(1),
  tagline: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().optional(),
  businessHours: z.string().optional(),
  consultationUrl: z.string().optional(),
});

export const seoSettingsSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  titleTemplate: z.string().optional(),
  verificationGoogle: z.string().optional(),
  verificationBing: z.string().optional(),
  robotsIndex: z.boolean(),
  noIndex: z.boolean().optional(),
});
