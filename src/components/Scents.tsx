"use client";

import Image from "next/image";
import AnimateIn from "./AnimateIn";
import { StaggerContainer, StaggerItem } from "./AnimateIn";

interface FeaturedScent {
  name: string;
  image: string;
  notes: string;
}

interface Scent {
  name: string;
  tag: string;
  note: string;
  accent: string;
}

const featuredScents: FeaturedScent[] = [
  {
    name: "Strawberry Pound Cake",
    image: "/images/product-strawberry-pound-cake.png",
    notes: "Ripe strawberries, vanilla cake, whipped cream",
  },
  {
    name: "Lemon Pound Cake",
    image: "/images/product-lemon-pound-cake.png",
    notes: "Bright lemon zest, buttery pound cake, sweet cream",
  },
  {
    name: "Cherry Cheesecake",
    image: "/images/product-cherry-cheesecake.png",
    notes: "Ripe cherries, creamy cheesecake, graham crust",
  },
  {
    name: "Blueberry Pancakes",
    image: "/images/product-blueberry-pancakes.png",
    notes: "Fresh blueberries, maple syrup, warm butter",
  },
];

const remainingScents: Scent[] = [
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
    accent: "bg-[#8a3a4a]",
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
    name: "Gingerbread",
    tag: "Bakery",
    note: "Warm ginger, cinnamon spice, dark molasses",
    accent: "bg-[#8a5a3a]",
  },
  {
    name: "Glazed Donuts",
    tag: "Bakery",
    note: "Warm dough, sweet vanilla glaze, powdered sugar",
    accent: "bg-[#c4a44a]",
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
    accent: "bg-[#c45a6a]",
  },
  {
    name: "Watermelon Lemonade",
    tag: "Fruity",
    note: "Sweet watermelon, tart lemon, summer breeze",
    accent: "bg-[#6a9a5a]",
  },
];

function FeaturedCard({ scent }: { scent: FeaturedScent }) {
  return (
    <div className="group relative">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-parchment">
        <Image
          src={scent.image}
          alt={`${scent.name} scented candle in mason jar`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 25vw"
        />
        {/* Glass-morphism overlay on hover (desktop only) */}
        <div className="hidden md:block absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <div className="bg-burgundy/80 backdrop-blur-md p-5">
            <p className="text-blush/80 text-sm leading-relaxed">
              {scent.notes}
            </p>
          </div>
        </div>
        {/* Permanent gradient at bottom for text readability (desktop only) */}
        <div className="hidden md:block absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent group-hover:opacity-0 transition-opacity duration-500" />
      </div>

      {/* Name and notes below image */}
      <div className="mt-4 text-center">
        <h3 className="font-display text-burgundy text-lg md:text-xl group-hover:text-gold transition-colors duration-300">
          {scent.name}
        </h3>
        {/* Scent notes visible on mobile, hidden on desktop (shown via hover overlay) */}
        <p className="md:hidden text-rose-gray text-sm mt-1 leading-relaxed">
          {scent.notes}
        </p>
      </div>
    </div>
  );
}

export default function Scents() {
  return (
    <section id="scents" className="relative overflow-hidden">
      {/* Featured scents — blush background */}
      <div className="py-16 md:py-24 lg:py-36 bg-blush relative">
        <div className="absolute inset-0 grain" />
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
          {/* Section header */}
          <AnimateIn className="text-center mb-10 md:mb-16 lg:mb-24">
            <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">
              The Collection
            </p>
            <h2 className="font-display text-burgundy text-4xl md:text-5xl lg:text-6xl mb-6">
              14 Signature Scents
            </h2>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8" />
            <p className="text-rose-gray max-w-2xl mx-auto text-lg leading-relaxed">
              From warm bakery comforts to bright fruity escapes — each
              fragrance is carefully selected and blended to fill your space
              with just&nbsp;the&nbsp;right&nbsp;mood.
            </p>
          </AnimateIn>

          {/* Price callout */}
          <AnimateIn className="text-center mb-16 md:mb-20">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-gold text-5xl md:text-6xl">
                  $15
                </span>
                <span className="text-rose-gray text-sm tracking-widest uppercase">
                  8oz
                </span>
              </div>
              <div className="hidden sm:block w-px h-10 bg-gold/20" />
              <div className="flex items-baseline gap-2">
                <span className="font-display text-gold text-5xl md:text-6xl">
                  $25
                </span>
                <span className="text-rose-gray text-sm tracking-widest uppercase">
                  16oz
                </span>
              </div>
            </div>
            <p className="text-rose-gray/60 text-sm mt-4">
              8oz &amp; 16oz mason jars &middot; coconut, soy &amp; beeswax
              blend &middot; 75+ hour burn time &middot; all-cotton wick
              &middot; no added dyes
            </p>
          </AnimateIn>

          {/* Featured product grid */}
          <StaggerContainer
            stagger={0.35}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {featuredScents.map((scent) => (
              <StaggerItem key={scent.name} variant="fadeUp">
                <FeaturedCard scent={scent} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>

      {/* Remaining scents — burgundy background */}
      <div className="py-16 md:py-20 lg:py-28 bg-burgundy relative grain">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
          <AnimateIn className="text-center mb-12">
            <p className="text-gold text-sm tracking-[0.3em] uppercase mb-3">
              All 14 Scents
            </p>
            <h3 className="font-display text-blush text-2xl md:text-3xl">
              The Full Collection
            </h3>
          </AnimateIn>

          {/* Text grid for remaining scents */}
          <StaggerContainer
            stagger={0.12}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-3 md:gap-4"
          >
            {remainingScents.map((scent) => (
              <StaggerItem key={scent.name} variant="fadeUp" className="h-full">
                <div className="h-full group relative bg-burgundy-light/30 border border-blush/5 p-5 hover:border-gold/30 transition-all duration-500 hover:bg-burgundy-light/50">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${scent.accent} ring-2 ring-blush/10 group-hover:ring-gold/30 transition-all duration-300`}
                    />
                    <span className="text-blush/25 text-[10px] tracking-[0.2em] uppercase group-hover:text-gold/50 transition-colors duration-300">
                      {scent.tag}
                    </span>
                  </div>

                  <h4 className="font-display text-blush text-base mb-2 group-hover:text-gold transition-colors duration-300">
                    {scent.name}
                  </h4>

                  <p className="text-blush/35 text-sm leading-relaxed group-hover:text-blush/55 transition-colors duration-300">
                    {scent.note}
                  </p>

                  {/* Animated bottom accent */}
                  <div className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-gold to-gold-light group-hover:w-full transition-all duration-700" />
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* CTA */}
          <AnimateIn className="text-center mt-14">
            <a
              href="#order"
              className="group inline-flex items-center gap-3 btn-shimmer text-burgundy px-10 py-5 text-sm tracking-widest uppercase font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-gold/25"
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
      </div>
    </section>
  );
}
