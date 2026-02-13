import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Canterbury Candles — Hand-Poured Artisan Candles",
  description:
    "Small batch, hand-poured coconut & soy blend candles in 16oz mason jars. 14 artisan scents, crafted with intention. $14 each.",
  keywords: [
    "candles",
    "hand poured",
    "artisan",
    "coconut soy",
    "mason jar candles",
    "Canterbury Candles",
  ],
  openGraph: {
    title: "Canterbury Candles — Hand-Poured Artisan Candles",
    description:
      "Small batch coconut & soy blend candles. 14 scents, $14 each.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${playfair.variable} ${dmSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
