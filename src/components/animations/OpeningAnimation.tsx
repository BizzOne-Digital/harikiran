"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useState } from "react";
import { SITE_DEFAULTS } from "@/config/site";
import { cn } from "@/lib/utilities/cn";

const STORAGE_KEY = "ta4u-opening-seen-v3";

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

/** Slow, calm choreography (~9s) then soft exit */
const TIMING = {
  bg: 0,
  icons: 0.85,
  center: 2.5,
  progress: 3.8,
  progressFill: 4.2,
  exitAt: 8.4,
  doneAt: 9.4,
} as const;

function GlowRing({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      {/* Soft bloom behind the ring */}
      <div
        className="absolute -inset-6 rounded-full opacity-80 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 30% 50%, rgba(34,211,238,0.45) 0%, transparent 45%), radial-gradient(circle at 75% 50%, rgba(240,160,32,0.35) 0%, transparent 48%)",
        }}
      />

      {/* Outer glow halo */}
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

      {/* Main hollow ring — cyan left → gold right */}
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

      {/* Inner thin accent ring */}
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
  const fromX = compact
    ? side === "left"
      ? -80
      : 80
    : side === "left"
      ? -280
      : 280;
  const fromY = compact ? 40 : -36;
  const fromRot = side === "left" ? -18 : 18;
  const delay = TIMING.icons + index * 0.18;

  return (
    <motion.div
      className="will-change-transform"
      animate={{
        y: [0, index % 2 === 0 ? -5 : -3, 0],
      }}
      transition={{
        delay: delay + 1.1,
        duration: 3.4 + index * 0.4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <motion.div
        initial={{
          x: fromX,
          y: fromY,
          rotate: fromRot,
          opacity: 0,
          scale: compact ? 1.15 : 1.35,
        }}
        animate={{
          x: 0,
          y: 0,
          rotate: 0,
          opacity: 1,
          scale: 1,
        }}
        transition={{
          type: "spring",
          stiffness: compact ? 200 : 160,
          damping: 18,
          mass: 1.2,
          delay,
        }}
      >
        <motion.div
          initial={{ scaleY: 1 }}
          animate={{ scaleY: [1, 0.92, 1.03, 1] }}
          transition={{
            delay: delay + 0.45,
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="origin-bottom"
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
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Cinematic first-visit intro: BG springs up, icons crush in from sides,
 * center brand appears, progress fills to 100%, then fades out.
 */
export function OpeningAnimation() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"idle" | "play" | "exit" | "done">("idle");
  const [pct, setPct] = useState(0);

  useLayoutEffect(() => {
    if (reduced) {
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
      document.documentElement.dataset.intro = "seen";
      setPhase("done");
    }, TIMING.doneAt * 1000);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, [reduced]);

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
    document.body.style.overflow = "";
  }, [phase]);

  if (phase === "idle" || phase === "done") return null;

  return (
    <div
      data-opening-intro
      className={cn(
        "fixed inset-0 z-[300] overflow-hidden bg-[#02060f]",
        "transition-opacity duration-1000 ease-out",
        phase === "exit" && "pointer-events-none opacity-0",
      )}
      aria-hidden="true"
    >
      {/* Background — springs up from bottom */}
      <motion.div
        className="absolute inset-0"
        initial={{ y: "68%", scale: 1.06, opacity: 0.25 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 70,
          damping: 20,
          mass: 1.35,
          delay: TIMING.bg,
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
      </motion.div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(2,6,15,0.45) 0%, transparent 22%, transparent 68%, rgba(2,6,15,0.88) 100%)",
        }}
      />

      <div className="relative z-10 flex h-full min-h-0 w-full flex-col px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6">
        {/* Stage — fits inside viewport; icons never clip top/bottom */}
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 sm:gap-0">
          <div className="flex h-[min(72vh,560px)] w-full max-w-6xl items-center justify-center gap-2 sm:gap-5 lg:gap-8">
            {/* Left icons — desktop only */}
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

            {/* Center brand */}
            <div className="relative flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center">
              <div className="relative flex size-[min(58vw,220px)] items-center justify-center sm:size-[min(38vh,300px)] lg:size-[min(42vh,340px)]">
                <motion.div
                  className="pointer-events-none absolute inset-0"
                  initial={{ opacity: 0, scale: 0.72 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 1.35,
                    delay: TIMING.center,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <GlowRing className="size-full" />
                </motion.div>

                <motion.div
                  className="relative z-10 flex max-w-[85%] flex-col items-center px-2 text-center sm:max-w-[80%] sm:px-3"
                  initial={{ opacity: 0, y: 28, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 1.1,
                    delay: TIMING.center + 0.25,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div className="relative mb-1 h-[4rem] w-[7.25rem] overflow-hidden sm:mb-1.5 sm:h-[5.75rem] sm:w-[10.5rem] lg:h-[6.75rem] lg:w-[12.5rem]">
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
                  <p className="font-display text-[1.05rem] font-semibold tracking-wide text-white sm:text-xl lg:text-2xl">
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
                </motion.div>
              </div>
            </div>

            {/* Right icons — desktop only */}
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

          {/* Mobile icon grid */}
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

        {/* Progress — always in-flow so it never overlaps icons/circle */}
        <motion.div
          className="relative z-20 mx-auto w-full max-w-[28rem] shrink-0 px-2 pt-2 pb-1 sm:pt-3 sm:pb-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: TIMING.progress,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <p className="mb-1.5 text-center text-[9px] font-medium tracking-[0.16em] text-cyan-300/90 uppercase sm:mb-2 sm:text-[11px] sm:tracking-[0.2em]">
            Preparing Your Financial Future
          </p>
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10 shadow-[inset_0_0_8px_rgba(0,0,0,0.4)]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#2563EB] via-[#22d3ee] to-[#f0a020] shadow-[0_0_16px_rgba(34,211,238,0.55)]"
                initial={{ width: "0%" }}
                animate={{ width: `${pct}%` }}
                transition={{ ease: "linear", duration: 0.05 }}
              />
            </div>
            <span className="w-9 shrink-0 text-right text-[11px] font-semibold tabular-nums text-[#f0a020] sm:w-10 sm:text-sm">
              {pct}%
            </span>
          </div>
          <p className="mt-1.5 text-center text-[9px] text-white/40 sm:mt-2 sm:text-[10px]">
            Please wait…
          </p>
        </motion.div>
      </div>
    </div>
  );
}
