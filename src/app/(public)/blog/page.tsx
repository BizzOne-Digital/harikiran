import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { PageHero } from "@/components/public/PageHero";
import { ImageSplit } from "@/components/public/ImageSplit";
import { RichHtml } from "@/components/shared/RichHtml";
import { Reveal } from "@/components/animations/Reveal";
import { Badge } from "@/components/ui/badge";
import { getPublishedBlogPosts, getPublishedPageBySlug } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublishedPageBySlug("blog");
  return {
    title: page?.seo.title || "Insights",
    description:
      page?.seo.description ||
      "Educational articles on life insurance, mortgages, business financing, benefits, education planning and legacy.",
  };
}

export default async function BlogPage() {
  const [posts, page] = await Promise.all([
    getPublishedBlogPosts(),
    getPublishedPageBySlug("blog"),
  ]);
  const imgs = page?.images ?? [];

  return (
    <>
      <PageHero
        eyebrow={page?.hero.eyebrow || "Blog"}
        title={
          page?.hero.heading || "Insights for clearer financial decisions"
        }
        description={
          page?.hero.subheading ||
          "Practical, educational perspectives — not personalized financial advice."
        }
        backgroundImage={page?.hero.backgroundImage}
      />

      <ImageSplit
        image={imgs[0]}
        eyebrow="Why we publish"
        title="Education first. Advice when you are ready."
        description="These articles help you prepare better questions for a consultation. They are not personalized financial, legal or tax advice."
      >
        {page?.bodyHtml ? <RichHtml html={page.bodyHtml} /> : null}
      </ImageSplit>

      <section className="section-padding pt-0">
        <div className="container-wide">
          <Reveal>
            <h2 className="font-display text-3xl">Latest articles</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Reveal key={post.id} delay={index * 0.04}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="relative aspect-[16/10] overflow-hidden bg-navy/40">
                      {post.coverImage?.url ? (
                        <Image
                          src={post.coverImage.url}
                          alt={post.coverImage.alt || post.title}
                          fill
                          sizes="(max-width:768px) 100vw, 33vw"
                          className="object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#000B18]/70 via-transparent to-transparent" />
                    </div>
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <time
                      dateTime={post.publishedAt}
                      className="text-xs text-text-secondary"
                    >
                      {format(new Date(post.publishedAt), "MMMM d, yyyy")}
                    </time>
                    {post.featured && (
                      <Badge className="mt-3 w-fit" variant="gold">
                        Featured
                      </Badge>
                    )}
                    <h2 className="mt-3 font-display text-xl">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="transition-colors hover:text-sky"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mt-2 flex-1 text-sm text-text-secondary">
                      {post.excerpt}
                    </p>
                    <p className="mt-4 text-xs text-text-secondary">
                      {post.readingTimeMinutes} min read · Read article →
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {imgs[1] ? (
        <ImageSplit
          image={imgs[1]}
          reverse
          eyebrow="Have a question?"
          title="Bring your article notes to a consultation"
          description="If something you read sparked a question about your own situation, we can walk through it together."
        >
          <Link
            href="/contact"
            className="text-sm font-semibold text-sky hover:underline"
          >
            Book a free consultation →
          </Link>
        </ImageSplit>
      ) : null}
    </>
  );
}
