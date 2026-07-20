"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  Building2,
  GraduationCap,
  HeartPulse,
  Home,
  Landmark,
  ScrollText,
  Shield,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/animations/Reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SERVICE_GROUP_LABELS,
  type PublicService,
} from "@/lib/data/fallbacks";

const iconMap: Record<string, LucideIcon> = {
  Shield,
  Building2,
  Home,
  Landmark,
  Briefcase,
  HeartPulse,
  GraduationCap,
  ScrollText,
};

const groupAccent: Record<string, string> = {
  protection: "#5eb3e4",
  financing: "#f0a020",
  "future-legacy": "#e31c23",
};

interface SolutionsUniverseProps {
  services: PublicService[];
}

export function SolutionsUniverse({ services }: SolutionsUniverseProps) {
  const groups = ["protection", "financing", "future-legacy"] as const;
  const reduced = useReducedMotion();

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-25" aria-hidden />
      <div
        className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full blur-3xl"
        style={{ background: "rgba(94,179,228,0.12)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full blur-3xl"
        style={{ background: "rgba(227,28,35,0.1)" }}
        aria-hidden
      />

      <div className="container-wide relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold tracking-[0.22em] text-sky uppercase">
            Solutions universe
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl">
            Eight pathways.{" "}
            <span className="text-gradient-gold">One trusted relationship.</span>
          </h2>
          <p className="mt-5 text-lg text-text-secondary">
            Explore protection, financing and future & legacy solutions — designed
            for families, property owners and businesses who want clarity, not
            noise.
          </p>
        </Reveal>

        <div className="mt-10 space-y-10">
          {groups.map((group, groupIndex) => {
            const groupServices = services.filter((s) => s.group === group);
            const accent = groupAccent[group];
            return (
              <Reveal key={group} delay={groupIndex * 0.06}>
                <div>
                  <div className="mb-7 flex items-center gap-4">
                    <span
                      className="h-px flex-1"
                      style={{
                        background: `linear-gradient(90deg, ${accent}, transparent)`,
                      }}
                    />
                    <h3
                      className="font-display text-2xl tracking-tight sm:text-3xl"
                      style={{ color: accent }}
                    >
                      {SERVICE_GROUP_LABELS[group]}
                    </h3>
                    <span
                      className="h-px flex-1"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${accent})`,
                      }}
                    />
                  </div>

                  <div className="mt-6 grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {groupServices.map((service, i) => {
                      const Icon = iconMap[service.icon ?? "Shield"] ?? Shield;
                      return (
                        <motion.div
                          key={service.slug}
                          whileHover={reduced ? undefined : { y: -6 }}
                          transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 22,
                          }}
                          className="h-full"
                        >
                          <Link
                            href={`/services/${service.slug}`}
                            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-white/20"
                          >
                            <div className="relative aspect-[16/10] overflow-hidden bg-navy/40">
                              {service.image?.url ? (
                                <Image
                                  src={service.image.url}
                                  alt={service.image.alt || service.name}
                                  fill
                                  sizes="(max-width:768px) 100vw, 33vw"
                                  className="object-cover transition duration-700 group-hover:scale-105"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <Icon
                                    className="size-10 opacity-40"
                                    style={{ color: accent }}
                                  />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-[#030910]/85 via-transparent to-transparent" />
                              {service.featured && (
                                <Badge className="absolute top-3 right-3 border-gold/30 bg-gold/15 text-gold">
                                  Featured
                                </Badge>
                              )}
                            </div>

                            <div className="flex flex-1 flex-col p-5">
                              <div className="flex items-center gap-2">
                                <span
                                  className="inline-flex size-8 items-center justify-center rounded-lg"
                                  style={{
                                    background: `${accent}18`,
                                    color: accent,
                                  }}
                                >
                                  <Icon className="size-4" />
                                </span>
                                <h4 className="font-display text-lg text-text-primary transition-colors group-hover:text-sky">
                                  {service.name}
                                </h4>
                              </div>
                              <p className="mt-2 flex-1 text-sm leading-relaxed text-text-secondary">
                                {service.shortDescription}
                              </p>
                              <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-3 text-sm font-semibold text-sky">
                                <span>Explore</span>
                                <ArrowUpRight
                                  className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                  style={{ transitionDelay: `${i * 20}ms` }}
                                />
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-14 text-center">
          <Button
            asChild
            size="lg"
            className="rounded-xl bg-sky px-8 font-semibold text-[#030910] hover:bg-sky/90"
          >
            <Link href="/services">View all solutions</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
