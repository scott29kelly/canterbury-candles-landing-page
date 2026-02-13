"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const processSteps = [
  {
    image: "/images/process-jars.jpg",
    alt: "Mason jars with wicks ready for pouring",
    title: "Prepare",
    description: "Each 16oz mason jar is fitted with a cotton wick, centered by hand.",
  },
  {
    image: "/images/process-pouring-pots.jpg",
    alt: "Stainless steel pouring pots on the stove",
    title: "Melt",
    description:
      "Our coconut and soy wax blend is melted low and slow for the cleanest burn.",
  },
  {
    image: "/images/process-batch.png",
    alt: "A full batch of candles curing on trays",
    title: "Pour",
    description:
      "Fragrance oils are blended at the perfect temperature, then poured into each jar.",
  },
  {
    image: "/images/process-curing.jpg",
    alt: "Candle tops curing with crystalline patterns",
    title: "Cure",
    description:
      "Every candle cures for days, locking in maximum scent throw before it reaches you.",
  },
];

export default function Story() {
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
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    const elements = sectionRef.current?.querySelectorAll(".reveal");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-cream py-24 sm:py-32 md:py-40"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="reveal mb-20 max-w-2xl">
          <p className="text-bronze text-xs tracking-[0.3em] uppercase mb-4">
            The Process
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-warm-brown leading-tight mb-6">
            Every candle is a<br />
            <em className="text-forest">small act of craft</em>
          </h2>
          <p className="text-warm-brown-light/70 text-base sm:text-lg leading-relaxed max-w-lg">
            From our kitchen to your home. Each Canterbury candle is hand-poured
            in small batches — never mass-produced, always made with intention.
          </p>
        </div>

        {/* Process grid — asymmetric */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {processSteps.map((step, i) => (
            <div
              key={step.title}
              className={`reveal group relative overflow-hidden bg-white ${
                i === 0
                  ? "md:row-span-2"
                  : i === 3
                  ? "md:col-span-2"
                  : ""
              }`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div
                className={`relative overflow-hidden ${
                  i === 0
                    ? "aspect-[3/4] md:aspect-auto md:h-full"
                    : i === 3
                    ? "aspect-[2/1]"
                    : "aspect-[4/3]"
                }`}
              >
                <Image
                  src={step.image}
                  alt={step.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/80 via-forest-deep/20 to-transparent" />

                {/* Text overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <span className="text-bronze-light text-xs tracking-[0.3em] uppercase block mb-2">
                    0{i + 1}
                  </span>
                  <h3 className="font-serif text-cream text-xl sm:text-2xl mb-2">
                    {step.title}
                  </h3>
                  <p className="text-cream/70 text-sm leading-relaxed max-w-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Product showcase */}
        <div className="reveal mt-20 md:mt-28 flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <div className="relative w-64 h-80 sm:w-72 sm:h-96 flex-shrink-0">
            <Image
              src="/images/product-finished.jpg"
              alt="Canterbury Candles finished product — 16oz mason jar with bronze lid"
              fill
              sizes="300px"
              className="object-contain"
            />
          </div>
          <div className="max-w-md text-center md:text-left">
            <h3 className="font-serif text-2xl sm:text-3xl text-warm-brown mb-4">
              16oz Mason Jar
            </h3>
            <p className="text-warm-brown-light/70 text-sm sm:text-base leading-relaxed mb-6">
              Each candle comes in a classic mason jar with a bronze lid.
              Coconut and soy wax blend for a clean, even burn with incredible
              scent throw. Hand-labeled with care.
            </p>
            <div className="flex items-baseline gap-3 justify-center md:justify-start">
              <span className="font-serif text-3xl text-forest">$14</span>
              <span className="text-warm-brown-light/40 line-through text-lg">
                $20
              </span>
              <span className="text-xs tracking-[0.2em] uppercase text-bronze bg-bronze/10 px-3 py-1">
                30% off
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
