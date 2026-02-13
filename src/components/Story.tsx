"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.2) {
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
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

const processSteps = [
  {
    image: "/images/process-jars.jpg",
    alt: "Mason jars prepped with wicks",
    title: "Prepare",
    desc: "Each 16oz mason jar is fitted with a cotton wick, centered and secured by hand.",
  },
  {
    image: "/images/process-pots.jpg",
    alt: "Stainless steel melting pots on stove",
    title: "Melt",
    desc: "Our coconut & soy blend is carefully melted in small batches, temperature-controlled for the perfect consistency.",
  },
  {
    image: "/images/process-curing.png",
    alt: "Candles curing on trays with wick holders",
    title: "Pour & Cure",
    desc: "Fragrance oils are blended at the precise moment, then poured and left to cure — patience makes the scent.",
  },
  {
    image: "/images/product-finished.jpg",
    alt: "Finished Canterbury Candles product with bronze lid",
    title: "Finish",
    desc: "Bronze lids sealed, labels applied by hand. Each candle is inspected before it reaches you.",
  },
];

export default function Story() {
  const { ref: sectionRef, inView: sectionInView } = useInView(0.1);

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative py-28 lg:py-36 overflow-hidden"
    >
      {/* Warm background */}
      <div className="absolute inset-0 bg-[var(--color-cream)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div
          className={`max-w-2xl mb-20 transition-all duration-1000 ${
            sectionInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-[var(--color-bronze)] text-sm tracking-[0.3em] uppercase mb-4">
            The Process
          </p>
          <h2 className="font-[family-name:var(--font-serif)] text-[var(--color-forest-deep)] text-4xl sm:text-5xl leading-tight mb-6">
            Crafted with
            <br />
            intention
          </h2>
          <p className="text-[var(--color-warm-brown-light)] text-lg leading-relaxed">
            Every Canterbury candle begins as raw materials and ends as an
            experience. No shortcuts, no mass production — just careful hands
            and quality ingredients.
          </p>
        </div>

        {/* Process grid — asymmetric */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {processSteps.map((step, i) => (
            <ProcessCard key={step.title} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessCard({
  step,
  index,
}: {
  step: (typeof processSteps)[number];
  index: number;
}) {
  const { ref, inView } = useInView(0.15);

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden bg-[var(--color-cream-dark)] transition-all duration-700 ${
        index % 2 === 1 ? "md:translate-y-12" : ""
      } ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={step.image}
          alt={step.alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-forest-deep)]/60 to-transparent" />

        {/* Step number */}
        <div className="absolute top-6 left-6">
          <span className="font-[family-name:var(--font-serif)] text-[var(--color-cream)]/30 text-6xl leading-none">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Text */}
      <div className="p-8">
        <h3 className="font-[family-name:var(--font-serif)] text-[var(--color-forest-deep)] text-2xl mb-3">
          {step.title}
        </h3>
        <p className="text-[var(--color-warm-brown-light)] leading-relaxed">
          {step.desc}
        </p>
      </div>
    </div>
  );
}
