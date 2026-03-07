"use client";

import { CartProvider } from "@/context/CartContext";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import Scents from "@/components/Scents";
import OrderForm from "@/components/OrderForm";
import Footer from "@/components/Footer";

interface HomeClientProps {
  heroImageUrl?: string;
  storyImageOverrides?: Record<string, string>;
  productImageOverrides?: Record<string, string>;
}

export default function HomeClient({
  heroImageUrl,
  storyImageOverrides,
  productImageOverrides,
}: HomeClientProps) {
  return (
    <CartProvider>
      <Navigation />
      <main>
        <Hero heroImageUrl={heroImageUrl} />
        <Story imageOverrides={storyImageOverrides} />
        <Scents productImageOverrides={productImageOverrides} />
        <OrderForm />
      </main>
      <Footer />
    </CartProvider>
  );
}
