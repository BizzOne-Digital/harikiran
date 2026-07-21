/** Local service cover images — admin can override via Service.image.url */

export const SERVICE_IMAGES: Record<string, { url: string; alt: string }> = {
  "family-life-insurance": {
    url: "/images/Service-cover-1.png",
    alt: "Family together at home",
  },
  "corporate-life-insurance": {
    url: "/images/Service-cover-2.png",
    alt: "Modern business office",
  },
  "residential-mortgages": {
    url: "/images/Service-cover-3.png",
    alt: "House keys and home",
  },
  "commercial-mortgages": {
    url: "/images/Service-cover-4.png",
    alt: "Commercial building exterior",
  },
  "private-mortgages": {
    url: "/images/Services-2.png",
    alt: "Private mortgage planning conversation",
  },
  "reverse-mortgage": {
    url: "/images/Services-5.png",
    alt: "Home equity and reverse mortgage discussion",
  },
  "business-loans": {
    url: "/images/Service-cover-5.png",
    alt: "Business growth meeting",
  },
  "group-health-plans": {
    url: "/images/Service-cover-6.png",
    alt: "Healthcare and wellness",
  },
  "resp-education-planning": {
    url: "/images/Service-cover-7.png",
    alt: "Students learning together",
  },
  "estate-planning-coordination": {
    url: "/images/Service-cover-8.png",
    alt: "Legacy planning documents",
  },
  investments: {
    url: "/images/Services-3.png",
    alt: "Investment planning conversation",
  },
  "retirement-solutions": {
    url: "/images/Services-4.png",
    alt: "Retirement planning discussion",
  },
  "pos-systems": {
    url: "/images/Services-1.png",
    alt: "Business technology and point-of-sale systems",
  },
};

export function serviceImage(
  slug: string,
  override?: { url?: string; alt?: string } | null,
) {
  if (override?.url) {
    return { url: override.url, alt: override.alt || SERVICE_IMAGES[slug]?.alt || "" };
  }
  return SERVICE_IMAGES[slug] ?? null;
}
