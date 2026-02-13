"use client";

import { useEffect, useState } from "react";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-forest-deep/95 backdrop-blur-md py-3 shadow-lg shadow-black/10"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <a
          href="#"
          className="font-serif text-cream text-lg sm:text-xl tracking-wide hover:text-bronze-light transition-colors"
        >
          Canterbury <span className="text-cream/40">Candles</span>
        </a>

        <div className="flex items-center gap-6">
          <a
            href="#scents"
            className="hidden sm:inline text-cream/50 hover:text-cream text-xs tracking-[0.2em] uppercase transition-colors"
          >
            Scents
          </a>
          <a
            href="#order"
            className="bg-bronze/80 hover:bg-bronze text-white text-xs tracking-[0.15em] uppercase px-5 py-2.5 transition-all duration-300 hover:shadow-md hover:shadow-bronze/20"
          >
            Order
          </a>
        </div>
      </div>
    </nav>
  );
}
