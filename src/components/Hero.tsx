"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useEffect, useState, useMemo } from "react";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [breakpoint]);
  return isMobile;
}

function GoldParticles() {
  const isMobile = useIsMobile();
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${5 + Math.random() * 90}%`,
        size: 2 + Math.random() * 3,
        delay: Math.random() * 8,
        duration: 6 + Math.random() * 8,
        alt: i % 3 === 0,
      })),
    []
  );
  const visible = isMobile ? particles.slice(0, 6) : particles;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      {visible.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            bottom: "-4px",
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, ${
              p.alt ? "#D4A843" : "#C9A96E"
            } 0%, transparent 70%)`,
            animation: `${
              p.alt ? "float-particle-alt" : "float-particle"
            } ${p.duration}s ${p.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", isMobile ? "0%" : "25%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, isMobile ? 1 : 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], ["0%", isMobile ? "0%" : "12%"]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background — burgundy gradient base */}
      <div className="absolute inset-0 bg-burgundy" />

      {/* Background logo — artistic placement */}
      <motion.div
        className="absolute inset-0"
        style={{ y: bgY }}
      >
        <div className="absolute -right-[10%] -top-[5%] w-[75%] h-[110%] opacity-[0.07]">
          <Image
            src="/images/logo-burgundy-pink.png"
            alt=""
            fill
            className="object-contain"
            priority
            sizes="75vw"
            aria-hidden="true"
          />
        </div>
      </motion.div>

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-burgundy via-burgundy/90 to-burgundy-light/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-burgundy via-transparent to-transparent opacity-60" />

      {/* Paper texture */}
      <div className="absolute inset-0 grain" />

      {/* Gold particles */}
      <GoldParticles />

      {/* Main content */}
      <motion.div
        className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center min-h-screen py-24 lg:pt-28 lg:pb-0">
          {/* Left — Brand messaging */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-gold text-xs md:text-sm tracking-[0.35em] uppercase mb-5 font-medium">
                Hand-Poured &middot; Small Batch &middot; Artisan
              </p>
              <h1 className="font-display text-blush text-4xl md:text-5xl lg:text-7xl xl:text-[5.5rem] leading-[1.05] tracking-tight mb-6">
                Canterbury
                <span className="block text-gold italic">Candles</span>
              </h1>
            </motion.div>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="origin-left mx-auto lg:mx-0"
            >
              <div className="w-20 h-px bg-gradient-to-r from-gold via-gold-light to-transparent mb-8" />
            </motion.div>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-blush/70 text-base md:text-lg max-w-md mx-auto lg:mx-0 leading-relaxed mb-4"
            >
              Coconut &amp; soy blend candles, lovingly crafted in small batches.
              Each flame tells a story of care, patience, and intention.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-10"
            >
              <p className="text-gold-muted text-xs tracking-[0.25em] uppercase">
                14 Signature Scents &middot; 16oz Mason Jars
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center lg:items-start gap-4"
            >
              <a
                href="#scents"
                className="group inline-flex items-center gap-3 btn-shimmer text-burgundy px-8 py-4 text-sm tracking-widest uppercase font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-gold/25"
              >
                Explore Scents
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href="#order"
                className="inline-flex items-center gap-3 border border-blush/20 text-blush px-8 py-4 text-sm tracking-widest uppercase font-medium hover:border-gold hover:text-gold transition-all duration-300"
              >
                Place an Order
              </a>
            </motion.div>
          </div>

          {/* Right — Product hero image */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative mx-auto max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-md xl:max-w-lg">
              {/* Diffuse gold sunburst glow behind image */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(201,169,110,0.28)_0%,_rgba(201,169,110,0.13)_30%,_rgba(201,169,110,0.05)_55%,_transparent_75%)] blur-2xl pointer-events-none" />
              <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 w-[180%] h-[120%] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(212,168,67,0.16)_0%,_rgba(212,168,67,0.07)_40%,_transparent_70%)] blur-3xl pointer-events-none" />

              {/* Main product image */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
                <Image
                  src="/images/logo-header-hero-shot.jpeg"
                  alt="Canterbury Candles branded mason jar candle with rustic ingredients"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 80vw, (max-width: 1024px) 50vw, 40vw"
                />
                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-burgundy/30 via-transparent to-transparent" />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 scroll-indicator">
        <div className="flex flex-col items-center gap-3">
          <p className="text-blush/30 text-[10px] tracking-[0.3em] uppercase">
            Discover
          </p>
          <div className="w-px h-10 bg-gradient-to-b from-gold/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}