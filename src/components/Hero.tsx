"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-forest overflow-hidden">
      {/* Subtle dot texture */}
      <div className="absolute inset-0 opacity-[0.025] bg-[radial-gradient(circle_at_50%_50%,white_1px,transparent_1px)] bg-[length:24px_24px]" />

      {/* Floating product images — desktop only */}
      <div className="hidden lg:block absolute -left-8 top-1/2 -translate-y-1/2 opacity-[0.12] rotate-[-8deg]">
        <Image
          src="/images/candle-cherry.png"
          alt=""
          width={320}
          height={480}
          className="object-contain"
          aria-hidden="true"
        />
      </div>
      <div className="hidden lg:block absolute -right-8 top-1/3 -translate-y-1/2 opacity-[0.12] rotate-[6deg]">
        <Image
          src="/images/candle-lemon.png"
          alt=""
          width={280}
          height={420}
          className="object-contain"
          aria-hidden="true"
        />
      </div>

      {/* Gradient vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(15,36,25,0.6)_100%)]" />

      <div className="relative z-10 flex flex-col items-center px-6 py-24 max-w-4xl mx-auto text-center">
        {/* Logo */}
        <div className="animate-fade-up mb-10">
          <Image
            src="/images/logo-green.png"
            alt="Canterbury Candles logo"
            width={480}
            height={480}
            priority
            className="w-56 h-56 sm:w-72 sm:h-72 md:w-[22rem] md:h-[22rem] object-contain"
          />
        </div>

        {/* Tagline */}
        <h1 className="sr-only">Canterbury Candles</h1>
        <p className="animate-fade-up-delay-1 font-serif italic text-cream/85 text-lg sm:text-xl md:text-2xl tracking-wide mb-3">
          Hand-Poured Coconut &amp; Soy Blend
        </p>

        <div className="animate-fade-up-delay-2 flex items-center gap-3 text-cream/40 text-xs sm:text-sm tracking-[0.3em] uppercase mb-14">
          <span>Small Batch</span>
          <span className="w-1 h-1 rounded-full bg-bronze/60" />
          <span>Artisan-Made</span>
          <span className="w-1 h-1 rounded-full bg-bronze/60" />
          <span>14 Scents</span>
        </div>

        {/* CTA */}
        <a
          href="#scents"
          className="animate-fade-up-delay-3 group inline-flex items-center gap-3 bg-bronze/90 hover:bg-bronze text-white px-9 py-4 text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:shadow-xl hover:shadow-bronze/25 focus:outline-none focus:ring-2 focus:ring-bronze focus:ring-offset-2 focus:ring-offset-forest"
        >
          Explore Scents
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </a>

        {/* Price callout */}
        <p className="animate-fade-up-delay-3 mt-6 text-cream/25 text-xs tracking-wider">
          16oz mason jars &mdash;{" "}
          <span className="text-bronze/70 font-medium">$14</span>{" "}
          <span className="line-through">$20</span>
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-up-delay-3">
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-cream/15 to-cream/30" />
      </div>
    </section>
  );
}
