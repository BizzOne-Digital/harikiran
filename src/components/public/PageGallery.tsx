"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/animations/Reveal";

export type GalleryImage = {
  url: string;
  alt?: string;
  caption?: string;
};

interface PageGalleryProps {
  images: GalleryImage[];
  title?: string;
}

export function PageGallery({
  images,
  title = "Visual perspective",
}: PageGalleryProps) {
  const reduced = useReducedMotion();
  const list = images.filter((img) => img.url).slice(0, 5);
  if (!list.length) return null;

  const [featured, ...rest] = list;

  return (
    <section className="section-padding pt-0">
      <div className="container-wide">
        <Reveal>
          <p className="text-sm font-semibold tracking-[0.22em] text-sky uppercase">
            {title}
          </p>
        </Reveal>

        <div className="mt-8 grid gap-4 lg:grid-cols-12 lg:grid-rows-2">
          <Reveal className="lg:col-span-7 lg:row-span-2">
            <motion.figure
              whileHover={reduced ? undefined : { scale: 1.01 }}
              className="group relative h-64 overflow-hidden rounded-2xl border border-white/10 sm:h-80 lg:h-full lg:min-h-[420px]"
            >
              <Image
                src={featured.url}
                alt={featured.alt || ""}
                fill
                sizes="(max-width:1024px) 100vw, 58vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              {(featured.caption || featured.alt) && (
                <figcaption className="absolute bottom-4 left-4 right-4 text-sm font-medium text-white">
                  {featured.caption || featured.alt}
                </figcaption>
              )}
            </motion.figure>
          </Reveal>

          {rest.map((img, i) => (
            <Reveal
              key={`${img.url}-${i}`}
              delay={0.06 * (i + 1)}
              className="lg:col-span-5"
            >
              <motion.figure
                whileHover={reduced ? undefined : { y: -3 }}
                className="group relative h-44 overflow-hidden rounded-2xl border border-white/10 sm:h-48"
              >
                <Image
                  src={img.url}
                  alt={img.alt || ""}
                  fill
                  sizes="(max-width:1024px) 100vw, 40vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                {(img.caption || img.alt) && (
                  <figcaption className="absolute bottom-3 left-3 right-3 text-xs font-medium text-white/90">
                    {img.caption || img.alt}
                  </figcaption>
                )}
              </motion.figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
