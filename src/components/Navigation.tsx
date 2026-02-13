"use client";

import { useEffect, useState } from "react";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-forest-deep/95 backdrop-blur-md py-3 shadow-lg shadow-black/10"
          : "bg-transparent py-5"
      }`}
      role="banner"
    >
      <nav
        className="max-w-6xl mx-auto px-6 flex items-center justify-between"
        aria-label="Main navigation"
      >
        <a
          href="#"
          className="font-serif text-cream text-base sm:text-lg tracking-wide hover:text-bronze-light transition-colors focus:outline-none focus:ring-2 focus:ring-bronze focus:ring-offset-2 focus:ring-offset-forest rounded-sm px-1"
          aria-label="Canterbury Candles — back to top"
        >
          Canterbury{" "}
          <span className="text-cream/40 font-normal">Candles</span>
        </a>

        <div className="flex items-center gap-4 sm:gap-6">
          <a
            href="#scents"
            className="hidden sm:inline text-cream/50 hover:text-cream text-xs tracking-[0.2em] uppercase transition-colors focus:outline-none focus:text-cream"
          >
            Scents
          </a>
          <a
            href="#order"
            className="bg-bronze/80 hover:bg-bronze text-white text-[11px] sm:text-xs tracking-[0.15em] uppercase px-4 sm:px-5 py-2 sm:py-2.5 transition-all duration-300 hover:shadow-md hover:shadow-bronze/20 focus:outline-none focus:ring-2 focus:ring-bronze focus:ring-offset-2 focus:ring-offset-forest"
          >
            Order Now
          </a>
        </div>
      </nav>
    </header>
  );
}
