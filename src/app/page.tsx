"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import Divider from "@/components/Divider";
import ScentGrid, { type ScentSelection } from "@/components/ScentGrid";
import OrderForm from "@/components/OrderForm";
import Footer from "@/components/Footer";

export default function Home() {
  const [selections, setSelections] = useState<ScentSelection>({});

  return (
    <>
      <Navigation />
      <Hero />
      <Story />
      <Divider variant="cream-to-dark" />
      <ScentGrid selections={selections} onSelectionsChange={setSelections} />
      <Divider variant="dark-to-cream" />
      <OrderForm selections={selections} />
      {/* Cream to footer dark transition */}
      <div className="h-16 bg-gradient-to-b from-cream to-forest-950" />
      <Footer />
    </>
  );
}
