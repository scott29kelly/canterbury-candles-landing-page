"use client";

import { useState } from "react";
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

  if (submitted) {
    return (
      <section id="order" className="py-24 md:py-36 bg-cream-dark relative">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="text-bronze text-6xl mb-6">&#10043;</div>
          <h2 className="font-display text-forest text-4xl md:text-5xl mb-6">
            Thank You
          </h2>
          <p className="text-charcoal-light text-lg leading-relaxed mb-8">
            We&apos;ve received your order request. We&apos;ll be in touch
            shortly to confirm your selections and arrange delivery.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setSelectedScents([]);
            }}
            className="text-bronze text-sm tracking-widest uppercase hover:text-bronze-dark transition-colors duration-300"
          >
            Place another order
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="order" className="py-24 md:py-36 bg-cream-dark relative">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section header */}
        <AnimateIn className="text-center mb-16 md:mb-20">
          <p className="text-bronze text-sm tracking-[0.3em] uppercase mb-4">
            Get Yours
          </p>
          <h2 className="font-display text-forest text-4xl md:text-5xl lg:text-6xl mb-6">
            Place an Order
          </h2>
          <div className="w-12 h-px bg-bronze mx-auto mb-8" />
          <p className="text-charcoal-light max-w-xl mx-auto text-lg leading-relaxed">
            Select your favorite scents below and we&apos;ll get back to you to
            confirm your order. Each candle is{" "}
            <span className="text-bronze font-medium">$14</span>.
          </p>
        </AnimateIn>

        <AnimateIn>
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Contact info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-forest text-sm tracking-widest uppercase mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full bg-cream border border-forest/10 px-5 py-4 text-charcoal placeholder-charcoal/30 transition-all duration-300 hover:border-forest/20"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-forest text-sm tracking-widest uppercase mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full bg-cream border border-forest/10 px-5 py-4 text-charcoal placeholder-charcoal/30 transition-all duration-300 hover:border-forest/20"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-forest text-sm tracking-widest uppercase mb-2"
              >
                Phone{" "}
                <span className="text-charcoal-light normal-case tracking-normal">
                  (optional)
                </span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="w-full bg-cream border border-forest/10 px-5 py-4 text-charcoal placeholder-charcoal/30 transition-all duration-300 hover:border-forest/20"
                placeholder="(555) 123-4567"
              />
            </div>

            {/* Scent selection */}
            <div>
              <label className="block text-forest text-sm tracking-widest uppercase mb-4">
                Select Your Scents
                {selectedScents.length > 0 && (
                  <span className="text-bronze ml-2 normal-case tracking-normal">
                    ({selectedScents.length} selected &middot; $
                    {selectedScents.length * 14})
                  </span>
                )}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {allScents.map((scent) => {
                  const isSelected = selectedScents.includes(scent);
                  return (
                    <button
                      key={scent}
                      type="button"
                      onClick={() => toggleScent(scent)}
                      className={`px-4 py-3 text-sm text-left border transition-all duration-300 ${
                        isSelected
                          ? "bg-forest text-cream border-forest"
                          : "bg-cream text-charcoal border-forest/10 hover:border-forest/30"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors duration-300 ${
                            isSelected ? "bg-bronze" : "bg-forest/20"
                          }`}
                        />
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
                className="block text-forest text-sm tracking-widest uppercase mb-2"
              >
                Special Instructions{" "}
                <span className="text-charcoal-light normal-case tracking-normal">
                  (optional)
                </span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full bg-cream border border-forest/10 px-5 py-4 text-charcoal placeholder-charcoal/30 transition-all duration-300 hover:border-forest/20 resize-none"
                placeholder="Any special requests, delivery preferences, or questions..."
              />
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
              <div className="text-charcoal-light text-sm">
                {selectedScents.length > 0 ? (
                  <span>
                    <span className="text-forest font-medium">
                      {selectedScents.length}
                    </span>{" "}
                    candle{selectedScents.length !== 1 ? "s" : ""} &middot;{" "}
                    <span className="text-bronze font-medium">
                      ${selectedScents.length * 14}
                    </span>{" "}
                    total
                  </span>
                ) : (
                  <span>Select at least one scent to continue</span>
                )}
              </div>
              <button
                type="submit"
                disabled={selectedScents.length === 0}
                className="group bg-bronze text-forest px-10 py-5 text-sm tracking-widest uppercase font-medium hover:bg-bronze-light transition-all duration-300 hover:shadow-lg hover:shadow-bronze/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-bronze disabled:hover:shadow-none"
              >
                <span className="flex items-center gap-3">
                  Submit Order Request
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
          </form>
        </AnimateIn>
      </div>
    </section>
  );
}
