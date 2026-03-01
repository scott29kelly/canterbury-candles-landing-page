"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from "motion/react";
import AnimateIn from "./AnimateIn";
import WarmDivider from "./WarmDivider";
import ThankYouCandleAnimation from "./ThankYouCandleAnimation";
import { useCart, PRICES, type CandleSize } from "@/context/CartContext";
import * as gtag from "@/lib/gtag";

// SSR-safe deterministic pseudo-random for particle positions
function seededRand(i: number): number {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// One-shot golden burst particles (celebration moment)
const BURST_PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  angle: (i / 28) * Math.PI * 2 + (seededRand(i) - 0.5) * 0.4,
  distance: 70 + seededRand(i + 50) * 90,
  size: 2 + seededRand(i + 100) * 2.5,
  delay: seededRand(i + 150) * 0.3,
  duration: 1 + seededRand(i + 200) * 0.8,
}));

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
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      style={{ backgroundColor: "rgba(45,34,38,0.92)" }}
    >
      {/* Warm ambient radial glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: isExiting ? 0 : 0.4, scale: isExiting ? 0.5 : 1 }}
        transition={{ duration: 1.2, delay: isExiting ? 0 : 0.2, ease: EASE }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 50% 60% at 50% 42%, rgba(184,134,11,0.18) 0%, rgba(224,122,32,0.07) 40%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: isExiting ? 0 : 1, scale: isExiting ? 0.95 : 1 }}
        transition={{ duration: 0.6, delay: isExiting ? 0 : 0.15, ease: EASE }}
        className="text-center px-6 relative"
      >
        {/* Premium candle animation (jar + lid reveal + flame + embers + heat) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="relative mx-auto mb-8 flex items-center justify-center"
        >
          <ThankYouCandleAnimation />

          {/* Golden shockwave ring — fires at ignition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: [0, 0.7, 0], scale: [0.2, 1.8, 2.5] }}
            transition={{ duration: 1.0, delay: 1.6, ease: "easeOut" }}
            className="absolute inset-0 pointer-events-none"
          >
            <svg className="w-full h-full overflow-visible" viewBox="0 0 180 300" aria-hidden="true">
              <circle
                cx="90" cy="120" r="35"
                fill="none"
                stroke="#D4A843"
                strokeWidth="1.5"
                strokeDasharray="220"
                strokeDashoffset="0"
                opacity="0.7"
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* Burst particles — radiate at ignition */}
        <div className="absolute left-1/2 top-0 pointer-events-none" style={{ marginTop: "5rem" }}>
          {BURST_PARTICLES.map((p, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, x: 0, y: 0, scale: 1 }}
              animate={{
                opacity: [0, 1, 0],
                x: Math.cos(p.angle) * p.distance,
                y: Math.sin(p.angle) * p.distance,
                scale: [1, 0.5, 0],
              }}
              transition={{
                duration: p.duration,
                delay: 1.7 + p.delay,
                ease: "easeOut",
              }}
              className="absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: "#D4A843",
                boxShadow: "0 0 4px rgba(212,168,67,0.6)",
              }}
            />
          ))}
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
          className="font-display text-gold text-4xl md:text-5xl mb-6"
        >
          Thank You
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: EASE }}
          className="text-parchment/80 text-lg leading-relaxed mb-8 max-w-md mx-auto"
        >
          We&apos;ve received your order request. We&apos;ll be in touch shortly
          to confirm your selections and arrange delivery.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9, ease: EASE }}
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
  const prefersReduced = useReducedMotion();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [submitMode, setSubmitMode] = useState<"order" | "message">("order");

  const hasMessage = messageText.trim().length > 0;
  const isMessageOnly = items.length === 0 && hasMessage;
  const canSubmit = (items.length > 0 || isMessageOnly) && !isSubmitting;

  // Promo code state
  const [promoInput, setPromoInput] = useState("");
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoLabel, setPromoLabel] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoApplying, setPromoApplying] = useState(false);

  const finalTotal = promoCode ? Math.max(0, totalPrice - promoDiscount) : totalPrice;

  // Re-validate discount when cart changes
  const revalidatePromo = useCallback(async (code: string, subtotal: number) => {
    if (!code || subtotal <= 0) {
      setPromoCode(null);
      setPromoDiscount(0);
      setPromoLabel("");
      return;
    }
    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setPromoDiscount(data.discountAmount);
        setPromoLabel(
          data.type === "percent" ? `${data.value}% off` : `$${data.value} off`
        );
      } else {
        setPromoCode(null);
        setPromoDiscount(0);
        setPromoLabel("");
      }
    } catch {
      // Keep existing discount on network error
    }
  }, []);

  useEffect(() => {
    if (promoCode) {
      revalidatePromo(promoCode, totalPrice);
    }
  }, [promoCode, totalPrice, revalidatePromo]);

  const handleApplyPromo = async () => {
    const code = promoInput.trim();
    if (!code) return;
    setPromoError(null);
    setPromoApplying(true);

    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal: totalPrice }),
      });
      const data = await res.json();

      if (data.valid) {
        setPromoCode(data.code);
        setPromoDiscount(data.discountAmount);
        setPromoLabel(
          data.type === "percent" ? `${data.value}% off` : `$${data.value} off`
        );
        setPromoInput("");
        setPromoError(null);
        gtag.applyPromoCode(data.code, data.discountAmount);
      } else {
        setPromoError(data.error || "Invalid promo code.");
        gtag.promoCodeError(code, data.error || "Invalid promo code.");
      }
    } catch {
      setPromoError("Failed to validate code. Please try again.");
      gtag.promoCodeError(code, "network_error");
    } finally {
      setPromoApplying(false);
    }
  };

  const handleRemovePromo = () => {
    if (promoCode) gtag.removePromoCode(promoCode);
    setPromoCode(null);
    setPromoDiscount(0);
    setPromoLabel("");
    setPromoError(null);
    setPromoInput("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    if (isMessageOnly) {
      // Message-only path
      setSubmitMode("message");
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.get("name"),
            email: formData.get("email"),
            message: messageText.trim(),
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error || "Something went wrong. Please try again.");
        }

        gtag.contactFormSubmit();
        setSubmitted(true);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
        gtag.contactFormError(message);
        setSubmitError(message);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Order path
    setSubmitMode("order");
    gtag.beginCheckout(finalTotal, totalItems);

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
          message: messageText.trim() || undefined,
          promoCode: promoCode || undefined,
          items,
          total: finalTotal,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Something went wrong. Please try again.");
      }

      const cartSummary = items.map((i) => `${i.scent} ${i.size} x${i.quantity}`).join(", ");
      gtag.purchase(finalTotal, cartSummary);
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
            confirm your order. Have a question? Just fill in your name, email, and a message below.
            <span className="block mt-1">
              <span className="text-gold font-medium">${PRICES["8oz"]} for 8oz</span>
              {" / "}
              <span className="text-gold font-medium">${PRICES["16oz"]} for 16oz</span>.
            </span>
          </p>
        </AnimateIn>

        {/* Success overlay — portaled to body (orders only) */}
        {submitted && submitMode === "order" && (
          <SuccessState
            onReset={() => {
              setSubmitted(false);
              setSubmitMode("order");
              dispatch({ type: "CLEAR_CART" });
              setSubmitError(null);
              setMessageText("");
              handleRemovePromo();
              document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        )}

        {/* Inline message-sent confirmation */}
        {submitted && submitMode === "message" && (
          <AnimateIn className="text-center py-12">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/10 mb-6">
              <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="font-display text-burgundy text-3xl md:text-4xl mb-4">
              Message Sent
            </h3>
            <p className="text-rose-gray text-lg leading-relaxed max-w-md mx-auto mb-8">
              We&apos;ve received your message and will get back to you soon.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setSubmitMode("order");
                setMessageText("");
                setSubmitError(null);
              }}
              className="text-gold text-sm tracking-widest uppercase hover:text-gold-light transition-colors duration-300 group inline-flex items-center gap-2"
            >
              <span className="w-4 h-px bg-gold group-hover:w-6 transition-all duration-300" />
              Send another message
            </button>
          </AnimateIn>
        )}

        {!(submitted && submitMode === "message") && (
        <AnimateIn>
          <form
            onSubmit={handleSubmit}
            className="space-y-8 md:space-y-10"
          >
                {/* Contact info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  <div>
                    <label htmlFor="name" className="block text-burgundy text-xs tracking-widest uppercase mb-3 font-medium">
                      Name {items.length === 0 && <span className="text-rose-gray normal-case tracking-normal font-normal">(optional)</span>}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required={items.length > 0}
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

                {/* Shipping address — hidden when cart is empty */}
                <AnimatePresence initial={false}>
                  {items.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
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
                    </motion.div>
                  )}
                </AnimatePresence>

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
                      <div className="pt-3 border-t border-charcoal/10 space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-rose-gray">
                            <span className="text-burgundy font-medium">{totalItems}</span>{" "}
                            item{totalItems !== 1 ? "s" : ""}
                          </span>
                          <AnimatePresence mode="wait">
                            {promoCode && promoDiscount > 0 ? (
                              <motion.span
                                key="discounted"
                                initial={prefersReduced ? false : { opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center gap-1.5"
                              >
                                <span className="text-rose-gray/40 line-through text-xs">${totalPrice}</span>
                                <span className="text-gold font-semibold">${finalTotal}</span>
                              </motion.span>
                            ) : (
                              <motion.span
                                key="regular"
                                initial={prefersReduced ? false : { opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ duration: 0.2 }}
                                className="text-gold font-semibold"
                              >
                                ${totalPrice}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>
                        <AnimatePresence>
                          {promoCode && promoDiscount > 0 && (
                            <motion.div
                              initial={prefersReduced ? false : { height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="flex items-center gap-1.5 text-xs text-gold/70">
                                <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                                </svg>
                                <span className="font-medium tracking-wide uppercase">{promoCode}</span>
                                <span>&middot;</span>
                                <span className="font-semibold text-gold">-${promoDiscount}</span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
                </div>

                {/* Promo code */}
                {items.length > 0 && (
                  <div>
                    <label className="block text-burgundy text-xs tracking-widest uppercase mb-3 font-medium">
                      Promo Code <span className="text-rose-gray normal-case tracking-normal font-normal">(optional)</span>
                    </label>
                    <AnimatePresence mode="wait">
                      {promoCode ? (
                        <motion.div
                          key="promo-success"
                          initial={prefersReduced ? false : { opacity: 0, scale: 0.97, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: -5 }}
                          transition={{ duration: prefersReduced ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
                          className="relative bg-gradient-to-br from-gold/[0.07] to-gold/[0.03] border border-gold/20 rounded-lg p-4 sm:p-5 overflow-hidden"
                        >
                          {/* Corner accents */}
                          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-gold/25" />
                          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-gold/25" />
                          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-gold/25" />
                          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-gold/25" />

                          {/* Card sheen */}
                          {!prefersReduced && (
                            <div className="absolute inset-0 z-[1] pointer-events-none card-sheen" />
                          )}

                          <div className="relative z-[2] flex items-start gap-3 sm:gap-4">
                            {/* Animated checkmark circle */}
                            <motion.div
                              initial={prefersReduced ? false : { scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={prefersReduced ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 20, delay: 0.15 }}
                              className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0 mt-0.5"
                            >
                              <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <motion.path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M4.5 12.75l6 6 9-13.5"
                                  initial={prefersReduced ? { pathLength: 1 } : { pathLength: 0 }}
                                  animate={{ pathLength: 1 }}
                                  transition={prefersReduced ? { duration: 0 } : { duration: 0.4, delay: 0.3, ease: "easeOut" }}
                                />
                              </svg>
                            </motion.div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium text-charcoal tracking-wide text-sm">{promoCode}</span>
                                <span className="bg-gold/10 text-gold text-xs font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full">
                                  {promoLabel}
                                </span>
                              </div>
                              {promoDiscount > 0 && (
                                <motion.p
                                  initial={prefersReduced ? false : { opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={prefersReduced ? { duration: 0 } : { duration: 0.3, delay: 0.4 }}
                                  className="text-sm mt-1.5"
                                >
                                  <span className="text-rose-gray">Saving </span>
                                  <span className="text-gold font-semibold">-${promoDiscount}</span>
                                  <span className="text-rose-gray"> on this order</span>
                                </motion.p>
                              )}
                            </div>

                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={handleRemovePromo}
                              className="text-charcoal/30 hover:text-red-500 hover:bg-red-500/5 rounded-full p-1 transition-colors duration-200 flex-shrink-0"
                              aria-label="Remove promo code"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="promo-input"
                          initial={prefersReduced ? false : { opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
                          transition={{ duration: prefersReduced ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <div className="flex items-center gap-3">
                            {/* Tag icon */}
                            <svg className="w-4 h-4 text-gold/40 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                            </svg>
                            <input
                              type="text"
                              value={promoInput}
                              onChange={(e) => {
                                setPromoInput(e.target.value);
                                if (promoError) setPromoError(null);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleApplyPromo();
                                }
                              }}
                              className="flex-1 bg-transparent border-0 border-b-2 border-charcoal/10 px-0 py-3 text-charcoal tracking-wide uppercase placeholder-rose-gray/40 placeholder:normal-case placeholder:tracking-normal transition-all duration-300 focus:border-gold focus:shadow-none"
                              placeholder="Enter code"
                            />
                            <motion.button
                              type="button"
                              onClick={handleApplyPromo}
                              disabled={promoApplying || !promoInput.trim() || totalPrice <= 0}
                              whileHover={prefersReduced ? {} : { scale: 1.02 }}
                              whileTap={prefersReduced ? {} : { scale: 0.98 }}
                              className="text-gold text-xs tracking-widest uppercase font-semibold border border-gold/30 rounded-full px-4 py-2 hover:border-gold hover:bg-gold/5 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gold/30 disabled:hover:bg-transparent flex-shrink-0 flex items-center gap-2"
                            >
                              {promoApplying ? (
                                <>
                                  <span className="w-3 h-3 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                                  Checking
                                </>
                              ) : (
                                "Apply"
                              )}
                            </motion.button>
                          </div>
                          <AnimatePresence>
                            {promoError && (
                              <motion.p
                                initial={prefersReduced ? false : { opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: prefersReduced ? 0 : 0.2 }}
                                className="text-red-600/80 text-xs mt-2 flex items-center gap-1.5 overflow-hidden"
                              >
                                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                </svg>
                                {promoError}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Message */}
                <div id="contact">
                  <label htmlFor="message" className="block text-burgundy text-xs tracking-widest uppercase mb-3 font-medium">
                    Message <span className="text-rose-gray normal-case tracking-normal font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="w-full bg-transparent border-0 border-b-2 border-charcoal/10 px-0 py-3 text-charcoal placeholder-rose-gray/40 transition-all duration-300 focus:border-gold focus:shadow-none resize-none"
                    placeholder="Order notes, custom requests, or any questions you may have..."
                  />
                  <AnimatePresence>
                    {items.length === 0 && hasMessage && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="text-gold/80 text-xs mt-2"
                      >
                        You can send a message without placing an order.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Error message */}
                {submitError && (
                  <p className="text-red-600 text-sm text-center">{submitError}</p>
                )}

                {/* Submit */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
                  <div className="text-rose-gray text-sm text-center sm:text-left">
                    {items.length > 0 ? (
                      <span className="inline-flex items-center gap-1 flex-wrap">
                        <span className="text-burgundy font-medium">
                          {totalItems}
                        </span>{" "}
                        candle{totalItems !== 1 ? "s" : ""} &middot;{" "}
                        <AnimatePresence mode="wait">
                          {promoCode && promoDiscount > 0 ? (
                            <motion.span
                              key="submit-discounted"
                              initial={prefersReduced ? false : { opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              transition={{ duration: 0.2 }}
                              className="inline-flex items-center gap-1"
                            >
                              <span className="text-rose-gray/40 line-through text-xs">${totalPrice}</span>
                              <span className="text-gold font-semibold">${finalTotal}</span>
                            </motion.span>
                          ) : (
                            <motion.span
                              key="submit-regular"
                              initial={prefersReduced ? false : { opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              transition={{ duration: 0.2 }}
                              className="text-gold font-semibold"
                            >
                              ${totalPrice}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        {" "}total
                      </span>
                    ) : hasMessage ? (
                      <span className="text-rose-gray/60">
                        Just a message &mdash; no items in cart
                      </span>
                    ) : (
                      <span className="text-rose-gray/60">
                        Add candles to order, or type a message below
                      </span>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="group btn-shimmer text-burgundy px-10 py-4 text-sm tracking-widest uppercase font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-gold/25 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:bg-charcoal/10 disabled:text-charcoal/30 disabled:bg-none"
                  >
                    <span className="flex items-center gap-3">
                      {isSubmitting
                        ? (isMessageOnly ? "Sending..." : "Submitting...")
                        : (isMessageOnly ? "Send Message" : "Submit Order")}
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
        )}
      </div>
    </section>
  );
}
