"use client";

import Image from "next/image";
import AnimateIn from "./AnimateIn";
import { StaggerContainer, StaggerItem } from "./AnimateIn";

const SCENT_IMAGE_MAP: Record<string, string> = {
  "Aspen Woods": "/images/product-aspen-woods.jpg",
  "Blueberry Muffins": "/images/product-blueberry-muffins.jpg",
  "Blueberry Pancakes": "/images/product-blueberry-pancakes.jpg",
  "Cherry Cheesecake": "/images/product-cherry-cheesecake.jpg",
  "Espresso": "/images/product-espresso.jpg",
  "Fruit Loops": "/images/product-fruit-loops.jpg",
  "Gingerbread": "/images/product-gingerbread.jpg",
  "Glazed Donuts": "/images/product-glazed-donuts.jpg",
  "Lemon Pound Cake": "/images/product-lemon-pound-cake.jpg",
  "Pumpkin Pecan Waffles": "/images/product-pumkin-pecan-waffles.jpg",
  "Snickerdoodle": "/images/product-snickerdoodle.jpg",
  "Spring Flowers": "/images/product-spring-flowers.jpg",
  "Strawberry Pound Cake": "/images/product-strawberry-pound-cake.jpg",
  "Watermelon Lemonade": "/images/product-watermelon-lemonade.jpg",
};

interface Scent {
  name: string;
  tag: string;
  notes: string;
  accent: string;
}

const scents: Scent[] = [
  {
    name: "Aspen Woods",
    tag: "Woody",
    notes: "Earthy cedar, crisp mountain air, and warm amber",
    accent: "bg-[#5a6b4f]",
  },
  {
    name: "Blueberry Muffins",
    tag: "Bakery",
    notes: "Warm blueberry, buttery crumble, vanilla glaze",
    accent: "bg-[#4a5a8a]",
  },
  {
    name: "Blueberry Pancakes",
    tag: "Bakery",
    notes: "Fresh blueberries, maple syrup, warm butter",
    accent: "bg-[#5a6a9a]",
  },
  {
    name: "Cherry Cheesecake",
    tag: "Bakery",
    notes: "Ripe cherries, creamy cheesecake, graham crust",
    accent: "bg-[#8a3a4a]",
  },
  {
    name: "Espresso",
    tag: "Classic",
    notes: "Rich dark roast, caramel undertones, smooth finish",
    accent: "bg-[#5a3a2a]",
  },
  {
    name: "Fruit Loops",
    tag: "Fruity",
    notes: "Bright citrus medley, sweet cereal, morning joy",
    accent: "bg-[#c4784a]",
  },
  {
    name: "Gingerbread",
    tag: "Bakery",
    notes: "Warm ginger, cinnamon spice, dark molasses",
    accent: "bg-[#8a5a3a]",
  },
  {
    name: "Glazed Donuts",
    tag: "Bakery",
    notes: "Warm dough, sweet vanilla glaze, powdered sugar",
    accent: "bg-[#c4a44a]",
  },
  {
    name: "Lemon Pound Cake",
    tag: "Bakery",
    notes: "Bright lemon zest, buttery pound cake, sweet cream",
    accent: "bg-[#c4b44a]",
  },
  {
    name: "Pumpkin Pecan Waffles",
    tag: "Bakery",
    notes: "Spiced pumpkin, toasted pecans, maple drizzle",
    accent: "bg-[#b47a3a]",
  },
  {
    name: "Snickerdoodle",
    tag: "Bakery",
    notes: "Cinnamon sugar, warm vanilla, fresh-baked cookies",
    accent: "bg-[#c49a6a]",
  },
  {
    name: "Spring Flowers",
    tag: "Floral",
    notes: "Jasmine, lily of the valley, soft green stems",
    accent: "bg-[#7a9a6a]",
  },
  {
    name: "Strawberry Pound Cake",
    tag: "Bakery",
    notes: "Ripe strawberries, vanilla cake, whipped cream",
    accent: "bg-[#c45a6a]",
  },
  {
    name: "Watermelon Lemonade",
    tag: "Fruity",
    notes: "Sweet watermelon, tart lemon, summer breeze",
    accent: "bg-[#6a9a5a]",
  },
];

function ScentCard({ scent }: { scent: Scent }) {
  const image = SCENT_IMAGE_MAP[scent.name];

  return (
    <div className="group relative">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-parchment">
        <Image
          src={image}
          alt={`${scent.name} scented candle in mason jar`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 14vw"
        />
        {/* Glass-morphism overlay on hover (desktop only) */}
        <div className="hidden md:block absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <div className="bg-burgundy/80 backdrop-blur-md p-4">
            <p className="text-blush/80 text-sm leading-relaxed">
              {scent.notes}
            </p>
          </div>
        </div>
        {/* Permanent gradient at bottom for text readability (desktop only) */}
        <div className="hidden md:block absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent group-hover:opacity-0 transition-opacity duration-500" />
      </div>

      {/* Name and notes below image */}
      <div className="mt-3 text-center">
        <p className="text-gold/60 text-[10px] tracking-[0.2em] uppercase mb-1">
          {scent.tag}
        </p>
        <h3 className="font-display text-burgundy text-base md:text-lg group-hover:text-gold transition-colors duration-300 leading-tight">
          {scent.name}
        </h3>
        {/* Scent notes visible on mobile, hidden on desktop (shown via hover overlay) */}
        <p className="md:hidden text-rose-gray text-xs mt-1 leading-relaxed">
          {scent.notes}
        </p>
      </div>
    </div>
  );
}

export default function Scents() {
  return (
    <section id="scents" className="relative overflow-hidden">
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
              Mason jars &middot; coconut, soy &amp; beeswax
              blend &middot; 75+ hour burn time &middot; all-cotton wick
              &middot; no added dyes
            </p>
          </AnimateIn>

          {/* Unified product grid */}
          <StaggerContainer
            stagger={0.08}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-5 md:gap-6"
          >
            {scents.map((scent) => (
              <StaggerItem key={scent.name} variant="fadeUp">
                <ScentCard scent={scent} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
