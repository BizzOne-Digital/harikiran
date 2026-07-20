export const SITE_DEFAULTS = {
  businessName: "TopAdvice4U Financial Services Inc.",
  shortName: "TopAdvice4U",
  tagline: "Life. Property. Business. Legacy.",
  headline: "Protect What Matters. Finance What’s Next.",
  supportingText:
    "Life insurance, mortgages, business financing, employee benefits, education planning and legacy coordination—all through one trusted advisory relationship.",
  primaryCta: "Book a Free Consultation",
  secondaryCta: "Explore Our Solutions",
  trustStatement: "Advice for families, property owners and businesses.",
  contactName: "Harkiran Panesar",
  email: "topadvice4you@gmail.com",
  phone: "+1 604-837-3797",
  phoneHref: "tel:+16048373797",
  domain: "topadvice4u.com",
  description:
    "Canadian financial advisory for life insurance, mortgages, business financing, employee benefits, education planning and legacy coordination.",
} as const;

export const BRAND_COLORS = {
  background: "#030910",
  surface: "#07101f",
  surfaceElevated: "#0c1a32",
  navy: "#0a2540",
  blue: "#1e4d8c",
  cyan: "#5eb3e4",
  indigo: "#1a3a6b",
  violet: "#2d4a7a",
  gold: "#f0a020",
  accent: "#e31c23",
  textPrimary: "#F8FAFC",
  textSecondary: "#9eb4d0",
  border: "rgba(255,255,255,0.09)",
} as const;

export const APPROVED_FONTS = [
  { id: "instrument-sans", label: "Instrument Sans", css: "var(--font-body)" },
  { id: "outfit", label: "Outfit", css: "var(--font-body)" },
  { id: "sora", label: "Sora", css: "var(--font-body)" },
  { id: "dm-sans", label: "DM Sans", css: "var(--font-body)" },
] as const;

export const DISPLAY_FONTS = [
  { id: "fraunces", label: "Fraunces", css: "var(--font-display)" },
  { id: "cormorant", label: "Cormorant Garamond", css: "var(--font-display)" },
  { id: "libre-baskerville", label: "Libre Baskerville", css: "var(--font-display)" },
] as const;

export const SERVICE_SLUGS = [
  "family-life-insurance",
  "corporate-life-insurance",
  "residential-mortgages",
  "commercial-mortgages",
  "business-loans",
  "group-health-plans",
  "resp-education-planning",
  "estate-planning-coordination",
] as const;

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "follow-up",
  "converted",
  "closed",
  "spam",
] as const;

export const USER_ROLES = [
  "super_admin",
  "admin",
  "editor",
  "lead_manager",
] as const;

export const CONTENT_STATUSES = ["draft", "published", "archived"] as const;
