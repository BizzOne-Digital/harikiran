"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ChevronRight } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utilities/cn";
import { ParticleField } from "@/components/animations/ParticleField";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  backgroundImage?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  className?: string;
}

export function PageHero({
  eyebrow,
  title,
  description,
  backgroundImage,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  className,
}: PageHeroProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1.18]);

  return (
    <section
      ref={ref}
      className={cn(
        "relative min-h-[42vh] overflow-hidden pt-24 pb-14 sm:min-h-[52vh] sm:pt-28 sm:pb-20 lg:min-h-[58vh] lg:pb-24",
        className,
      )}
    >
      {backgroundImage ? (
        <motion.div
          className="absolute inset-0"
          style={reduced ? undefined : { y, scale }}
        >
          <Image
            src={backgroundImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {!reduced && (
            <motion.div
              className="absolute inset-0 opacity-35"
              animate={{ scale: [1, 1.05, 1], x: [0, 8, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
              style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                mixBlendMode: "screen",
              }}
            />
          )}
        </motion.div>
      ) : (
        <div className="absolute inset-0 bg-surface" />
      )}

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, rgba(0,11,24,0.94) 0%, rgba(0,11,24,0.72) 45%, rgba(0,11,24,0.55) 100%)",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,11,24,0.45) 0%, transparent 40%, rgba(0,11,24,0.75) 100%)",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden>
        <ParticleField count={28} />
      </div>

      <div className="container-wide relative z-10 max-w-3xl">
        {eyebrow && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center gap-3"
          >
            <span className="h-px w-8 bg-[#F4B44E]" />
            <p className="text-[11px] font-bold tracking-[0.28em] text-[#F4B44E] uppercase">
              {eyebrow}
            </p>
          </motion.div>
        )}
        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.05 }}
            className="font-display text-[1.75rem] leading-tight text-white sm:text-5xl lg:text-6xl"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:mt-5 sm:text-lg"
          >
            {description}
          </motion.p>
        )}
        {(primaryCtaHref || secondaryCtaHref) && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            {primaryCtaHref && primaryCtaLabel && (
              <Link
                href={primaryCtaHref}
                className="inline-flex h-12 items-center justify-center gap-1.5 rounded-md bg-gradient-to-r from-[#F4B44E] to-[#e8922a] px-6 text-sm font-semibold text-[#0a1628] shadow-[0_10px_32px_rgba(244,180,78,0.4)] hover:brightness-110"
              >
                {primaryCtaLabel}
                <ChevronRight className="size-4" />
              </Link>
            )}
            {secondaryCtaHref && secondaryCtaLabel && (
              <Link
                href={secondaryCtaHref}
                className="inline-flex h-12 items-center justify-center gap-1.5 rounded-md border border-white/30 px-6 text-sm font-medium text-white hover:bg-white/5"
              >
                {secondaryCtaLabel}
                <ChevronRight className="size-4" />
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
