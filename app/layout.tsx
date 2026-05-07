import type { Metadata, Viewport } from "next";
import { Inter, Libre_Baskerville } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { BRAND } from "@/lib/brand";
import { ExitIntentPopup } from "./components/ExitIntentPopup";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const baskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-baskerville",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND.name} - ${BRAND.tagline}`,
    template: `%s - ${BRAND.name}`,
  },
  description: BRAND.description,
  metadataBase: new URL(BRAND.url),
  openGraph: {
    title: BRAND.name,
    description: BRAND.description,
    url: BRAND.url,
    siteName: BRAND.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND.name,
    description: BRAND.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0A1628",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${baskerville.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <ExitIntentPopup />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
