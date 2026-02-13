"use client";

import { useState, useEffect } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on navigation
  const handleNavClick = () => setMenuOpen(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-forest/95 backdrop-blur-md shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-12">
        <a
          href="#top"
          className="font-heading text-xl tracking-wide text-cream transition-opacity hover:opacity-80"
        >
          Canterbury <span className="text-bronze-light">Candles</span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {[
            ["Our Story", "#story"],
            ["Scents", "#scents"],
            ["Order", "#order"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-sm tracking-widest text-cream/80 uppercase transition-colors hover:text-bronze-light"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a
            href="#order"
            className="hidden rounded-full border border-bronze/40 bg-bronze/10 px-5 py-2 text-xs font-medium tracking-widest text-cream uppercase backdrop-blur-sm transition-all hover:border-bronze hover:bg-bronze/20 sm:inline-flex"
          >
            Order Now
          </a>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 items-center justify-center md:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <div className="relative h-4 w-5">
              <span
                className={`absolute left-0 h-px w-5 bg-cream transition-all duration-300 ${
                  menuOpen ? "top-2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-2 h-px w-5 bg-cream transition-opacity duration-300 ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 h-px w-5 bg-cream transition-all duration-300 ${
                  menuOpen ? "top-2 -rotate-45" : "top-4"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-all duration-400 md:hidden ${
          menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-cream/10 bg-forest/95 px-6 py-4 backdrop-blur-md">
          {[
            ["Our Story", "#story"],
            ["Scents", "#scents"],
            ["Order", "#order"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={handleNavClick}
              className="block py-3 text-sm tracking-widest text-cream/70 uppercase transition-colors hover:text-bronze-light"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
