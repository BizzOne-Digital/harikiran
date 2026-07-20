"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/lib/utilities/cn";

type ImageSplitProps = {
  image?: { url: string; alt?: string; caption?: string } | null;
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  reverse?: boolean;
  className?: string;
};

/** Editorial split: image beside copy — used instead of standalone galleries. */
export function ImageSplit({
  image,
  eyebrow,
  title,
  description,
  children,
  reverse = false,
  className,
}: ImageSplitProps) {
  const reduced = useReducedMotion();
  if (!image?.url && !description && !children) return null;

  return (
    <section className={cn("section-padding pt-0", className)}>
      <div className="container-wide">
        <div
          className={cn(
            "grid items-center gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-10",
            reverse && "lg:[&>*:first-child]:order-2",
          )}
        >
          {image?.url ? (
            <Reveal>
              <motion.figure
                whileHover={reduced ? undefined : { scale: 1.01 }}
                className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 sm:aspect-[5/4] sm:rounded-2xl"
              >
                <Image
                  src={image.url}
                  alt={image.alt || title}
                  fill
                  sizes="(max-width:1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                {(image.caption || image.alt) && (
                  <figcaption className="absolute bottom-4 left-4 right-4 text-sm font-medium text-white">
                    {image.caption || image.alt}
                  </figcaption>
                )}
              </motion.figure>
            </Reveal>
          ) : null}

          <Reveal delay={0.08}>
            <div>
              {eyebrow ? (
                <p className="text-sm font-semibold tracking-[0.22em] text-sky uppercase">
                  {eyebrow}
                </p>
              ) : null}
              <h2 className="mt-2 font-display text-[1.65rem] leading-tight sm:mt-3 sm:text-3xl lg:text-4xl">
                {title}
              </h2>
              {description ? (
                <p className="mt-3 text-[15px] leading-relaxed text-text-secondary sm:mt-4 sm:text-base">
                  {description}
                </p>
              ) : null}
              {children ? <div className="mt-6">{children}</div> : null}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

type InlineFeatureImageProps = {
  image?: { url: string; alt?: string } | null;
  className?: string;
};

/** Full-width image band between content blocks. */
export function InlineFeatureImage({
  image,
  className,
}: InlineFeatureImageProps) {
  if (!image?.url) return null;
  return (
    <section className={cn("section-padding pt-0", className)}>
      <div className="container-wide">
        <Reveal>
          <div className="relative h-56 overflow-hidden rounded-2xl border border-white/10 sm:h-72 lg:h-96">
            <Image
              src={image.url}
              alt={image.alt || ""}
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#000B18]/55 via-transparent to-[#000B18]/35" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
