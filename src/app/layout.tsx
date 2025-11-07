import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import FooterWrapper from "@/components/FooterWrapper";
import { Analytics } from "@vercel/analytics/next";
import { siteConfig } from "@/lib/config";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", type: "image/png" },
      { url: "/favicon-16x16.png", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",

  themeColor: "#ffffff",
  applicationName: siteConfig.name,
  appleWebApp: {
    title: siteConfig.name,
    capable: true,
  },
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover",

  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mealtracker App Preview",
      },
    ],
  },

  // ✅ Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#ffffff" />
        <meta name="color-scheme" content="light" />
        <meta name="apple-mobile-web-app-title" content="Mealtracker" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="white-translucent"
        />
      </head>

      <body
        className={`${fontSans.className} antialiased`}
        suppressHydrationWarning
      >
        <NavbarWrapper />
        <main>{children}</main>
        <FooterWrapper />

        <Analytics />
      </body>
    </html>
  );
}
