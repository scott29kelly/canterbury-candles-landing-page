import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative bg-forest py-16 lg:py-20">
      <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-bronze/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="flex flex-col items-center text-center">
          {/* Logo mark */}
          <div className="mb-8 w-48 opacity-60">
            <Image
              src="/images/logo-green.webp"
              alt="Canterbury Candles"
              width={400}
              height={400}
              className="w-full h-auto brightness-200 contrast-0 invert"
            />
          </div>

          <p className="mb-8 max-w-sm text-sm leading-relaxed text-cream/40">
            Hand-poured coconut &amp; soy blend candles.
            <br />
            Small batch. Big love.
          </p>

          {/* Instagram */}
          <a
            href="https://instagram.com/canterburycandles2025"
            target="_blank"
            rel="noopener noreferrer"
            className="group mb-12 inline-flex items-center gap-2 text-sm tracking-wider text-cream/50 transition-colors hover:text-bronze-light"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="transition-transform group-hover:scale-110"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="5" />
              <circle
                cx="17.5"
                cy="6.5"
                r="1.5"
                fill="currentColor"
                stroke="none"
              />
            </svg>
            @canterburycandles2025
          </a>

          {/* Divider */}
          <div className="mb-8 h-px w-32 bg-gradient-to-r from-transparent via-cream/10 to-transparent" />

          <p className="text-xs text-cream/20">
            &copy; {new Date().getFullYear()} Canterbury Candles. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
