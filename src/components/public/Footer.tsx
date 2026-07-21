import Link from "next/link";
import type { ReactNode } from "react";
import {
  Briefcase,
  Calendar,
  ChevronRight,
  Clock,
  CreditCard,
  GraduationCap,
  Home,
  Mail,
  MapPin,
  MonitorSmartphone,
  Phone,
  Scale,
  Shield,
  Umbrella,
  Users,
  type LucideIcon,
} from "lucide-react";
import { BrandLogo } from "@/components/public/BrandLogo";
import { SITE_DEFAULTS } from "@/config/site";
import type { NavLink } from "@/types";

interface FooterProps {
  navItems: NavLink[];
  summary: string;
  disclaimer: string;
  showNewsletter: boolean;
  social: {
    facebook?: string;
    linkedin?: string;
    youtube?: string;
    x?: string;
    instagram?: string;
  };
}

function SocialIcon({
  name,
  className,
}: {
  name: "linkedin" | "facebook" | "instagram" | "youtube";
  className?: string;
}) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": true as const,
  };

  if (name === "linkedin") {
    return (
      <svg {...common}>
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.23 0z" />
      </svg>
    );
  }
  if (name === "facebook") {
    return (
      <svg {...common}>
        <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.79-4.7 4.54-4.7 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.5 0-1.96.93-1.96 1.89v2.26h3.34l-.53 3.49h-2.81V24C19.61 23.1 24 18.1 24 12.07z" />
      </svg>
    );
  }
  if (name === "instagram") {
    return (
      <svg {...common}>
        <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zm0-2.16C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95C23.73 2.7 21.31.27 16.95.07 15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.54 3.55 12 3.55 12 3.55s-7.54 0-9.38.51A3.02 3.02 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.84.51 9.38.51 9.38.51s7.54 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
    </svg>
  );
}

const solutions: {
  label: string;
  href: string;
  icon: LucideIcon;
  color: string;
}[] = [
  {
    label: "Life Insurance",
    href: "/services/family-life-insurance",
    icon: Umbrella,
    color: "#F4B44E",
  },
  {
    label: "Mortgages",
    href: "/services/residential-mortgages",
    icon: Home,
    color: "#38BDF8",
  },
  {
    label: "Business Loans",
    href: "/services/business-loans",
    icon: Briefcase,
    color: "#A78BFA",
  },
  {
    label: "POS Systems",
    href: "/services/pos-systems",
    icon: MonitorSmartphone,
    color: "#34D399",
  },
  {
    label: "Employee Benefits",
    href: "/services/group-health-plans",
    icon: Users,
    color: "#F472B6",
  },
  {
    label: "Education Planning",
    href: "/services/resp-education-planning",
    icon: GraduationCap,
    color: "#FACC15",
  },
  {
    label: "Estate Planning",
    href: "/services/estate-planning-coordination",
    icon: Scale,
    color: "#2DD4BF",
  },
  {
    label: "Investments",
    href: "/services/investments",
    icon: Briefcase,
    color: "#F472B6",
  },
  {
    label: "Retirement",
    href: "/services/retirement-solutions",
    icon: GraduationCap,
    color: "#FACC15",
  },
];

const quickLinks = [
  { label: "About Us", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact Us", href: "/contact" },
  { label: "Book a Consultation", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Use", href: "/terms" },
];

function ColumnHeading({ children }: { children: ReactNode }) {
  return (
    <p className="mb-5 text-[11px] font-semibold tracking-[0.2em] text-[#7DB4F0] uppercase">
      {children}
    </p>
  );
}

export function Footer({ summary, social }: FooterProps) {
  const year = new Date().getFullYear();

  const socialLinks = [
    { href: social.linkedin, label: "LinkedIn", name: "linkedin" as const },
    { href: social.facebook, label: "Facebook", name: "facebook" as const },
    { href: social.instagram, label: "Instagram", name: "instagram" as const },
    { href: social.youtube, label: "YouTube", name: "youtube" as const },
  ].filter((s) => Boolean(s.href)) as {
    href: string;
    label: string;
    name: "linkedin" | "facebook" | "instagram" | "youtube";
  }[];

  return (
    <footer className="relative overflow-hidden border-t border-white/10">
      <div
        className="absolute inset-0 scale-105 bg-cover bg-[center_40%] bg-no-repeat"
        style={{ backgroundImage: "url(/images/footer-bg.png)" }}
        aria-hidden
      />
      {/* Darker overlays so columns stay readable like the reference */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, rgba(3,9,20,0.94) 0%, rgba(3,9,20,0.88) 38%, rgba(3,9,20,0.82) 68%, rgba(3,9,20,0.9) 100%)",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(3,9,20,0.55) 0%, rgba(3,9,20,0.35) 40%, rgba(3,9,20,0.92) 100%)",
        }}
        aria-hidden
      />

      <div className="container-wide relative z-10 px-4 pt-12 pb-8 sm:px-8 sm:pt-16 lg:px-10 lg:pt-[4.5rem] lg:pb-12">
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-14 lg:grid-cols-3 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1.15fr)] xl:items-start xl:gap-x-14 xl:gap-y-0">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <BrandLogo size="lg" className="[&_img]:max-w-[11rem] sm:[&_img]:max-w-[13.5rem]" />
            <p className="mt-4 max-w-[18rem] text-[13px] leading-[1.7] text-white/65 sm:mt-5">
              {summary ||
                "Trusted advisory for life insurance, mortgages, business financing, employee benefits, education planning and legacy coordination."}
            </p>
            {socialLinks.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {socialLinks.map(({ href, label, name }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex size-10 items-center justify-center rounded-full border border-white/25 text-white/70 transition hover:border-[#5eb3e4]/60 hover:text-[#5eb3e4]"
                  >
                    <SocialIcon name={name} className="size-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Solutions */}
          <div>
            <ColumnHeading>Solutions</ColumnHeading>
            <ul className="space-y-3.5">
              {solutions.map(({ label, href, icon: Icon, color }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="group flex items-center gap-3 text-[13.5px] text-white/75 transition hover:text-white"
                  >
                    <Icon
                      className="size-[18px] shrink-0"
                      style={{ color }}
                      strokeWidth={1.75}
                    />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links (includes former Company links) */}
          <div>
            <ColumnHeading>Quick Links</ColumnHeading>
            <ul className="space-y-3.5">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[13.5px] text-white/75 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <ColumnHeading>Contact Us</ColumnHeading>
            <ul className="space-y-4">
              <li>
                <a
                  href={SITE_DEFAULTS.phoneHref}
                  className="flex items-start gap-3 text-[13.5px] text-white/75 transition hover:text-white"
                >
                  <Phone className="mt-0.5 size-[18px] shrink-0 text-[#60A5FA]" />
                  <span>{SITE_DEFAULTS.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE_DEFAULTS.email}`}
                  className="flex items-start gap-3 text-[13.5px] text-white/75 transition hover:text-white"
                >
                  <Mail className="mt-0.5 size-[18px] shrink-0 text-[#60A5FA]" />
                  <span className="break-words">{SITE_DEFAULTS.email}</span>
                </a>
              </li>
              {SITE_DEFAULTS.locations.map((loc) => (
                <li
                  key={loc.label}
                  className="flex items-start gap-3 text-[13.5px] leading-relaxed text-white/75"
                >
                  <MapPin className="mt-0.5 size-[18px] shrink-0 text-[#60A5FA]" />
                  <span>
                    <span className="font-medium text-white/90">{loc.label}</span>
                    <br />
                    {loc.lines.map((line) => (
                      <span key={line}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </span>
                </li>
              ))}
              <li>
                <a
                  href={SITE_DEFAULTS.digitalCardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-[13.5px] text-white/75 transition hover:text-white"
                >
                  <CreditCard className="mt-0.5 size-[18px] shrink-0 text-[#60A5FA]" />
                  <span>Digital business card</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-[13.5px] leading-relaxed text-white/75">
                <Clock className="mt-0.5 size-[18px] shrink-0 text-[#60A5FA]" />
                <span>
                  Mon – Fri: 9:00 AM – 5:00 PM
                  <br />
                  Saturday: By Appointment
                </span>
              </li>
            </ul>
          </div>

          {/* CTA — SS2 style: centered, floating calendar badge */}
          <div className="sm:col-span-2 lg:col-span-1 xl:pt-5">
            <div className="relative mx-auto w-full max-w-[17.5rem] xl:mx-0 xl:max-w-none">
              <div
                className="relative rounded-3xl border border-cyan-400/25 bg-[#070b14] px-5 pt-10 pb-6 text-center"
                style={{
                  boxShadow:
                    "0 0 40px rgba(34,211,238,0.12), inset 0 1px 0 rgba(103,232,249,0.08)",
                }}
              >
                {/* Soft top-left glow */}
                <div
                  className="pointer-events-none absolute -top-8 -left-6 size-28 rounded-full bg-cyan-400/20 blur-3xl"
                  aria-hidden
                />

                {/* Calendar badge overlapping top edge */}
                <span className="absolute top-0 left-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-400/55 bg-[#070b14] text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.35)]">
                  <Calendar className="size-5" strokeWidth={1.75} />
                </span>

                <h3 className="relative font-display text-[1.15rem] font-semibold leading-snug text-white sm:text-xl">
                  Let’s Build Your
                  <br />
                  Financial Future
                </h3>
                <p className="relative mt-3 text-[13px] leading-relaxed text-white/55">
                  Book a free consultation and let’s discuss your goals.
                </p>
                <Link
                  href="/contact"
                  className="relative mt-5 inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-sm font-semibold text-white shadow-[0_8px_24px_rgba(37,99,235,0.4)] transition hover:brightness-110"
                >
                  Book a Consultation
                  <ChevronRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8 sm:mt-16">
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="inline-flex items-center justify-center gap-2 text-sm font-medium tracking-wide">
              <Shield className="size-4 shrink-0 text-[#00A3FF]" />
              <span className="bg-gradient-to-r from-[#38BDF8] via-[#67E8F9] to-[#2DD4BF] bg-clip-text text-transparent">
                Life. Property. Business. Legacy.
              </span>
            </p>
            <p className="text-xs text-white/40">
              © {year} {SITE_DEFAULTS.businessName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
