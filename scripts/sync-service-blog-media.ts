/**
 * Sync service cover images + blog posts with covers into Mongo.
 * Also upserts any FALLBACK_SERVICES missing from the DB (e.g. Investments).
 * Usage: npx tsx scripts/sync-service-blog-media.ts
 */
import dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });
dotenv.config({ path: resolve(process.cwd(), ".env") });

import mongoose from "mongoose";
import { SERVICE_IMAGES } from "../src/config/service-media";
import {
  FALLBACK_BLOG_POSTS,
  FALLBACK_HEADER_NAV,
  FALLBACK_SERVICES,
} from "../src/lib/data/fallbacks";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI required");
  process.exit(1);
}

const RICH_CONTENT: Record<string, string> = {
  "family-life-insurance": `<p>Family life insurance planning focuses on protecting household income, covering outstanding obligations and supporting long-term goals for the people who matter most.</p><p>We help you understand coverage types, estimate needs and compare suitable options based on your circumstances. Conversations typically cover dependents, debts, education goals and how long support may be needed.</p><p>Educational estimators on this site can help you explore scenarios. Final coverage amounts, premiums and eligibility depend on underwriting and the insurer — nothing here is a quotation or guarantee.</p>`,
  "corporate-life-insurance": `<p>Corporate life insurance planning looks at how coverage may support a business if a key person is lost, or how ownership transitions can be funded more thoughtfully.</p><p>We discuss key-person protection, buy-sell funding considerations and how coverage can align with your corporate structure — then coordinate with accountants and lawyers where appropriate.</p><p>We do not provide legal or tax advice. Final terms depend on underwriting and the insurer.</p>`,
  "residential-mortgages": `<p>Residential mortgage conversations help you understand pathways for purchasing, refinancing or renewing a home loan — with clear explanations of what lenders typically review.</p><p>We walk through structures, timelines and documentation expectations so you can prepare without pressure. Payment examples on this site are educational estimates only.</p><p>Final rates, approvals and terms are always determined by the lender and underwriting — never guaranteed on this website.</p>`,
  "commercial-mortgages": `<p>Commercial mortgage planning supports property owners and investors exploring financing for commercial real estate.</p><p>We help clarify typical lender considerations, documentation pathways and how commercial financing conversations differ from residential ones.</p><p>Eligibility and terms depend on the property, borrower profile and lender underwriting. Site examples are educational only.</p>`,
  "business-loans": `<p>Business loan conversations focus on clarifying capital needs, timing and suitable financing pathways for owners who want growth without confusion.</p><p>We help you prepare the right questions, understand common requirements and coordinate next steps with relevant providers.</p><p>Approvals and terms are never guaranteed on this site — they depend on lenders and underwriting.</p>`,
  "group-health-plans": `<p>Group health and employee benefits planning helps employers support teams with coverage options that fit their workforce and budget realities.</p><p>We explain plan structures in plain language and help you understand what to compare before making decisions.</p><p>Final plan terms depend on the provider and eligibility rules.</p>`,
  "resp-education-planning": `<p>RESP and education-planning conversations help families think ahead about tuition and opportunity — with clarity on contribution concepts and educational savings pathways.</p><p>We focus on practical questions and timelines, not product pressure. Tax treatment should be confirmed with a qualified tax professional.</p>`,
  "estate-planning-coordination": `<p>Estate-planning coordination helps connect your insurance and financing picture with the legal and accounting conversations that shape legacy goals.</p><p>We prepare you for discussions with lawyers and accountants and can introduce partnered professionals where appropriate. TopAdvice4U does not provide legal or tax advice.</p>`,
};

async function main() {
  await mongoose.connect(MONGODB_URI!);
  const { Service } = await import("../src/models/Service");
  const { BlogPost } = await import("../src/models/Blog");
  const { NavigationMenu } = await import("../src/models/NavigationMenu");

  for (const service of FALLBACK_SERVICES) {
    const img = SERVICE_IMAGES[service.slug];
    await Service.findOneAndUpdate(
      { slug: service.slug },
      {
        $set: {
          name: service.name,
          shortDescription: service.shortDescription,
          summary: service.summary,
          content: RICH_CONTENT[service.slug] || service.content,
          icon: service.icon,
          group: service.group,
          audienceFilters: service.audienceFilters,
          targetAudience: service.targetAudience,
          challenges: service.challenges,
          benefits: service.benefits,
          processSteps: service.processSteps,
          featured: service.featured,
          sortOrder: service.sortOrder,
          ctaLabel: service.ctaLabel,
          ctaHref: service.ctaHref,
          seo: service.seo,
          status: "published",
          visibility: true,
          ...(img ? { image: { url: img.url, alt: img.alt } } : {}),
        },
        $setOnInsert: {
          slug: service.slug,
        },
      },
      { upsert: true },
    );
    console.log(`Upserted service ${service.slug}`);
  }

  for (const post of FALLBACK_BLOG_POSTS) {
    await BlogPost.findOneAndUpdate(
      { slug: post.slug },
      {
        $set: {
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage,
          authorName: post.authorName,
          tags: post.tags,
          featured: post.featured,
          readingTimeMinutes: post.readingTimeMinutes,
          status: "published",
          publishedAt: new Date(post.publishedAt),
          seo: { title: post.title, description: post.excerpt },
        },
        $setOnInsert: {
          slug: post.slug,
        },
      },
      { upsert: true },
    );
    console.log(`Upserted blog ${post.slug}`);
  }

  await NavigationMenu.findOneAndUpdate(
    { key: "header" },
    {
      $set: {
        megaMenuGroups: FALLBACK_HEADER_NAV.megaMenuGroups,
      },
    },
    { upsert: false },
  );
  console.log("Updated header mega menu (if header nav exists)");

  console.log("Service + blog media sync complete.");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
