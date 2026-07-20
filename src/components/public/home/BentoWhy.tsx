"use client";

import {
  Layers,
  MessageSquare,
  Route,
  Users,
  ShieldCheck,
  Landmark,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/animations/Reveal";

const reasons = [
  {
    icon: Layers,
    title: "One Relationship, Multiple Solutions",
    description:
      "Life insurance, mortgages, business financing, benefits, education and legacy — coordinated through one advisory relationship.",
    accent: "#5eb3e4",
  },
  {
    icon: ShieldCheck,
    title: "Family & Corporate Planning",
    description:
      "Personal protection and business continuity conversations that respect your real priorities.",
    accent: "#f0a020",
  },
  {
    icon: Landmark,
    title: "Residential & Commercial Financing",
    description:
      "Property financing pathways with educational clarity — never guaranteed approvals.",
    accent: "#e31c23",
  },
  {
    icon: Route,
    title: "Business Growth Support",
    description:
      "Financing and benefits discussions that help owners strengthen what they are building.",
    accent: "#4fc3f7",
  },
  {
    icon: Users,
    title: "Professional Partner Network",
    description:
      "Coordination with partnered lawyers and accountants when estate or tax input is needed.",
    accent: "#f0a020",
  },
  {
    icon: MessageSquare,
    title: "Long-Term Perspective",
    description:
      "Advice oriented toward durable decisions — not short-term noise or empty promises.",
    accent: "#5eb3e4",
  },
];

export function BentoWhy() {
  const reduced = useReducedMotion();

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" aria-hidden />
      <div className="container-wide relative">
        <Reveal className="max-w-3xl">
          <p className="text-sm font-semibold tracking-[0.22em] text-sky uppercase">
            Why Topadvice4u
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl">
            Built for decisions that{" "}
            <span className="text-gradient-gold">actually matter.</span>
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Premium advisory experience — cinematic on screen, serious in
            substance.
          </p>
        </Reveal>

        <div className="mt-8 grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={index * 0.05} className="h-full">
                <motion.article
                  whileHover={reduced ? undefined : { y: -4 }}
                  transition={{ type: "spring", stiffness: 280, damping: 24 }}
                  className="brand-card group relative flex h-full min-h-[200px] flex-col overflow-hidden rounded-2xl p-5 sm:min-h-[220px] sm:p-7"
                >
                  <div
                    className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full opacity-35 blur-3xl transition-opacity group-hover:opacity-60"
                    style={{ background: item.accent }}
                  />
                  <span
                    className="relative inline-flex size-11 items-center justify-center rounded-xl border border-white/10"
                    style={{
                      background: `${item.accent}18`,
                      color: item.accent,
                      boxShadow: `0 0 24px ${item.accent}28`,
                    }}
                  >
                    <Icon className="size-5" />
                  </span>
                  <h3 className="relative mt-4 font-display text-xl">
                    {item.title}
                  </h3>
                  <p className="relative mt-2 flex-1 text-sm leading-relaxed text-text-secondary">
                    {item.description}
                  </p>
                </motion.article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
