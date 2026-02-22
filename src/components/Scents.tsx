"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import AnimateIn from "./AnimateIn";
import WarmDivider from "./WarmDivider";
import { SCENTS, PRICES, PRODUCT_DETAILS, type Scent } from "@/data/products";
import { useCart, type CandleSize } from "@/context/CartContext";
import { useInventory } from "@/hooks/useInventory";
import * as gtag from "@/lib/gtag";

const EASE = [0.16, 1, 0.3, 1] as const;

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

  return (
    <div className={`group relative${!available ? " opacity-50" : ""}`}>
      {/* Candlelight hover glow — warm bloom behind card */}
      {available && (
        <div className="hidden md:block absolute -inset-3 z-0 rounded-xl bg-[radial-gradient(ellipse_at_center,_rgba(212,168,67,0.35)_0%,_rgba(184,134,11,0.15)_40%,_transparent_70%)] opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-out pointer-events-none" style={{ filter: "blur(20px)" }} />
      )}
      {/* Image */}
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
          className={`object-cover transition-all duration-700${available ? " group-hover:scale-105 group-hover:brightness-[1.03] group-hover:saturate-[1.05]" : " grayscale"}`}
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

        {/* Glass-morphism hover overlay — hidden when card is active or sold out */}
        {!isActive && available && (
          <div className="hidden md:block absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
            <div className="bg-burgundy/80 backdrop-blur-md p-4">
              <p className="text-blush/80 text-sm leading-relaxed">
                {scent.notes}
              </p>
            </div>
          </div>
        )}

        {/* Permanent gradient at bottom for text readability (desktop only, hidden when active or sold out) */}
        {!isActive && available && (
          <div className="hidden md:block absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent group-hover:opacity-0 transition-opacity duration-500" />
        )}

        {/* Cart indicator badge — shown when NOT active and scent is in cart */}
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
        <h3 className={`font-display text-base md:text-lg leading-tight transition-colors duration-300${available ? " text-burgundy group-hover:text-gold" : " text-burgundy/50"}`}>
          {scent.name}
        </h3>
        {/* Scent notes visible on mobile, hidden on desktop (shown via hover overlay) */}
        <p className="md:hidden text-rose-gray text-xs mt-1 leading-relaxed">
          {scent.notes}
        </p>
      </div>
    </div>
  );
}

export default function Scents() {
  const [activeCardName, setActiveCardName] = useState<string | null>(null);
  const inventory = useInventory();

  const handleBackgroundClick = useCallback(() => {
    setActiveCardName(null);
  }, []);

  return (
    <section id="scents" className="relative overflow-hidden">
      <div
        className="py-16 md:py-24 lg:py-36 bg-blush relative"
        onClick={handleBackgroundClick}
      >
        <div className="absolute inset-0 grain" />
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

          {/* Unified product grid */}
          <div
            className="flex flex-wrap justify-center gap-5 md:gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            {SCENTS.map((scent) => (
              <AnimateIn
                key={scent.name}
                variant="fadeUp"
                className="w-[calc(50%-0.625rem)] sm:w-[calc(50%-0.625rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(33.333%-1.125rem)] xl:w-[calc(25%-1.2rem)] 2xl:w-[calc(20%-1.286rem)]"
              >
                <ScentCard
                  scent={scent}
                  isActive={activeCardName === scent.name}
                  onActivate={() => setActiveCardName(scent.name)}
                  onDeactivate={() => setActiveCardName(null)}
                  available={inventory[scent.name] !== false}
                />
              </AnimateIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
