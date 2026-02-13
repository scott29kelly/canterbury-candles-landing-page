import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background — forest green with texture overlay */}
      <div className="absolute inset-0 bg-[var(--color-forest-deep)]">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')] bg-repeat" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-screen py-32">
          {/* Left — Text */}
          <div className="animate-fade-up order-2 lg:order-1">
            <p className="text-[var(--color-bronze-light)] text-sm tracking-[0.3em] uppercase mb-6">
              Hand-poured &middot; Small batch &middot; Artisan-made
            </p>

            <h1 className="font-[family-name:var(--font-serif)] text-[var(--color-cream)] text-5xl sm:text-6xl lg:text-7xl leading-[1.1] mb-8">
              Scents that
              <br />
              <span className="text-[var(--color-bronze)]">tell a story</span>
            </h1>

            <p className="text-[var(--color-cream)]/70 text-lg max-w-md leading-relaxed mb-10">
              Coconut &amp; soy blend candles, poured by hand into 16oz mason
              jars with bronze lids. Fourteen carefully crafted scents.
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <a
                href="#scents"
                className="inline-flex items-center gap-2 bg-[var(--color-bronze)] text-[var(--color-cream)] px-8 py-4 text-sm tracking-[0.15em] uppercase hover:bg-[var(--color-bronze-dark)] transition-all duration-300 hover:translate-y-[-2px]"
              >
                Browse Scents
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </a>

              <div className="flex items-baseline gap-2 ml-2">
                <span className="text-[var(--color-cream)] font-[family-name:var(--font-serif)] text-3xl">
                  $14
                </span>
                <span className="text-[var(--color-cream)]/40 line-through text-sm">
                  $20
                </span>
                <span className="text-[var(--color-bronze-light)] text-xs tracking-wide uppercase">
                  each
                </span>
              </div>
            </div>
          </div>

          {/* Right — Logo image */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem] animate-gentle-float">
              <Image
                src="/images/logo-green.webp"
                alt="Canterbury Candles logo"
                fill
                priority
                className="object-contain drop-shadow-2xl"
                sizes="(max-width: 768px) 288px, (max-width: 1024px) 384px, 448px"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-fade-in" style={{ animationDelay: "1.2s", opacity: 0 }}>
        <div className="w-px h-16 bg-gradient-to-b from-[var(--color-bronze)] to-transparent mx-auto mb-2" />
        <span className="text-[var(--color-cream)]/40 text-xs tracking-[0.2em] uppercase">
          Scroll
        </span>
      </div>
    </section>
  );
}
