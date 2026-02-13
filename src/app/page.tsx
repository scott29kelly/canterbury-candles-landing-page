"use client";

import { useState, useCallback } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import ScentGrid from "@/components/ScentGrid";
import OrderForm from "@/components/OrderForm";
import Footer from "@/components/Footer";

export default function Home() {
  const [selectedScents, setSelectedScents] = useState<string[]>([]);

  const toggleScent = useCallback((name: string) => {
    setSelectedScents((prev) =>
      prev.includes(name)
        ? prev.filter((s) => s !== name)
        : [...prev, name]
    );
  }, []);

  const removeScent = useCallback((name: string) => {
    setSelectedScents((prev) => prev.filter((s) => s !== name));
  }, []);

  return (
    <main>
      <Navigation />
      <Hero />
      <Story />
      <ScentGrid selected={selectedScents} onToggle={toggleScent} />
      <OrderForm selected={selectedScents} onRemove={removeScent} />
      <Footer />
    </main>
  );
}
