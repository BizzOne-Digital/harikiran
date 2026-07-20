import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/public/PageHero";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/button";
import {
  getBlogSlugs,
  getPublishedBlogPostBySlug,
  getPublishedBlogPosts,
} from "@/lib/data";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);
  if (!post) notFound();

  const allPosts = await getPublishedBlogPosts();
  const related = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title={post.title}
        description={post.excerpt}
        backgroundImage={post.coverImage?.url}
      />

      <article className="section-padding">
        <div className="container-narrow">
          {post.coverImage?.url ? (
            <Reveal>
              <div className="relative mb-10 aspect-[21/9] overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src={post.coverImage.url}
                  alt={post.coverImage.alt || post.title}
                  fill
                  priority
                  sizes="(max-width:768px) 100vw, 800px"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ) : null}

          <Reveal>
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
              <time dateTime={post.publishedAt}>
                {format(new Date(post.publishedAt), "MMMM d, yyyy")}
              </time>
              <span>·</span>
              <span>{post.readingTimeMinutes} min read</span>
              <span>·</span>
              <span>{post.authorName}</span>
            </div>
          </Reveal>

          {post.tags.length > 0 ? (
            <Reveal delay={0.04}>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/15 px-3 py-1 text-xs text-text-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Reveal>
          ) : null}

          <Reveal delay={0.06}>
            <div
              className="prose prose-invert mt-10 max-w-none prose-headings:font-display prose-p:text-text-secondary"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </Reveal>

          <Reveal delay={0.1} className="mt-12 border-t border-border pt-8">
            <p className="text-xs text-text-secondary">
              This article is for general educational purposes only and does not
              constitute personalized financial, legal or tax advice.
            </p>
            <Button asChild className="mt-6" variant="gold">
              <Link href="/contact">Book a Free Consultation</Link>
            </Button>
          </Reveal>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="section-padding pt-0">
          <div className="container-wide">
            <Reveal>
              <h2 className="font-display text-2xl">Continue reading</h2>
            </Reveal>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((item, i) => (
                <Reveal key={item.slug} delay={0.05 * i}>
                  <Link
                    href={`/blog/${item.slug}`}
                    className="group block overflow-hidden rounded-2xl border border-white/10"
                  >
                    <div className="relative aspect-[16/10] bg-navy/40">
                      {item.coverImage?.url ? (
                        <Image
                          src={item.coverImage.url}
                          alt={item.coverImage.alt || item.title}
                          fill
                          sizes="33vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : null}
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-lg group-hover:text-sky">
                        {item.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-text-secondary">
                        {item.excerpt}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
