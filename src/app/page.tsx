"use client";

import { CartProvider } from "@/context/CartContext";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import Scents from "@/components/Scents";
import OrderForm from "@/components/OrderForm";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <CartProvider>
      <Navigation />
      <main>
        <Hero />
        <Story />
        <Scents />
        <OrderForm />
        <ContactForm />
      </main>
      <Footer />
    </CartProvider>
  );
}
