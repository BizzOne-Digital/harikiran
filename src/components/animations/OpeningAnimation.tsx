"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SITE_DEFAULTS } from "@/config/site";
import { cn } from "@/lib/utilities/cn";

const STORAGE_KEY = "ta4u-opening-seen-v5";

const LEFT_ICONS = [
  { src: "/intro/icon-protect.png", alt: "Protect Your Family" },
  { src: "/intro/icon-finance.png", alt: "Finance Your Property" },
  { src: "/intro/icon-grow.png", alt: "Grow Your Business" },
] as const;

const RIGHT_ICONS = [
  { src: "/intro/icon-preserve.png", alt: "Preserve Your Legacy" },
  { src: "/intro/icon-one-advisor.png", alt: "One Advisor Multiple Solutions" },
  { src: "/intro/icon-trusted.png", alt: "Trusted Advice" },
] as const;

const ADVISORS = [
  {
    src: "/team/harkiran-singh.png?v=4",
    name: "Harkiran Singh",
  },
  {
    src: "/team/jennifer-chan.png",
    name: "Jennifer Chan",
  },
] as const;

/** Longer stay so advisor photos remain visible (~12.5s) */
const TIMING = {
  icons: 0.85,
  center: 2.5,
  advisors: 3.1,
  progress: 4.2,
  progressFill: 5.5,
  exitAt: 11.8,
  doneAt: 12.9,
} as const;

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function GlowRing({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <div
        className="absolute -inset-6 rounded-full opacity-80 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 30% 50%, rgba(34,211,238,0.45) 0%, transparent 45%), radial-gradient(circle at 75% 50%, rgba(240,160,32,0.35) 0%, transparent 48%)",
        }}
      />
      <div
        className="absolute inset-0 rounded-full opacity-90 blur-md"
        style={{
          background:
            "conic-gradient(from 200deg, #22d3ee, #38bdf8, #60a5fa, #fbbf24, #f0a020, #fb923c, #22d3ee)",
          WebkitMask:
            "radial-gradient(farthest-side, transparent calc(100% - 14px), #000 calc(100% - 10px))",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 14px), #000 calc(100% - 10px))",
        }}
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 200deg, #67e8f9 0%, #22d3ee 18%, #38bdf8 35%, #fbbf24 58%, #f0a020 72%, #fb923c 88%, #67e8f9 100%)",
          WebkitMask:
            "radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 4px))",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 4px))",
          boxShadow:
            "0 0 28px rgba(34,211,238,0.35), 0 0 48px rgba(240,160,32,0.2)",
        }}
      />
      <div
        className="absolute inset-[10px] rounded-full opacity-70"
        style={{
          background:
            "conic-gradient(from 200deg, rgba(103,232,249,0.85), rgba(56,189,248,0.5), rgba(240,160,32,0.75), rgba(103,232,249,0.85))",
          WebkitMask:
            "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px))",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px))",
        }}
      />
    </div>
  );
}

function IntroIcon({
  src,
  alt,
  side,
  index,
  compact = false,
}: {
  src: string;
  alt: string;
  side: "left" | "right";
  index: number;
  compact?: boolean;
}) {
  const delay = TIMING.icons + index * 0.18;
  const enterName = compact
    ? side === "left"
      ? "intro-icon-in-left-sm"
      : "intro-icon-in-right-sm"
    : side === "left"
      ? "intro-icon-in-left"
      : "intro-icon-in-right";

  return (
    <div
      className="will-change-transform"
      style={{
        animation: `intro-float ${3.4 + index * 0.4}s ease-in-out ${delay + 1.1}s infinite`,
      }}
    >
      <div
        style={{
          animation: `${enterName} 1.05s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s both`,
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={280}
          height={320}
          unoptimized
          priority
          className={cn(
            "h-auto object-contain drop-shadow-[0_0_14px_rgba(0,180,255,0.25)]",
            compact
              ? "w-[4.75rem]"
              : "w-[clamp(4.25rem,9.5vh,6.75rem)] lg:w-[clamp(4.75rem,10.5vh,7.5rem)]",
          )}
        />
      </div>
    </div>
  );
}

/**
 * Cinematic first-visit intro — CSS animations only.
 * Motion/Framer caused removeChild NotFoundErrors on dismiss with React 19.
 */
export function OpeningAnimation() {
  const [phase, setPhase] = useState<"idle" | "play" | "exit" | "done">("idle");
  const [pct, setPct] = useState(0);
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);

    if (prefersReducedMotion()) {
      document.documentElement.dataset.intro = "seen";
      setPhase("done");
      return;
    }

    try {
      if (sessionStorage.getItem(STORAGE_KEY)) {
        document.documentElement.dataset.intro = "seen";
        setPhase("done");
        return;
      }
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* private mode */
    }

    document.documentElement.dataset.intro = "playing";
    setPhase("play");

    const exitTimer = window.setTimeout(
      () => setPhase("exit"),
      TIMING.exitAt * 1000,
    );
    const doneTimer = window.setTimeout(() => {
      setPhase("done");
    }, TIMING.doneAt * 1000);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  useEffect(() => {
    if (phase !== "done") return;
    document.documentElement.dataset.intro = "seen";
    document.body.style.overflow = "";
  }, [phase]);

  useEffect(() => {
    if (phase !== "play") return;

    const start = performance.now();
    const delayMs = TIMING.progress * 1000;
    const fillMs = TIMING.progressFill * 1000;
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - start - delayMs;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const next = Math.min(100, Math.round((elapsed / fillMs) * 100));
      setPct(next);
      if (next < 100) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  useEffect(() => {
    if (phase === "play" || phase === "exit") {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [phase]);

  if (!mounted || phase === "idle" || phase === "done") return null;

  const shell = (
    <div
      data-opening-intro
      data-phase={phase}
      className={cn(
        "fixed inset-0 z-[300] overflow-hidden bg-[#02060f]",
        "transition-opacity duration-1000 ease-out",
        phase === "exit" && "pointer-events-none opacity-0",
      )}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          animation: "intro-bg-rise 1.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        }}
      >
        <Image
          src="/intro/bg.png"
          alt=""
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 50% at 50% 42%, transparent 0%, rgba(2,6,15,0.28) 55%, rgba(2,6,15,0.65) 100%)",
          }}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(2,6,15,0.45) 0%, transparent 22%, transparent 68%, rgba(2,6,15,0.88) 100%)",
        }}
      />

      <div className="relative z-10 flex h-full min-h-0 w-full flex-col px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6">
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 sm:gap-0">
          <div className="flex h-[min(78vh,620px)] w-full max-w-6xl items-center justify-center gap-2 sm:gap-5 lg:gap-8">
            <div className="hidden h-full max-h-full w-[18%] max-w-[9.5rem] flex-col items-center justify-evenly py-1 sm:flex lg:max-w-[10.5rem]">
              {LEFT_ICONS.map((icon, i) => (
                <IntroIcon
                  key={icon.src}
                  src={icon.src}
                  alt={icon.alt}
                  side="left"
                  index={i}
                />
              ))}
            </div>

            <div className="relative flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center gap-3 sm:gap-4">
              <div className="relative flex size-[min(68vw,260px)] items-center justify-center sm:size-[min(44vh,340px)] lg:size-[min(48vh,390px)]">
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    animation: `intro-fade-in 1.35s cubic-bezier(0.22, 1, 0.36, 1) ${TIMING.center}s both`,
                  }}
                >
                  <GlowRing className="size-full" />
                </div>

                <div
                  className="relative z-10 flex max-w-[85%] flex-col items-center px-2 text-center sm:max-w-[80%] sm:px-3"
                  style={{
                    animation: `intro-fade-up 1.1s cubic-bezier(0.22, 1, 0.36, 1) ${TIMING.center + 0.25}s both`,
                  }}
                >
                  <div className="relative mb-1 h-[4.5rem] w-[8rem] overflow-hidden sm:mb-1.5 sm:h-[6.5rem] sm:w-[12rem] lg:h-[7.5rem] lg:w-[14rem]">
                    <Image
                      src="/logo/logo.png?v=2"
                      alt={SITE_DEFAULTS.businessName}
                      width={320}
                      height={240}
                      priority
                      unoptimized
                      className="absolute left-1/2 top-0 h-[145%] w-[145%] max-w-none -translate-x-1/2 object-contain object-top"
                    />
                  </div>
                  <p className="font-display text-[1.1rem] font-semibold tracking-wide text-white sm:text-2xl lg:text-[1.75rem]">
                    TopAdvice
                    <span className="text-[#7dd3fc]">4U</span>
                  </p>
                  <p className="mt-0.5 text-[7px] font-medium tracking-[0.22em] text-white/75 uppercase sm:text-[10px] sm:tracking-[0.34em]">
                    Financial Services Inc.
                  </p>
                  <div className="mt-2 h-px w-12 bg-gradient-to-r from-transparent via-[#f0a020]/90 to-transparent sm:mt-2.5 sm:w-20" />
                  <p className="mt-1.5 flex flex-wrap items-center justify-center gap-x-1 gap-y-0.5 text-[7px] font-semibold tracking-[0.1em] uppercase sm:mt-2 sm:gap-x-1.5 sm:text-[10px] sm:tracking-[0.18em]">
                    <span className="text-[#22d3ee]">Protect.</span>
                    <span className="text-[#c084fc]">Finance.</span>
                    <span className="text-[#38bdf8]">Grow.</span>
                    <span className="text-[#f0a020]">Preserve.</span>
                  </p>
                </div>
              </div>

              <div
                className="z-20 flex items-start justify-center gap-4 sm:gap-6"
                style={{
                  animation: `intro-fade-up 0.85s cubic-bezier(0.22, 1, 0.36, 1) ${TIMING.advisors}s both`,
                }}
              >
                {ADVISORS.map((person) => (
                  <div key={person.name} className="flex flex-col items-center">
                    <div className="relative size-16 overflow-hidden rounded-full border border-white/30 shadow-[0_0_22px_rgba(34,211,238,0.3)] sm:size-[4.75rem] lg:size-[5.5rem]">
                      <Image
                        src={person.src}
                        alt={person.name}
                        fill
                        unoptimized
                        sizes="88px"
                        className={
                          person.name.includes("Harkiran")
                            ? "object-cover object-[center_22%]"
                            : "object-cover object-top"
                        }
                      />
                    </div>
                    <p className="mt-1.5 max-w-[5.5rem] text-center text-[10px] font-semibold leading-tight tracking-wide text-white/95 sm:max-w-[6.5rem] sm:text-[11px]">
                      {person.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden h-full max-h-full w-[18%] max-w-[9.5rem] flex-col items-center justify-evenly py-1 sm:flex lg:max-w-[10.5rem]">
              {RIGHT_ICONS.map((icon, i) => (
                <IntroIcon
                  key={icon.src}
                  src={icon.src}
                  alt={icon.alt}
                  side="right"
                  index={i}
                />
              ))}
            </div>
          </div>

          <div className="mt-1 grid w-full max-w-sm grid-cols-3 justify-items-center gap-x-1 gap-y-0.5 px-1 sm:hidden">
            {[...LEFT_ICONS, ...RIGHT_ICONS].map((icon, i) => (
              <IntroIcon
                key={`m-${icon.src}`}
                src={icon.src}
                alt={icon.alt}
                side={i < 3 ? "left" : "right"}
                index={i % 3}
                compact
              />
            ))}
          </div>
        </div>

        <div
          className="relative z-20 mx-auto w-full max-w-[28rem] shrink-0 px-2 pt-2 pb-1 sm:pt-3 sm:pb-2"
          style={{
            animation: `intro-fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${TIMING.progress}s both`,
          }}
        >
          <p className="mb-1.5 text-center text-[9px] font-medium tracking-[0.16em] text-cyan-300/90 uppercase sm:mb-2 sm:text-[11px] sm:tracking-[0.2em]">
            Preparing Your Financial Future
          </p>
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10 shadow-[inset_0_0_8px_rgba(0,0,0,0.4)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#2563EB] via-[#22d3ee] to-[#f0a020] shadow-[0_0_16px_rgba(34,211,238,0.55)] transition-[width] duration-75 ease-linear"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-9 shrink-0 text-right text-[11px] font-semibold tabular-nums text-[#f0a020] sm:w-10 sm:text-sm">
              {pct}%
            </span>
          </div>
          <p className="mt-1.5 text-center text-[9px] text-white/40 sm:mt-2 sm:text-[10px]">
            Please wait…
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(shell, document.body);
}
