"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import AnimateIn from "./AnimateIn";

const allScents = [
  "Aspen Woods",
  "Blueberry Muffins",
  "Blueberry Pancakes",
  "Cherry Cheesecake",
  "Espresso",
  "Fruit Loops",
  "Glazed Donuts",
  "Gingerbread",
  "Lemon Pound Cake",
  "Pumpkin Pecan Waffles",
  "Snickerdoodle",
  "Spring Flowers",
  "Strawberry Pound Cake",
  "Watermelon Lemonade",
];

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

export default function OrderForm() {
  const [selectedScents, setSelectedScents] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleScent = (scent: string) => {
    setSelectedScents((prev) =>
      prev.includes(scent) ? prev.filter((s) => s !== scent) : [...prev, scent]
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
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
            confirm your order. Each candle is{" "}
            <span className="text-gold font-medium">$14</span>.
          </p>
        </AnimateIn>

        <AnimateIn>
          <AnimatePresence mode="wait">
            {submitted ? (
              <SuccessState
                key="success"
                onReset={() => {
                  setSubmitted(false);
                  setSelectedScents([]);
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

                {/* Scent selection — pill/chip buttons */}
                <div>
                  <label className="block text-burgundy text-xs tracking-widest uppercase mb-2 font-medium">
                    Select Your Scents
                  </label>
                  {selectedScents.length > 0 && (
                    <p className="text-gold text-sm mb-4">
                      {selectedScents.length} selected &middot; $
                      {selectedScents.length * 14} total
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2.5">
                    {allScents.map((scent) => {
                      const isSelected = selectedScents.includes(scent);
                      return (
                        <button
                          key={scent}
                          type="button"
                          onClick={() => toggleScent(scent)}
                          className={`px-4 py-2.5 rounded-full text-sm transition-all duration-300 ${
                            isSelected
                              ? "bg-burgundy text-blush border border-burgundy shadow-md shadow-burgundy/20"
                              : "bg-transparent text-charcoal border border-charcoal/15 hover:border-gold hover:text-gold"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {isSelected && (
                              <svg
                                className="w-3.5 h-3.5 text-gold"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                              >
                                <path d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                            {scent}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

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

                {/* Submit */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
                  <div className="text-rose-gray text-sm text-center sm:text-left">
                    {selectedScents.length > 0 ? (
                      <span>
                        <span className="text-burgundy font-medium">
                          {selectedScents.length}
                        </span>{" "}
                        candle{selectedScents.length !== 1 ? "s" : ""} &middot;{" "}
                        <span className="text-gold font-semibold">
                          ${selectedScents.length * 14}
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
                    disabled={selectedScents.length === 0}
                    className="group btn-shimmer text-burgundy px-10 py-4 text-sm tracking-widest uppercase font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-gold/25 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:bg-charcoal/10 disabled:text-charcoal/30 disabled:bg-none"
                  >
                    <span className="flex items-center gap-3">
                      Submit Order
                      <svg
                        className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
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
