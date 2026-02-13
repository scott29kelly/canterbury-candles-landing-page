"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import ScentGrid, { type ScentSelection } from "@/components/ScentGrid";
import OrderForm from "@/components/OrderForm";
import Footer from "@/components/Footer";

export default function Home() {
  const [selections, setSelections] = useState<ScentSelection>({});

  return (
    <>
      <Hero />
      <Story />
      <ScentGrid selections={selections} onSelectionsChange={setSelections} />
      <OrderForm selections={selections} />
      <Footer />
    </>
  );
}
