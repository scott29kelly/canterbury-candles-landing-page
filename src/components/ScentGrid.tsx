"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

export type ScentCategory = "sweet" | "warm" | "fresh" | "rich";

export interface Scent {
  name: string;
  category: ScentCategory;
  note: string;
  emoji: string;
}

export const SCENTS: Scent[] = [
  { name: "Aspen Woods", category: "warm", note: "Woody, crisp, alpine", emoji: "🌲" },
  { name: "Blueberry Muffins", category: "sweet", note: "Fresh baked, buttery", emoji: "🫐" },
  { name: "Blueberry Pancakes", category: "sweet", note: "Sweet, syrupy, warm", emoji: "🥞" },
  { name: "Cherry Cheesecake", category: "sweet", note: "Tart cherry, creamy", emoji: "🍒" },
  { name: "Espresso", category: "rich", note: "Bold, roasted, deep", emoji: "☕" },
  { name: "Fruit Loops", category: "fresh", note: "Citrus, playful, bright", emoji: "🍊" },
  { name: "Glazed Donuts", category: "sweet", note: "Vanilla glaze, doughy", emoji: "🍩" },
  { name: "Gingerbread", category: "warm", note: "Spiced, molasses, cozy", emoji: "🍪" },
  { name: "Lemon Pound Cake", category: "fresh", note: "Zesty, buttery, light", emoji: "🍋" },
  { name: "Pumpkin Pecan Waffles", category: "warm", note: "Spiced, nutty, warm", emoji: "🧇" },
  { name: "Snickerdoodle", category: "sweet", note: "Cinnamon sugar, soft", emoji: "🍪" },
  { name: "Spring Flowers", category: "fresh", note: "Floral, green, bright", emoji: "🌸" },
  { name: "Strawberry Pound Cake", category: "sweet", note: "Berry, vanilla, sweet", emoji: "🍓" },
  { name: "Watermelon Lemonade", category: "fresh", note: "Juicy, tangy, summer", emoji: "🍉" },
];

const categoryColors: Record<ScentCategory, string> = {
  sweet: "bg-rose-50 border-rose-200/50 hover:border-rose-300",
  warm: "bg-amber-50 border-amber-200/50 hover:border-amber-300",
  fresh: "bg-emerald-50 border-emerald-200/50 hover:border-emerald-300",
  rich: "bg-stone-100 border-stone-300/50 hover:border-stone-400",
};

const categoryDot: Record<ScentCategory, string> = {
  sweet: "bg-rose-400",
  warm: "bg-amber-500",
  fresh: "bg-emerald-500",
  rich: "bg-stone-500",
};

interface ScentGridProps {
  selected: Record<string, number>;
  onToggle: (name: string) => void;
  onIncrement: (name: string) => void;
  onDecrement: (name: string) => void;
}

export default function ScentGrid({
  selected,
  onToggle,
  onIncrement,
  onDecrement,
}: ScentGridProps) {
  const sectionRef = useScrollReveal<HTMLElement>(0.05);

  return (
    <section
      id="scents"
      ref={sectionRef}
      className="relative bg-forest py-24 lg:py-32"
    >
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-bronze/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div data-animate className="mb-16 max-w-2xl opacity-0">
          <span className="mb-4 inline-block text-xs tracking-[0.4em] text-bronze-light uppercase">
            The Collection
          </span>
          <h2 className="font-heading text-4xl leading-tight text-cream lg:text-5xl">
            Choose your scents.
          </h2>
          <p className="mt-4 max-w-md text-base text-cream/50">
            Tap to select, then adjust the quantity. Each candle is $14.
          </p>
        </div>

        {/* Category legend */}
        <div data-animate className="mb-10 flex flex-wrap gap-6 opacity-0">
          {(
            [
              ["sweet", "Sweet & Bakery"],
              ["warm", "Warm & Spiced"],
              ["fresh", "Fresh & Bright"],
              ["rich", "Rich & Bold"],
            ] as const
          ).map(([cat, label]) => (
            <div key={cat} className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${categoryDot[cat]}`} />
              <span className="text-xs tracking-wider text-cream/40 uppercase">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SCENTS.map((scent, i) => {
            const qty = selected[scent.name] || 0;
            const isSelected = qty > 0;

            return (
              <div
                key={scent.name}
                data-animate
                className="opacity-0"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div
                  className={`group relative cursor-pointer rounded-xl border p-5 transition-all duration-300 ${
                    isSelected
                      ? "border-bronze bg-cream shadow-lg shadow-bronze/10 scale-[1.02]"
                      : `${categoryColors[scent.category]} bg-opacity-90`
                  }`}
                  onClick={() => {
                    if (!isSelected) onToggle(scent.name);
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${scent.name} — ${scent.note}. ${isSelected ? `${qty} selected` : "Click to add"}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      if (!isSelected) onToggle(scent.name);
                    }
                  }}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-1.5 w-1.5 rounded-full ${
                            isSelected ? "bg-bronze" : categoryDot[scent.category]
                          }`}
                        />
                        <h3
                          className={`font-heading text-lg ${
                            isSelected ? "text-forest" : "text-charcoal"
                          }`}
                        >
                          {scent.name}
                        </h3>
                      </div>
                      <p
                        className={`mt-1 text-xs tracking-wide ${
                          isSelected ? "text-bark-light" : "text-charcoal/50"
                        }`}
                      >
                        {scent.note}
                      </p>
                    </div>
                    <span className="text-xl" role="img" aria-hidden>
                      {scent.emoji}
                    </span>
                  </div>

                  {/* Quantity controls */}
                  {isSelected && (
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDecrement(scent.name);
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-forest/20 text-forest transition-colors hover:bg-forest hover:text-cream"
                          aria-label={`Decrease ${scent.name} quantity`}
                        >
                          <svg width="12" height="2" viewBox="0 0 12 2" fill="currentColor">
                            <rect width="12" height="2" rx="1" />
                          </svg>
                        </button>
                        <span className="min-w-[1.5rem] text-center font-heading text-lg text-forest">
                          {qty}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onIncrement(scent.name);
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-forest/20 text-forest transition-colors hover:bg-forest hover:text-cream"
                          aria-label={`Increase ${scent.name} quantity`}
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                            <rect y="5" width="12" height="2" rx="1" />
                            <rect x="5" width="2" height="12" rx="1" />
                          </svg>
                        </button>
                      </div>
                      <span className="text-sm font-medium text-bronze">
                        ${qty * 14}
                      </span>
                    </div>
                  )}

                  {/* Hover hint */}
                  {!isSelected && (
                    <div className="mt-3 text-right">
                      <span className="text-xs text-charcoal/30 transition-colors group-hover:text-bronze">
                        + Add to order
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
