import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/button";
import { SITE_DEFAULTS } from "@/config/site";
import { cn } from "@/lib/utilities/cn";
import type { PublicTeamMember } from "@/lib/data/fallbacks";

interface TeamPreviewProps {
  members: PublicTeamMember[];
}

function photoObjectClass(name: string) {
  // Studio portrait — keep face/turban framed in the circle
  if (name.toLowerCase().includes("harkiran")) {
    return "object-cover object-[center_22%]";
  }
  return "object-cover object-top";
}

export function TeamPreview({ members }: TeamPreviewProps) {
  const preview = members.slice(0, 3);

  return (
    <section className="section-padding bg-surface">
      <div className="container-wide">
        <Reveal className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:items-end sm:text-left">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-wider text-cyan uppercase">
              Advisory team
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">
              People behind the advice
            </h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/team">View team</Link>
          </Button>
        </Reveal>

        <div className="mt-10 flex flex-wrap justify-center gap-6">
          {preview.map((member, index) => (
            <Reveal
              key={member.id}
              delay={index * 0.06}
              className="w-full max-w-[22rem]"
            >
              <article className="glass-panel h-full rounded-xl p-6 text-center">
                {member.photoUrl ? (
                  <div className="relative mx-auto size-20 overflow-hidden rounded-full border border-white/15">
                    <Image
                      src={member.photoUrl}
                      alt={member.name}
                      fill
                      unoptimized
                      sizes="80px"
                      className={cn(photoObjectClass(member.name))}
                    />
                  </div>
                ) : (
                  <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-navy/50 font-display text-2xl text-gradient">
                    {member.name.charAt(0)}
                  </div>
                )}
                <h3 className="mt-4 font-display text-xl">{member.name}</h3>
                <p className="text-sm text-cyan">{member.role}</p>
                {member.shortBio && (
                  <p className="mt-3 text-sm text-text-secondary">
                    {member.shortBio}
                  </p>
                )}
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8 text-center">
          <div className="flex flex-col items-center gap-2 text-sm">
            <a
              href={SITE_DEFAULTS.phoneHref}
              className="text-cyan hover:underline"
            >
              {SITE_DEFAULTS.phone}
            </a>
            <a
              href={`mailto:${SITE_DEFAULTS.email}`}
              className="text-cyan hover:underline"
            >
              {SITE_DEFAULTS.email}
            </a>
          </div>
          <Button asChild className="mt-6" variant="gold">
            <Link href="/contact">{SITE_DEFAULTS.primaryCta}</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
