import type { Metadata } from "next";
import { SiteChrome } from "@/components/site-chrome";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: `${siteConfig.name} | Dental care built around you`,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    type: "website",
    locale: siteConfig.openGraphLocale,
    images: [{ url: "/clinic-hero.png", alt: "A bright, welcoming dental treatment room" }]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={siteConfig.locale}>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
