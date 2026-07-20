"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Phone, Mail, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { ParticleField } from "@/components/animations/ParticleField";
import { Button } from "@/components/ui/button";
import { SITE_DEFAULTS } from "@/config/site";

export function FinalCTA() {
  const reduced = useReducedMotion();

  return (
    <section className="section-padding relative overflow-hidden pb-16">
      <div className="container-narrow relative">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10">
            {/* Animated horizon */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, #061525 0%, #0a2540 35%, #1e4d8c 70%, #5eb3e4 100%)",
              }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-1/2 opacity-60"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(240,160,32,0.35), rgba(227,28,35,0.4), transparent)",
                filter: "blur(40px)",
              }}
            />
            <div className="pointer-events-none absolute inset-0 opacity-50">
              <ParticleField count={36} />
            </div>
            <div className="absolute inset-0 bg-grid opacity-30" />

            {!reduced && (
              <motion.div
                className="absolute -bottom-20 left-1/2 h-40 w-[120%] -translate-x-1/2 rounded-[100%] opacity-40"
                style={{
                  background:
                    "radial-gradient(ellipse, rgba(240,160,32,0.5), transparent 70%)",
                }}
                animate={{ scaleX: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
            )}

            <div className="relative px-8 py-16 text-center sm:px-14 sm:py-20">
              <p className="text-sm font-semibold tracking-[0.25em] text-gold uppercase">
                Let’s build what’s next
              </p>
              <h2 className="mt-4 font-display text-3xl text-white sm:text-4xl lg:text-5xl">
                Let’s Build a Stronger{" "}
                <span className="text-shimmer">Financial Future.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-white/75">
                Tell us what you are planning, protecting or financing. We’ll help
                you understand the next step.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <MagneticButton>
                  <Button
                    asChild
                    size="lg"
                    className="h-13 rounded-xl bg-gradient-to-r from-[#f0a020] to-[#e31c23] px-8 text-base font-semibold text-white shadow-[0_16px_50px_rgba(227,28,35,0.4)] hover:brightness-110"
                  >
                    <Link href="/contact">
                      {SITE_DEFAULTS.primaryCta}
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </MagneticButton>
              </div>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 text-sm text-white/80 sm:flex-row sm:gap-8">
                <a
                  href={SITE_DEFAULTS.phoneHref}
                  className="inline-flex items-center gap-2 transition-colors hover:text-gold"
                >
                  <Phone className="size-4 text-gold" />
                  {SITE_DEFAULTS.phone}
                </a>
                <a
                  href={`mailto:${SITE_DEFAULTS.email}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-sky"
                >
                  <Mail className="size-4 text-sky" />
                  {SITE_DEFAULTS.email}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
