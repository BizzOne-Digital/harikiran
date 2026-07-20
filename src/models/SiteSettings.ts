import mongoose, { Schema, models, model } from "mongoose";
import type { SeoFields, MediaRef } from "@/types";

const SeoSchema = new Schema<SeoFields>(
  {
    title: String,
    description: String,
    keywords: [String],
    ogImage: String,
    canonicalUrl: String,
    noIndex: { type: Boolean, default: false },
  },
  { _id: false },
);

const MediaRefSchema = new Schema<MediaRef>(
  {
    url: { type: String, required: true },
    alt: String,
    width: Number,
    height: Number,
    publicId: String,
    assetId: { type: Schema.Types.ObjectId, ref: "MediaAsset" },
  },
  { _id: false },
);

export interface ISiteSettings {
  _id: mongoose.Types.ObjectId;
  businessName: string;
  shortName: string;
  description: string;
  tagline: string;
  email: string;
  phone: string;
  address?: string;
  businessHours?: string;
  consultationUrl?: string;
  mapEmbedUrl?: string;
  showMap: boolean;
  showAddress: boolean;
  showBusinessHours: boolean;
  logo?: MediaRef;
  logoAlt?: MediaRef;
  favicon?: MediaRef;
  defaultOgImage?: MediaRef;
  colors: {
    background: string;
    surface: string;
    surfaceElevated: string;
    navy: string;
    blue: string;
    cyan: string;
    indigo: string;
    violet: string;
    gold: string;
    accent: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
  };
  primaryGradient: string;
  displayFont: string;
  bodyFont: string;
  buttonStyle: "solid" | "outline" | "glow";
  borderRadius: "none" | "sm" | "md" | "lg";
  animationIntensity: "reduced" | "subtle" | "full";
  social: {
    facebook?: string;
    Instagram?: string;
    linkedin?: string;
    youtube?: string;
    x?: string;
    other?: { label: string; url: string }[];
  };
  seo: SeoFields & {
    titleTemplate?: string;
    verificationGoogle?: string;
    verificationBing?: string;
    robotsIndex: boolean;
  };
  integrations: {
    gaId?: string;
    gtmId?: string;
    metaPixelId?: string;
    calendlyUrl?: string;
    turnstileEnabled: boolean;
  };
  footer: {
    summary: string;
    copyright?: string;
    disclaimer: string;
    showNewsletter: boolean;
  };
  homepage: {
    showTeamPreview: boolean;
    showTestimonials: boolean;
    showCalculators: boolean;
    showBlogPreview: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    businessName: { type: String, required: true },
    shortName: { type: String, required: true },
    description: { type: String, required: true },
    tagline: { type: String, default: "Life. Property. Business. Legacy." },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: String,
    businessHours: String,
    consultationUrl: String,
    mapEmbedUrl: String,
    showMap: { type: Boolean, default: false },
    showAddress: { type: Boolean, default: false },
    showBusinessHours: { type: Boolean, default: true },
    logo: MediaRefSchema,
    logoAlt: MediaRefSchema,
    favicon: MediaRefSchema,
    defaultOgImage: MediaRefSchema,
    colors: {
      background: { type: String, default: "#050816" },
      surface: { type: String, default: "#091225" },
      surfaceElevated: { type: String, default: "#0D1931" },
      navy: { type: String, default: "#102A56" },
      blue: { type: String, default: "#2563EB" },
      cyan: { type: String, default: "#22D3EE" },
      indigo: { type: String, default: "#4F46E5" },
      violet: { type: String, default: "#7C3AED" },
      gold: { type: String, default: "#F4B942" },
      accent: { type: String, default: "#E85D3B" },
      textPrimary: { type: String, default: "#F8FAFC" },
      textSecondary: { type: String, default: "#A9B7CF" },
      border: { type: String, default: "rgba(255,255,255,0.10)" },
    },
    primaryGradient: {
      type: String,
      default: "linear-gradient(135deg, #2563EB 0%, #22D3EE 100%)",
    },
    displayFont: { type: String, default: "fraunces" },
    bodyFont: { type: String, default: "instrument-sans" },
    buttonStyle: {
      type: String,
      enum: ["solid", "outline", "glow"],
      default: "solid",
    },
    borderRadius: {
      type: String,
      enum: ["none", "sm", "md", "lg"],
      default: "md",
    },
    animationIntensity: {
      type: String,
      enum: ["reduced", "subtle", "full"],
      default: "full",
    },
    social: {
      facebook: String,
      Instagram: String,
      linkedin: String,
      youtube: String,
      x: String,
      other: [{ label: String, url: String }],
    },
    seo: {
      title: String,
      description: String,
      keywords: [String],
      ogImage: String,
      canonicalUrl: String,
      noIndex: { type: Boolean, default: false },
      titleTemplate: { type: String, default: "%s | TopAdvice4U" },
      verificationGoogle: String,
      verificationBing: String,
      robotsIndex: { type: Boolean, default: true },
    },
    integrations: {
      gaId: String,
      gtmId: String,
      metaPixelId: String,
      calendlyUrl: String,
      turnstileEnabled: { type: Boolean, default: false },
    },
    footer: {
      summary: {
        type: String,
        default:
          "Trusted advisory for life insurance, mortgages, business financing, employee benefits, education planning and legacy coordination.",
      },
      copyright: String,
      disclaimer: {
        type: String,
        default:
          "Information on this website is general and educational. Availability and eligibility depend on individual circumstances. Mortgage and insurance examples are estimates only. Final terms are subject to relevant providers, underwriting and approvals. Legal and accounting matters should be addressed by qualified professionals.",
      },
      showNewsletter: { type: Boolean, default: true },
    },
    homepage: {
      showTeamPreview: { type: Boolean, default: true },
      showTestimonials: { type: Boolean, default: true },
      showCalculators: { type: Boolean, default: true },
      showBlogPreview: { type: Boolean, default: true },
    },
  },
  { timestamps: true },
);

export const SiteSettings =
  models.SiteSettings || model<ISiteSettings>("SiteSettings", SiteSettingsSchema);

export { SeoSchema, MediaRefSchema };
