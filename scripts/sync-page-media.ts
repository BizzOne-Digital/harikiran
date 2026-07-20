/**
 * Sync hero backgrounds + 5 gallery images onto existing CMS pages.
 * Usage: npx tsx scripts/sync-page-media.ts
 */
import dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });
dotenv.config({ path: resolve(process.cwd(), ".env") });

import mongoose from "mongoose";
import { PAGE_MEDIA } from "../src/config/page-media";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI required");
  process.exit(1);
}

async function main() {
  await mongoose.connect(MONGODB_URI!);
  const { Page } = await import("../src/models/Page");

  for (const media of PAGE_MEDIA) {
    const images = media.images.map((img, i) => ({
      url: img.url,
      alt: img.alt,
      caption: img.caption,
      order: i,
    }));

    const result = await Page.findOneAndUpdate(
      { slug: media.slug },
      {
        $set: {
          "hero.backgroundImage": media.heroBg,
          bodyHtml: media.bodyHtml,
          images,
          status: "published",
          visibility: true,
          publishedAt: new Date(),
        },
      },
      { upsert: false },
    );

    if (result) {
      console.log(`Updated media for /${media.slug}`);
    } else {
      console.log(`Page not found (skip): ${media.slug}`);
    }
  }

  console.log("Page media sync complete.");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
