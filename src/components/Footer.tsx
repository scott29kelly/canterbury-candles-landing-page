import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative bg-[var(--color-forest-deep)] py-20 overflow-hidden">
      {/* Texture */}
      <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')] bg-repeat" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 items-start">
          {/* Brand */}
          <div>
            <div className="relative w-40 h-40 mb-6 -ml-2 opacity-80">
              <Image
                src="/images/logo-embossed.webp"
                alt="Canterbury Candles"
                fill
                className="object-contain"
                sizes="160px"
              />
            </div>
            <p className="text-[var(--color-cream)]/40 text-sm leading-relaxed max-w-xs">
              Hand-poured coconut &amp; soy blend candles. Small batch, artisan-made
              in 16oz mason jars with bronze lids.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-[var(--color-bronze)] text-sm tracking-[0.2em] uppercase mb-6">
              Navigate
            </h4>
            <nav className="flex flex-col gap-3">
              {[
                { href: "#", label: "Home" },
                { href: "#story", label: "Our Craft" },
                { href: "#scents", label: "Scents" },
                { href: "#order", label: "Order" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[var(--color-cream)]/50 hover:text-[var(--color-cream)] transition-colors text-sm"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[var(--color-bronze)] text-sm tracking-[0.2em] uppercase mb-6">
              Connect
            </h4>
            <a
              href="https://instagram.com/canterburycandles2025"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-[var(--color-cream)]/50 hover:text-[var(--color-cream)] transition-colors group"
            >
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              <span className="text-sm">@canterburycandles2025</span>
            </a>

            <div className="mt-8 pt-8 border-t border-[var(--color-cream)]/10">
              <p className="text-[var(--color-cream)]/20 text-xs">
                &copy; {new Date().getFullYear()} Canterbury Candles. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
