import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Canterbury Candles — Hand-Poured Coconut/Soy Blend",
  description:
    "Small batch, artisan-made candles. Hand-poured coconut/soy blend in 16oz mason jars with bronze lids. 14 signature scents, $14 each.",
  keywords: [
    "candles",
    "hand-poured",
    "coconut soy",
    "artisan candles",
    "Canterbury Candles",
    "mason jar candles",
  ],
  openGraph: {
    title: "Canterbury Candles — Hand-Poured Coconut/Soy Blend",
    description:
      "Small batch, artisan-made candles in 14 signature scents. $14 each.",
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
      <body className={`${cormorant.variable} ${dmSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
