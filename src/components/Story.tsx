"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const processSteps = [
  {
    image: "/images/process-jars.jpg",
    alt: "Mason jars with wicks ready for pouring",
    title: "Prepare",
    description:
      "Each 16oz mason jar is fitted with a cotton wick, centered and secured by hand.",
  },
  {
    image: "/images/process-pouring-pots.jpg",
    alt: "Stainless steel pouring pots on the stove",
    title: "Melt",
    description:
      "Our coconut and soy wax blend is melted low and slow for the cleanest, most even burn.",
  },
  {
    image: "/images/process-batch.png",
    alt: "A full batch of candles curing on trays with fragrance oils and tools",
    title: "Pour",
    description:
      "Premium fragrance oils blended at the perfect temperature, then hand-poured into each jar.",
  },
  {
    image: "/images/process-curing.jpg",
    alt: "Top-down view of curing candle wax with natural crystalline patterns",
    title: "Cure",
    description:
      "Every candle cures for days — locking in maximum scent throw before it reaches you.",
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
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    const elements = sectionRef.current?.querySelectorAll(".reveal");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-cream">
      {/* Product showcase band */}
      <div className="py-20 sm:py-28 border-b border-warm-brown/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="reveal flex flex-col md:flex-row items-center gap-10 md:gap-20">
            {/* Product image */}
            <div className="relative w-52 h-72 sm:w-64 sm:h-80 flex-shrink-0">
              <Image
                src="/images/product-finished.jpg"
                alt="Canterbury Candles finished product — 16oz mason jar with bronze lid and branded label"
                fill
                sizes="280px"
                className="object-contain"
                priority
              />
            </div>

            {/* Product info */}
            <div className="max-w-lg text-center md:text-left">
              <p className="text-bronze text-xs tracking-[0.3em] uppercase mb-4">
                The Product
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-warm-brown leading-tight mb-5">
                16oz Mason Jar<br />
                <span className="text-forest">Coconut &amp; Soy Blend</span>
              </h2>
              <p className="text-warm-brown-light/60 text-sm sm:text-base leading-relaxed mb-8">
                Clean-burning coconut and soy wax in a classic mason jar with
                bronze lid. Hand-labeled, hand-poured. Never mass-produced.
                Incredible scent throw that fills an entire room.
              </p>
              <div className="flex items-baseline gap-4 justify-center md:justify-start">
                <span className="font-serif text-4xl text-forest">$14</span>
                <span className="text-warm-brown-light/30 line-through text-xl">
                  $20
                </span>
                <span className="text-[10px] tracking-[0.25em] uppercase text-bronze bg-bronze/10 px-3 py-1.5 font-medium">
                  30% off
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Process section */}
      <div className="py-24 sm:py-32 md:py-40">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section header */}
          <div className="reveal mb-16 sm:mb-20 max-w-xl">
            <p className="text-bronze text-xs tracking-[0.3em] uppercase mb-4">
              The Process
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-warm-brown leading-tight mb-6">
              Every candle is a<br />
              <em className="text-forest not-italic font-serif">
                small act of craft
              </em>
            </h2>
            <p className="text-warm-brown-light/60 text-sm sm:text-base leading-relaxed">
              From our kitchen to your home — each Canterbury candle is
              hand-poured in small batches with care and intention.
            </p>
          </div>

          {/* Process grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {processSteps.map((step, i) => (
              <div
                key={step.title}
                className="reveal group"
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                <div
                  className={`relative overflow-hidden ${
                    i === 0 ? "sm:row-span-2" : ""
                  }`}
                >
                  <div
                    className={`relative overflow-hidden ${
                      i === 0
                        ? "aspect-[3/4] sm:aspect-auto sm:h-full sm:min-h-[500px]"
                        : "aspect-[4/3]"
                    }`}
                  >
                    <Image
                      src={step.image}
                      alt={step.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/80 via-forest-deep/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-bronze-light/70 text-[11px] tracking-[0.3em] uppercase font-medium">
                          0{i + 1}
                        </span>
                        <span className="flex-1 h-px bg-cream/10" />
                      </div>
                      <h3 className="font-serif text-cream text-xl sm:text-2xl mb-2">
                        {step.title}
                      </h3>
                      <p className="text-cream/60 text-xs sm:text-sm leading-relaxed max-w-xs">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
