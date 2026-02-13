import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Canterbury Candles — Hand-Poured Artisan Candles",
  description:
    "Small batch, hand-poured coconut & soy blend candles in 16oz mason jars. 14 scents, artisan-made with care. $14 each.",
  openGraph: {
    title: "Canterbury Candles — Hand-Poured Artisan Candles",
    description:
      "Small batch, hand-poured coconut & soy blend candles. 14 scents, $14 each.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
