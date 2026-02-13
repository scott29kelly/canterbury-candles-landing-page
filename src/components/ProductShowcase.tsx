"use client";

import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const products = [
  {
    image: "/images/candle-cherry.webp",
    name: "Cherry Cheesecake",
    alt: "Canterbury Candles Cherry Cheesecake in mason jar with bronze lid",
  },
  {
    image: "/images/candle-lemon.webp",
    name: "Lemon Pound Cake",
    alt: "Canterbury Candles Lemon Pound Cake in mason jar with bronze lid",
  },
  {
    image: "/images/candle-strawberry.webp",
    name: "Strawberry Pound Cake",
    alt: "Canterbury Candles Strawberry Pound Cake in mason jar with bronze lid",
  },
  {
    image: "/images/candle-blueberry.webp",
    name: "Blueberry Pancakes",
    alt: "Canterbury Candles Blueberry Pancakes in mason jar with bronze lid",
  },
];

export default function ProductShowcase() {
  const sectionRef = useScrollReveal<HTMLElement>(0.05);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-cream-dark py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div data-animate className="mb-16 text-center opacity-0">
          <span className="mb-4 inline-block text-xs tracking-[0.4em] text-bronze uppercase">
            Up Close
          </span>
          <h2 className="font-heading text-4xl text-forest lg:text-5xl">
            See the craft.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base text-bark-light/60">
            Each candle features our signature label, a coconut-soy wax fill,
            and a bronze-finished lid.
          </p>
        </div>

        {/* Product grid — staggered asymmetric */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {products.map((product, i) => (
            <div
              key={product.name}
              data-animate
              className={`opacity-0 ${i % 2 !== 0 ? "mt-8 lg:mt-12" : ""}`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg shadow-bark/5 transition-all duration-500 hover:shadow-xl hover:shadow-bark/10">
                <div className="aspect-[3/4] relative">
                  <Image
                    src={product.image}
                    alt={product.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-forest/80 via-forest/0 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="w-full p-5">
                    <p className="font-heading text-lg text-cream">
                      {product.name}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs text-cream/40 line-through">
                        $20
                      </span>
                      <span className="text-sm font-medium text-bronze-light">
                        $14
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Key details */}
        <div
          data-animate
          className="mt-16 flex flex-wrap justify-center gap-8 opacity-0 lg:gap-16"
        >
          {[
            ["16oz", "Mason Jar"],
            ["Coconut + Soy", "Wax Blend"],
            ["Bronze", "Lid Finish"],
            ["Hand-Poured", "Small Batch"],
          ].map(([value, label]) => (
            <div key={label} className="text-center">
              <div className="font-heading text-xl text-forest lg:text-2xl">
                {value}
              </div>
              <div className="mt-1 text-xs tracking-wider text-bark-light/50 uppercase">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
