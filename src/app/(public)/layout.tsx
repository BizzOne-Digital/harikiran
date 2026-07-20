import { OpeningAnimation } from "@/components/animations/OpeningAnimation";
import { PageTransition } from "@/components/animations/PageTransition";
import { ScrollProgress } from "@/components/animations/ScrollProgress";
import { Footer } from "@/components/public/Footer";
import { Header } from "@/components/public/Header";
import { SkipLink } from "@/components/public/SkipLink";
import {
  getFooterNavigation,
  getHeaderNavigation,
  getSiteSettings,
} from "@/lib/data";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [headerNav, footerNav, settings] = await Promise.all([
    getHeaderNavigation(),
    getFooterNavigation(),
    getSiteSettings(),
  ]);

  return (
    <>
      <SkipLink />
      <OpeningAnimation />
      <ScrollProgress />
      <Header
        navItems={headerNav.items}
        megaMenuGroups={headerNav.megaMenuGroups}
        ctaLabel={headerNav.ctaLabel}
        ctaHref={headerNav.ctaHref}
      />
      <PageTransition className="flex flex-1 flex-col">
        <main id="main-content" className="flex-1">
          {children}
        </main>
      </PageTransition>
      <Footer
        navItems={footerNav.items}
        summary={settings.footer.summary}
        disclaimer={settings.footer.disclaimer}
        showNewsletter={settings.footer.showNewsletter}
        social={settings.social}
      />
    </>
  );
}
