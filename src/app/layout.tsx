import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import FooterWrapper from "@/components/FooterWrapper";
import AuthProvider from "@/utils/Auth/AuthProvider";
import { ThemeProvider } from "@/utils/Themes/ThemeProvider";
import { AuthGuard } from "@/utils/Auth/AuthGard";
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: "Mealtracker",
  description: "Track your Daily Meal",
  icons: {
    icon: [
      { url: "favicon.ico" },
      { url: "favicon-32x32.png", type: "image/png" },
    ],
  },
};

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  //suppressHydrationWarning
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="Meal Track" />
        <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
      </head>
      <body
        className={`${fontSans.className}  antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <AuthProvider>
            <AuthGuard>
              <NavbarWrapper />
              <main>{children}</main>
              <FooterWrapper />
            </AuthGuard>
          </AuthProvider>
        </ThemeProvider>

        <Analytics />
      </body>
    </html>
  );
}
