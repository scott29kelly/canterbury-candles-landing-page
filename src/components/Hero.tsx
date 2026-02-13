import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-forest grain overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/logo-green.svg"
          alt="Canterbury Candles"
          fill
          className="object-cover opacity-30"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest/60 via-forest/40 to-forest/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/images/logo-leather.svg"
            alt="Canterbury Candles Logo"
            width={280}
            height={280}
            className="mx-auto rounded-full shadow-2xl border-2 border-bronze/30"
            priority
          />
        </div>

        <h1 className="font-display text-cream text-5xl md:text-7xl lg:text-8xl leading-tight tracking-tight mb-6">
          Canterbury
          <span className="block text-bronze">Candles</span>
        </h1>

        <div className="w-16 h-px bg-bronze mx-auto mb-8" />

        <p className="text-cream/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-4 font-light">
          Hand-poured coconut &amp; soy blend candles, crafted in small batches
          with intention.
        </p>

        <p className="text-bronze text-sm tracking-[0.25em] uppercase mb-12">
          14 Signature Scents &middot; 16oz Mason Jars &middot; Bronze Lids
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#scents"
            className="group inline-flex items-center gap-3 bg-bronze text-forest px-8 py-4 text-sm tracking-widest uppercase font-medium hover:bg-bronze-light transition-all duration-300 hover:shadow-lg hover:shadow-bronze/20"
          >
            Explore Our Scents
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="#order"
            className="inline-flex items-center gap-3 border border-cream/30 text-cream px-8 py-4 text-sm tracking-widest uppercase font-medium hover:border-bronze hover:text-bronze transition-all duration-300"
          >
            Place an Order
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-cream/40 mx-auto mb-2" />
        <p className="text-cream/30 text-[10px] tracking-[0.3em] uppercase">
          Scroll
        </p>
      </div>
    </section>
  );
}
