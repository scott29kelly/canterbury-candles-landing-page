"use client";

import Image from "next/image";
import AnimateIn from "./AnimateIn";

const processSteps = [
  {
    image: "/images/workspace.svg",
    alt: "Candle-making workspace with mason jars, pouring pitcher, and bronze lids",
    title: "Prepare",
    description:
      "Each batch begins with care — clean mason jars, precision-cut wicks, and our signature bronze lids, all laid out and ready.",
  },
  {
    image: "/images/melting.svg",
    alt: "Stainless steel pitchers melting coconut and soy wax blend on the stove",
    title: "Blend",
    description:
      "Our proprietary coconut & soy wax blend is slowly melted and infused with premium fragrance oils at the perfect temperature.",
  },
  {
    image: "/images/jars.svg",
    alt: "Mason jars with pre-installed wicks ready for wax pouring",
    title: "Pour",
    description:
      "Hand-poured into 16oz mason jars, each candle is given time to cure and set — no rushing, no shortcuts.",
  },
];

export default function Story() {
  return (
    <section id="story" className="py-24 md:py-36 bg-cream relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <AnimateIn className="text-center mb-20 md:mb-28">
          <p className="text-bronze text-sm tracking-[0.3em] uppercase mb-4">
            Our Process
          </p>
          <h2 className="font-display text-forest text-4xl md:text-5xl lg:text-6xl mb-6">
            The Craft Behind
            <span className="italic"> Every Flame</span>
          </h2>
          <div className="w-12 h-px bg-bronze mx-auto mb-8" />
          <p className="text-charcoal-light max-w-2xl mx-auto text-lg leading-relaxed">
            Every Canterbury candle is a labor of love — hand-poured in small
            batches using a coconut &amp; soy wax blend that burns cleaner and
            longer than conventional wax.
          </p>
        </AnimateIn>

        {/* Process steps - asymmetric layout */}
        <div className="space-y-20 md:space-y-32">
          {processSteps.map((step, i) => (
            <AnimateIn key={step.title}>
              <div
                className={`flex flex-col ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } items-center gap-10 md:gap-16 lg:gap-24`}
              >
                {/* Image */}
                <div className="w-full md:w-3/5 relative">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <Image
                      src={step.image}
                      alt={step.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 60vw"
                    />
                    {/* Subtle border accent */}
                    <div
                      className={`absolute ${
                        i % 2 === 0 ? "-right-3 -bottom-3" : "-left-3 -bottom-3"
                      } w-full h-full border border-bronze/20 -z-10`}
                    />
                  </div>
                </div>

                {/* Text */}
                <div className="w-full md:w-2/5">
                  <span className="text-bronze/60 font-display text-7xl md:text-8xl leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-forest text-3xl md:text-4xl mt-2 mb-4">
                    {step.title}
                  </h3>
                  <div className="w-8 h-px bg-bronze mb-6" />
                  <p className="text-charcoal-light leading-relaxed text-lg">
                    {step.description}
                  </p>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>

        {/* Pull quote */}
        <AnimateIn className="mt-24 md:mt-36 text-center">
          <blockquote className="max-w-3xl mx-auto">
            <div className="text-bronze text-5xl font-display leading-none mb-4">
              &ldquo;
            </div>
            <p className="font-display text-forest text-2xl md:text-3xl italic leading-relaxed">
              We don&apos;t mass-produce. Each candle passes through our hands,
              poured with the same care we&apos;d put into one made for our own
              home.
            </p>
            <div className="w-8 h-px bg-bronze mx-auto mt-8 mb-4" />
            <cite className="text-charcoal-light text-sm tracking-widest uppercase not-italic">
              Canterbury Candles
            </cite>
          </blockquote>
        </AnimateIn>
      </div>
    </section>
  );
}
