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

const scents = [
  {
    name: "Strawberry Pound Cake",
    image: "/images/candle-strawberry.png",
    color: "#C62828",
    accent: "#FFCDD2",
  },
  {
    name: "Cherry Cheesecake",
    image: "/images/candle-cherry.png",
    color: "#880E4F",
    accent: "#F8BBD0",
  },
  {
    name: "Lemon Pound Cake",
    image: "/images/candle-lemon.png",
    color: "#F9A825",
    accent: "#FFF9C4",
  },
  {
    name: "Blueberry Pancakes",
    image: "/images/candle-blueberry.png",
    color: "#283593",
    accent: "#C5CAE9",
  },
  {
    name: "Blueberry Muffins",
    color: "#1565C0",
    accent: "#BBDEFB",
  },
  {
    name: "Aspen Woods",
    color: "#2E7D32",
    accent: "#C8E6C9",
  },
  {
    name: "Espresso",
    color: "#3E2723",
    accent: "#D7CCC8",
  },
  {
    name: "Fruit Loops",
    color: "#E65100",
    accent: "#FFE0B2",
  },
  {
    name: "Glazed Donuts",
    color: "#F57F17",
    accent: "#FFF8E1",
  },
  {
    name: "Gingerbread",
    color: "#6D4C41",
    accent: "#EFEBE9",
  },
  {
    name: "Pumpkin Pecan Waffles",
    color: "#E65100",
    accent: "#FBE9E7",
  },
  {
    name: "Snickerdoodle",
    color: "#8D6E63",
    accent: "#FFF3E0",
  },
  {
    name: "Spring Flowers",
    color: "#558B2F",
    accent: "#DCEDC8",
  },
  {
    name: "Watermelon Lemonade",
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
          <p className="text-warm-brown-light/60 text-sm sm:text-base max-w-md mx-auto">
            Tap the + to add candles to your order. Each 16oz candle is{" "}
            <span className="text-forest font-medium">$14</span>.
          </p>
        </div>

        {/* Scent grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {scents.map((scent, i) => {
            const qty = order[scent.name] || 0;
            const isSelected = qty > 0;

            return (
              <div
                key={scent.name}
                className="reveal"
                style={{ transitionDelay: `${Math.min(i * 0.05, 0.4)}s` }}
              >
                <div
                  className={`group relative bg-white overflow-hidden transition-all duration-300 ${
                    isSelected
                      ? "ring-2 ring-forest shadow-lg"
                      : "hover:shadow-md"
                  }`}
                >
                  {/* Image or color swatch */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {scent.image ? (
                      <Image
                        src={scent.image}
                        alt={`${scent.name} candle`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ background: scent.accent }}
                      >
                        <div
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full opacity-60 transition-transform duration-500 group-hover:scale-110"
                          style={{ background: scent.color }}
                        />
                      </div>
                    )}

                    {/* Quantity badge */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 bg-forest text-cream text-xs w-7 h-7 flex items-center justify-center font-medium rounded-full shadow-md">
                        {qty}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3 sm:p-4">
                    <h3 className="font-serif text-sm sm:text-base text-warm-brown leading-snug mb-1 truncate">
                      {scent.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-forest font-medium text-sm">
                          $14
                        </span>
                        <span className="text-warm-brown-light/30 line-through text-xs">
                          $20
                        </span>
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-1">
                        {isSelected && (
                          <button
                            onClick={() =>
                              onUpdateOrder(scent.name, Math.max(0, qty - 1))
                            }
                            className="w-7 h-7 flex items-center justify-center text-warm-brown-light/60 hover:text-forest hover:bg-forest/5 transition-colors rounded-full text-lg leading-none"
                            aria-label={`Remove one ${scent.name}`}
                          >
                            &minus;
                          </button>
                        )}
                        <button
                          onClick={() => onUpdateOrder(scent.name, qty + 1)}
                          className={`w-7 h-7 flex items-center justify-center transition-colors rounded-full text-lg leading-none ${
                            isSelected
                              ? "text-forest hover:bg-forest/10"
                              : "text-bronze hover:text-forest hover:bg-forest/5"
                          }`}
                          aria-label={`Add one ${scent.name}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating order summary */}
        {totalItems > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-up">
            <a
              href="#order"
              className="flex items-center gap-4 bg-forest text-cream pl-6 pr-4 py-3 shadow-2xl shadow-forest/30 hover:bg-forest-deep transition-colors group"
            >
              <span className="text-sm tracking-wide">
                <span className="font-medium">{totalItems}</span>{" "}
                {totalItems === 1 ? "candle" : "candles"} &middot;{" "}
                <span className="font-medium">${totalItems * 14}</span>
              </span>
              <span className="text-xs tracking-[0.15em] uppercase text-cream/70 group-hover:text-cream transition-colors">
                Complete Order
              </span>
              <svg
                className="w-4 h-4 text-cream/50 group-hover:text-cream transition-all group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
