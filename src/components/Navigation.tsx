"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-forest-950/90 py-3 shadow-lg shadow-black/10 backdrop-blur-md"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 lg:px-12">
        {/* Logo */}
        <a href="#" className="relative flex items-center gap-3">
          <div className="relative h-8 w-24 opacity-80 transition-opacity hover:opacity-100">
            <Image
              src="/images/logo-green.jpg"
              alt="Canterbury Candles"
              fill
              className="object-contain"
              sizes="96px"
            />
          </div>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#story"
            className="font-[family-name:var(--font-dm-sans)] text-[13px] font-medium tracking-wide text-cream/60 transition-colors hover:text-bronze-400"
          >
            Process
          </a>
          <a
            href="#scents"
            className="font-[family-name:var(--font-dm-sans)] text-[13px] font-medium tracking-wide text-cream/60 transition-colors hover:text-bronze-400"
          >
            Scents
          </a>
          <a
            href="#order"
            className="rounded-full bg-bronze-500/90 px-5 py-2 font-[family-name:var(--font-dm-sans)] text-[13px] font-medium text-forest-950 transition-all hover:bg-bronze-400"
          >
            Order Now
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center md:hidden"
          aria-label="Toggle menu"
        >
          <div className="relative h-4 w-5">
            <span
              className={`absolute left-0 h-px w-full bg-cream transition-all duration-300 ${
                mobileOpen ? "top-2 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-2 h-px w-full bg-cream transition-all duration-300 ${
                mobileOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 h-px w-full bg-cream transition-all duration-300 ${
                mobileOpen ? "top-2 -rotate-45" : "top-4"
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-all duration-400 md:hidden ${
          mobileOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-4 border-t border-forest-700/20 bg-forest-950/95 px-6 py-6 backdrop-blur-md">
          <a
            href="#story"
            onClick={() => setMobileOpen(false)}
            className="font-[family-name:var(--font-dm-sans)] text-sm text-cream/70 transition-colors hover:text-bronze-400"
          >
            Process
          </a>
          <a
            href="#scents"
            onClick={() => setMobileOpen(false)}
            className="font-[family-name:var(--font-dm-sans)] text-sm text-cream/70 transition-colors hover:text-bronze-400"
          >
            Scents
          </a>
          <a
            href="#order"
            onClick={() => setMobileOpen(false)}
            className="mt-2 inline-block rounded-full bg-bronze-500/90 px-5 py-2.5 text-center font-[family-name:var(--font-dm-sans)] text-sm font-medium text-forest-950"
          >
            Order Now
          </a>
        </div>
      </div>
    </nav>
  );
}
