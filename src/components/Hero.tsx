"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

function GoldParticles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${5 + Math.random() * 90}%`,
    size: 2 + Math.random() * 3,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 8,
    alt: i % 3 === 0,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      {particles.map((p) => (
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
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], ["0%", "12%"]);

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-screen py-24 lg:py-0">
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
              <h1 className="font-display text-blush text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] leading-[1.05] tracking-tight mb-6">
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
            <div className="relative mx-auto max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
              {/* Decorative gold ring behind image */}
              <div className="absolute -inset-4 rounded-full border border-gold/10 hidden lg:block" />
              <div className="absolute -inset-8 rounded-full border border-gold/5 hidden lg:block" />

              {/* Main product image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
                <Image
                  src="/images/candle-product-shot.jpg"
                  alt="Canterbury Candles hand-poured candle in mason jar with bronze lid"
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
