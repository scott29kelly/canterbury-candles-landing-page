"use client";

import { useCallback, useState } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import Scents, { type ScentOrder } from "@/components/Scents";
import OrderForm from "@/components/OrderForm";
import Footer from "@/components/Footer";

export default function Home() {
  const [order, setOrder] = useState<ScentOrder>({});

  const handleUpdateOrder = useCallback((scent: string, qty: number) => {
    setOrder((prev) => {
      const next = { ...prev };
      if (qty <= 0) {
        delete next[scent];
      } else {
        next[scent] = qty;
      }
      return next;
    });
  }, []);

  const handleClearOrder = useCallback(() => {
    setOrder({});
  }, []);

  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Story />
        <Scents order={order} onUpdateOrder={handleUpdateOrder} />
        <OrderForm
          order={order}
          onUpdateOrder={handleUpdateOrder}
          onClearOrder={handleClearOrder}
        />
      </main>
      <Footer />
    </>
  );
}
