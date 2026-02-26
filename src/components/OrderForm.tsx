"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import AnimateIn from "./AnimateIn";
import WarmDivider from "./WarmDivider";
import { useCart, PRICES, type CandleSize } from "@/context/CartContext";
import * as gtag from "@/lib/gtag";

const EMBERS = [
  { delay: 0, duration: 2.2, x: -6, alt: false, size: 1.5 },
  { delay: 0.3, duration: 1.8, x: 4, alt: true, size: 1 },
  { delay: 0.7, duration: 2.5, x: -2, alt: false, size: 2 },
  { delay: 1.0, duration: 2.0, x: 8, alt: true, size: 1.5 },
  { delay: 0.5, duration: 2.3, x: -8, alt: false, size: 1 },
  { delay: 1.3, duration: 1.9, x: 2, alt: true, size: 2 },
  { delay: 0.2, duration: 2.6, x: -4, alt: false, size: 1 },
  { delay: 0.8, duration: 2.1, x: 6, alt: true, size: 1.5 },
  { delay: 1.1, duration: 2.4, x: 0, alt: false, size: 2 },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function SuccessState({ onReset }: { onReset: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleReset = () => {
    setIsExiting(true);
    setTimeout(() => {
      document.body.style.overflow = "";
      onReset();
    }, 500);
  };

  if (!mounted) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: isExiting ? 0 : 1, scale: isExiting ? 0.95 : 1 }}
        transition={{ duration: 0.6, delay: isExiting ? 0 : 0.2, ease: EASE }}
        className="text-center px-6 relative"
      >
        {/* Flame with embers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          className="relative w-24 h-32 mx-auto mb-8"
        >
          {/* Ember particles */}
          {EMBERS.map((e, i) => (
            <span
              key={i}
              className="absolute left-1/2 bottom-1/3 rounded-full"
              style={{
                width: e.size,
                height: e.size,
                backgroundColor: e.alt ? "#E8C96A" : "#FFEBBC",
                animation: `${e.alt ? "ember-rise-alt" : "ember-rise"} ${e.duration}s ${e.delay}s ease-out infinite`,
                marginLeft: e.x,
              }}
            />
          ))}

          {/* Premium flame SVG with feTurbulence distortion */}
          <svg
            className="absolute inset-0 w-full h-full overflow-visible"
            viewBox="0 0 48 64"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              {/* Turbulence filters — each layer gets different noise */}
              <filter id="flame-distort-outer" x="-20%" y="-10%" width="140%" height="120%">
                <feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="3" result="noise" seed="1">
                  <animate attributeName="baseFrequency" dur="4s" values="0.04;0.06;0.04" repeatCount="indefinite" />
                </feTurbulence>
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" />
              </filter>
              <filter id="flame-distort-middle" x="-15%" y="-10%" width="130%" height="120%">
                <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="3" result="noise" seed="2">
                  <animate attributeName="baseFrequency" dur="3.3s" values="0.05;0.07;0.05" repeatCount="indefinite" />
                </feTurbulence>
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
              </filter>
              <filter id="flame-distort-inner" x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence type="turbulence" baseFrequency="0.06" numOctaves="2" result="noise" seed="3">
                  <animate attributeName="baseFrequency" dur="2.7s" values="0.06;0.08;0.06" repeatCount="indefinite" />
                </feTurbulence>
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
              </filter>
              <filter id="flame-glow-blur">
                <feGaussianBlur stdDeviation="6" />
              </filter>

              {/* Flame gradients */}
              <linearGradient id="grad-outer" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="#F0B840" />
                <stop offset="50%" stopColor="#C0501A" />
                <stop offset="100%" stopColor="#6B1E2E" />
              </linearGradient>
              <linearGradient id="grad-middle" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="#FFD96A" />
                <stop offset="100%" stopColor="#E07A20" />
              </linearGradient>
              <linearGradient id="grad-inner" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="#FFF8E8" />
                <stop offset="100%" stopColor="#FFD06A" />
              </linearGradient>
            </defs>

            {/* Layer 1: Ambient glow */}
            <ellipse
              cx="24" cy="38" rx="16" ry="20"
              fill="#F0B840" opacity="0.15"
              filter="url(#flame-glow-blur)"
              style={{ animation: "flame-glow-breathe 3s ease-in-out infinite" }}
            />

            {/* Layer 2: Outer flame */}
            <path
              d="M24 4C24 4 8 28 8 40C8 49 15 56 24 56C33 56 40 49 40 40C40 28 24 4 24 4Z"
              fill="url(#grad-outer)"
              filter="url(#flame-distort-outer)"
              style={{
                transformBox: "fill-box",
                transformOrigin: "center bottom",
                animation: "flame-outer-sway 3.7s ease-in-out infinite",
              }}
            />

            {/* Layer 3: Middle flame */}
            <path
              d="M24 14C24 14 14 32 14 42C14 48 18 52 24 52C30 52 34 48 34 42C34 32 24 14 24 14Z"
              fill="url(#grad-middle)"
              filter="url(#flame-distort-middle)"
              style={{
                transformBox: "fill-box",
                transformOrigin: "center bottom",
                animation: "flame-middle-sway 2.9s ease-in-out infinite",
              }}
            />

            {/* Layer 4: Inner flame */}
            <path
              d="M24 22C24 22 18 35 18 43C18 46 21 49 24 49C27 49 30 46 30 43C30 35 24 22 24 22Z"
              fill="url(#grad-inner)"
              filter="url(#flame-distort-inner)"
              style={{
                transformBox: "fill-box",
                transformOrigin: "center bottom",
                animation: "flame-inner-sway 2.3s ease-in-out infinite",
              }}
            />

            {/* Layer 5: Bright core */}
            <ellipse
              cx="24" cy="44" rx="4" ry="6"
              fill="#FFF8E8" opacity="0.9"
              style={{ animation: "flame-core-pulse 1.8s ease-in-out infinite" }}
            />
          </svg>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
          className="font-display text-gold text-4xl md:text-5xl mb-6"
        >
          Thank You
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
          className="text-parchment/80 text-lg leading-relaxed mb-8 max-w-md mx-auto"
        >
          We&apos;ve received your order request. We&apos;ll be in touch shortly
          to confirm your selections and arrange delivery.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: EASE }}
          onClick={() => {
            gtag.reorderClick();
            handleReset();
          }}
          className="text-gold text-sm tracking-widest uppercase hover:text-gold-light transition-colors duration-300 group inline-flex items-center gap-2"
        >
          <span className="w-4 h-px bg-gold group-hover:w-6 transition-all duration-300" />
          Place another order
        </motion.button>
      </motion.div>
    </motion.div>,
    document.body
  );
}

function CartItemRow({
  item,
}: {
  item: { scent: string; size: CandleSize; quantity: number };
}) {
  const { dispatch, getScentImage } = useCart();
  const image = getScentImage(item.scent);
  const lineTotal = PRICES[item.size] * item.quantity;

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center flex-wrap gap-x-3 gap-y-1.5 md:gap-4 py-3 first:pt-0 last:pb-0"
    >
      {/* Thumbnail */}
      {image && (
        <div className="relative w-10 h-[53px] rounded overflow-hidden flex-shrink-0 bg-parchment">
          <Image
            src={image}
            alt={item.scent}
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
      )}

      {/* Name */}
      <span className="font-display text-charcoal text-sm flex-1 min-w-0 truncate">
        {item.scent}
      </span>

      <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
        {/* Size toggle pills */}
        <div className="flex rounded-full border border-gold/30 overflow-hidden text-[11px] font-medium leading-none">
          <button
            type="button"
            onClick={() => {
              if (item.size !== "8oz") {
                gtag.changeItemSize(item.scent, item.size, "8oz");
                dispatch({ type: "CHANGE_SIZE", scent: item.scent, fromSize: item.size, toSize: "8oz" });
              }
            }}
            className={`px-2.5 py-1.5 transition-colors duration-200 ${
              item.size === "8oz"
                ? "bg-gold text-burgundy"
                : "text-rose-gray hover:text-gold"
            }`}
          >
            8oz
          </button>
          <button
            type="button"
            onClick={() => {
              if (item.size !== "16oz") {
                gtag.changeItemSize(item.scent, item.size, "16oz");
                dispatch({ type: "CHANGE_SIZE", scent: item.scent, fromSize: item.size, toSize: "16oz" });
              }
            }}
            className={`px-2.5 py-1.5 transition-colors duration-200 ${
              item.size === "16oz"
                ? "bg-gold text-burgundy"
                : "text-rose-gray hover:text-gold"
            }`}
          >
            16oz
          </button>
        </div>

        {/* Quantity controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              if (item.quantity <= 1) {
                dispatch({
                  type: "REMOVE_ITEM",
                  scent: item.scent,
                  size: item.size,
                });
              } else {
                dispatch({
                  type: "CHANGE_QUANTITY",
                  scent: item.scent,
                  size: item.size,
                  delta: -1,
                });
              }
            }}
            className="w-7 h-7 rounded-full border border-charcoal/15 text-charcoal/60 hover:border-gold hover:text-gold transition-colors duration-200 flex items-center justify-center text-sm"
          >
            &minus;
          </button>
          <span className="w-6 text-center text-sm text-charcoal font-medium tabular-nums">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() =>
              dispatch({
                type: "CHANGE_QUANTITY",
                scent: item.scent,
                size: item.size,
                delta: 1,
              })
            }
            className="w-7 h-7 rounded-full border border-charcoal/15 text-charcoal/60 hover:border-gold hover:text-gold transition-colors duration-200 flex items-center justify-center text-sm"
          >
            +
          </button>
        </div>

        {/* Line total */}
        <span className="text-gold font-semibold text-sm w-14 text-right tabular-nums">
          ${lineTotal}
        </span>

        {/* Remove button */}
        <button
          type="button"
          onClick={() => {
            gtag.removeFromCart(item.scent, item.size);
            dispatch({ type: "REMOVE_ITEM", scent: item.scent, size: item.size });
          }}
          className="w-7 h-7 rounded-full text-charcoal/30 hover:text-red-500 hover:bg-red-50 transition-colors duration-200 hidden sm:flex items-center justify-center"
          aria-label={`Remove ${item.scent} ${item.size}`}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

function PhoneInput() {
  const [phone, setPhone] = useState("");

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length === 0) return "";
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  return (
    <input
      type="tel"
      id="phone"
      name="phone"
      value={phone}
      onChange={(e) => setPhone(formatPhone(e.target.value))}
      className="w-full bg-transparent border-0 border-b-2 border-charcoal/10 px-0 py-3 text-charcoal placeholder-rose-gray/40 transition-all duration-300 focus:border-gold focus:shadow-none"
      placeholder="(555) 123-4567"
    />
  );
}

export default function OrderForm() {
  const { items, dispatch, totalItems, totalPrice } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    gtag.beginCheckout(totalPrice, totalItems);

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone") || undefined,
          addressLine1: formData.get("addressLine1"),
          addressLine2: formData.get("addressLine2") || undefined,
          city: formData.get("city"),
          state: formData.get("state"),
          zip: formData.get("zip"),
          message: formData.get("message") || undefined,
          items,
          total: totalPrice,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Something went wrong. Please try again.");
      }

      const cartSummary = items.map((i) => `${i.scent} ${i.size} x${i.quantity}`).join(", ");
      gtag.purchase(totalPrice, cartSummary);
      setSubmitted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      gtag.orderError(message);
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="order" className="py-16 md:py-24 lg:py-36 bg-parchment relative overflow-hidden">
      {/* Texture */}
      <div className="absolute inset-0 grain" />

      {/* Decorative corner accents */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-gold/10 hidden lg:block" />
      <div className="absolute top-8 right-8 w-16 h-16 border-t border-r border-gold/10 hidden lg:block" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b border-l border-gold/10 hidden lg:block" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-gold/10 hidden lg:block" />

      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section header */}
        <AnimateIn className="text-center mb-10 md:mb-16 lg:mb-20">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">
            Get Yours
          </p>
          <h2 className="font-display text-burgundy text-4xl md:text-5xl lg:text-6xl mb-6">
            Place an Order
          </h2>
          <WarmDivider variant="narrow" className="mb-8" />
          <p className="text-rose-gray max-w-xl mx-auto text-lg leading-relaxed">
            Select your favorite scents above and we&apos;ll get back to you to
            confirm your order.
            <span className="block mt-1">
              <span className="text-gold font-medium">${PRICES["8oz"]} for 8oz</span>
              {" / "}
              <span className="text-gold font-medium">${PRICES["16oz"]} for 16oz</span>.
            </span>
          </p>
        </AnimateIn>

        {/* Success overlay — portaled to body */}
        {submitted && (
          <SuccessState
            onReset={() => {
              setSubmitted(false);
              dispatch({ type: "CLEAR_CART" });
              setSubmitError(null);
              document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        )}

        <AnimateIn>
          <form
            onSubmit={handleSubmit}
            className="space-y-8 md:space-y-10"
          >
                {/* Contact info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  <div>
                    <label htmlFor="name" className="block text-burgundy text-xs tracking-widest uppercase mb-3 font-medium">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full bg-transparent border-0 border-b-2 border-charcoal/10 px-0 py-3 text-charcoal placeholder-rose-gray/40 transition-all duration-300 focus:border-gold focus:shadow-none"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-burgundy text-xs tracking-widest uppercase mb-3 font-medium">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full bg-transparent border-0 border-b-2 border-charcoal/10 px-0 py-3 text-charcoal placeholder-rose-gray/40 transition-all duration-300 focus:border-gold focus:shadow-none"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="min-w-[14rem]">
                    <label htmlFor="phone" className="block text-burgundy text-xs tracking-widest uppercase mb-3 font-medium">
                      Phone <span className="text-rose-gray normal-case tracking-normal font-normal">(optional)</span>
                    </label>
                    <PhoneInput />
                  </div>
                </div>

                {/* Shipping address */}
                <div className="space-y-6">
                  <h3 className="text-burgundy text-xs tracking-widest uppercase mb-3 font-medium">
                    Shipping Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_9rem] gap-6 md:gap-8">
                    <div>
                      <label htmlFor="addressLine1" className="sr-only">Street address</label>
                      <input
                        type="text"
                        id="addressLine1"
                        name="addressLine1"
                        autoComplete="street-address"
                        className="w-full bg-transparent border-0 border-b-2 border-charcoal/10 px-0 py-3 text-charcoal placeholder-rose-gray/40 transition-all duration-300 focus:border-gold focus:shadow-none"
                        placeholder="Street address"
                      />
                    </div>
                    <div>
                      <label htmlFor="addressLine2" className="sr-only">Apt, suite, unit</label>
                      <input
                        type="text"
                        id="addressLine2"
                        name="addressLine2"
                        autoComplete="address-line2"
                        className="w-full bg-transparent border-0 border-b-2 border-charcoal/10 px-0 py-3 text-charcoal placeholder-rose-gray/40 transition-all duration-300 focus:border-gold focus:shadow-none"
                        placeholder="Apt, suite"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6 md:gap-8">
                    <div>
                      <label htmlFor="city" className="sr-only">City</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        autoComplete="address-level2"
                        className="w-full bg-transparent border-0 border-b-2 border-charcoal/10 px-0 py-3 text-charcoal placeholder-rose-gray/40 transition-all duration-300 focus:border-gold focus:shadow-none"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="sr-only">State</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        autoComplete="address-level1"
                        className="w-full bg-transparent border-0 border-b-2 border-charcoal/10 px-0 py-3 text-charcoal placeholder-rose-gray/40 transition-all duration-300 focus:border-gold focus:shadow-none"
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <label htmlFor="zip" className="sr-only">ZIP code</label>
                      <input
                        type="text"
                        id="zip"
                        name="zip"
                        inputMode="numeric"
                        autoComplete="postal-code"
                        className="w-full bg-transparent border-0 border-b-2 border-charcoal/10 px-0 py-3 text-charcoal placeholder-rose-gray/40 transition-all duration-300 focus:border-gold focus:shadow-none"
                        placeholder="ZIP"
                      />
                    </div>
                  </div>
                </div>

                {/* Visual cart summary */}
                <div id="cart">
                  <label className="block text-burgundy text-xs tracking-widest uppercase mb-4 font-medium">
                    Your Cart
                  </label>

                  {items.length === 0 ? (
                    <div className="border border-charcoal/10 rounded-lg p-8 text-center">
                      <svg
                        className="w-10 h-10 mx-auto mb-3 text-charcoal/20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <p className="text-rose-gray/60 text-sm mb-2">
                        Your cart is empty
                      </p>
                      <a
                        href="#scents"
                        onClick={() => gtag.ctaClick("browse_scents")}
                        className="text-gold text-sm tracking-wider uppercase hover:text-gold-light transition-colors duration-200"
                      >
                        Browse scents &rarr;
                      </a>
                    </div>
                  ) : (
                    <div className="border border-gold/15 rounded-lg p-3 sm:p-5 md:p-6 space-y-1">
                      <LayoutGroup>
                        <div className="divide-y divide-charcoal/5">
                          <AnimatePresence initial={false}>
                            {items.map((item) => (
                              <CartItemRow
                                key={`${item.scent}::${item.size}`}
                                item={item}
                              />
                            ))}
                          </AnimatePresence>
                        </div>
                      </LayoutGroup>
                      <div className="pt-3 border-t border-charcoal/10">
                        <p className="text-sm text-rose-gray">
                          <span className="text-burgundy font-medium">{totalItems}</span>{" "}
                          item{totalItems !== 1 ? "s" : ""} &middot;{" "}
                          <span className="text-gold font-semibold">${totalPrice}</span> total
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Special instructions */}
                <div>
                  <label htmlFor="message" className="block text-burgundy text-xs tracking-widest uppercase mb-3 font-medium">
                    Special Instructions <span className="text-rose-gray normal-case tracking-normal font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    className="w-full bg-transparent border-0 border-b-2 border-charcoal/10 px-0 py-3 text-charcoal placeholder-rose-gray/40 transition-all duration-300 focus:border-gold focus:shadow-none resize-none"
                    placeholder="Any special requests, delivery preferences, or questions..."
                  />
                </div>

                {/* Error message */}
                {submitError && (
                  <p className="text-red-600 text-sm text-center">{submitError}</p>
                )}

                {/* Submit */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
                  <div className="text-rose-gray text-sm text-center sm:text-left">
                    {items.length > 0 ? (
                      <span>
                        <span className="text-burgundy font-medium">
                          {totalItems}
                        </span>{" "}
                        candle{totalItems !== 1 ? "s" : ""} &middot;{" "}
                        <span className="text-gold font-semibold">
                          ${totalPrice}
                        </span>{" "}
                        total
                      </span>
                    ) : (
                      <span className="text-rose-gray/60">
                        Select at least one scent to continue
                      </span>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={items.length === 0 || isSubmitting}
                    className="group btn-shimmer text-burgundy px-10 py-4 text-sm tracking-widest uppercase font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-gold/25 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:bg-charcoal/10 disabled:text-charcoal/30 disabled:bg-none"
                  >
                    <span className="flex items-center gap-3">
                      {isSubmitting ? "Submitting..." : "Submit Order"}
                      {!isSubmitting && (
                        <svg
                          className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      )}
                    </span>
                  </button>
                </div>
          </form>
        </AnimateIn>
      </div>
    </section>
  );
}
