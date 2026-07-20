"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Home, Building2, Briefcase, ScrollText } from "lucide-react";

const stages = [
  {
    n: "01",
    title: "Protect Your Family",
    description:
      "Life insurance conversations focused on dependents, income replacement and household priorities — with educational clarity, not pressure.",
    href: "/services/family-life-insurance",
    link: "Family Life Insurance",
    icon: Home,
    accent: "#5eb3e4",
    glow: "rgba(94,179,228,0.2)",
  },
  {
    n: "02",
    title: "Finance Your Property",
    description:
      "Residential and commercial mortgage pathways for purchases, renewals and refinancing — with honest eligibility conversations.",
    href: "/services/residential-mortgages",
    link: "Residential Mortgages",
    icon: Building2,
    accent: "#f0a020",
    glow: "rgba(240,160,32,0.2)",
  },
  {
    n: "03",
    title: "Strengthen Your Business",
    description:
      "Corporate life insurance, group benefits and business financing discussions that support continuity and growth.",
    href: "/services/business-loans",
    link: "Business Loans",
    icon: Briefcase,
    accent: "#e31c23",
    glow: "rgba(227,28,35,0.18)",
  },
  {
    n: "04",
    title: "Preserve Your Legacy",
    description:
      "RESP planning and estate-planning coordination with partnered lawyers and accountants — so strategy works as one.",
    href: "/services/estate-planning-coordination",
    link: "Estate Coordination",
    icon: ScrollText,
    accent: "#4fc3f7",
    glow: "rgba(79,195,247,0.18)",
  },
];

export function JourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    if (reduced || !desktop || !sectionRef.current || !trackRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const getScroll = () =>
        Math.max(0, track.scrollWidth - window.innerWidth);

      gsap.to(track, {
        x: () => -getScroll(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${getScroll() + window.innerWidth * 0.35}`,
          pin: true,
          scrub: 0.85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="relative overflow-hidden bg-surface lg:h-dvh"
    >
      <div className="pointer-events-none absolute inset-0 bg-diagonal opacity-40" aria-hidden />

      {/* Mobile: vertical stack */}
      <div className="section-padding lg:hidden">
        <div className="container-narrow mb-10">
          <p className="text-sm font-semibold tracking-[0.22em] text-sky uppercase">
            Four-part financial journey
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            Protect. Finance.{" "}
            <span className="text-gradient-fire">Strengthen. Preserve.</span>
          </h2>
          <p className="mt-4 text-text-secondary">
            A cinematic path through the decisions that shape family security,
            property, business strength and long-term legacy.
          </p>
        </div>

        <div className="container-narrow space-y-5">
          {stages.map((stage) => {
            const Icon = stage.icon;
            return (
              <article
                key={stage.title}
                className="brand-card relative overflow-hidden rounded-2xl p-6"
                style={{ boxShadow: `0 0 40px ${stage.glow}` }}
              >
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span
                      className="font-display text-4xl font-bold opacity-30"
                      style={{ color: stage.accent }}
                    >
                      {stage.n}
                    </span>
                    <span
                      className="inline-flex size-11 items-center justify-center rounded-xl"
                      style={{
                        background: `${stage.accent}22`,
                        color: stage.accent,
                      }}
                    >
                      <Icon className="size-5" />
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-2xl">{stage.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {stage.description}
                  </p>
                  <Link
                    href={stage.href}
                    className="mt-4 inline-flex text-sm font-semibold"
                    style={{ color: stage.accent }}
                  >
                    {stage.link} →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Desktop: full-viewport pinned horizontal story */}
      <div className="hidden h-full flex-col lg:flex">
        {/* Compact header — leaves room for full cards */}
        <div className="shrink-0 px-[max(2rem,6vw)] pb-4 pt-28">
          <p className="text-xs font-semibold tracking-[0.22em] text-sky uppercase">
            Four-part financial journey
          </p>
          <h2 className="mt-2 max-w-3xl font-display text-3xl xl:text-4xl">
            Protect. Finance.{" "}
            <span className="text-gradient-fire">Strengthen. Preserve.</span>
          </h2>
          <p className="mt-2 max-w-xl text-sm text-text-secondary xl:text-base">
            Scroll to move through the pathway — family, property, business and
            legacy.
          </p>
        </div>

        {/* Cards vertically centered in remaining viewport */}
        <div className="relative flex min-h-0 flex-1 items-center">
          <div
            ref={trackRef}
            className="flex w-max items-stretch gap-6 px-[max(2rem,6vw)] will-change-transform"
          >
            {stages.map((stage) => {
              const Icon = stage.icon;
              return (
                <article
                  key={stage.title}
                  className="brand-card relative flex h-[min(420px,calc(100dvh-14rem))] w-[min(72vw,420px)] shrink-0 flex-col overflow-hidden rounded-3xl p-8 xl:p-9"
                  style={{
                    borderColor: `${stage.accent}40`,
                    boxShadow: `0 24px 60px rgba(0,0,0,0.4), 0 0 50px ${stage.glow}`,
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-50"
                    style={{
                      background: `linear-gradient(145deg, ${stage.glow}, transparent 65%)`,
                    }}
                  />
                  <div className="relative flex h-full flex-col">
                    <div className="flex items-start justify-between">
                      <span
                        className="font-display text-6xl font-bold leading-none opacity-30 xl:text-7xl"
                        style={{ color: stage.accent }}
                      >
                        {stage.n}
                      </span>
                      <span
                        className="inline-flex size-12 items-center justify-center rounded-2xl border border-white/10 xl:size-14"
                        style={{
                          background: `${stage.accent}20`,
                          color: stage.accent,
                        }}
                      >
                        <Icon className="size-5 xl:size-6" />
                      </span>
                    </div>
                    <h3 className="mt-6 font-display text-2xl tracking-tight xl:text-3xl">
                      {stage.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary xl:text-base">
                      {stage.description}
                    </p>
                    <Link
                      href={stage.href}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-bold tracking-wide uppercase transition-opacity hover:opacity-80"
                      style={{ color: stage.accent }}
                    >
                      {stage.link}
                      <span aria-hidden>→</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
