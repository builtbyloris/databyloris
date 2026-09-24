import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { PublicShell } from "@/components/layout/public-shell";
import { themeInitScript } from "@/lib/theme";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "databyloris",
  description: "A modular data storytelling platform.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
