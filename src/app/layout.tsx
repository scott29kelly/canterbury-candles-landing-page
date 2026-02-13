import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Canterbury Candles — Hand-Poured Artisan Candles",
  description:
    "Small batch, hand-poured coconut & soy blend candles in 16oz mason jars. 14 artisan scents, crafted with care. $14 each.",
  openGraph: {
    title: "Canterbury Candles — Hand-Poured Artisan Candles",
    description:
      "Small batch coconut & soy blend candles. 14 artisan scents at $14 each.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
