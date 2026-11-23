import type { Metadata, Viewport } from "next";
import { Onest } from "next/font/google";
import { business, siteIndexable, siteUrl } from "@/config/business";
import { iconFontUrl } from "@/components/ui/icon";
import { DemoNotice } from "@/components/layout/demo-notice";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import "./globals.css";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${business.name} · ${business.tagline} en ${business.city}, ${business.region}`,
    template: `%s · ${business.name}`,
  },
  description: `Tienda de calzado en ${business.city}, ${business.region}: tenis, botines, botas, zapatos casuales, formales, escolares y deportivos para mujer, hombre, niños y niñas.`,
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: business.name,
  },
  robots: siteIndexable ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#320b0e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-CO" className={onest.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={iconFontUrl} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-btn focus:bg-white focus:px-4 focus:py-2 focus:shadow-lift"
        >
          Saltar al contenido
        </a>
        <DemoNotice />
        <SiteHeader />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <WhatsAppFab />
      </body>
    </html>
  );
}
