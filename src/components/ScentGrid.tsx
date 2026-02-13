"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Scent = {
  name: string;
  note: string;
  category: "sweet" | "warm" | "fresh" | "fruity";
};

const scents: Scent[] = [
  { name: "Aspen Woods", note: "Earthy cedar & pine", category: "warm" },
  { name: "Blueberry Muffins", note: "Fresh berries & warm batter", category: "sweet" },
  { name: "Blueberry Pancakes", note: "Maple syrup & blueberry", category: "sweet" },
  { name: "Cherry Cheesecake", note: "Tart cherry & vanilla cream", category: "sweet" },
  { name: "Espresso", note: "Dark roast & caramel", category: "warm" },
  { name: "Fruit Loops", note: "Bright citrus cereal", category: "fruity" },
  { name: "Glazed Donuts", note: "Sugar glaze & warm dough", category: "sweet" },
  { name: "Gingerbread", note: "Spiced molasses & warmth", category: "warm" },
  { name: "Lemon Pound Cake", note: "Citrus zest & buttery cake", category: "sweet" },
  { name: "Pumpkin Pecan Waffles", note: "Pumpkin spice & toasted pecan", category: "warm" },
  { name: "Snickerdoodle", note: "Cinnamon sugar cookie", category: "sweet" },
  { name: "Spring Flowers", note: "Fresh blooms & green stems", category: "fresh" },
  { name: "Strawberry Pound Cake", note: "Berry sweetness & golden cake", category: "sweet" },
  { name: "Watermelon Lemonade", note: "Cool melon & tart citrus", category: "fruity" },
];

const categoryLabels: Record<string, string> = {
  sweet: "Sweet",
  warm: "Warm & Spiced",
  fresh: "Fresh",
  fruity: "Fruity",
};

const categoryAccents: Record<string, string> = {
  sweet: "bg-amber-100",
  warm: "bg-orange-100",
  fresh: "bg-emerald-100",
  fruity: "bg-rose-100",
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
      {/* Subtle texture */}
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
            Tap to select the scents you&apos;d like. Your choices appear in the order form below.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
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
            <span className="text-[var(--color-bronze-light)] font-[family-name:var(--font-serif)] text-base">
              ${selected.length * 14}
            </span>{" "}
            total
          </p>
          <a
            href="#order"
            className="inline-block mt-4 text-[var(--color-bronze-light)] text-sm tracking-[0.15em] uppercase border-b border-[var(--color-bronze-light)]/30 hover:border-[var(--color-bronze-light)] transition-colors pb-1"
          >
            Continue to order
          </a>
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
      className={`scent-card relative text-left p-5 sm:p-6 transition-all duration-300 cursor-pointer group rounded-sm
        ${
          isActive
            ? "bg-[var(--color-bronze)] ring-2 ring-[var(--color-bronze-light)] scale-[0.97]"
            : "bg-[var(--color-cream)] hover:ring-2 hover:ring-[var(--color-bronze)]/30"
        }
        ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
      `}
      style={{ transitionDelay: inView ? `${index * 50}ms` : "0ms" }}
      aria-pressed={isActive}
    >
      {/* Checkmark */}
      <div
        className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
          isActive
            ? "bg-[var(--color-cream)] scale-100"
            : "border-2 border-[var(--color-cream-dark)] scale-100 group-hover:border-[var(--color-bronze)]/40"
        }`}
      >
        {isActive && (
          <svg
            className="w-3.5 h-3.5 text-[var(--color-bronze)]"
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
        )}
      </div>

      {/* Category badge */}
      <div
        className={`inline-block px-2 py-0.5 text-[10px] tracking-[0.1em] uppercase mb-3 rounded-sm transition-colors duration-300 ${
          isActive
            ? "bg-[var(--color-cream)]/20 text-[var(--color-cream)]/80"
            : `${categoryAccents[scent.category]} text-[var(--color-warm-brown)]`
        }`}
      >
        {categoryLabels[scent.category]}
      </div>

      {/* Scent name */}
      <h3
        className={`font-[family-name:var(--font-serif)] text-lg leading-tight transition-colors duration-300 mb-2 ${
          isActive ? "text-[var(--color-cream)]" : "text-[var(--color-forest-deep)]"
        }`}
      >
        {scent.name}
      </h3>

      {/* Scent note */}
      <p
        className={`text-xs leading-relaxed transition-colors duration-300 ${
          isActive ? "text-[var(--color-cream)]/60" : "text-[var(--color-warm-brown-light)]"
        }`}
      >
        {scent.note}
      </p>

      {/* Price */}
      <div className="mt-4 pt-3 border-t border-current/10 flex items-baseline gap-2">
        <span
          className={`font-[family-name:var(--font-serif)] text-xl ${
            isActive ? "text-[var(--color-cream)]" : "text-[var(--color-forest)]"
          }`}
        >
          $14
        </span>
        <span
          className={`text-xs line-through ${
            isActive ? "text-[var(--color-cream)]/30" : "text-[var(--color-warm-brown-light)]/40"
          }`}
        >
          $20
        </span>
      </div>
    </button>
  );
}
