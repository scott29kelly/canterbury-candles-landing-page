"use client";

import { useState, useCallback } from "react";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import ScentGrid from "@/components/ScentGrid";
import OrderForm from "@/components/OrderForm";
import Footer from "@/components/Footer";

export default function Home() {
  const [selected, setSelected] = useState<Record<string, number>>({});

  const handleToggle = useCallback((name: string) => {
    setSelected((prev) => {
      if (prev[name]) {
        const next = { ...prev };
        delete next[name];
        return next;
      }
      return { ...prev, [name]: 1 };
    });
  }, []);

  const handleIncrement = useCallback((name: string) => {
    setSelected((prev) => ({
      ...prev,
      [name]: Math.min((prev[name] || 0) + 1, 10),
    }));
  }, []);

  const handleDecrement = useCallback((name: string) => {
    setSelected((prev) => {
      const current = prev[name] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[name];
        return next;
      }
      return { ...prev, [name]: current - 1 };
    });
  }, []);

  const handleRemove = useCallback((name: string) => {
    setSelected((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  return (
    <>
      <Nav />
      <Hero />
      <Story />
      <ScentGrid
        selected={selected}
        onToggle={handleToggle}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
      />
      <OrderForm selected={selected} onRemove={handleRemove} />
      <Footer />
    </>
  );
}
