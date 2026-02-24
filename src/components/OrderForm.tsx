"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import AnimateIn from "./AnimateIn";
import WarmDivider from "./WarmDivider";
import { useCart, PRICES, type CandleSize } from "@/context/CartContext";
import * as gtag from "@/lib/gtag";

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="text-center py-12"
    >
      {/* Gold sparkle */}
      <div className="relative w-20 h-20 mx-auto mb-8">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className="absolute w-2 h-2 bg-gold rounded-full"
            style={{
              top: "50%",
              left: "50%",
              animation: `sparkle 1.5s ${i * 0.25}s ease-in-out infinite`,
              transform: `rotate(${i * 60}deg) translateY(-28px)`,
            }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-gold text-4xl font-display">&#10043;</span>
        </div>
      </div>

      <h2 className="font-display text-burgundy text-4xl md:text-5xl mb-6">
        Thank You
      </h2>
      <p className="text-rose-gray text-lg leading-relaxed mb-8 max-w-md mx-auto">
        We&apos;ve received your order request. We&apos;ll be in touch shortly
        to confirm your selections and arrange delivery.
      </p>
      <button
        onClick={() => {
          gtag.reorderClick();
          onReset();
        }}
        className="text-gold text-sm tracking-widest uppercase hover:text-gold-light transition-colors duration-300 group inline-flex items-center gap-2"
      >
        <span className="w-4 h-px bg-gold group-hover:w-6 transition-all duration-300" />
        Place another order
      </button>
    </motion.div>
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

        <AnimateIn>
          <AnimatePresence mode="wait">
            {submitted ? (
              <SuccessState
                key="success"
                onReset={() => {
                  setSubmitted(false);
                  dispatch({ type: "CLEAR_CART" });
                  setSubmitError(null);
                }}
              />
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-8 md:space-y-10"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
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
              </motion.form>
            )}
          </AnimatePresence>
        </AnimateIn>
      </div>
    </section>
  );
}
