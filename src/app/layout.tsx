import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeScript } from "@/components/layout/ThemeToggle";
import GoogleAnalytics from '@/components/GoogleAnalytics'

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
      </head>
      <body className={`${inter.className} bg-white dark:bg-gray-900`}>
        {children}
        <GoogleAnalytics GA_MEASUREMENT_ID="G-SSG1FNP0LX" />
      </body>
    </html>
  );
}
