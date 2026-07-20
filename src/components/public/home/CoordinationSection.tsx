"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Scale, Users2, ArrowRight, Shield, Landmark, Briefcase } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/button";

const flow = [
  { label: "Insurance", icon: Shield, color: "#5eb3e4" },
  { label: "Financing", icon: Landmark, color: "#f0a020" },
  { label: "Business", icon: Briefcase, color: "#e31c23" },
  { label: "Coordination", icon: Scale, color: "#4fc3f7" },
  { label: "Legacy", icon: Users2, color: "#f0a020" },
];

export function CoordinationSection() {
  const reduced = useReducedMotion();

  return (
    <section className="section-padding relative overflow-hidden bg-surface">
      <div className="absolute inset-0 bg-diagonal opacity-30" aria-hidden />
      <div className="container-wide relative grid items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <p className="text-sm font-semibold tracking-[0.22em] text-sky uppercase">
            Coordinated planning
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl">
            Your Financial Strategy{" "}
            <span className="text-gradient-gold">Should Work as One.</span>
          </h2>
          <p className="mt-5 text-lg text-text-secondary">
            TopAdvice4U does not provide legal or accounting advice. For
            estate-planning conversations, we coordinate with partnered corporate
            lawyers and accountants so insurance, financing and legacy can move
            together.
          </p>
          <p className="mt-4 text-sm text-text-secondary/90">
            Partner professionals are engaged based on your needs. We keep the
            financial pieces aligned — we do not substitute for qualified legal or
            tax counsel.
          </p>
          <Button
            asChild
            className="mt-8 rounded-xl border-sky/30 bg-sky/10 text-sky hover:bg-sky/20"
            variant="outline"
          >
            <Link href="/services/estate-planning-coordination">
              Learn about coordination
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative">
            <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8">
              <p className="mb-6 text-center text-xs font-semibold tracking-[0.2em] text-text-secondary uppercase">
                Advisory pathway
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                {flow.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-2 sm:gap-3">
                      <motion.div
                        initial={reduced ? false : { opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.45 }}
                        className="flex flex-col items-center gap-2"
                      >
                        <span
                          className="inline-flex size-14 items-center justify-center rounded-2xl border border-white/10"
                          style={{
                            background: `${item.color}18`,
                            color: item.color,
                            boxShadow: `0 0 24px ${item.color}33`,
                          }}
                        >
                          <Icon className="size-5" />
                        </span>
                        <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: item.color }}>
                          {item.label}
                        </span>
                      </motion.div>
                      {i < flow.length - 1 && (
                        <span
                          className="mb-5 hidden h-px w-6 sm:block"
                          style={{
                            background: `linear-gradient(90deg, ${item.color}, ${flow[i + 1].color})`,
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
