import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-forest overflow-hidden">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_50%_50%,white_1px,transparent_1px)] bg-[length:32px_32px]" />

      <div className="relative z-10 flex flex-col items-center px-6 py-20 max-w-5xl mx-auto text-center">
        {/* Logo */}
        <div className="animate-fade-up mb-8">
          <Image
            src="/images/logo-green.png"
            alt="Canterbury Candles"
            width={480}
            height={480}
            priority
            className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 object-contain drop-shadow-2xl"
          />
        </div>

        {/* Tagline */}
        <p className="animate-fade-up-delay-1 font-serif text-cream/90 text-lg sm:text-xl md:text-2xl tracking-wide mb-4">
          Hand-Poured Coconut &amp; Soy Blend
        </p>

        <p className="animate-fade-up-delay-2 text-cream/50 text-sm sm:text-base tracking-[0.25em] uppercase mb-12">
          Small Batch &middot; Artisan-Made &middot; 14 Scents
        </p>

        {/* CTA */}
        <a
          href="#scents"
          className="animate-fade-up-delay-3 group inline-flex items-center gap-3 bg-bronze/90 hover:bg-bronze text-white px-8 py-4 text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:shadow-lg hover:shadow-bronze/20"
        >
          Explore Scents
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1"
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
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-up-delay-3">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-cream/30" />
      </div>
    </section>
  );
}
