"use client";

import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  {
    num: "01",
    title: "Prepare",
    desc: "Mason jars are fitted with cotton wicks, each centered by hand. The workspace is clean, intentional — every jar placed with care.",
    image: "/images/process-jars.webp",
    alt: "Empty mason jars with cotton wicks ready for pouring",
  },
  {
    num: "02",
    title: "Melt & Blend",
    desc: "Coconut and soy wax melted in small stainless steel batches on the stove. Fragrance oils measured with precision, not guesswork.",
    image: "/images/process-melting.webp",
    alt: "Stainless steel pouring pots on the stove for wax melting",
  },
  {
    num: "03",
    title: "Pour & Cure",
    desc: "Each jar hand-poured and left to cure. The wax crystallizes slowly, locking in scent. No shortcuts, just patience.",
    image: "/images/process-curing.webp",
    alt: "Freshly poured candles curing on trays with fragrance oils and tools",
  },
];

export default function Story() {
  const sectionRef = useScrollReveal<HTMLElement>(0.1);

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative overflow-hidden bg-cream py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section header */}
        <div data-animate className="mb-20 max-w-2xl opacity-0">
          <span className="mb-4 inline-block text-xs tracking-[0.4em] text-bronze uppercase">
            The Process
          </span>
          <h2 className="font-heading text-4xl leading-tight text-forest lg:text-5xl">
            Every candle tells the story
            <br />
            <span className="text-bronze">of its making.</span>
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-bark-light/80">
            No factories. No assembly lines. Just a kitchen, quality wax, and
            the patience to get every pour right.
          </p>
        </div>

        {/* Process steps — asymmetric layout */}
        <div className="space-y-20 lg:space-y-28">
          {steps.map((step, i) => (
            <div
              key={step.num}
              data-animate
              className={`flex flex-col gap-8 opacity-0 lg:flex-row lg:items-center lg:gap-16 ${
                i % 2 !== 0 ? "lg:flex-row-reverse" : ""
              }`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* Image */}
              <div className="group relative flex-1 overflow-hidden rounded-2xl">
                <div className="aspect-[4/3] relative">
                  <Image
                    src={step.image}
                    alt={step.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                {/* Bronze corner accent */}
                <div
                  className={`absolute top-0 ${
                    i % 2 !== 0 ? "right-0" : "left-0"
                  } h-16 w-px bg-gradient-to-b from-bronze to-transparent`}
                />
                <div
                  className={`absolute top-0 ${
                    i % 2 !== 0 ? "right-0" : "left-0"
                  } h-px w-16 bg-gradient-to-r from-bronze to-transparent`}
                />
              </div>

              {/* Text */}
              <div className="flex flex-1 flex-col justify-center">
                <span className="font-heading text-6xl font-light text-bronze/20 lg:text-7xl">
                  {step.num}
                </span>
                <h3 className="mt-2 font-heading text-2xl text-forest lg:text-3xl">
                  {step.title}
                </h3>
                <p className="mt-4 max-w-sm text-base leading-relaxed text-bark-light/70">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Real product showcase */}
        <div
          data-animate
          className="mt-24 flex flex-col items-center opacity-0 lg:mt-32"
        >
          <div className="mb-8 text-center">
            <span className="text-xs tracking-[0.4em] text-bronze uppercase">
              The Result
            </span>
          </div>
          <div className="relative mx-auto max-w-xs overflow-hidden rounded-2xl shadow-2xl shadow-bark/10">
            <Image
              src="/images/product-real.webp"
              alt="Finished Canterbury Candles product with bronze lid and label"
              width={400}
              height={600}
              className="w-full h-auto"
            />
          </div>
          <p className="mt-6 max-w-sm text-center text-sm leading-relaxed text-bark-light/60">
            16oz mason jar. Bronze lid. Coconut &amp; soy blend.
            <br />
            Made with care in small batches.
          </p>
        </div>
      </div>
    </section>
  );
}
