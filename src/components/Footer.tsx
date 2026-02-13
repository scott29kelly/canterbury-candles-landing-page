"use client";

import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-forest-deep py-14 sm:py-20" role="contentinfo">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-10">
          {/* Brand */}
          <div className="flex flex-col items-center sm:items-start gap-5">
            <Image
              src="/images/logo-green.png"
              alt="Canterbury Candles"
              width={100}
              height={100}
              className="w-16 h-16 object-contain opacity-50"
            />
            <p className="text-cream/25 text-xs tracking-wider leading-relaxed max-w-xs text-center sm:text-left">
              Hand-poured coconut &amp; soy blend candles.
              <br />
              Small batch, artisan-made.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center sm:items-end gap-5">
            <a
              href="https://www.instagram.com/canterburycandles2025"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 text-cream/35 hover:text-bronze transition-colors text-sm focus:outline-none focus:text-bronze"
              aria-label="Follow Canterbury Candles on Instagram"
            >
              <svg
                className="w-4.5 h-4.5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              @canterburycandles2025
            </a>
            <nav
              className="flex gap-6 text-cream/25 text-xs tracking-[0.15em] uppercase"
              aria-label="Footer navigation"
            >
              <a
                href="#scents"
                className="hover:text-cream/50 transition-colors focus:outline-none focus:text-cream/50"
              >
                Scents
              </a>
              <a
                href="#order"
                className="hover:text-cream/50 transition-colors focus:outline-none focus:text-cream/50"
              >
                Order
              </a>
            </nav>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 pt-8 border-t border-cream/5 text-center">
          <p className="text-cream/15 text-[11px] tracking-wider">
            &copy; {year} Canterbury Candles. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
