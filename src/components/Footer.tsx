import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-forest-950 py-16 lg:py-24">
      {/* Subtle background image */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
        <Image
          src="/images/process-jars.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          aria-hidden="true"
        />
      </div>
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
          {/* Logo */}
          <div className="flex flex-col items-center gap-4 lg:items-start">
            <div className="relative h-16 w-48 opacity-60">
              <Image
                src="/images/logo-green.jpg"
                alt="Canterbury Candles logo"
                fill
                className="object-contain"
                sizes="192px"
              />
            </div>
            <p className="max-w-xs text-center font-[family-name:var(--font-dm-sans)] text-xs leading-relaxed text-forest-400/50 lg:text-left">
              Hand-poured coconut/soy blend candles.
              <br />
              Small batch. Artisan-made.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center gap-6 lg:flex-row lg:gap-12">
            <nav className="flex gap-8">
              <a
                href="#story"
                className="font-[family-name:var(--font-dm-sans)] text-sm text-forest-400/60 transition-colors hover:text-bronze-400"
              >
                Process
              </a>
              <a
                href="#scents"
                className="font-[family-name:var(--font-dm-sans)] text-sm text-forest-400/60 transition-colors hover:text-bronze-400"
              >
                Scents
              </a>
              <a
                href="#order"
                className="font-[family-name:var(--font-dm-sans)] text-sm text-forest-400/60 transition-colors hover:text-bronze-400"
              >
                Order
              </a>
            </nav>

            {/* Instagram */}
            <a
              href="https://instagram.com/canterburycandles2025"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-forest-700/30 px-5 py-2.5 transition-all hover:border-bronze-500/40 hover:bg-forest-900/50"
            >
              <svg
                className="h-4 w-4 text-forest-400/60 transition-colors group-hover:text-bronze-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              <span className="font-[family-name:var(--font-dm-sans)] text-xs font-medium text-forest-400/60 transition-colors group-hover:text-bronze-400">
                @canterburycandles2025
              </span>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-forest-800/20 pt-8 text-center">
          <p className="font-[family-name:var(--font-dm-sans)] text-[11px] tracking-wider text-forest-400/30">
            &copy; {new Date().getFullYear()} Canterbury Candles. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
