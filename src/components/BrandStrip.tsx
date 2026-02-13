import Image from "next/image";

export default function BrandStrip() {
  return (
    <div className="relative h-48 sm:h-64 lg:h-80 overflow-hidden">
      <Image
        src="/images/process-curing.webp"
        alt="Candles curing in the workshop"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[var(--color-forest-deep)]/70" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-6">
          <p className="font-[family-name:var(--font-serif)] text-[var(--color-cream)] text-2xl sm:text-3xl lg:text-4xl mb-3">
            Every batch, <span className="text-[var(--color-bronze-light)]">poured with purpose</span>
          </p>
          <p className="text-[var(--color-cream)]/50 text-sm tracking-[0.15em] uppercase">
            Coconut &amp; Soy Blend &middot; 16oz Mason Jars &middot; Bronze Lids
          </p>
        </div>
      </div>
    </div>
  );
}
