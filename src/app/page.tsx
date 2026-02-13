"use client";

import { useState, useCallback, useMemo } from "react";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import SectionDivider from "@/components/SectionDivider";
import Story from "@/components/Story";
import ProductShowcase from "@/components/ProductShowcase";
import ScentGrid from "@/components/ScentGrid";
import OrderForm from "@/components/OrderForm";
import Footer from "@/components/Footer";
import FloatingCart from "@/components/FloatingCart";

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

  const { totalItems, totalPrice } = useMemo(() => {
    const items = Object.values(selected);
    const qty = items.reduce((sum, q) => sum + q, 0);
    return { totalItems: qty, totalPrice: qty * 14 };
  }, [selected]);

  return (
    <>
      <Nav />
      <Hero />
      <SectionDivider variant="forest-to-cream" />
      <Story />
      <SectionDivider variant="cream-to-cream-dark" />
      <ProductShowcase />
      <SectionDivider variant="cream-dark-to-forest" />
      <ScentGrid
        selected={selected}
        onToggle={handleToggle}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
      />
      <SectionDivider variant="forest-to-cream" />
      <OrderForm selected={selected} onRemove={handleRemove} />
      <Footer />
      <FloatingCart totalItems={totalItems} totalPrice={totalPrice} />
    </>
  );
}
