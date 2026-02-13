import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-forest grain relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Top border */}
        <div className="h-px bg-gradient-to-r from-transparent via-bronze/30 to-transparent" />

        <div className="py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <Image
                  src="/images/logo-leather.svg"
                  alt="Canterbury Candles"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <span className="font-display text-cream text-xl">
                  Canterbury Candles
                </span>
              </div>
              <p className="text-cream/40 leading-relaxed text-sm max-w-xs">
                Hand-poured coconut &amp; soy blend candles, crafted in small
                batches with intention and care.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="text-cream text-sm tracking-widest uppercase mb-6">
                Quick Links
              </h4>
              <div className="flex flex-col gap-3">
                <a
                  href="#story"
                  className="text-cream/40 text-sm hover:text-bronze transition-colors duration-300"
                >
                  Our Story
                </a>
                <a
                  href="#scents"
                  className="text-cream/40 text-sm hover:text-bronze transition-colors duration-300"
                >
                  Scent Collection
                </a>
                <a
                  href="#order"
                  className="text-cream/40 text-sm hover:text-bronze transition-colors duration-300"
                >
                  Place an Order
                </a>
              </div>
            </div>

            {/* Social / Contact */}
            <div>
              <h4 className="text-cream text-sm tracking-widest uppercase mb-6">
                Connect
              </h4>
              <a
                href="https://instagram.com/canterburycandles2025"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 text-cream/40 hover:text-bronze transition-colors duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                <span className="text-sm">@canterburycandles2025</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="h-px bg-cream/5" />
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-cream/20 text-xs">
            &copy; {new Date().getFullYear()} Canterbury Candles. All rights
            reserved.
          </p>
          <p className="text-cream/20 text-xs">
            Hand-poured with love &middot; Small batch &middot; Always
          </p>
        </div>
      </div>
    </footer>
  );
}
