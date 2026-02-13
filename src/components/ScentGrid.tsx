"use client";

import Image from "next/image";
import { useState } from "react";
import Reveal from "./Reveal";

export interface ScentSelection {
  [scent: string]: number;
}

const scents = [
  { name: "Aspen Woods", category: "Woody", accent: "bg-forest-700" },
  { name: "Blueberry Muffins", category: "Bakery", accent: "bg-indigo-400", image: "/images/product-blueberry.jpg" },
  { name: "Blueberry Pancakes", category: "Bakery", accent: "bg-indigo-500" },
  { name: "Cherry Cheesecake", category: "Bakery", accent: "bg-red-400", image: "/images/product-cherry.jpg" },
  { name: "Espresso", category: "Rich", accent: "bg-bark-800" },
  { name: "Fruit Loops", category: "Fruity", accent: "bg-amber-400" },
  { name: "Glazed Donuts", category: "Bakery", accent: "bg-bronze-400" },
  { name: "Gingerbread", category: "Spiced", accent: "bg-bronze-700" },
  { name: "Lemon Pound Cake", category: "Bakery", accent: "bg-yellow-400", image: "/images/product-lemon.jpg" },
  { name: "Pumpkin Pecan Waffles", category: "Spiced", accent: "bg-orange-500" },
  { name: "Snickerdoodle", category: "Bakery", accent: "bg-bronze-500" },
  { name: "Spring Flowers", category: "Floral", accent: "bg-pink-300" },
  { name: "Strawberry Pound Cake", category: "Bakery", accent: "bg-rose-400", image: "/images/product-strawberry.jpg" },
  { name: "Watermelon Lemonade", category: "Fruity", accent: "bg-emerald-400" },
];

interface ScentGridProps {
  selections: ScentSelection;
  onSelectionsChange: (selections: ScentSelection) => void;
}

export default function ScentGrid({ selections, onSelectionsChange }: ScentGridProps) {
  const [hoveredScent, setHoveredScent] = useState<string | null>(null);

  const updateQuantity = (scent: string, delta: number) => {
    const current = selections[scent] || 0;
    const next = Math.max(0, current + delta);
    const newSelections = { ...selections };
    if (next === 0) {
      delete newSelections[scent];
    } else {
      newSelections[scent] = next;
    }
    onSelectionsChange(newSelections);
  };

  const totalItems = Object.values(selections).reduce((a, b) => a + b, 0);
  const totalPrice = totalItems * 14;

  return (
    <section id="scents" className="relative bg-forest-950 py-28 lg:py-40">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 flex flex-col gap-6 lg:mb-24 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <div>
              <span className="mb-4 inline-block font-[family-name:var(--font-dm-sans)] text-xs font-medium tracking-[0.25em] text-bronze-500 uppercase">
                14 Signature Scents
              </span>
              <h2 className="font-[family-name:var(--font-cormorant)] text-4xl leading-[1.15] font-light text-cream sm:text-5xl lg:text-6xl">
                Choose your
                <br />
                <span className="italic text-bronze-400">favorites.</span>
              </h2>
            </div>
          </Reveal>

          {/* Floating cart summary */}
          {totalItems > 0 && (
            <div className="flex items-center gap-6 rounded-2xl border border-bronze-500/20 bg-forest-900/80 px-6 py-4 backdrop-blur-sm">
              <div>
                <span className="block font-[family-name:var(--font-dm-sans)] text-xs tracking-widest text-forest-300/50 uppercase">
                  Selected
                </span>
                <span className="font-[family-name:var(--font-cormorant)] text-2xl font-light text-cream">
                  {totalItems} candle{totalItems !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="h-8 w-px bg-forest-700/40" />
              <div>
                <span className="block font-[family-name:var(--font-dm-sans)] text-xs tracking-widest text-forest-300/50 uppercase">
                  Total
                </span>
                <span className="font-[family-name:var(--font-cormorant)] text-2xl font-light text-bronze-400">
                  ${totalPrice}
                </span>
              </div>
              <a
                href="#order"
                className="ml-4 rounded-full bg-bronze-500 px-6 py-2.5 font-[family-name:var(--font-dm-sans)] text-sm font-medium text-forest-950 transition-colors hover:bg-bronze-400"
              >
                Order
              </a>
            </div>
          )}
        </div>

        {/* Scent grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {scents.map((scent) => {
            const qty = selections[scent.name] || 0;
            const isSelected = qty > 0;
            const isHovered = hoveredScent === scent.name;

            return (
              <div
                key={scent.name}
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 ${
                  isSelected
                    ? "border-bronze-500/40 bg-forest-900/60"
                    : "border-forest-800/20 bg-forest-900/30 hover:border-forest-700/30 hover:bg-forest-900/50"
                }`}
                onMouseEnter={() => setHoveredScent(scent.name)}
                onMouseLeave={() => setHoveredScent(null)}
              >
                {/* Image or color block */}
                {scent.image ? (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={scent.image}
                      alt={`${scent.name} candle`}
                      fill
                      className={`object-cover transition-transform duration-700 ${
                        isHovered ? "scale-105" : "scale-100"
                      }`}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/20 to-transparent" />
                  </div>
                ) : (
                  <div className="relative flex h-28 items-end p-4">
                    <div
                      className={`absolute top-3 right-4 h-8 w-8 rounded-full ${scent.accent} opacity-60 blur-sm transition-all duration-500 ${
                        isHovered ? "scale-150 opacity-80" : ""
                      }`}
                    />
                    <div
                      className={`absolute top-4 right-5 h-4 w-4 rounded-full ${scent.accent} opacity-90`}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-medium text-cream">
                        {scent.name}
                      </h3>
                      <span className="font-[family-name:var(--font-dm-sans)] text-[11px] tracking-widest text-forest-400/60 uppercase">
                        {scent.category}
                      </span>
                    </div>
                    <span className="font-[family-name:var(--font-cormorant)] text-lg font-light text-bronze-400">
                      $14
                    </span>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center justify-between">
                    {isSelected ? (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(scent.name, -1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-forest-600/30 text-forest-300 transition-colors hover:border-bronze-500/50 hover:text-bronze-400"
                          aria-label={`Decrease ${scent.name} quantity`}
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="w-6 text-center font-[family-name:var(--font-dm-sans)] text-sm font-medium text-cream">
                          {qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(scent.name, 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-forest-600/30 text-forest-300 transition-colors hover:border-bronze-500/50 hover:text-bronze-400"
                          aria-label={`Increase ${scent.name} quantity`}
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => updateQuantity(scent.name, 1)}
                        className="font-[family-name:var(--font-dm-sans)] text-xs font-medium tracking-wide text-forest-400/60 transition-colors hover:text-bronze-400"
                      >
                        + Add to order
                      </button>
                    )}

                    {isSelected && (
                      <span className="font-[family-name:var(--font-dm-sans)] text-xs font-medium text-bronze-400/80">
                        ${qty * 14}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA for mobile */}
        {totalItems > 0 && (
          <div className="mt-12 text-center lg:hidden">
            <a
              href="#order"
              className="inline-flex items-center gap-3 rounded-full bg-bronze-500 px-10 py-4 font-[family-name:var(--font-dm-sans)] text-sm font-medium text-forest-950 transition-colors hover:bg-bronze-400"
            >
              Continue to Order — ${totalPrice}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
