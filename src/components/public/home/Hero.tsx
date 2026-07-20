"use client";

import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import {
  Briefcase,
  Check,
  ChevronRight,
  GraduationCap,
  Home,
  Leaf,
  Lock,
  Scale,
  Shield,
  TrendingUp,
  Umbrella,
  Users,
} from "lucide-react";
import { useRef } from "react";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { ParticleField } from "@/components/animations/ParticleField";
import { SITE_DEFAULTS } from "@/config/site";

const orbitNodes = [
  {
    label: "PROTECT",
    sub: "Your Family",
    icon: Users,
    color: "#2DD4BF",
    pos: "left-[0%] top-[6%]",
  },
  {
    label: "FINANCE",
    sub: "Your Property",
    icon: Home,
    color: "#A78BFA",
    pos: "right-[0%] top-[8%]",
  },
  {
    label: "GROW",
    sub: "Your Business",
    icon: TrendingUp,
    color: "#38BDF8",
    pos: "left-[0%] bottom-[22%]",
  },
  {
    label: "PRESERVE",
    sub: "Your Legacy",
    icon: Leaf,
    color: "#F4B44E",
    pos: "right-[0%] bottom-[20%]",
  },
];

const trustItems = [
  { icon: Shield, label: "Trusted Advice" },
  { icon: Users, label: "Client Focused" },
  { icon: Lock, label: "Confidential & Secure" },
];

const serviceBar = [
  {
    icon: Umbrella,
    color: "#2DD4BF",
    label: "Life Insurance",
    desc: "Family & corporate coverage",
    href: "/services/family-life-insurance",
  },
  {
    icon: Home,
    color: "#A78BFA",
    label: "Mortgages",
    desc: "Residential & commercial",
    href: "/services/residential-mortgages",
  },
  {
    icon: Briefcase,
    color: "#38BDF8",
    label: "Business Loans",
    desc: "Growth & working capital",
    href: "/services/business-loans",
  },
  {
    icon: Users,
    color: "#F4B44E",
    label: "Employee Benefits",
    desc: "Group health plans",
    href: "/services/group-health-plans",
  },
  {
    icon: GraduationCap,
    color: "#2DD4BF",
    label: "Education Planning",
    desc: "RESP & savings paths",
    href: "/services/resp-education-planning",
  },
  {
    icon: Scale,
    color: "#A78BFA",
    label: "Estate Planning",
    desc: "Legacy coordination",
    href: "/services/estate-planning-coordination",
  },
];

export function Hero({
  backgroundImage = "/images/hero-bg.png",
  eyebrow = "Life. Property. Business. Legacy.",
  heading = "Protect What Matters.\nFinance What’s Next.",
  subheading = "Life insurance, mortgages, business financing, employee benefits, education planning and legacy coordination—all through one trusted advisory relationship.",
  primaryCtaLabel = "Book a Free Consultation",
  primaryCtaHref = "/contact",
  secondaryCtaLabel = "Explore Our Solutions",
  secondaryCtaHref = "/services",
}: {
  backgroundImage?: string;
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 45, damping: 22 });
  const sy = useSpring(my, { stiffness: 45, damping: 22 });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.14]);
  const parallaxX = useTransform(sx, [-0.5, 0.5], [-12, 12]);
  const graphicX = useTransform(sx, [-0.5, 0.5], [-8, 8]);
  const graphicY = useTransform(sy, [-0.5, 0.5], [-6, 6]);

  const headingLines = heading.split("\n").filter(Boolean);
  const line1 = headingLines[0] || "Protect What Matters.";
  const line2 = headingLines[1] || "Finance What’s Next.";

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduced || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMove}
      className="relative min-h-[100dvh] overflow-hidden bg-[#000B18] pt-[4.75rem]"
    >
      {/* Background — cinematic city / light trails */}
      <motion.div
        className="absolute inset-0 z-0"
        style={reduced ? undefined : { y: bgY, scale: bgScale, x: parallaxX }}
      >
        <Image
          src={backgroundImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[78%_center]"
        />
        {!reduced && (
          <motion.div
            className="absolute inset-0 origin-center opacity-40"
            animate={{ scale: [1, 1.04, 1], x: [0, 10, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "78% center",
              mixBlendMode: "screen",
            }}
          />
        )}
      </motion.div>

      {/* Left readability wash — matches SS dark left / lit right */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(105deg, rgba(0,11,24,0.97) 0%, rgba(0,11,24,0.88) 34%, rgba(0,11,24,0.45) 58%, rgba(0,11,24,0.55) 100%)",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,11,24,0.5) 0%, transparent 22%, transparent 68%, rgba(0,11,24,0.95) 100%)",
        }}
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-0 z-[2] opacity-30" aria-hidden>
        <ParticleField count={36} />
      </div>

      {!reduced && (
        <motion.div
          className="pointer-events-none absolute bottom-[18%] right-[-8%] z-[2] h-20 w-[50%] rotate-[-10deg] blur-md"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(244,180,78,0.4), rgba(0,163,255,0.28), transparent)",
          }}
          animate={{ x: ["-6%", "10%", "-6%"], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
      )}

      {/* Main hero content */}
      <div className="container-wide relative z-10 grid min-h-[calc(100dvh-4.75rem)] items-center gap-8 pb-36 pt-10 sm:pb-40 lg:grid-cols-[1fr_1fr] lg:gap-4 lg:pb-44 lg:pt-6">
        {/* LEFT — exact SS copy block */}
        <div className="relative z-10 max-w-[560px]">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 flex items-center gap-3"
          >
            <span className="h-px w-8 bg-[#F4B44E]" />
            <p className="text-[11px] font-bold tracking-[0.28em] text-[#F4B44E] uppercase">
              {eyebrow}
            </p>
          </motion.div>

          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[2.15rem] leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem] xl:text-[3.75rem]"
          >
            <span className="block text-white">{line1}</span>
            <span className="mt-1 block bg-gradient-to-r from-[#00A3FF] via-[#5ee7ff] to-[#00A3FF] bg-clip-text text-transparent">
              {line2}
            </span>
          </motion.h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="mt-5 max-w-[480px] text-[15px] leading-[1.65] text-white/75 sm:text-base"
          >
            {subheading}
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.5 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <MagneticButton>
              <Link
                href={primaryCtaHref}
                className="inline-flex h-12 items-center justify-center gap-1.5 rounded-md bg-gradient-to-r from-[#F4B44E] to-[#e8922a] px-6 text-[15px] font-semibold text-[#0a1628] shadow-[0_10px_36px_rgba(244,180,78,0.45)] transition hover:brightness-110"
              >
                {primaryCtaLabel}
                <ChevronRight className="size-4" />
              </Link>
            </MagneticButton>
            <Link
              href={secondaryCtaHref}
              className="inline-flex h-12 items-center justify-center gap-1.5 rounded-md border border-white/35 bg-transparent px-6 text-[15px] font-medium text-white transition hover:border-white/60 hover:bg-white/5"
            >
              {secondaryCtaLabel}
              <ChevronRight className="size-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.42 }}
            className="mt-9 flex flex-wrap gap-x-7 gap-y-3"
          >
            {trustItems.map((item) => {
              const Icon = item.icon;
              return (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-2 text-[12px] font-medium text-white/70"
                >
                  <Icon className="size-3.5 text-[#00A3FF]" strokeWidth={2} />
                  {item.label}
                </span>
              );
            })}
          </motion.div>
        </div>

        {/* RIGHT — orbital graphic matching SS */}
        <div className="relative mx-auto hidden w-full max-w-[540px] lg:block">
          <motion.div
            style={reduced ? undefined : { x: graphicX, y: graphicY }}
            className="relative mx-auto aspect-square w-full"
          >
            {/* Concentric glow rings */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-[#00A3FF]/30"
                style={{
                  inset: `${12 + i * 10}%`,
                  boxShadow:
                    i === 0
                      ? "0 0 50px rgba(0,163,255,0.2), inset 0 0 40px rgba(0,163,255,0.08)"
                      : undefined,
                }}
                animate={
                  reduced
                    ? undefined
                    : {
                        rotate: i % 2 === 0 ? 360 : -360,
                        opacity: [0.35, 0.7, 0.35],
                      }
                }
                transition={{
                  rotate: {
                    duration: 36 + i * 14,
                    repeat: Infinity,
                    ease: "linear",
                  },
                  opacity: {
                    duration: 3.5 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              />
            ))}

            {/* Connecting dashed orbit feel */}
            <svg
              className="pointer-events-none absolute inset-[8%] opacity-40"
              viewBox="0 0 100 100"
              aria-hidden
            >
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="rgba(0,163,255,0.45)"
                strokeWidth="0.35"
                strokeDasharray="1.5 2"
              />
            </svg>

            {/* Four orbit nodes */}
            {orbitNodes.map((node, i) => {
              const Icon = node.icon;
              return (
                <motion.div
                  key={node.label}
                  className={`absolute z-20 ${node.pos}`}
                  initial={reduced ? false : { opacity: 0, scale: 0.85 }}
                  animate={
                    reduced
                      ? { opacity: 1 }
                      : {
                          opacity: 1,
                          scale: 1,
                          y: [0, i % 2 === 0 ? -9 : 9, 0],
                        }
                  }
                  transition={{
                    opacity: { delay: 0.3 + i * 0.08, duration: 0.45 },
                    y: {
                      delay: 0.7,
                      duration: 4.2 + i * 0.35,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                >
                  <div
                    className="flex min-w-[148px] items-center gap-2.5 rounded-full border border-white/20 bg-[#000B18]/80 px-3 py-2 backdrop-blur-md"
                    style={{
                      boxShadow: `0 0 22px ${node.color}40, 0 8px 24px rgba(0,0,0,0.45)`,
                    }}
                  >
                    <span
                      className="inline-flex size-9 shrink-0 items-center justify-center rounded-full"
                      style={{
                        background: `${node.color}20`,
                        color: node.color,
                        boxShadow: `0 0 14px ${node.color}55`,
                      }}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="leading-tight">
                      <span
                        className="block text-[10px] font-extrabold tracking-[0.12em] uppercase"
                        style={{ color: node.color }}
                      >
                        {node.label}
                      </span>
                      <span className="block text-[11px] font-medium text-white/85">
                        {node.sub}
                      </span>
                    </span>
                  </div>
                </motion.div>
              );
            })}

            {/* Bottom trust callout under graphic */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="absolute bottom-[2%] left-1/2 z-20 w-[min(100%,320px)] -translate-x-1/2"
            >
              <div className="flex items-center gap-2.5 rounded-lg border border-white/15 bg-[#000B18]/75 px-3.5 py-2.5 backdrop-blur-md">
                <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#00A3FF]/20 text-[#00A3FF]">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                <p className="text-[11px] leading-snug text-white/80">
                  {SITE_DEFAULTS.trustStatement}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom services bar */}
      <div className="absolute inset-x-0 bottom-3 z-20 mx-auto w-[min(100%-1rem,88rem)] overflow-hidden rounded-xl border border-white/10 bg-[#000B18]/85 backdrop-blur-xl sm:bottom-5 sm:w-[min(100%-1.5rem,88rem)]">
        <div className="flex snap-x snap-mandatory overflow-x-auto scrollbar-none lg:grid lg:grid-cols-6 lg:overflow-visible">
          {serviceBar.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="group flex min-w-[9.5rem] shrink-0 snap-start items-start gap-2.5 border-r border-white/5 px-3 py-3.5 transition-colors last:border-r-0 hover:bg-white/[0.04] sm:min-w-[11rem] sm:gap-3 sm:px-4 sm:py-4 lg:min-w-0 lg:border-r lg:last:border-r-0"
              >
                <span
                  className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg sm:size-9"
                  style={{
                    background: `${item.color}18`,
                    color: item.color,
                  }}
                >
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[12px] font-bold text-white sm:text-[13px]">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block text-[10px] leading-snug text-white/50 sm:text-[11px]">
                    {item.desc}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
