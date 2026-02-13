"use client";

import AnimateIn from "./AnimateIn";

interface Scent {
  name: string;
  tag: string;
  note: string;
  accent: string;
}

const scents: Scent[] = [
  {
    name: "Aspen Woods",
    tag: "Woody",
    note: "Earthy cedar, crisp mountain air, and warm amber",
    accent: "bg-[#5a6b4f]",
  },
  {
    name: "Blueberry Muffins",
    tag: "Bakery",
    note: "Warm blueberry, buttery crumble, vanilla glaze",
    accent: "bg-[#4a5a8a]",
  },
  {
    name: "Blueberry Pancakes",
    tag: "Bakery",
    note: "Fresh blueberries, maple syrup, warm butter",
    accent: "bg-[#5a6a9a]",
  },
  {
    name: "Cherry Cheesecake",
    tag: "Bakery",
    note: "Ripe cherries, creamy cheesecake, graham crust",
    accent: "bg-[#9a4a4a]",
  },
  {
    name: "Espresso",
    tag: "Classic",
    note: "Rich dark roast, caramel undertones, smooth finish",
    accent: "bg-[#5a3a2a]",
  },
  {
    name: "Fruit Loops",
    tag: "Fruity",
    note: "Bright citrus medley, sweet cereal, morning joy",
    accent: "bg-[#c4784a]",
  },
  {
    name: "Glazed Donuts",
    tag: "Bakery",
    note: "Warm dough, sweet vanilla glaze, powdered sugar",
    accent: "bg-[#c4a44a]",
  },
  {
    name: "Gingerbread",
    tag: "Bakery",
    note: "Warm ginger, cinnamon spice, dark molasses",
    accent: "bg-[#8a5a3a]",
  },
  {
    name: "Lemon Pound Cake",
    tag: "Bakery",
    note: "Bright lemon zest, buttery pound cake, sweet cream",
    accent: "bg-[#c4b44a]",
  },
  {
    name: "Pumpkin Pecan Waffles",
    tag: "Bakery",
    note: "Spiced pumpkin, toasted pecans, maple drizzle",
    accent: "bg-[#b47a3a]",
  },
  {
    name: "Snickerdoodle",
    tag: "Bakery",
    note: "Cinnamon sugar, warm vanilla, fresh-baked cookies",
    accent: "bg-[#c49a6a]",
  },
  {
    name: "Spring Flowers",
    tag: "Floral",
    note: "Jasmine, lily of the valley, soft green stems",
    accent: "bg-[#7a9a6a]",
  },
  {
    name: "Strawberry Pound Cake",
    tag: "Bakery",
    note: "Ripe strawberries, vanilla cake, whipped cream",
    accent: "bg-[#c45a5a]",
  },
  {
    name: "Watermelon Lemonade",
    tag: "Fruity",
    note: "Sweet watermelon, tart lemon, summer breeze",
    accent: "bg-[#6a9a5a]",
  },
];

export default function Scents() {
  return (
    <section id="scents" className="py-24 md:py-36 bg-forest relative grain">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <AnimateIn className="text-center mb-16 md:mb-24">
          <p className="text-bronze text-sm tracking-[0.3em] uppercase mb-4">
            The Collection
          </p>
          <h2 className="font-display text-cream text-4xl md:text-5xl lg:text-6xl mb-6">
            14 Signature Scents
          </h2>
          <div className="w-12 h-px bg-bronze mx-auto mb-8" />
          <p className="text-cream/60 max-w-2xl mx-auto text-lg leading-relaxed">
            From warm bakery comforts to bright fruity escapes — each fragrance
            is carefully selected and blended to fill your space with
            just&nbsp;the&nbsp;right&nbsp;mood.
          </p>
        </AnimateIn>

        {/* Price callout */}
        <AnimateIn className="text-center mb-16">
          <div className="inline-flex items-baseline gap-3">
            <span className="text-cream/40 line-through text-xl">$20</span>
            <span className="font-display text-bronze text-5xl md:text-6xl">
              $14
            </span>
            <span className="text-cream/60 text-sm tracking-widest uppercase">
              per candle
            </span>
          </div>
          <p className="text-cream/40 text-sm mt-2">
            16oz mason jar &middot; coconut &amp; soy blend &middot; bronze lid
          </p>
        </AnimateIn>

        {/* Scent grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {scents.map((scent, i) => (
            <AnimateIn key={scent.name} delay={Math.min((i % 4) + 1, 4)}>
              <div className="group relative bg-forest-light/50 border border-cream/5 p-6 hover:border-bronze/30 transition-all duration-500 hover:bg-forest-light/80">
                {/* Color accent dot */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-3 h-3 rounded-full ${scent.accent} ring-2 ring-cream/10 group-hover:ring-bronze/30 transition-all duration-300`}
                  />
                  <span className="text-cream/30 text-[10px] tracking-[0.2em] uppercase group-hover:text-bronze/60 transition-colors duration-300">
                    {scent.tag}
                  </span>
                </div>

                <h3 className="font-display text-cream text-xl mb-2 group-hover:text-bronze transition-colors duration-300">
                  {scent.name}
                </h3>

                <p className="text-cream/40 text-sm leading-relaxed group-hover:text-cream/60 transition-colors duration-300">
                  {scent.note}
                </p>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 w-0 h-px bg-bronze group-hover:w-full transition-all duration-700" />
              </div>
            </AnimateIn>
          ))}
        </div>

        {/* CTA */}
        <AnimateIn className="text-center mt-16">
          <a
            href="#order"
            className="group inline-flex items-center gap-3 bg-bronze text-forest px-10 py-5 text-sm tracking-widest uppercase font-medium hover:bg-bronze-light transition-all duration-300 hover:shadow-lg hover:shadow-bronze/20"
          >
            Order Your Favorites
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </a>
        </AnimateIn>
      </div>
    </section>
  );
}
