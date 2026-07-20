"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/public/BrandLogo";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utilities/cn";
import { SITE_DEFAULTS } from "@/config/site";
import type { MegaMenuGroup, NavLink } from "@/types";

interface HeaderProps {
  navItems: NavLink[];
  megaMenuGroups: MegaMenuGroup[];
  ctaLabel: string;
  ctaHref: string;
}

export function Header({
  navItems,
  megaMenuGroups,
  ctaLabel,
  ctaHref,
}: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const leftLinks = navItems.filter(
    (item) =>
      !["Solutions", "Contact"].includes(item.label) &&
      item.label !== "Our Team",
  );
  // Match mock: Home, About, Solutions, Blog, Our Team, FAQ, Contact
  const ordered = [
    ...navItems.filter((i) => i.label === "Home"),
    ...navItems.filter((i) => i.label === "About"),
    ...navItems.filter((i) => i.label === "Blog"),
    ...navItems.filter((i) => i.label === "Our Team"),
    ...navItems.filter((i) => i.label === "FAQ"),
    ...navItems.filter((i) => i.label === "Contact"),
  ];
  // Prefer ordered if available, else fallback
  const desktopLinks = ordered.length ? ordered : leftLinks;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-white/10 bg-[#000B18]/85 shadow-lg shadow-black/30 backdrop-blur-xl"
            : "bg-transparent",
        )}
      >
        <div className="container-wide flex min-h-[4.25rem] items-center justify-between gap-2 py-2 sm:min-h-[4.75rem] sm:gap-3 lg:min-h-[5.25rem]">
          <BrandLogo priority size="md" className="shrink-0 lg:[&_img]:h-[4.5rem] lg:[&_img]:max-w-[14rem]" />

          <nav
            className="hidden items-center gap-0.5 lg:flex"
            aria-label="Primary navigation"
          >
            {desktopLinks
              .filter((item) => item.label !== "Contact")
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-3 py-2 text-[13px] font-medium tracking-wide text-white/75 transition-colors hover:text-white",
                    isActive(item.href) && "text-white",
                  )}
                >
                  {item.label === "About" ? "About Us" : item.label}
                  {isActive(item.href) && (
                    <span className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-[#F4B44E]" />
                  )}
                </Link>
              ))}

            <div
              className="relative"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <button
                type="button"
                className="inline-flex items-center gap-1 px-3 py-2 text-[13px] font-medium tracking-wide text-white/75 transition-colors hover:text-white"
                aria-expanded={megaOpen}
                aria-haspopup="true"
              >
                Solutions
                <ChevronDown
                  className={cn(
                    "size-3.5 transition-transform",
                    megaOpen && "rotate-180",
                  )}
                />
              </button>

              {megaOpen && (
                <div className="absolute left-1/2 top-full z-50 w-[min(92vw,680px)] -translate-x-1/2 pt-3">
                  <div className="grid grid-cols-3 gap-5 rounded-2xl border border-white/10 bg-[#000B18]/95 p-6 shadow-2xl backdrop-blur-xl">
                    {megaMenuGroups.map((group) => (
                      <div key={group.title}>
                        <p className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-[#00A3FF] uppercase">
                          {group.title}
                        </p>
                        <ul className="space-y-1.5">
                          {group.links.map((link) => (
                            <li key={link.href}>
                              <Link
                                href={link.href}
                                className="block rounded-md px-2 py-1.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <div className="col-span-3 border-t border-white/10 pt-4">
                      <Link
                        href="/services"
                        className="inline-flex items-center gap-1 text-sm font-medium text-[#00A3FF] hover:underline"
                      >
                        View all solutions
                        <ChevronRight className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {desktopLinks
              .filter((item) => item.label === "Contact")
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-3 py-2 text-[13px] font-medium tracking-wide text-white/75 transition-colors hover:text-white",
                    isActive(item.href) && "text-white",
                  )}
                >
                  Contact
                </Link>
              ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <a
              href={SITE_DEFAULTS.phoneHref}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 text-sm font-medium text-white/90 transition-colors hover:border-[#F4B44E]/40 hover:text-[#F4B44E]"
            >
              <Phone className="size-3.5 text-[#F4B44E]" />
              <span className="hidden xl:inline">604-837-3797</span>
            </a>
            <MagneticButton>
              <Button
                asChild
                size="lg"
                className="h-11 rounded-lg bg-gradient-to-r from-[#F4B44E] to-[#e89a2e] px-5 text-sm font-semibold text-[#0a1628] shadow-[0_8px_28px_rgba(244,180,78,0.35)] hover:brightness-110"
              >
                <Link href={ctaHref} className="inline-flex items-center gap-1">
                  {ctaLabel}
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
            </MagneticButton>
          </div>

          <button
            type="button"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-white/15 text-white lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-[#000B18] lg:hidden">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:h-20">
            <BrandLogo size="sm" />
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-lg border border-white/15 text-white"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
          </div>
          <nav
            className="flex h-[calc(100dvh-4rem)] flex-col overflow-y-auto px-5 pb-10 sm:h-[calc(100dvh-5rem)] sm:px-6"
            aria-label="Mobile navigation"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-white/10 py-3.5 text-base font-medium text-white sm:py-4 sm:text-lg"
                onClick={() => setMobileOpen(false)}
              >
                {item.label === "About" ? "About Us" : item.label}
              </Link>
            ))}

            <div className="mt-4 border-b border-white/10 pb-4">
              <p className="mb-2 text-[11px] font-bold tracking-[0.2em] text-[#00A3FF] uppercase">
                Solutions
              </p>
              <Link
                href="/services"
                className="block py-2 text-base font-medium text-white"
                onClick={() => setMobileOpen(false)}
              >
                View all solutions
              </Link>
              {megaMenuGroups.flatMap((group) =>
                group.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block py-2 pl-1 text-sm text-white/70"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                )),
              )}
            </div>

            <a
              href={SITE_DEFAULTS.phoneHref}
              className="mt-6 inline-flex min-h-11 items-center gap-2 text-[#F4B44E]"
            >
              <Phone className="size-4" />
              604-837-3797
            </a>
            <Button
              asChild
              className="mt-4 h-12 rounded-lg bg-gradient-to-r from-[#F4B44E] to-[#e89a2e] font-semibold text-[#0a1628]"
              size="lg"
            >
              <Link href={ctaHref} onClick={() => setMobileOpen(false)}>
                {ctaLabel}
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </>
  );
}
