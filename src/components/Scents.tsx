"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export interface ScentOrder {
  [scent: string]: number;
}

interface ScentsProps {
  order: ScentOrder;
  onUpdateOrder: (scent: string, qty: number) => void;
}

interface Scent {
  name: string;
  category: string;
  image?: string;
  color: string;
  accent: string;
}

const scents: Scent[] = [
  {
    name: "Strawberry Pound Cake",
    category: "Bakery",
    image: "/images/candle-strawberry.png",
    color: "#C62828",
    accent: "#FFF0F0",
  },
  {
    name: "Cherry Cheesecake",
    category: "Bakery",
    image: "/images/candle-cherry.png",
    color: "#880E4F",
    accent: "#FFF0F5",
  },
  {
    name: "Lemon Pound Cake",
    category: "Bakery",
    image: "/images/candle-lemon.png",
    color: "#F9A825",
    accent: "#FFFDE7",
  },
  {
    name: "Blueberry Pancakes",
    category: "Breakfast",
    image: "/images/candle-blueberry.png",
    color: "#283593",
    accent: "#F0F0FF",
  },
  {
    name: "Blueberry Muffins",
    category: "Bakery",
    color: "#3949AB",
    accent: "#E8EAF6",
  },
  {
    name: "Aspen Woods",
    category: "Nature",
    color: "#2E7D32",
    accent: "#E8F5E9",
  },
  {
    name: "Espresso",
    category: "Warm",
    color: "#3E2723",
    accent: "#EFEBE9",
  },
  {
    name: "Fruit Loops",
    category: "Sweet",
    color: "#E65100",
    accent: "#FFF3E0",
  },
  {
    name: "Glazed Donuts",
    category: "Bakery",
    color: "#F57F17",
    accent: "#FFFDE7",
  },
  {
    name: "Gingerbread",
    category: "Warm",
    color: "#5D4037",
    accent: "#EFEBE9",
  },
  {
    name: "Pumpkin Pecan Waffles",
    category: "Breakfast",
    color: "#BF360C",
    accent: "#FBE9E7",
  },
  {
    name: "Snickerdoodle",
    category: "Bakery",
    color: "#8D6E63",
    accent: "#FFF8E1",
  },
  {
    name: "Spring Flowers",
    category: "Nature",
    color: "#558B2F",
    accent: "#F1F8E9",
  },
  {
    name: "Watermelon Lemonade",
    category: "Fresh",
    color: "#C62828",
    accent: "#FFEBEE",
  },
];

export default function Scents({ order, onUpdateOrder }: ScentsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" }
    );

    const elements = sectionRef.current?.querySelectorAll(".reveal");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const totalItems = Object.values(order).reduce((sum, qty) => sum + qty, 0);

  return (
    <section
      id="scents"
      ref={sectionRef}
      className="relative bg-cream-dark py-24 sm:py-32"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="reveal mb-16 text-center">
          <p className="text-bronze text-xs tracking-[0.3em] uppercase mb-4">
            Our Collection
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-warm-brown leading-tight mb-6">
            Choose Your Scents
          </h2>
          <p className="text-warm-brown-light/60 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Each 16oz coconut &amp; soy candle is{" "}
            <span className="text-forest font-medium">$14</span>
            <span className="text-warm-brown-light/30 line-through ml-1.5">
              $20
            </span>
            . Tap + to add to your order.
          </p>
        </div>

        {/* Scent grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5"
          role="list"
        >
          {scents.map((scent, i) => {
            const qty = order[scent.name] || 0;
            const isSelected = qty > 0;

            return (
              <div
                key={scent.name}
                className="reveal"
                style={{ transitionDelay: `${Math.min(i * 0.04, 0.35)}s` }}
                role="listitem"
              >
                <article
                  className={`group relative bg-white overflow-hidden transition-all duration-300 ${
                    isSelected
                      ? "ring-2 ring-forest shadow-lg shadow-forest/10"
                      : "hover:shadow-md hover:shadow-warm-brown/8"
                  }`}
                >
                  {/* Image / Visual area */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {scent.image ? (
                      <Image
                        src={scent.image}
                        alt={`Canterbury Candles ${scent.name} — 16oz mason jar candle`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div
                        className="absolute inset-0 flex flex-col items-center justify-center gap-4 transition-all duration-500"
                        style={{ background: scent.accent }}
                      >
                        {/* Abstract swatch — two layered circles */}
                        <div className="relative">
                          <div
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full opacity-20 transition-transform duration-700 group-hover:scale-125"
                            style={{ background: scent.color }}
                          />
                          <div
                            className="absolute inset-2 sm:inset-3 rounded-full opacity-40 transition-transform duration-500 group-hover:scale-110"
                            style={{ background: scent.color }}
                          />
                        </div>
                        <span
                          className="text-[10px] tracking-[0.25em] uppercase opacity-40 font-medium"
                          style={{ color: scent.color }}
                        >
                          {scent.category}
                        </span>
                      </div>
                    )}

                    {/* Quantity badge */}
                    {isSelected && (
                      <div className="absolute top-2.5 right-2.5 bg-forest text-cream text-[11px] w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center font-medium rounded-full shadow-md">
                        {qty}
                      </div>
                    )}
                  </div>

                  {/* Card footer */}
                  <div className="p-3 sm:p-4">
                    <h3 className="font-serif text-[13px] sm:text-sm text-warm-brown leading-snug mb-1.5 min-h-[2.5em]">
                      {scent.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-forest font-medium text-sm">
                          $14
                        </span>
                        <span className="text-warm-brown-light/25 line-through text-[11px]">
                          $20
                        </span>
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center">
                        {isSelected && (
                          <button
                            onClick={() =>
                              onUpdateOrder(scent.name, Math.max(0, qty - 1))
                            }
                            className="w-7 h-7 flex items-center justify-center text-warm-brown-light/50 hover:text-forest hover:bg-forest/5 active:bg-forest/10 transition-colors rounded-full"
                            aria-label={`Remove one ${scent.name} from order`}
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path
                                strokeLinecap="round"
                                d="M5 12h14"
                              />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => onUpdateOrder(scent.name, qty + 1)}
                          className={`w-7 h-7 flex items-center justify-center transition-colors rounded-full ${
                            isSelected
                              ? "text-forest hover:bg-forest/10 active:bg-forest/15"
                              : "text-bronze hover:text-forest hover:bg-forest/5 active:bg-forest/10"
                          }`}
                          aria-label={`Add one ${scent.name} to order`}
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              d="M12 5v14m-7-7h14"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>

        {/* Floating order bar */}
        {totalItems > 0 && (
          <div className="fixed bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-up">
            <a
              href="#order"
              className="flex items-center gap-4 bg-forest text-cream pl-5 sm:pl-6 pr-4 py-3 shadow-2xl shadow-forest/40 hover:bg-forest-deep transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-bronze focus:ring-offset-2"
            >
              {/* Item count */}
              <div className="flex items-center gap-2">
                <span className="bg-cream/15 text-cream text-xs w-6 h-6 flex items-center justify-center rounded-full font-medium">
                  {totalItems}
                </span>
                <span className="text-cream/80 text-sm hidden sm:inline">
                  {totalItems === 1 ? "candle" : "candles"}
                </span>
              </div>

              <span className="text-cream/30">|</span>

              <span className="text-cream font-medium text-sm">
                ${totalItems * 14}
              </span>

              <span className="text-cream/30">|</span>

              <span className="text-xs tracking-[0.15em] uppercase text-bronze group-hover:text-bronze-light transition-colors flex items-center gap-1.5">
                Order
                <svg
                  className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
