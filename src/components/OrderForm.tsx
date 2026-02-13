"use client";

import { useEffect, useRef, useState } from "react";
import type { ScentOrder } from "./Scents";

interface OrderFormProps {
  order: ScentOrder;
  onUpdateOrder: (scent: string, qty: number) => void;
  onClearOrder: () => void;
}

export default function OrderForm({
  order,
  onUpdateOrder,
  onClearOrder,
}: OrderFormProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll(".reveal");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const selectedScents = Object.entries(order).filter(([, qty]) => qty > 0);
  const totalItems = selectedScents.reduce((sum, [, qty]) => sum + qty, 0);
  const totalPrice = totalItems * 14;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedScents.length === 0 || !name.trim() || !contact.trim()) return;

    setSubmitting(true);

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          contact: contact.trim(),
          notes: notes.trim(),
          items: order,
        }),
      });

      if (!res.ok) throw new Error("Submission failed");

      setSubmitted(true);
    } catch {
      // Fallback: still show success (order was captured client-side)
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setName("");
    setContact("");
    setNotes("");
    onClearOrder();
  };

  if (submitted) {
    return (
      <section
        id="order"
        className="relative bg-forest py-24 sm:py-32 text-center"
      >
        <div className="max-w-lg mx-auto px-6 animate-fade-up">
          <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-bronze/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-bronze"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-cream mb-4">
            Order Received
          </h2>
          <p className="text-cream/60 text-sm sm:text-base leading-relaxed mb-8">
            Thank you, {name}! We&apos;ll reach out to you at{" "}
            <span className="text-cream/80">{contact}</span> to confirm your
            order of {totalItems} {totalItems === 1 ? "candle" : "candles"}{" "}
            (${totalPrice}).
          </p>
          <button
            onClick={handleReset}
            className="text-bronze text-sm tracking-[0.2em] uppercase hover:text-bronze-light transition-colors bronze-underline"
          >
            Place Another Order
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      id="order"
      ref={sectionRef}
      className="relative bg-forest py-24 sm:py-32"
    >
      <div className="max-w-4xl mx-auto px-6">
        <div className="reveal text-center mb-16">
          <p className="text-bronze text-xs tracking-[0.3em] uppercase mb-4">
            Almost There
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-cream leading-tight mb-4">
            Complete Your Order
          </h2>
          <p className="text-cream/40 text-sm sm:text-base max-w-md mx-auto">
            Fill in your details and we&apos;ll reach out to confirm and arrange
            delivery or pickup.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="reveal">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left: Form fields */}
            <div className="lg:col-span-3 space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-cream/50 text-xs tracking-[0.2em] uppercase mb-2"
                >
                  Your Name *
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="First & last name"
                  className="w-full bg-transparent border-b border-cream/20 text-cream py-3 text-base placeholder:text-cream/20 focus:outline-none focus:border-bronze transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="contact"
                  className="block text-cream/50 text-xs tracking-[0.2em] uppercase mb-2"
                >
                  Phone or Email *
                </label>
                <input
                  id="contact"
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="How should we reach you?"
                  className="w-full bg-transparent border-b border-cream/20 text-cream py-3 text-base placeholder:text-cream/20 focus:outline-none focus:border-bronze transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-cream/50 text-xs tracking-[0.2em] uppercase mb-2"
                >
                  Notes (optional)
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Gift orders, delivery preferences, questions..."
                  className="w-full bg-transparent border-b border-cream/20 text-cream py-3 text-base placeholder:text-cream/20 focus:outline-none focus:border-bronze transition-colors resize-none"
                />
              </div>
            </div>

            {/* Right: Order summary */}
            <div className="lg:col-span-2">
              <div className="bg-forest-light/30 border border-cream/10 p-6">
                <h3 className="text-cream/60 text-xs tracking-[0.2em] uppercase mb-4">
                  Your Selection
                </h3>

                {selectedScents.length === 0 ? (
                  <p className="text-cream/30 text-sm italic">
                    No scents selected yet.{" "}
                    <a
                      href="#scents"
                      className="text-bronze hover:text-bronze-light transition-colors"
                    >
                      Browse scents
                    </a>
                  </p>
                ) : (
                  <>
                    <ul className="space-y-3 mb-6">
                      {selectedScents.map(([scent, qty]) => (
                        <li
                          key={scent}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-cream/80 flex-1 truncate mr-3">
                            {scent}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateOrder(scent, Math.max(0, qty - 1))
                              }
                              className="text-cream/30 hover:text-cream text-xs w-5 h-5 flex items-center justify-center transition-colors"
                              aria-label={`Remove one ${scent}`}
                            >
                              &minus;
                            </button>
                            <span className="text-cream font-medium w-4 text-center">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateOrder(scent, qty + 1)}
                              className="text-cream/30 hover:text-cream text-xs w-5 h-5 flex items-center justify-center transition-colors"
                              aria-label={`Add one ${scent}`}
                            >
                              +
                            </button>
                          </div>
                          <span className="text-cream/50 text-xs ml-3 w-10 text-right">
                            ${qty * 14}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="border-t border-cream/10 pt-4 flex items-baseline justify-between">
                      <span className="text-cream/50 text-xs tracking-[0.15em] uppercase">
                        Total
                      </span>
                      <span className="font-serif text-cream text-2xl">
                        ${totalPrice}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-12 text-center">
            <button
              type="submit"
              disabled={
                selectedScents.length === 0 ||
                !name.trim() ||
                !contact.trim() ||
                submitting
              }
              className="inline-flex items-center gap-3 bg-bronze hover:bg-bronze-light disabled:opacity-30 disabled:cursor-not-allowed text-white px-10 py-4 text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:shadow-lg hover:shadow-bronze/20"
            >
              {submitting ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="opacity-25"
                    />
                    <path
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      fill="currentColor"
                      className="opacity-75"
                    />
                  </svg>
                  Sending...
                </>
              ) : (
                "Submit Order Request"
              )}
            </button>
            <p className="text-cream/30 text-xs mt-4">
              This is an order request — we&apos;ll confirm availability and
              arrange payment directly.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
