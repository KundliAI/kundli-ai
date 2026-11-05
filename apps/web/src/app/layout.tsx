import type { Metadata, Viewport } from "next";
import { Manrope, Noto_Sans_Devanagari } from "next/font/google";
import "@/styles/globals.css";
import { COPY } from "@/lib/copy";
import { ThemeScript } from "@/components/Theme";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-latin", display: "swap" });
const deva = Noto_Sans_Devanagari({ subsets: ["devanagari"], weight: ["400", "500", "600"], variable: "--font-deva", display: "swap" });

export const metadata: Metadata = {
  title: { default: `${COPY.brand.name} · ${COPY.brand.tagline}`, template: `%s · ${COPY.brand.name}` },
  description: COPY.landing.lead,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ECDCB8" },
    { media: "(prefers-color-scheme: dark)", color: "#3A2415" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${deva.variable}`} suppressHydrationWarning>
      <head><ThemeScript /></head>
      <body>{children}</body>
    </html>
  );
}
