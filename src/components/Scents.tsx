"use client";

import Image from "next/image";
import AnimateIn from "./AnimateIn";
import { SCENTS, PRICES, PRODUCT_DETAILS, type Scent } from "@/data/products";

function ScentCard({ scent }: { scent: Scent }) {
  return (
    <div className="group relative">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-parchment">
        <Image
          src={scent.image}
          alt={`${scent.name} scented candle in mason jar`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 14vw"
        />
        {/* Glass-morphism overlay on hover (desktop only) */}
        <div className="hidden md:block absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <div className="bg-burgundy/80 backdrop-blur-md p-4">
            <p className="text-blush/80 text-sm leading-relaxed">
              {scent.notes}
            </p>
          </div>
        </div>
        {/* Permanent gradient at bottom for text readability (desktop only) */}
        <div className="hidden md:block absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent group-hover:opacity-0 transition-opacity duration-500" />
      </div>

      {/* Name and notes below image */}
      <div className="mt-3 text-center">
        <p className="text-gold/60 text-[10px] tracking-[0.2em] uppercase mb-1">
          {scent.tag}
        </p>
        <h3 className="font-display text-burgundy text-base md:text-lg group-hover:text-gold transition-colors duration-300 leading-tight">
          {scent.name}
        </h3>
        {/* Scent notes visible on mobile, hidden on desktop (shown via hover overlay) */}
        <p className="md:hidden text-rose-gray text-xs mt-1 leading-relaxed">
          {scent.notes}
        </p>
      </div>
    </div>
  );
}

export default function Scents() {
  return (
    <section id="scents" className="relative overflow-hidden">
      <div className="py-16 md:py-24 lg:py-36 bg-blush relative">
        <div className="absolute inset-0 grain" />
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
          {/* Section header */}
          <AnimateIn className="text-center mb-10 md:mb-16 lg:mb-24">
            <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">
              The Collection
            </p>
            <h2 className="font-display text-burgundy text-4xl md:text-5xl lg:text-6xl mb-6">
              Our Signature Scents
            </h2>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8" />
            <p className="text-rose-gray max-w-2xl mx-auto text-lg leading-relaxed">
              From warm bakery comforts to bright fruity escapes — each
              fragrance is carefully selected and blended to fill your space
              with just&nbsp;the&nbsp;right&nbsp;mood.
            </p>
          </AnimateIn>

          {/* Price callout */}
          <AnimateIn className="text-center mb-16 md:mb-20">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-gold text-5xl md:text-6xl">
                  ${PRICES["8oz"]}
                </span>
                <span className="text-rose-gray text-sm tracking-widest uppercase">
                  8oz
                </span>
              </div>
              <div className="hidden sm:block w-px h-10 bg-gold/20" />
              <div className="flex items-baseline gap-2">
                <span className="font-display text-gold text-5xl md:text-6xl">
                  ${PRICES["16oz"]}
                </span>
                <span className="text-rose-gray text-sm tracking-widest uppercase">
                  16oz
                </span>
              </div>
            </div>
            <p className="text-rose-gray/60 text-sm mt-4">
              Mason jars &middot; coconut, soy &amp; beeswax blend &middot; {PRODUCT_DETAILS.waxType} &middot; {PRODUCT_DETAILS.wickType} &middot; {PRODUCT_DETAILS.burnTime} &middot; {PRODUCT_DETAILS.origin}
            </p>
          </AnimateIn>

          {/* Unified product grid */}
          <div className="flex flex-wrap justify-center gap-5 md:gap-6">
            {SCENTS.map((scent) => (
              <AnimateIn key={scent.name} variant="fadeUp" className="w-[calc(50%-0.625rem)] sm:w-[calc(33.333%-0.834rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)] xl:w-[calc(20%-1.2rem)] 2xl:w-[calc(14.285%-1.286rem)]">
                <ScentCard scent={scent} />
              </AnimateIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
