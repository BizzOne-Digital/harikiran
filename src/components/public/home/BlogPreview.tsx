import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PublicBlogPost } from "@/lib/data/fallbacks";

interface BlogPreviewProps {
  posts: PublicBlogPost[];
}

export function BlogPreview({ posts }: BlogPreviewProps) {
  const featured = posts.slice(0, 3);

  return (
    <section className="section-padding">
      <div className="container-wide">
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-wider text-cyan uppercase">
              Insights
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">
              Educational perspectives for clearer decisions
            </h2>
            <p className="mt-3 text-text-secondary">
              Practical articles — not personalized financial advice.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/blog">View all articles</Link>
          </Button>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {featured.map((post, index) => (
            <Reveal key={post.id} delay={index * 0.06}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="relative aspect-[16/10] overflow-hidden bg-navy/40">
                    {post.coverImage?.url ? (
                      <Image
                        src={post.coverImage.url}
                        alt={post.coverImage.alt || post.title}
                        fill
                        sizes="33vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-2">
                    <time
                      dateTime={post.publishedAt}
                      className="text-xs text-text-secondary"
                    >
                      {format(new Date(post.publishedAt), "MMM d, yyyy")}
                    </time>
                    {post.featured && <Badge variant="gold">Featured</Badge>}
                  </div>
                  <h3 className="mt-4 font-display text-xl transition-colors group-hover:text-cyan">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-text-secondary">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-cyan"
                  >
                    Read article
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
