"use client";

import { useState, useEffect } from "react";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#story", label: "Our Craft" },
    { href: "#scents", label: "Scents" },
    { href: "#order", label: "Order" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[var(--color-cream)]/95 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a
          href="#"
          className={`font-[family-name:var(--font-serif)] text-xl tracking-wide transition-colors duration-300 ${
            scrolled ? "text-[var(--color-forest-deep)]" : "text-[var(--color-cream)]"
          }`}
        >
          Canterbury <span className="text-[var(--color-bronze)]">Candles</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm tracking-[0.15em] uppercase transition-colors duration-300 hover:text-[var(--color-bronze)] ${
                scrolled
                  ? "text-[var(--color-warm-brown)]"
                  : "text-[var(--color-cream)]/80"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden relative w-8 h-8 flex flex-col justify-center items-center gap-1.5"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-px transition-all duration-300 ${
              mobileOpen ? "rotate-45 translate-y-[3px]" : ""
            } ${scrolled ? "bg-[var(--color-forest-deep)]" : "bg-[var(--color-cream)]"}`}
          />
          <span
            className={`block w-6 h-px transition-all duration-300 ${
              mobileOpen ? "-rotate-45 -translate-y-[3px]" : ""
            } ${scrolled ? "bg-[var(--color-forest-deep)]" : "bg-[var(--color-cream)]"}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ${
          mobileOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-4 bg-[var(--color-cream)]/95 backdrop-blur-md flex flex-col gap-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm tracking-[0.15em] uppercase text-[var(--color-warm-brown)] hover:text-[var(--color-bronze)] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
