"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useEffect, useState } from "react";
import AnimateIn from "./AnimateIn";
import WarmDivider from "./WarmDivider";

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
      "Our proprietary coconut, soy & beeswax blend is slowly melted and infused with premium fragrance oils at the perfect temperature.",
  },
  {
    image: "/images/workspace-candle-making.png",
    alt: "Overhead view of full candle-making workspace with trays of jars and wax in various stages",
    title: "Pour",
    description:
      "Hand-poured into mason jars, each candle is given time to cure and set — no rushing, no shortcuts.",
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
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%", "0%"] : ["-8%", "8%"]);

  return (
    <div ref={ref} className="relative overflow-hidden aspect-[4/3]">
      <motion.div className={isMobile ? "absolute inset-0" : "absolute inset-[-16%]"} style={{ y }}>
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

export default function Story() {
  return (
    <section id="story" className="py-16 md:py-24 lg:py-36 bg-blush relative">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        {/* Section header */}
        <AnimateIn className="text-center mb-12 md:mb-20 lg:mb-28">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">
            Our Process
          </p>
          <h2 className="font-display text-burgundy text-4xl md:text-5xl lg:text-6xl mb-6">
            The Craft Behind
            <span className="italic"> Every Flame</span>
          </h2>
          <WarmDivider variant="narrow" className="mb-8" />
          <p className="text-rose-gray max-w-2xl mx-auto text-lg leading-relaxed">
            Every Canterbury candle is a labor of love — hand-poured in small
            batches using a coconut, soy &amp; beeswax blend that burns cleaner and
            longer than conventional wax.
          </p>
        </AnimateIn>

        {/* Process steps */}
        <div className="space-y-16 md:space-y-24 lg:space-y-36">
          {processSteps.map((step, i) => (
            <div
              key={step.title}
              className={`flex flex-col ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } items-center gap-6 md:gap-16 lg:gap-24`}
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
                  className="font-display text-7xl md:text-8xl lg:text-9xl leading-none bg-gradient-to-b from-gold/25 to-gold/5 bg-clip-text text-transparent select-none"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-burgundy text-3xl md:text-4xl -mt-3 mb-4">
                  {step.title}
                </h3>
                <WarmDivider variant="narrow" className="w-10 mb-6" />
                <p className="text-rose-gray leading-relaxed text-lg">
                  {step.description}
                </p>
              </AnimateIn>
            </div>
          ))}
        </div>

        {/* Pull quote on parchment */}
        <AnimateIn className="mt-16 md:mt-24 lg:mt-36">
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
              <p className="font-display text-burgundy text-xl md:text-2xl lg:text-3xl italic leading-relaxed">
                We don&apos;t mass-produce. Each candle passes through our
                hands, poured with the same care we&apos;d put into one made
                for our own home.
              </p>
              <WarmDivider variant="narrow" className="w-10 mt-8 mb-4" />
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
