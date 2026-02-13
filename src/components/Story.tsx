"use client";

import Image from "next/image";
import Reveal from "./Reveal";

const steps = [
  {
    number: "01",
    title: "Source",
    description:
      "Premium coconut and soy wax, carefully selected for clean, even burns.",
    image: "/images/process-setup.jpg",
    alt: "Candle-making supplies laid out on workstation",
  },
  {
    number: "02",
    title: "Melt",
    description:
      "Wax heated in stainless steel pots to the precise temperature for optimal scent throw.",
    image: "/images/process-pots.jpg",
    alt: "Melting pots on stove for candle wax",
  },
  {
    number: "03",
    title: "Pour",
    description:
      "Each 16oz mason jar hand-poured and wicked with care. No shortcuts, no machines.",
    image: "/images/process-curing.jpg",
    alt: "Freshly poured candles curing on trays",
  },
  {
    number: "04",
    title: "Cure",
    description:
      "Two weeks of curing for maximum fragrance. Patience is the final ingredient.",
    image: "/images/process-wax-tops.jpg",
    alt: "Candle wax tops crystallizing during cure",
  },
];

export default function Story() {
  return (
    <section id="story" className="relative overflow-hidden bg-cream py-28 lg:py-40">
      {/* Section header */}
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <Reveal>
          <div className="mb-20 max-w-xl lg:mb-28">
            <span className="mb-4 inline-block font-[family-name:var(--font-dm-sans)] text-xs font-medium tracking-[0.25em] text-bronze-600 uppercase">
              The Process
            </span>
            <h2 className="font-[family-name:var(--font-cormorant)] text-4xl leading-[1.15] font-light text-bark-900 sm:text-5xl lg:text-6xl">
              Made by hand,
              <br />
              <span className="italic text-forest-800">batch by batch.</span>
            </h2>
            <p className="mt-6 max-w-md font-[family-name:var(--font-dm-sans)] text-base leading-relaxed font-light text-bark-600">
              Every Canterbury candle begins as raw wax and ends as something
              worth savoring. Here&apos;s what happens in between.
            </p>
          </div>
        </Reveal>

        {/* Process steps — staggered grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 150}>
              <div
                className={`group relative ${i % 2 === 1 ? "lg:mt-12" : ""}`}
              >
                {/* Image */}
                <div className="relative mb-6 aspect-[3/4] overflow-hidden rounded-xl bg-bark-800">
                  <Image
                    src={step.image}
                    alt={step.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent" />
                  {/* Step number */}
                  <span className="absolute bottom-4 left-4 font-[family-name:var(--font-cormorant)] text-5xl font-light text-white/20">
                    {step.number}
                  </span>
                </div>

                {/* Text */}
                <h3 className="mb-2 font-[family-name:var(--font-cormorant)] text-2xl font-medium text-bark-900">
                  {step.title}
                </h3>
                <p className="font-[family-name:var(--font-dm-sans)] text-sm leading-relaxed font-light text-bark-600">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Product highlight */}
        <div className="mt-28 grid grid-cols-1 items-center gap-12 lg:mt-40 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <Image
                  src="/images/product-real.jpg"
                  alt="Canterbury Candles finished product with label"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -right-4 -bottom-4 rounded-xl bg-forest-900 px-6 py-4 shadow-lg lg:-right-8 lg:-bottom-8">
                <span className="block font-[family-name:var(--font-cormorant)] text-3xl font-light text-bronze-400">
                  16oz
                </span>
                <span className="font-[family-name:var(--font-dm-sans)] text-[10px] tracking-[0.2em] text-forest-300/60 uppercase">
                  Mason Jar
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div>
              <h3 className="font-[family-name:var(--font-cormorant)] text-3xl leading-snug font-light text-bark-900 sm:text-4xl lg:text-5xl">
                Coconut &amp; soy,
                <br />
                <span className="italic text-forest-800">bronze lids,</span>
                <br />
                14 reasons to stay.
              </h3>
              <p className="mt-6 max-w-md font-[family-name:var(--font-dm-sans)] text-base leading-relaxed font-light text-bark-600">
                Each candle is hand-poured into a 16oz mason jar and sealed with
                a bronze lid. The coconut/soy blend burns cleaner and throws
                scent farther than paraffin alternatives.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {["Clean Burn", "Long Lasting", "Hand-Poured", "Non-Toxic"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-forest-800/15 bg-forest-50 px-4 py-1.5 font-[family-name:var(--font-dm-sans)] text-xs font-medium tracking-wide text-forest-800"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
