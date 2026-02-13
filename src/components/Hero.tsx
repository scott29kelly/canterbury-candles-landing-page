"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-forest"
    >
      {/* Subtle texture overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Warm gradient glow from bottom */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />

      {/* Bronze accent lines */}
      <div className="pointer-events-none absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-bronze/30 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-bronze/30 to-transparent" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Logo */}
        <div className="animate-scale-in mb-8 w-[280px] sm:w-[340px] lg:w-[400px]">
          <Image
            src="/images/logo-green.png"
            alt="Canterbury Candles logo"
            width={800}
            height={800}
            priority
            className="w-full h-auto drop-shadow-2xl"
          />
        </div>

        {/* Tagline */}
        <p className="animate-fade-up animation-delay-200 mb-3 text-sm tracking-[0.35em] text-bronze-light uppercase opacity-0">
          Hand-Poured Artisan Candles
        </p>

        <p className="animate-fade-up animation-delay-300 mb-10 max-w-md text-base leading-relaxed text-cream/60 opacity-0">
          Small batch coconut &amp; soy blend, crafted with intention.
          <br />
          14 scents. 16oz mason jars. Bronze lids.
        </p>

        {/* CTA */}
        <div className="animate-fade-up animation-delay-400 flex flex-col items-center gap-4 opacity-0 sm:flex-row">
          <a
            href="#scents"
            className="group relative inline-flex items-center gap-2 rounded-full bg-bronze px-8 py-3.5 text-sm font-medium tracking-widest text-cream uppercase transition-all hover:bg-bronze-light hover:shadow-lg hover:shadow-bronze/20"
          >
            Explore Scents
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </a>

          <a
            href="#story"
            className="inline-flex items-center gap-2 text-sm tracking-widest text-cream/50 uppercase transition-colors hover:text-cream/80"
          >
            Our Process
          </a>
        </div>

        {/* Price badge */}
        <div className="animate-fade-up animation-delay-500 mt-12 opacity-0">
          <div className="inline-flex items-center gap-3 rounded-full border border-cream/10 bg-cream/5 px-6 py-2 backdrop-blur-sm">
            <span className="text-sm text-cream/40 line-through">$20</span>
            <span className="text-lg font-heading font-semibold text-bronze-light">
              $14
            </span>
            <span className="text-xs text-cream/50 uppercase tracking-wider">each</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in animation-delay-500 opacity-0">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.3em] text-cream/30 uppercase">
            Scroll
          </span>
          <div className="h-8 w-px bg-gradient-to-b from-cream/30 to-transparent" />
        </div>
      </div>
    </section>
  );
}
