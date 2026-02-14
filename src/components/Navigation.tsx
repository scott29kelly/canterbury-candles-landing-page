"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

const navLinks = [
  { label: "Our Process", href: "#story" },
  { label: "Scents", href: "#scents" },
  { label: "Order", href: "#order" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-blush/80 backdrop-blur-xl shadow-[0_1px_0_0_rgba(184,134,11,0.08)] py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between">
          {/* Brand */}
          <a
            href="#"
            className="flex items-center gap-3 group"
          >
            <div className={`relative rounded-full overflow-hidden transition-all duration-500 ${
              scrolled ? "w-9 h-9" : "w-10 h-10"
            }`}>
              <Image
                src="/images/logo-burgundy-pink.png"
                alt="Canterbury Candles"
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
            <span className={`font-display text-lg tracking-wide transition-colors duration-300 ${
              scrolled
                ? "text-burgundy group-hover:text-burgundy-light"
                : "text-blush group-hover:text-gold"
            }`}>
              Canterbury
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`relative text-sm tracking-widest uppercase transition-colors duration-300 group ${
                  scrolled
                    ? "text-charcoal/70 hover:text-burgundy"
                    : "text-blush/80 hover:text-gold"
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-300 ${
                  scrolled ? "bg-gold" : "bg-gold"
                }`} />
              </a>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2.5 transition-colors z-60 relative ${
              mobileOpen
                ? "text-blush hover:text-gold"
                : scrolled
                  ? "text-burgundy hover:text-burgundy-light"
                  : "text-blush hover:text-gold"
            }`}
            aria-label="Toggle menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              {mobileOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h12" />
                  <path d="M4 17h8" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Full-screen mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-burgundy/98 backdrop-blur-xl flex flex-col items-center justify-center"
          >
            {/* Decorative background */}
            <div className="absolute inset-0 grain opacity-50" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] opacity-[0.04]">
              <Image
                src="/images/logo-burgundy-pink.png"
                alt=""
                fill
                className="object-contain"
                sizes="60vw"
                aria-hidden="true"
              />
            </div>

            {/* Navigation links */}
            <nav className="relative z-10 flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 + i * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="font-display text-blush text-4xl tracking-wide hover:text-gold transition-colors duration-300"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            {/* Bottom accent */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-12 text-center"
            >
              <div className="w-8 h-px bg-gold/30 mx-auto mb-4" />
              <p className="text-blush/30 text-[10px] tracking-[0.3em] uppercase">
                Hand-Poured &middot; Small Batch
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
