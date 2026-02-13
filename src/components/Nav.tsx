"use client";

import { useState, useEffect } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

        <a
          href="#order"
          className="rounded-full border border-bronze/40 bg-bronze/10 px-5 py-2 text-xs font-medium tracking-widest text-cream uppercase backdrop-blur-sm transition-all hover:border-bronze hover:bg-bronze/20"
        >
          Order Now
        </a>
      </div>
    </nav>
  );
}
