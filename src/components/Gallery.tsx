"use client";

import Image from "next/image";
import AnimateIn from "./AnimateIn";
import { StaggerContainer, StaggerItem } from "./AnimateIn";

const galleryImages = [
  {
    src: "/images/workspace-candle-making.png",
    alt: "Overhead view of full candle-making workspace",
    span: "col-span-2 row-span-2",
    aspect: "aspect-square",
  },
  {
    src: "/images/pour-pitchers-stovetop.jpg",
    alt: "Pouring pitchers on electric stovetop",
    span: "col-span-1 row-span-1",
    aspect: "aspect-square",
  },
  {
    src: "/images/frosted-wax-candles.jpg",
    alt: "Crystalline frosted wax candles",
    span: "col-span-1 row-span-1",
    aspect: "aspect-square",
  },
  {
    src: "/images/crafting-supplies.jpg",
    alt: "Candle-making supplies laid out on work surface",
    span: "col-span-1 row-span-1",
    aspect: "aspect-square",
  },
  {
    src: "/images/candle-product-shot.jpg",
    alt: "Canterbury Candles finished product in mason jar",
    span: "col-span-1 row-span-1",
    aspect: "aspect-square",
  },
  {
    src: "/images/empty-jars-prepped.jpg",
    alt: "Empty glass jars with wicks ready for pouring",
    span: "col-span-2 row-span-1",
    aspect: "aspect-[2/1]",
  },
];

export default function Gallery() {
  return (
    <section className="py-24 md:py-36 bg-blush-light relative overflow-hidden">
      {/* Subtle texture */}
      <div className="absolute inset-0 grain" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        {/* Section header */}
        <AnimateIn className="text-center mb-16 md:mb-20">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">
            Behind the Scenes
          </p>
          <h2 className="font-display text-burgundy text-4xl md:text-5xl lg:text-6xl mb-6">
            Made with Love
          </h2>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8" />
          <p className="text-rose-gray max-w-xl mx-auto text-lg leading-relaxed">
            A glimpse into where the magic happens — every jar, every pour,
            every flame starts here.
          </p>
        </AnimateIn>

        {/* Masonry grid */}
        <StaggerContainer
          stagger={0.08}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-auto"
        >
          {galleryImages.map((img) => (
            <StaggerItem
              key={img.src}
              variant="scaleIn"
              className={`${img.span} group relative overflow-hidden`}
            >
              <div className={`${img.aspect} relative w-full`}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover ken-burns group-hover:pause"
                  sizes={
                    img.span.includes("col-span-2")
                      ? "(max-width: 768px) 100vw, 50vw"
                      : "(max-width: 768px) 50vw, 25vw"
                  }
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-burgundy/0 group-hover:bg-burgundy/20 transition-colors duration-500" />
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Bottom tagline */}
        <AnimateIn className="text-center mt-16">
          <p className="font-display text-burgundy-muted text-xl md:text-2xl italic">
            &ldquo;Poured by hand, with heart.&rdquo;
          </p>
        </AnimateIn>
      </div>
    </section>
  );
}
