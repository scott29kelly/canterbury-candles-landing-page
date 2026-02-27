"use client";

import Image from "next/image";
import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useReducedMotion } from "motion/react";
import WarmDivider from "./WarmDivider";

/* ── Local hooks ─────────────────────────────────────────── */

function useHasHover() {
  const [hasHover, setHasHover] = useState(false);
  useEffect(() => {
    const hoverMql = window.matchMedia("(hover: hover)");
    const pointerMql = window.matchMedia("(pointer: fine)");
    const check = () => setHasHover(hoverMql.matches && pointerMql.matches);
    check();
    hoverMql.addEventListener("change", check);
    pointerMql.addEventListener("change", check);
    return () => {
      hoverMql.removeEventListener("change", check);
      pointerMql.removeEventListener("change", check);
    };
  }, []);
  return hasHover;
}

function useFlamePosition(
  containerRef: React.RefObject<HTMLElement | null>,
  enabled: boolean
) {
  const [position, setPosition] = useState({ x: 0, y: 0, active: false });
  const hasHover = useHasHover();

  /* ── Desktop: mouse tracking ──────────────────────────── */
  useEffect(() => {
    if (!enabled || !hasHover) return;
    const el = containerRef.current;
    if (!el) return;

    let rafId = 0;

    const onMouse = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        setPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          active: true,
        });
      });
    };

    const onLeave = () => setPosition((p) => ({ ...p, active: false }));

    el.addEventListener("mousemove", onMouse, { passive: true });
    el.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener("mousemove", onMouse);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [containerRef, enabled, hasHover]);

  /* ── Mobile: tap-to-sparkle ─────────────────────────────── */
  useEffect(() => {
    if (!enabled || hasHover) return;
    const el = containerRef.current;
    if (!el) return;

    let fadeTimer: ReturnType<typeof setTimeout>;

    const onTap = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const rect = el.getBoundingClientRect();
      setPosition({
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
        active: true,
      });

      clearTimeout(fadeTimer);
      fadeTimer = setTimeout(() => {
        setPosition((p) => ({ ...p, active: false }));
      }, 2500);
    };

    el.addEventListener("touchstart", onTap, { passive: true });

    return () => {
      clearTimeout(fadeTimer);
      el.removeEventListener("touchstart", onTap);
      setPosition((p) => ({ ...p, active: false }));
    };
  }, [containerRef, enabled, hasHover]);

  return { ...position, hasHover };
}

/* ── Layer 1: Candlelight Glow ───────────────────────────── */

function CandlelightGlow({
  mouseX,
  mouseY,
  active,
}: {
  mouseX: number;
  mouseY: number;
  active: boolean;
}) {
  return (
    <motion.div
      className="absolute inset-0 z-[2] pointer-events-none overflow-hidden"
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Lead glow — smallest, tracks closest to cursor */}
      <motion.div
        className="absolute w-[250px] h-[250px] -translate-x-1/2 -translate-y-1/2"
        animate={{ left: mouseX, top: mouseY }}
        transition={{ type: "spring", stiffness: 80, damping: 20, mass: 0.8 }}
        style={{
          background:
            "radial-gradient(circle, rgba(212,168,67,0.18) 0%, rgba(184,134,11,0.10) 35%, rgba(184,134,11,0.04) 55%, transparent 70%)",
          filter: "blur(25px)",
        }}
      />
      {/* Mid trail — lags behind cursor */}
      <motion.div
        className="absolute w-[350px] h-[350px] -translate-x-1/2 -translate-y-1/2"
        animate={{ left: mouseX, top: mouseY }}
        transition={{ type: "spring", stiffness: 30, damping: 18, mass: 1.2 }}
        style={{
          background:
            "radial-gradient(circle, rgba(212,168,67,0.10) 0%, rgba(184,134,11,0.05) 40%, transparent 65%)",
          filter: "blur(35px)",
        }}
      />
      {/* Tail bloom — slowest, widest, creates the trailing tail */}
      <motion.div
        className="absolute w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2"
        animate={{ left: mouseX, top: mouseY }}
        transition={{ type: "spring", stiffness: 12, damping: 14, mass: 1.5 }}
        style={{
          background:
            "radial-gradient(circle, rgba(245,225,220,0.06) 0%, rgba(212,168,67,0.03) 40%, transparent 65%)",
          filter: "blur(45px)",
          mixBlendMode: "screen",
        }}
      />
    </motion.div>
  );
}

/* ── Layer 2: Footer Embers ──────────────────────────────── */

const MAX_EMBERS = 24;

interface Ember {
  id: number;
  x: number;
  y: number;
  size: number;
  alt: boolean;
}

function FooterEmbers({
  mouseX,
  mouseY,
  active,
}: {
  mouseX: number;
  mouseY: number;
  active: boolean;
}) {
  const [embers, setEmbers] = useState<Ember[]>([]);
  const nextId = useRef(0);
  const lastSpawn = useRef(0);

  useEffect(() => {
    if (!active) return;

    const now = Date.now();
    if (now - lastSpawn.current < 50) return;
    lastSpawn.current = now;

    const newEmber: Ember = {
      id: nextId.current++,
      x: mouseX + (Math.random() - 0.5) * 24,
      y: mouseY - 10 - Math.random() * 20,
      size: 3 + Math.random() * 4,
      alt: Math.random() > 0.5,
    };

    setEmbers((prev) => [...prev.slice(-(MAX_EMBERS - 1)), newEmber]);
  }, [mouseX, mouseY, active]);

  // Clean up embers after their animation completes
  useEffect(() => {
    if (embers.length === 0) return;
    const timer = setTimeout(() => {
      setEmbers((prev) => prev.slice(1));
    }, 6000);
    return () => clearTimeout(timer);
  }, [embers.length]);

  return (
    <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
      {embers.map((ember) => (
        <span
          key={ember.id}
          className="absolute rounded-full"
          style={{
            left: ember.x,
            top: ember.y,
            width: ember.size,
            height: ember.size,
            background: `radial-gradient(circle, ${
              ember.alt
                ? "rgba(212,168,67,1)"
                : "rgba(201,169,110,0.95)"
            } 0%, transparent 70%)`,
            boxShadow: `0 0 4px rgba(212,168,67,0.6)`,
            animation: `${
              ember.alt ? "card-ember-alt" : "card-ember"
            } 5.5s ease-in-out forwards`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Layer 3: Cursor Flame ───────────────────────────────── */

function CursorFlame({
  mouseX,
  mouseY,
  active,
}: {
  mouseX: number;
  mouseY: number;
  active: boolean;
}) {
  return (
    <motion.div
      className="absolute inset-0 z-[4] pointer-events-none overflow-hidden"
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.div
        className="absolute -translate-x-1/2 cursor-flame-container"
        animate={{ left: mouseX, top: mouseY }}
        transition={{ type: "spring", stiffness: 800, damping: 40, mass: 0.3 }}
        style={{ width: 35, height: 65 }}
      >
        {/* Translate upward so flame sits above cursor */}
        <div className="relative w-full h-full" style={{ transform: "translateY(-100%)" }}>
          <div className="absolute inset-0 cursor-flame-outer rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%]" />
          <div className="absolute inset-[15%] cursor-flame-body rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%]" />
          <div className="absolute inset-[30%] cursor-flame-core rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%]" />
          <div className="absolute left-[25%] right-[25%] top-0 h-[40%] cursor-flame-tip rounded-[50%_50%_50%_50%_/_70%_70%_30%_30%]" />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Layer 4: Magnetic Link ──────────────────────────────── */

function MagneticLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const prefersReduced = useReducedMotion();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (prefersReduced) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = (e.clientX - centerX) * 0.25;
      const dy = (e.clientY - centerY) * 0.25;
      setOffset({
        x: Math.max(-8, Math.min(8, dx)),
        y: Math.max(-4, Math.min(4, dy)),
      });
    },
    [prefersReduced]
  );

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
  }, []);

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 250, damping: 20, mass: 0.5 }}
    >
      {children}
    </motion.a>
  );
}

/* ── Footer ──────────────────────────────────────────────── */

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const enableEffects = !prefersReduced;
  const { x, y, active, hasHover } = useFlamePosition(footerRef, enableEffects);

  const linkClass =
    "text-blush/40 text-sm tracking-widest uppercase hover:text-gold transition-colors duration-300";

  return (
    <footer
      ref={footerRef}
      className="bg-burgundy grain relative overflow-hidden"
    >
      {/* Interactive layers (respects reduced motion) */}
      {enableEffects && (
        <CandlelightGlow mouseX={x} mouseY={y} active={active} />
      )}
      {enableEffects && (
        <FooterEmbers mouseX={x} mouseY={y} active={active} />
      )}
      {enableEffects && hasHover && (
        <CursorFlame mouseX={x} mouseY={y} active={active} />
      )}

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        {/* Gold separator */}
        <WarmDivider variant="wide" />

        <div className="py-16 md:py-24">
          {/* Centered logo and brand */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto relative rounded-full overflow-hidden ring-1 ring-gold/20 mb-6">
              <Image
                src="/images/logo-embossed-paper.png"
                alt="Canterbury Candles"
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <h3 className="font-display text-blush text-2xl tracking-wide mb-3">
              Canterbury Candles
            </h3>
            <p className="text-blush/35 leading-relaxed text-sm max-w-sm mx-auto">
              Hand-poured coconut, soy &amp; beeswax blend candles, crafted in
              small batches with intention and care.
            </p>
          </div>

          {/* Gold separator */}
          <WarmDivider variant="narrow" className="w-16 mb-12" />

          {/* Links row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-12">
            <MagneticLink href="#story" className={linkClass}>
              Our Process
            </MagneticLink>
            <span className="hidden sm:inline text-gold/20">&middot;</span>
            <MagneticLink href="#scents" className={linkClass}>
              Scents
            </MagneticLink>
            <span className="hidden sm:inline text-gold/20">&middot;</span>
            <MagneticLink href="#order" className={linkClass}>
              Order
            </MagneticLink>
          </div>

          {/* Social */}
          <div className="text-center mb-12">
            <a
              href="https://instagram.com/canterburycandles2025"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 text-blush/40 hover:text-gold transition-colors duration-300"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              <span className="text-sm">@canterburycandles2025</span>
            </a>
            <div className="mt-6">
              <Image
                src="/images/IG-link.jpg"
                alt="Scan to follow Canterbury Candles on Instagram"
                width={112}
                height={112}
                className="mx-auto opacity-60 hover:opacity-90 transition-opacity duration-300"
              />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="h-px bg-blush/5" />
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-blush/15 text-xs">
            &copy; {new Date().getFullYear()} Canterbury Candles. All rights
            reserved.
          </p>
          <p className="text-blush/15 text-xs">
            Hand-poured with love &middot; Small batch &middot; Always
          </p>
        </div>
      </div>
    </footer>
  );
}
