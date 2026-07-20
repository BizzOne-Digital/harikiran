"use client";

import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/animations/Reveal";

const steps = [
  {
    step: "01",
    title: "Start the Conversation",
    description:
      "Share what you are protecting, financing or planning. We clarify priorities and timelines together.",
    color: "#5eb3e4",
  },
  {
    step: "02",
    title: "Understand Your Priorities",
    description:
      "We explore suitable options and estimators with educational clarity — never pressure.",
    color: "#f0a020",
  },
  {
    step: "03",
    title: "Explore Suitable Solutions",
    description:
      "Compare pathways that fit your situation. Approvals and terms always depend on providers.",
    color: "#e31c23",
  },
  {
    step: "04",
    title: "Move Forward With Confidence",
    description:
      "Clear next steps, application support when ready, and ongoing advisory as life evolves.",
    color: "#4fc3f7",
  },
];

export function ProcessTimeline() {
  const reduced = useReducedMotion();

  return (
    <section className="section-padding relative overflow-hidden">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 hidden h-px w-[70%] -translate-x-1/2 -translate-y-1/2 lg:block"
        style={{
          background:
            "linear-gradient(90deg, #5eb3e4, #f0a020, #e31c23, #4fc3f7)",
          opacity: 0.35,
        }}
        aria-hidden
      />

      <div className="container-wide relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-[0.22em] text-sky uppercase">
            How we work
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl">
            Four steps.{" "}
            <span className="text-gradient-fire">Zero guesswork.</span>
          </h2>
        </Reveal>

        <div className="mt-8 grid auto-rows-fr gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {steps.map((item, index) => (
            <Reveal key={item.step} delay={index * 0.08} className="h-full">
              <motion.article
                whileHover={reduced ? undefined : { y: -6 }}
                className="brand-card relative flex h-full min-h-[220px] flex-col rounded-2xl p-5 sm:min-h-[240px] sm:p-6"
              >
                <span
                  className="font-display text-4xl font-bold"
                  style={{
                    background: `linear-gradient(135deg, ${item.color}, transparent)`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {item.step}
                </span>
                <h3 className="mt-4 font-display text-lg sm:text-xl">
                  {item.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">
                  {item.description}
                </p>
                <div
                  className="mt-5 h-0.5 w-12 shrink-0 rounded-full"
                  style={{ background: item.color }}
                />
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
