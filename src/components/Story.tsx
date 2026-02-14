"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import AnimateIn from "./AnimateIn";

const processSteps = [
  {
    image: "/images/empty-jars-prepped.jpg",
    alt: "Box of empty glass mason jars with wicks centered, ready for pouring",
    title: "Prepare",
    description:
      "Each batch begins with care — clean mason jars, precision-cut wicks, and our signature bronze lids, all laid out and ready.",
  },
  {
    image: "/images/pour-pitchers-stovetop.jpg",
    alt: "Eleven stainless steel pouring pitchers heating on electric stovetop",
    title: "Blend",
    description:
      "Our proprietary coconut & soy wax blend is slowly melted and infused with premium fragrance oils at the perfect temperature.",
  },
  {
    image: "/images/workspace-candle-making.png",
    alt: "Overhead view of full candle-making workspace with trays of jars and wax in various stages",
    title: "Pour",
    description:
      "Hand-poured into 16oz mason jars, each candle is given time to cure and set — no rushing, no shortcuts.",
  },
];

function ParallaxImage({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div ref={ref} className="relative overflow-hidden aspect-[4/3]">
      <motion.div className="absolute inset-[-16%]" style={{ y }}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 60vw"
          priority={priority}
        />
      </motion.div>
    </div>
  );
}

function DetailImage({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  return (
    <AnimateIn variant="scaleIn" className="relative group">
      <div className="relative overflow-hidden aspect-square">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-burgundy/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <p className="text-rose-gray text-xs tracking-[0.15em] uppercase mt-3 text-center">
        {caption}
      </p>
    </AnimateIn>
  );
}

export default function Story() {
  return (
    <section id="story" className="py-24 md:py-36 bg-blush relative">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        {/* Section header */}
        <AnimateIn className="text-center mb-20 md:mb-28">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">
            Our Process
          </p>
          <h2 className="font-display text-burgundy text-4xl md:text-5xl lg:text-6xl mb-6">
            The Craft Behind
            <span className="italic"> Every Flame</span>
          </h2>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8" />
          <p className="text-rose-gray max-w-2xl mx-auto text-lg leading-relaxed">
            Every Canterbury candle is a labor of love — hand-poured in small
            batches using a coconut &amp; soy wax blend that burns cleaner and
            longer than conventional wax.
          </p>
        </AnimateIn>

        {/* Process steps */}
        <div className="space-y-24 md:space-y-36">
          {processSteps.map((step, i) => (
            <div
              key={step.title}
              className={`flex flex-col ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } items-center gap-10 md:gap-16 lg:gap-24`}
            >
              {/* Image */}
              <AnimateIn
                variant={i % 2 === 0 ? "slideLeft" : "slideRight"}
                className="w-full md:w-3/5 relative"
              >
                <ParallaxImage
                  src={step.image}
                  alt={step.alt}
                  priority={i === 0}
                />
                {/* Offset decorative border */}
                <div
                  className={`absolute ${
                    i % 2 === 0 ? "-right-3 -bottom-3" : "-left-3 -bottom-3"
                  } w-full h-full border border-gold/15 -z-10 hidden md:block`}
                />
              </AnimateIn>

              {/* Text */}
              <AnimateIn
                variant={i % 2 === 0 ? "slideRight" : "slideLeft"}
                delay={0.15}
                className="w-full md:w-2/5"
              >
                {/* Large watermark step number */}
                <span
                  className="font-display text-8xl md:text-9xl leading-none bg-gradient-to-b from-gold/25 to-gold/5 bg-clip-text text-transparent select-none"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-burgundy text-3xl md:text-4xl -mt-3 mb-4">
                  {step.title}
                </h3>
                <div className="w-10 h-px bg-gradient-to-r from-gold to-transparent mb-6" />
                <p className="text-rose-gray leading-relaxed text-lg">
                  {step.description}
                </p>
              </AnimateIn>
            </div>
          ))}
        </div>

        {/* Detail images row */}
        <div className="mt-24 md:mt-36 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <DetailImage
            src="/images/crafting-supplies.jpg"
            alt="Measuring cup, metal pouring pot, glass jars, wick clips on paper towel"
            caption="The tools"
          />
          <DetailImage
            src="/images/frosted-wax-candles.jpg"
            alt="Two round wax candles showing crystalline frosting patterns"
            caption="Natural frosting"
          />
          <DetailImage
            src="/images/candle-product-shot.jpg"
            alt="Single Canterbury Candles jar, clean product shot"
            caption="The finished pour"
          />
          <DetailImage
            src="/images/empty-jars-prepped.jpg"
            alt="Glass jars with wicks ready for pouring"
            caption="Ready to fill"
          />
        </div>

        {/* Pull quote on parchment */}
        <AnimateIn className="mt-24 md:mt-36">
          <div className="bg-parchment relative py-16 px-8 md:px-16 text-center overflow-hidden">
            {/* Subtle texture */}
            <div className="absolute inset-0 grain" />

            {/* Gold corner accents */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-gold/20" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-gold/20" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-gold/20" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-gold/20" />

            <blockquote className="max-w-3xl mx-auto relative z-10">
              <div className="text-gold text-5xl font-display leading-none mb-6">
                &ldquo;
              </div>
              <p className="font-display text-burgundy text-2xl md:text-3xl italic leading-relaxed">
                We don&apos;t mass-produce. Each candle passes through our
                hands, poured with the same care we&apos;d put into one made
                for our own home.
              </p>
              <div className="w-10 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-8 mb-4" />
              <cite className="text-rose-gray text-sm tracking-widest uppercase not-italic">
                Canterbury Candles
              </cite>
            </blockquote>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
