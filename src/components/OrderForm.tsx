"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import AnimateIn from "./AnimateIn";
import { SCENT_NAMES, PRICES, type CandleSize } from "@/data/products";

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
        onClick={onReset}
        className="text-gold text-sm tracking-widest uppercase hover:text-gold-light transition-colors duration-300 group inline-flex items-center gap-2"
      >
        <span className="w-4 h-px bg-gold group-hover:w-6 transition-all duration-300" />
        Place another order
      </button>
    </motion.div>
  );
}

export interface LineItem {
  scent: string;
  size: CandleSize;
  quantity: number;
}

export default function OrderForm() {
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [activeScentPicker, setActiveScentPicker] = useState<string | null>(null);

  const addToCart = (scent: string, size: CandleSize) => {
    setLineItems((prev) => {
      const existing = prev.find(
        (item) => item.scent === scent && item.size === size
      );
      if (existing) {
        return prev.map((item) =>
          item.scent === scent && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { scent, size, quantity: 1 }];
    });
    setActiveScentPicker(null);
  };

  const removeFromCart = (scent: string, size: CandleSize) => {
    setLineItems((prev) =>
      prev.filter((item) => !(item.scent === scent && item.size === size))
    );
  };

  const changeSize = (scent: string, fromSize: CandleSize, toSize: CandleSize) => {
    if (fromSize === toSize) return;
    setLineItems((prev) => {
      const target = prev.find(
        (item) => item.scent === scent && item.size === toSize
      );
      if (target) {
        const source = prev.find(
          (item) => item.scent === scent && item.size === fromSize
        );
        return prev
          .map((item) => {
            if (item.scent === scent && item.size === toSize) {
              return { ...item, quantity: item.quantity + (source?.quantity ?? 0) };
            }
            return item;
          })
          .filter((item) => !(item.scent === scent && item.size === fromSize));
      }
      return prev.map((item) =>
        item.scent === scent && item.size === fromSize
          ? { ...item, size: toSize }
          : item
      );
    });
  };

  const changeQuantity = (scent: string, size: CandleSize, delta: number) => {
    setLineItems((prev) =>
      prev.map((item) =>
        item.scent === scent && item.size === size
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const totalItems = lineItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = lineItems.reduce(
    (sum, item) => sum + PRICES[item.size] * item.quantity,
    0
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone") || undefined,
          address: formData.get("address") || undefined,
          message: formData.get("message") || undefined,
          items: lineItems,
          total: totalPrice,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Something went wrong. Please try again.");
      }

      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
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
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8" />
          <p className="text-rose-gray max-w-xl mx-auto text-lg leading-relaxed">
            Select your favorite scents below and we&apos;ll get back to you to
            confirm your order.{" "}
            <span className="text-gold font-medium">${PRICES["8oz"]} for 8oz</span> /{" "}
            <span className="text-gold font-medium">${PRICES["16oz"]} for 16oz</span>.
          </p>
        </AnimateIn>

        <AnimateIn>
          <AnimatePresence mode="wait">
            {submitted ? (
              <SuccessState
                key="success"
                onReset={() => {
                  setSubmitted(false);
                  setLineItems([]);
                  setSubmitError(null);
                  setActiveScentPicker(null);
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
                {/* Contact info — underline-only inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-burgundy text-xs tracking-widest uppercase mb-3 font-medium"
                    >
                      Name
                    </label>
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
                    <label
                      htmlFor="email"
                      className="block text-burgundy text-xs tracking-widest uppercase mb-3 font-medium"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full bg-transparent border-0 border-b-2 border-charcoal/10 px-0 py-3 text-charcoal placeholder-rose-gray/40 transition-all duration-300 focus:border-gold focus:shadow-none"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-burgundy text-xs tracking-widest uppercase mb-3 font-medium"
                  >
                    Phone{" "}
                    <span className="text-rose-gray normal-case tracking-normal font-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full bg-transparent border-0 border-b-2 border-charcoal/10 px-0 py-3 text-charcoal placeholder-rose-gray/40 transition-all duration-300 focus:border-gold focus:shadow-none"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-burgundy text-xs tracking-widest uppercase mb-3 font-medium"
                  >
                    Mailing Address{" "}
                    <span className="text-rose-gray normal-case tracking-normal font-normal">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    className="w-full bg-transparent border-0 border-b-2 border-charcoal/10 px-0 py-3 text-charcoal placeholder-rose-gray/40 transition-all duration-300 focus:border-gold focus:shadow-none resize-none"
                    placeholder="Street, city, state, ZIP"
                  />
                </div>

                {/* Scent selection — pill/chip buttons */}
                <div>
                  <label className="block text-burgundy text-xs tracking-widest uppercase mb-2 font-medium">
                    Select Your Scents
                  </label>
                  {lineItems.length > 0 && (
                    <p className="text-gold text-sm mb-4">
                      {totalItems} item{totalItems !== 1 ? "s" : ""} &middot; ${totalPrice} total
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2.5">
                    {SCENT_NAMES.map((scent) => {
                      const scentQty = lineItems
                        .filter((item) => item.scent === scent)
                        .reduce((sum, item) => sum + item.quantity, 0);
                      const inCart = scentQty > 0;
                      const pickerOpen = activeScentPicker === scent;
                      return (
                        <div key={scent} className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveScentPicker(pickerOpen ? null : scent)
                            }
                            className={`px-4 py-2.5 rounded-full text-sm transition-all duration-300 ${
                              inCart
                                ? "bg-burgundy text-blush border border-burgundy shadow-md shadow-burgundy/20"
                                : "bg-transparent text-charcoal border border-charcoal/15 hover:border-gold hover:text-gold"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              {inCart ? (
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gold text-burgundy text-[11px] font-bold leading-none">
                                  {scentQty}
                                </span>
                              ) : (
                                <svg
                                  className="w-3.5 h-3.5 opacity-40"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 5v14M5 12h14" />
                                </svg>
                              )}
                              {scent}
                            </span>
                          </button>
                          {/* Size picker dropdown */}
                          {pickerOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setActiveScentPicker(null)}
                              />
                              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-20 bg-white rounded-lg shadow-lg shadow-charcoal/10 border border-gold/20 p-1.5 flex gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => addToCart(scent, "8oz")}
                                  className="px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap text-charcoal hover:bg-gold/10 hover:text-gold transition-colors duration-200"
                                >
                                  8oz &middot; ${PRICES["8oz"]}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => addToCart(scent, "16oz")}
                                  className="px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap text-charcoal hover:bg-gold/10 hover:text-gold transition-colors duration-200"
                                >
                                  16oz &middot; ${PRICES["16oz"]}
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Cart summary */}
                {lineItems.length > 0 && (
                  <div className="border border-gold/15 rounded-lg p-5 md:p-6 space-y-4">
                    <h3 className="text-burgundy text-xs tracking-widest uppercase font-medium">
                      Your Cart
                    </h3>
                    <div className="divide-y divide-charcoal/5">
                      {lineItems.map((item) => (
                        <div
                          key={`${item.scent}::${item.size}`}
                          className="flex flex-col sm:flex-row sm:items-center gap-3 py-3 first:pt-0 last:pb-0"
                        >
                          {/* Scent name */}
                          <span className="text-charcoal text-sm font-medium flex-1 min-w-0">
                            {item.scent}
                          </span>

                          <div className="flex items-center gap-3 flex-wrap">
                            {/* Size toggle */}
                            <div className="flex rounded-full border border-gold/30 overflow-hidden text-[11px] font-medium leading-none">
                              <button
                                type="button"
                                onClick={() => changeSize(item.scent, item.size, "8oz")}
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
                                onClick={() => changeSize(item.scent, item.size, "16oz")}
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
                                onClick={() => changeQuantity(item.scent, item.size, -1)}
                                disabled={item.quantity <= 1}
                                className="w-7 h-7 rounded-full border border-charcoal/15 text-charcoal/60 hover:border-gold hover:text-gold transition-colors duration-200 flex items-center justify-center text-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-charcoal/15 disabled:hover:text-charcoal/60"
                              >
                                &minus;
                              </button>
                              <span className="w-6 text-center text-sm text-charcoal font-medium tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => changeQuantity(item.scent, item.size, 1)}
                                className="w-7 h-7 rounded-full border border-charcoal/15 text-charcoal/60 hover:border-gold hover:text-gold transition-colors duration-200 flex items-center justify-center text-sm"
                              >
                                +
                              </button>
                            </div>

                            {/* Line total */}
                            <span className="text-gold font-semibold text-sm w-14 text-right tabular-nums">
                              ${PRICES[item.size] * item.quantity}
                            </span>

                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.scent, item.size)}
                              className="w-7 h-7 rounded-full text-charcoal/30 hover:text-red-500 hover:bg-red-50 transition-colors duration-200 flex items-center justify-center"
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
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Special instructions */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-burgundy text-xs tracking-widest uppercase mb-3 font-medium"
                  >
                    Special Instructions{" "}
                    <span className="text-rose-gray normal-case tracking-normal font-normal">
                      (optional)
                    </span>
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
                    {lineItems.length > 0 ? (
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
                    disabled={lineItems.length === 0 || isSubmitting}
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
