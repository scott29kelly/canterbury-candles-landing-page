"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const products = [
  {
    image: "/images/product-cherry.webp",
    name: "Cherry Cheesecake",
    desc: "Rich cherry tartness meets creamy vanilla base",
  },
  {
    image: "/images/product-lemon.webp",
    name: "Lemon Pound Cake",
    desc: "Bright citrus zest with buttery cake warmth",
  },
  {
    image: "/images/product-strawberry.webp",
    name: "Strawberry Pound Cake",
    desc: "Sweet strawberry layered with golden cake notes",
  },
  {
    image: "/images/product-blueberry.webp",
    name: "Blueberry Pancakes",
    desc: "Warm maple syrup and fresh blueberry medley",
  },
];

export default function ProductShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative py-24 lg:py-32 bg-[var(--color-cream-dark)] overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div
          className={`text-center max-w-xl mx-auto mb-16 transition-all duration-1000 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-[var(--color-bronze)] text-sm tracking-[0.3em] uppercase mb-4">
            16oz Mason Jars &middot; Bronze Lids
          </p>
          <h2 className="font-[family-name:var(--font-serif)] text-[var(--color-forest-deep)] text-4xl sm:text-5xl leading-tight">
            The collection
          </h2>
        </div>

        {/* Product carousel / horizontal scroll */}
        <div className="flex gap-6 lg:gap-8 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-6 px-6">
          {products.map((product, i) => (
            <div
              key={product.name}
              className={`flex-shrink-0 w-72 sm:w-80 snap-center transition-all duration-700 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="relative aspect-[3/4] mb-5 overflow-hidden bg-[var(--color-cream)] group">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 288px, 320px"
                />
              </div>
              <h3 className="font-[family-name:var(--font-serif)] text-[var(--color-forest-deep)] text-xl mb-1">
                {product.name}
              </h3>
              <p className="text-[var(--color-warm-brown-light)] text-sm leading-relaxed">
                {product.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
