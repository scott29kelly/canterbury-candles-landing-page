"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import AnimateIn from "./AnimateIn";
import WarmDivider from "./WarmDivider";
import { SCENTS, PRICES, PRODUCT_DETAILS, type Scent } from "@/data/products";
import { useCart, type CandleSize } from "@/context/CartContext";
import { useInventory } from "@/hooks/useInventory";
import * as gtag from "@/lib/gtag";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ─── useColumnCount ─── */
function useColumnCount() {
  const [cols, setCols] = useState(2);

  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w >= 1536) setCols(5);      // 2xl
      else if (w >= 1280) setCols(4); // xl
      else if (w >= 768) setCols(3);  // md
      else setCols(2);                // base/sm
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return cols;
}

/* ─── getCardDelay ─── */
function getCardDelay(index: number, columnCount: number) {
  const row = Math.floor(index / columnCount);
  const col = index % columnCount;
  return row * 0.12 + col * 0.06;
}

/* ─── ScentsFlickerGlow ─── */
function ScentsFlickerGlow() {
  const prefersReduced = useReducedMotion();

  return (
    <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
      {/* Upper-left glow */}
      <div
        className="absolute -top-[10%] -left-[10%] w-[45vw] h-[60%] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(212,168,67,0.14) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: prefersReduced
            ? "none"
            : "candleFlicker 4s ease-in-out infinite",
          opacity: prefersReduced ? 0.6 : undefined,
        }}
      />
      {/* Lower-right glow — hidden on mobile, static on reduced motion */}
      <div
        className="hidden md:block absolute -bottom-[10%] -right-[5%] w-[35vw] h-[50%] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(184,134,11,0.10) 0%, transparent 65%)",
          filter: "blur(70px)",
          animation: prefersReduced
            ? "none"
            : "candleFlickerAlt 5.5s ease-in-out infinite",
          opacity: prefersReduced ? 0.5 : undefined,
        }}
      />
    </div>
  );
}

/* ─── AromaWisps ─── */
const WISP_DATA = [
  { left: "10%", bottom: "5%", color: "rgba(201,169,110,0.35)", delay: 0 },
  { left: "25%", bottom: "12%", color: "rgba(212,168,67,0.3)", delay: 1.5 },
  { left: "40%", bottom: "8%", color: "rgba(201,169,110,0.35)", delay: 3.0 },
  { left: "55%", bottom: "15%", color: "rgba(212,168,67,0.3)", delay: 4.5 },
  { left: "70%", bottom: "6%", color: "rgba(201,169,110,0.35)", delay: 6.0 },
  { left: "85%", bottom: "10%", color: "rgba(212,168,67,0.3)", delay: 7.5 },
  { left: "18%", bottom: "18%", color: "rgba(212,168,67,0.3)", delay: 2.0 },
  { left: "62%", bottom: "20%", color: "rgba(201,169,110,0.35)", delay: 5.0 },
];

function AromaWisps() {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) return null;

  return (
    <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
      {WISP_DATA.map((wisp, i) => (
        <span
          key={i}
          className={`absolute w-3 h-3 rounded-full ${i >= 3 ? "hidden md:block" : ""}`}
          style={{
            left: wisp.left,
            bottom: wisp.bottom,
            backgroundColor: wisp.color,
            filter: "blur(12px)",
            animation: `aromaRise 8s ease-in-out ${wisp.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── CardEmbers ─── */
const EMBER_DATA = [
  { left: "20%", bottom: "10%", size: 4, delay: 0, duration: 5, alt: false },
  { left: "55%", bottom: "18%", size: 3, delay: 1.2, duration: 6, alt: true },
  { left: "75%", bottom: "8%", size: 3.5, delay: 2.5, duration: 5.5, alt: false },
  { left: "40%", bottom: "14%", size: 3, delay: 3.8, duration: 6.5, alt: true },
];

function CardEmbers() {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {EMBER_DATA.map((e, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: e.left,
            bottom: e.bottom,
            width: e.size,
            height: e.size,
            background: `radial-gradient(circle, ${
              e.alt ? "rgba(212,168,67,0.85)" : "rgba(201,169,110,0.75)"
            } 0%, transparent 70%)`,
            animation: `${e.alt ? "card-ember-alt" : "card-ember"} ${e.duration}s ${e.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── QuantityStepper ─── */
function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
}: {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={onDecrement}
        className="w-7 h-7 rounded-full border border-blush/30 text-blush/80 hover:border-gold hover:text-gold transition-colors duration-200 flex items-center justify-center text-sm"
      >
        &minus;
      </button>
      <span className="w-6 text-center text-sm text-blush font-medium tabular-nums">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        className="w-7 h-7 rounded-full border border-blush/30 text-blush/80 hover:border-gold hover:text-gold transition-colors duration-200 flex items-center justify-center text-sm"
      >
        +
      </button>
    </div>
  );
}

/* ─── SizeRow ─── */
function SizeRow({
  scent,
  size,
  price,
  quantity,
}: {
  scent: string;
  size: CandleSize;
  price: number;
  quantity: number;
}) {
  const { dispatch } = useCart();
  const inCart = quantity > 0;

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-blush/80 text-sm whitespace-nowrap">
        {size} &middot; ${price}
      </span>
      {inCart ? (
        <QuantityStepper
          quantity={quantity}
          onIncrement={() =>
            dispatch({ type: "CHANGE_QUANTITY", scent, size, delta: 1 })
          }
          onDecrement={() => {
            if (quantity <= 1) {
              dispatch({ type: "REMOVE_ITEM", scent, size });
              gtag.removeFromCart(scent, size);
            } else {
              dispatch({ type: "CHANGE_QUANTITY", scent, size, delta: -1 });
            }
          }}
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            dispatch({ type: "ADD_ITEM", scent, size });
            gtag.addToCart(scent, size, price);
          }}
          className="px-4 py-1.5 rounded-full border border-gold/50 text-gold text-xs tracking-wider uppercase hover:bg-gold/20 transition-colors duration-200"
        >
          Add
        </button>
      )}
    </div>
  );
}

/* ─── Hover transition configs — gentle, no bounce ─── */
const HOVER_TWEEN = { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const };
const GLOW_TWEEN = { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const };
const OVERLAY_TWEEN = { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] as const };

/* ─── ScentCard ─── */
function ScentCard({
  scent,
  isActive,
  onActivate,
  onDeactivate,
  available,
}: {
  scent: Scent;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  available: boolean;
}) {
  const { getItemsForScent, getScentQuantity } = useCart();
  const scentItems = getItemsForScent(scent.name);
  const totalQty = getScentQuantity(scent.name);
  const inCart = totalQty > 0;

  const qty8 = scentItems.find((i) => i.size === "8oz")?.quantity ?? 0;
  const qty16 = scentItems.find((i) => i.size === "16oz")?.quantity ?? 0;

  const [isHovered, setIsHovered] = useState(false);
  const [shineActive, setShineActive] = useState(false);
  const desktopHover = isHovered && available;

  useEffect(() => {
    if (!desktopHover) {
      setShineActive(false);
      return;
    }
    const timer = setTimeout(() => setShineActive(true), 100);
    return () => clearTimeout(timer);
  }, [desktopHover]);

  return (
    <motion.div
      className={`relative${!available ? " opacity-50" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        y: desktopHover ? -2 : 0,
        boxShadow: desktopHover
          ? "0 6px 20px -6px rgba(184,134,11,0.10)"
          : "0 0px 0px 0px rgba(184,134,11,0)",
      }}
      transition={HOVER_TWEEN}
      style={{ borderRadius: 12 }}
    >
      {/* Candlelight hover glow — soft warm bloom behind card */}
      {available && (
        <motion.div
          className="hidden md:block absolute -inset-3 z-0 rounded-xl pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(212,168,67,0.20) 0%, rgba(184,134,11,0.08) 40%, transparent 70%)",
            filter: "blur(24px)",
          }}
          animate={{
            opacity: desktopHover ? 0.7 : 0,
            scale: desktopHover ? 1.05 : 0.95,
          }}
          transition={GLOW_TWEEN}
        />
      )}

      {/* Image container */}
      <div
        className={`relative aspect-[3/4] overflow-hidden rounded-lg bg-parchment${available ? " cursor-pointer" : " cursor-default"}`}
        onClick={() => {
          if (!available) {
            gtag.soldOutClick(scent.name);
            return;
          }
          if (isActive) onDeactivate();
          else {
            onActivate();
            gtag.selectItem(scent.name);
          }
        }}
      >
        <Image
          src={scent.image}
          alt={`${scent.name} scented candle in mason jar`}
          fill
          className={`object-cover transition-all duration-1000 ease-out${available ? (desktopHover ? " scale-105 brightness-[1.03] saturate-[1.05]" : " scale-100") : " grayscale"}`}
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 14vw"
        />

        {/* Sold Out badge */}
        {!available && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <span className="bg-burgundy/90 text-blush text-xs tracking-[0.15em] uppercase px-4 py-1.5 rounded-full font-medium shadow-md">
              Sold Out
            </span>
          </div>
        )}

        {/* Glass-morphism hover overlay — smooth slide */}
        {!isActive && available && (
          <motion.div
            className="hidden md:block absolute inset-x-0 bottom-0 z-[5]"
            initial={{ y: "100%" }}
            animate={{ y: desktopHover ? "0%" : "100%" }}
            transition={OVERLAY_TWEEN}
          >
            <div className="relative bg-burgundy/85 backdrop-blur-sm p-4 overflow-hidden">
              {shineActive && (
                <div className="absolute inset-0 z-[1] pointer-events-none card-sheen" />
              )}
              <p className="text-blush/80 text-sm leading-relaxed">
                {scent.notes}
              </p>
            </div>
          </motion.div>
        )}

        {/* Permanent gradient at bottom for text readability (desktop only) */}
        {!isActive && available && (
          <div
            className={`hidden md:block absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent transition-opacity duration-700 ease-out${desktopHover ? " opacity-0" : " opacity-100"}`}
          />
        )}

        {/* Cart indicator badge */}
        <AnimatePresence>
          {!isActive && inCart && available && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gold flex items-center justify-center z-10 shadow-md"
            >
              {totalQty === 1 ? (
                <svg
                  className="w-3.5 h-3.5 text-burgundy"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="text-burgundy text-[11px] font-bold leading-none">
                  {totalQty}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selection overlay */}
        <AnimatePresence>
          {isActive && available && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.4, ease: EASE }}
              className="absolute inset-0 bg-burgundy/85 backdrop-blur-md flex flex-col items-center justify-center p-5 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <CardEmbers />

              {/* Close button */}
              <button
                type="button"
                onClick={onDeactivate}
                className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full text-blush/60 hover:text-gold transition-colors duration-200 flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h4 className="font-display text-blush text-base md:text-lg mb-5 text-center leading-tight">
                {scent.name}
              </h4>

              <div className="w-full max-w-[220px] space-y-3">
                <SizeRow
                  scent={scent.name}
                  size="8oz"
                  price={PRICES["8oz"]}
                  quantity={qty8}
                />
                <SizeRow
                  scent={scent.name}
                  size="16oz"
                  price={PRICES["16oz"]}
                  quantity={qty16}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Name and notes below image */}
      <div className="mt-3 text-center">
        <p className="text-gold/60 text-[10px] tracking-[0.2em] uppercase mb-1">
          {scent.tag}
        </p>
        <h3
          className={`font-display text-base md:text-lg leading-tight transition-colors duration-500 ease-out${
            available
              ? isHovered
                ? " text-gold"
                : " text-burgundy"
              : " text-burgundy/50"
          }`}
        >
          {scent.name}
        </h3>
        {/* Scent notes visible on mobile, hidden on desktop (shown via hover overlay) */}
        <p className="md:hidden text-rose-gray text-xs mt-1 leading-relaxed">
          {scent.notes}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Main Scents Section ─── */
export default function Scents() {
  const [activeCardName, setActiveCardName] = useState<string | null>(null);
  const inventory = useInventory();
  const columnCount = useColumnCount();
  const prefersReduced = useReducedMotion();

  const handleBackgroundClick = useCallback(() => {
    setActiveCardName(null);
  }, []);

  /* Card entrance variants — gentle fade and drift */
  const cardVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: prefersReduced ? 0 : 14 },
      visible: { opacity: 1, y: 0 },
    }),
    [prefersReduced],
  );

  return (
    <section id="scents" className="relative overflow-hidden">
      <div
        className="py-16 md:py-24 lg:py-36 relative"
        style={{
          background:
            "linear-gradient(to bottom, #F5E1DC 0%, #F3DDD4 35%, #F5E1DC 65%, #F2D9CE 100%)",
        }}
        onClick={handleBackgroundClick}
      >
        {/* Layer 2: Flickering candlelight glow */}
        <ScentsFlickerGlow />

        {/* Layer 3: Rising aroma wisps */}
        <AromaWisps />

        {/* Layer 4: Grain texture (existing) */}
        <div className="absolute inset-0 grain" />

        {/* Layer 5: Content */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
          {/* Section header */}
          <AnimateIn className="text-center mb-10 md:mb-16 lg:mb-24">
            <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">
              The Collection
            </p>
            <h2 className="font-display text-burgundy text-4xl md:text-5xl lg:text-6xl mb-6">
              Our Signature Scents
            </h2>
            <WarmDivider variant="narrow" className="mb-8" />
            <p className="text-rose-gray max-w-2xl mx-auto text-lg leading-relaxed">
              From warm bakery comforts to bright fruity escapes — each
              fragrance is carefully selected and blended to fill your space
              with just&nbsp;the&nbsp;right&nbsp;mood.
            </p>
          </AnimateIn>

          {/* Price callout */}
          <AnimateIn className="text-center mb-16 md:mb-20">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-gold text-5xl md:text-6xl">
                  ${PRICES["8oz"]}
                </span>
                <span className="text-rose-gray text-sm tracking-widest uppercase">
                  8oz
                </span>
              </div>
              <div className="hidden sm:block w-px h-10 bg-gold/20" />
              <div className="flex items-baseline gap-2">
                <span className="font-display text-gold text-5xl md:text-6xl">
                  ${PRICES["16oz"]}
                </span>
                <span className="text-rose-gray text-sm tracking-widest uppercase">
                  16oz
                </span>
              </div>
            </div>
            <p className="text-rose-gray/60 text-sm mt-8">
              Coconut, paraffin-free soy &amp; beeswax blend &middot; {PRODUCT_DETAILS.wickType} &middot; {PRODUCT_DETAILS.burnTime} &middot; {PRODUCT_DETAILS.origin}
            </p>
          </AnimateIn>

          {/* Unified product grid — staggered entrance */}
          <div
            className="flex flex-wrap justify-center gap-5 md:gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            {SCENTS.map((scent, index) => (
              <motion.div
                key={scent.name}
                className="w-[calc(50%-0.625rem)] sm:w-[calc(50%-0.625rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(33.333%-1.125rem)] xl:w-[calc(25%-1.2rem)] 2xl:w-[calc(20%-1.286rem)]"
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: prefersReduced ? 0 : 1.4,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: prefersReduced ? 0 : getCardDelay(index, columnCount),
                }}
              >
                <ScentCard
                  scent={scent}
                  isActive={activeCardName === scent.name}
                  onActivate={() => setActiveCardName(scent.name)}
                  onDeactivate={() => setActiveCardName(null)}
                  available={inventory[scent.name] !== false}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
