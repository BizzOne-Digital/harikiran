import Link from "next/link";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/button";
import { SITE_DEFAULTS } from "@/config/site";
import type { PublicTeamMember } from "@/lib/data/fallbacks";

interface TeamPreviewProps {
  members: PublicTeamMember[];
}

export function TeamPreview({ members }: TeamPreviewProps) {
  const hasMembers = members.length > 0;

  return (
    <section className="section-padding bg-surface">
      <div className="container-wide">
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
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

        {hasMembers ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {members.slice(0, 3).map((member, index) => (
              <Reveal key={member.id} delay={index * 0.06}>
                <article className="glass-panel rounded-xl p-6">
                  <div className="flex size-16 items-center justify-center rounded-full bg-navy/50 font-display text-2xl text-gradient">
                    {member.name.charAt(0)}
                  </div>
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
        ) : (
          <Reveal className="mt-10">
            <div className="glass-panel-elevated rounded-2xl p-8 sm:p-12 text-center">
              <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-navy/50 font-display text-3xl text-gradient">
                {SITE_DEFAULTS.shortName.charAt(0)}
              </div>
              <h3 className="mt-6 font-display text-2xl">
                Connect with {SITE_DEFAULTS.contactName}
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-text-secondary">
                Team profiles are published when ready. Until then, reach out
                directly to start a consultation about protection, financing or
                legacy planning.
              </p>
              <div className="mt-6 flex flex-col items-center gap-2 text-sm">
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
              <Button asChild className="mt-8" variant="gold">
                <Link href="/contact">{SITE_DEFAULTS.primaryCta}</Link>
              </Button>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
