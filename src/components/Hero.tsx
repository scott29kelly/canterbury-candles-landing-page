import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-forest-900">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Main content grid */}
      <div className="relative z-10 mx-auto grid min-h-screen max-w-[1440px] grid-cols-1 items-center gap-8 px-6 py-32 lg:grid-cols-12 lg:gap-0 lg:px-12">
        {/* Left: Text */}
        <div className="order-2 flex flex-col items-center text-center lg:col-span-5 lg:order-1 lg:items-start lg:text-left">
          <div className="animate-fade-in-up mb-8 inline-flex items-center gap-2 rounded-full border border-bronze-500/30 bg-bronze-500/10 px-4 py-1.5 opacity-0">
            <span className="h-1.5 w-1.5 rounded-full bg-bronze-400" />
            <span className="font-[family-name:var(--font-dm-sans)] text-xs font-medium tracking-[0.2em] text-bronze-300 uppercase">
              Hand-Poured &middot; Small Batch
            </span>
          </div>

          <h1 className="animate-fade-in-up animation-delay-200 font-[family-name:var(--font-cormorant)] text-5xl leading-[1.1] font-light tracking-tight text-cream opacity-0 sm:text-6xl lg:text-7xl">
            Scent is
            <br />
            <span className="font-medium italic text-bronze-400">memory,</span>
            <br />
            poured.
          </h1>

          <p className="animate-fade-in-up animation-delay-400 mt-8 max-w-md font-[family-name:var(--font-dm-sans)] text-base leading-relaxed font-light text-forest-200/70 opacity-0">
            Coconut &amp; soy wax, hand-blended in small batches.
            14&nbsp;signature scents in 16oz mason jars with bronze&nbsp;lids.
          </p>

          <div className="animate-fade-in-up animation-delay-600 mt-10 flex flex-col items-center gap-4 opacity-0 sm:flex-row">
            <a
              href="#scents"
              className="group inline-flex items-center gap-3 rounded-full bg-bronze-500 px-8 py-3.5 font-[family-name:var(--font-dm-sans)] text-sm font-medium tracking-wide text-forest-950 transition-all duration-300 hover:bg-bronze-400 hover:shadow-lg hover:shadow-bronze-500/20"
            >
              Browse Scents
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
            <a
              href="#story"
              className="font-[family-name:var(--font-dm-sans)] text-sm font-medium tracking-wide text-forest-200/60 transition-colors duration-300 hover:text-bronze-400"
            >
              Our Process
            </a>
          </div>

          {/* Price callout */}
          <div className="animate-fade-in-up animation-delay-800 mt-16 flex items-baseline gap-3 border-t border-forest-700/40 pt-6 opacity-0">
            <span className="font-[family-name:var(--font-cormorant)] text-4xl font-light text-bronze-400">
              $14
            </span>
            <span className="font-[family-name:var(--font-dm-sans)] text-sm text-forest-300/50 line-through">
              $20
            </span>
            <span className="font-[family-name:var(--font-dm-sans)] text-xs tracking-widest text-forest-300/40 uppercase">
              per candle
            </span>
          </div>
        </div>

        {/* Right: Image composition */}
        <div className="relative order-1 flex items-center justify-center lg:col-span-7 lg:order-2">
          {/* Main product image */}
          <div className="animate-scale-in animation-delay-200 relative opacity-0">
            <div className="relative z-20 h-[420px] w-[280px] overflow-hidden rounded-2xl shadow-2xl shadow-black/40 sm:h-[520px] sm:w-[340px] lg:h-[600px] lg:w-[400px]">
              <Image
                src="/images/product-cherry.jpg"
                alt="Canterbury Candles — Cherry Cheesecake scent in mason jar"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 640px) 280px, (max-width: 1024px) 340px, 400px"
              />
            </div>

            {/* Offset secondary image */}
            <div className="animate-fade-in-up animation-delay-600 absolute -right-8 -bottom-12 z-30 hidden h-[200px] w-[160px] overflow-hidden rounded-xl opacity-0 shadow-xl shadow-black/30 sm:block lg:-right-16 lg:-bottom-16 lg:h-[260px] lg:w-[200px]">
              <Image
                src="/images/product-lemon.jpg"
                alt="Canterbury Candles — Lemon Pound Cake"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 160px, 200px"
              />
            </div>

            {/* Background decorative circles */}
            <div className="absolute -top-16 -left-16 z-10 h-[320px] w-[320px] rounded-full border border-bronze-500/10 lg:-top-24 lg:-left-24 lg:h-[480px] lg:w-[480px]" />
            <div className="absolute -top-8 -left-8 z-10 h-[320px] w-[320px] rounded-full border border-bronze-500/5 lg:-top-12 lg:-left-12 lg:h-[480px] lg:w-[480px]" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="animate-fade-in animation-delay-1000 absolute bottom-8 left-1/2 z-20 -translate-x-1/2 opacity-0">
        <div className="flex flex-col items-center gap-2">
          <span className="font-[family-name:var(--font-dm-sans)] text-[10px] tracking-[0.3em] text-forest-300/30 uppercase">
            Scroll
          </span>
          <div className="h-8 w-px animate-pulse bg-gradient-to-b from-bronze-500/50 to-transparent" />
        </div>
      </div>
    </section>
  );
}
