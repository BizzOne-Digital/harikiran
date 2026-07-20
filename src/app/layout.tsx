import type { Metadata } from "next";
import Script from "next/script";
import { Fraunces, Instrument_Sans } from "next/font/google";
import "@/styles/globals.css";
import { SITE_DEFAULTS } from "@/config/site";
import { getSiteSettings } from "@/lib/data";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings.seo.title ?? SITE_DEFAULTS.businessName;
  const description = settings.seo.description ?? SITE_DEFAULTS.description;

  return {
    metadataBase: new URL(`https://${SITE_DEFAULTS.domain}`),
    title: {
      default: title,
      template: settings.seo.titleTemplate ?? "%s | TopAdvice4U",
    },
    description,
    openGraph: {
      title,
      description,
      siteName: settings.shortName,
      locale: "en_CA",
      type: "website",
    },
    robots: settings.seo.robotsIndex
      ? { index: true, follow: true }
      : { index: false },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-CA"
      className={`${fraunces.variable} ${instrumentSans.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-background text-text-primary antialiased">
        <Script id="ta4u-intro-gate" strategy="beforeInteractive">{`
          try {
            if (sessionStorage.getItem("ta4u-opening-seen-v3")) {
              document.documentElement.dataset.intro = "seen";
            } else {
              document.documentElement.dataset.intro = "pending";
            }
          } catch (e) {
            document.documentElement.dataset.intro = "pending";
          }
        `}</Script>
        {children}
      </body>
    </html>
  );
}
