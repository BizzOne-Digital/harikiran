import type { MetadataRoute } from "next";
import { SITE_DEFAULTS } from "@/config/site";
import {
  getBlogSlugs,
  getServiceSlugs,
} from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = `https://${SITE_DEFAULTS.domain}`;
  const [serviceSlugs, blogSlugs] = await Promise.all([
    getServiceSlugs(),
    getBlogSlugs(),
  ]);

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/contact",
    "/blog",
    "/team",
    "/faq",
    "/privacy-policy",
    "/terms",
    "/disclaimer",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
    ...serviceSlugs.map((slug) => ({
      url: `${baseUrl}/services/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...blogSlugs.map((slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
