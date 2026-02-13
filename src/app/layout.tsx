import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const displayFont = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://canterbury-candles.vercel.app"),
  title: "Canterbury Candles | Hand-Poured Coconut/Soy Blend",
  description:
    "Browse 14 handcrafted Canterbury Candles scents, select your favorites, and submit an order request.",
  keywords: [
    "Canterbury Candles",
    "hand-poured candles",
    "coconut soy candles",
    "mason jar candles",
    "artisan candles",
  ],
  openGraph: {
    title: "Canterbury Candles",
    description:
      "Hand-poured coconut/soy candles in 16oz mason jars. 14 scents at $14 each.",
    type: "website",
    images: [
      {
        url: "/canterbury/jar-real.webp",
        width: 1052,
        height: 1800,
        alt: "Canterbury Candles mason jar product image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Canterbury Candles",
    description:
      "Hand-poured coconut/soy candles in 16oz mason jars. 14 scents at $14 each.",
    images: ["/canterbury/jar-real.webp"],
  },
  icons: {
    icon: "/canterbury/logo-bronze.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
