"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";

type Scent = {
  name: string;
  emoji: string;
  image?: string;
  category: "sweet" | "warm" | "fresh" | "fruity";
};

const scents: Scent[] = [
  { name: "Aspen Woods", emoji: "\u{1F332}", category: "warm" },
  { name: "Blueberry Muffins", emoji: "\u{1FAD0}", category: "sweet", image: "/images/product-blueberry.png" },
  { name: "Blueberry Pancakes", emoji: "\u{1F95E}", category: "sweet", image: "/images/product-blueberry.png" },
  { name: "Cherry Cheesecake", emoji: "\u{1F352}", category: "sweet", image: "/images/product-cherry.png" },
  { name: "Espresso", emoji: "\u2615", category: "warm" },
  { name: "Fruit Loops", emoji: "\u{1F525}", category: "fruity" },
  { name: "Glazed Donuts", emoji: "\u{1F369}", category: "sweet" },
  { name: "Gingerbread", emoji: "\u{1F36A}", category: "warm" },
  { name: "Lemon Pound Cake", emoji: "\u{1F34B}", category: "sweet", image: "/images/product-lemon.png" },
  { name: "Pumpkin Pecan Waffles", emoji: "\u{1F9C7}", category: "warm" },
  { name: "Snickerdoodle", emoji: "\u{1F36A}", category: "sweet" },
  { name: "Spring Flowers", emoji: "\u{1F33C}", category: "fresh" },
  { name: "Strawberry Pound Cake", emoji: "\u{1F353}", category: "sweet", image: "/images/product-strawberry.png" },
  { name: "Watermelon Lemonade", emoji: "\u{1F349}", category: "fruity" },
];

const categoryColors: Record<string, string> = {
  sweet: "bg-[#F5E6D3]",
  warm: "bg-[#E8DDD0]",
  fresh: "bg-[#DDE8D5]",
  fruity: "bg-[#F0DDD5]",
};

export default function ScentGrid({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (name: string) => void;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const isSelected = useCallback(
    (name: string) => selected.includes(name),
    [selected]
  );

  return (
    <section
      id="scents"
      ref={sectionRef}
      className="relative py-28 lg:py-36 bg-[var(--color-forest-deep)]"
    >
      {/* Texture */}
      <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMS41IiBmaWxsPSIjZmZmIi8+PC9zdmc+')] bg-repeat" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-1000 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-[var(--color-bronze-light)] text-sm tracking-[0.3em] uppercase mb-4">
            14 Artisan Scents
          </p>
          <h2 className="font-[family-name:var(--font-serif)] text-[var(--color-cream)] text-4xl sm:text-5xl leading-tight mb-6">
            Find your fragrance
          </h2>
          <p className="text-[var(--color-cream)]/50 text-lg">
            Tap to select the scents you want. They&apos;ll be added to your order below.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {scents.map((scent, i) => (
            <ScentCard
              key={scent.name}
              scent={scent}
              index={i}
              isActive={isSelected(scent.name)}
              onToggle={onToggle}
              inView={inView}
            />
          ))}
        </div>

        {/* Selection counter */}
        <div
          className={`text-center mt-10 transition-all duration-500 ${
            selected.length > 0
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-[var(--color-cream)]/60 text-sm">
            {selected.length} scent{selected.length !== 1 ? "s" : ""} selected
            &middot;{" "}
            <span className="text-[var(--color-bronze-light)]">
              ${selected.length * 14}
            </span>{" "}
            total
          </p>
        </div>
      </div>
    </section>
  );
}

function ScentCard({
  scent,
  index,
  isActive,
  onToggle,
  inView,
}: {
  scent: Scent;
  index: number;
  isActive: boolean;
  onToggle: (name: string) => void;
  inView: boolean;
}) {
  return (
    <button
      onClick={() => onToggle(scent.name)}
      className={`scent-card relative text-left p-5 transition-all duration-300 cursor-pointer group
        ${
          isActive
            ? "bg-[var(--color-bronze)] ring-2 ring-[var(--color-bronze-light)] scale-[0.97]"
            : `${categoryColors[scent.category]} hover:ring-2 hover:ring-[var(--color-bronze)]/30`
        }
        ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
      `}
      style={{ transitionDelay: inView ? `${index * 60}ms` : "0ms" }}
      aria-pressed={isActive}
    >
      {/* Checkmark */}
      <div
        className={`absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
          isActive
            ? "bg-[var(--color-cream)] scale-100"
            : "bg-transparent scale-0"
        }`}
      >
        <svg
          className="w-3 h-3 text-[var(--color-bronze)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {/* Product image or emoji */}
      {scent.image ? (
        <div className="relative w-full aspect-[3/4] mb-4 overflow-hidden -mx-1">
          <Image
            src={scent.image}
            alt={scent.name}
            fill
            className={`object-contain transition-all duration-500 group-hover:scale-105 ${
              isActive ? "brightness-110" : ""
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        </div>
      ) : (
        <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110">
          {scent.emoji}
        </div>
      )}

      {/* Scent name */}
      <h3
        className={`font-[family-name:var(--font-serif)] text-base leading-tight transition-colors duration-300 ${
          isActive ? "text-[var(--color-cream)]" : "text-[var(--color-forest-deep)]"
        }`}
      >
        {scent.name}
      </h3>

      {/* Price */}
      <div className="mt-2 flex items-baseline gap-2">
        <span
          className={`font-[family-name:var(--font-serif)] text-lg ${
            isActive ? "text-[var(--color-cream)]" : "text-[var(--color-forest)]"
          }`}
        >
          $14
        </span>
        <span
          className={`text-xs line-through ${
            isActive ? "text-[var(--color-cream)]/40" : "text-[var(--color-warm-brown-light)]/50"
          }`}
        >
          $20
        </span>
      </div>
    </button>
  );
}
