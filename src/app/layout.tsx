import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeScript } from "@/components/layout/ThemeToggle";
import GoogleAnalytics from '@/components/GoogleAnalytics'
import Script from "next/script";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bubble Shooter",
  description: "Bubble Shooter is a classic bubble-popping game that you can play online for free. It's easy to learn and hard to put down. Try it now!",
  robots: {
    index: true,
    follow: true
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <Script 
          defer 
          data-domain="bubbleshooters.org" 
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4294526989014116"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.className} bg-white dark:bg-gray-900`}>
        {children}
        <GoogleAnalytics GA_MEASUREMENT_ID="G-NS3QT1TZVV" />
      </body>
    </html>
  );
}
