import type { MetadataRoute } from "next";
import { SITE_DEFAULTS } from "@/config/site";
import { getSiteSettings } from "@/lib/data";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings();
  const baseUrl = `https://${SITE_DEFAULTS.domain}`;

  if (!settings.seo.robotsIndex) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
