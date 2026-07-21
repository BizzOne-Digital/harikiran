"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utilities/cn";
import { SITE_DEFAULTS } from "@/config/site";

interface BrandLogoProps {
  className?: string;
  /** Extra wordmark beside the image — off by default (logo file already includes text). */
  showText?: boolean;
  priority?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

/** Transparent wordmark at /logo/logo.png (approx 941×695) */
const sizes = {
  sm: {
    className: "h-10 w-auto max-w-[8.5rem] sm:h-12 sm:max-w-[10rem]",
    width: 200,
    height: 148,
  },
  md: {
    className: "h-12 w-auto max-w-[10.5rem] sm:h-16 sm:max-w-[13.5rem]",
    width: 280,
    height: 208,
  },
  lg: {
    className: "h-16 w-auto max-w-[13rem] sm:h-[5.25rem] sm:max-w-[16rem]",
    width: 320,
    height: 236,
  },
  xl: {
    className:
      "h-[5.5rem] w-auto max-w-[16rem] sm:h-28 sm:max-w-[20rem] lg:h-32 lg:max-w-[22rem]",
    width: 352,
    height: 260,
  },
};

export function BrandLogo({
  className,
  showText = false,
  priority = false,
  size = "md",
}: BrandLogoProps) {
  const [logoError, setLogoError] = useState(false);
  const dim = sizes[size];

  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-3 transition-opacity hover:opacity-90",
        className,
      )}
      aria-label={`${SITE_DEFAULTS.shortName} home`}
    >
      {!logoError ? (
        <Image
          src="/logo/logo.png?v=2"
          alt={SITE_DEFAULTS.businessName}
          width={dim.width}
          height={dim.height}
          priority={priority}
          unoptimized
          className={cn(
            dim.className,
            "object-contain object-left [background:transparent!important]",
          )}
          style={{ backgroundColor: "transparent" }}
          onError={() => setLogoError(true)}
        />
      ) : (
        <span className="flex flex-col leading-tight">
          <span className="font-display text-lg font-bold text-[#e31c23]">
            Topadvice4u
          </span>
          <span className="text-[10px] tracking-wider text-sky uppercase">
            Financial Services Inc
          </span>
        </span>
      )}
      {showText && !logoError && (
        <span className="hidden flex-col leading-tight sm:flex">
          <span className="font-display text-base font-semibold text-text-primary">
            Topadvice4u
          </span>
          <span className="text-[10px] tracking-wider text-text-secondary uppercase">
            Financial Services
          </span>
        </span>
      )}
    </Link>
  );
}
