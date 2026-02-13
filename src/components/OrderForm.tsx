"use client";

import { useState, type FormEvent } from "react";
import type { ScentSelection } from "./ScentGrid";
import Reveal from "./Reveal";

interface OrderFormProps {
  selections: ScentSelection;
}

export default function OrderForm({ selections }: OrderFormProps) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalItems = Object.values(selections).reduce((a, b) => a + b, 0);
  const totalPrice = totalItems * 14;
  const hasSelections = totalItems > 0;

  const selectedScents = Object.entries(selections)
    .filter(([, qty]) => qty > 0)
    .sort(([a], [b]) => a.localeCompare(b));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!hasSelections || !name.trim() || !contact.trim()) return;

    setIsSubmitting(true);

    // Build order summary for Instagram DM / text
    const orderLines = selectedScents
      .map(([scent, qty]) => `${qty}x ${scent}`)
      .join("\n");

    const message = encodeURIComponent(
      `Hi! I'd like to place an order:\n\n${orderLines}\n\nTotal: ${totalItems} candle${totalItems !== 1 ? "s" : ""} — $${totalPrice}\n\nName: ${name}\nContact: ${contact}${notes ? `\nNotes: ${notes}` : ""}`
    );

    // Open Instagram DM with pre-filled message
    const igUrl = `https://ig.me/m/canterburycandles2025?text=${message}`;

    // Simulate brief processing
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      // Open IG DM in new tab
      window.open(igUrl, "_blank", "noopener,noreferrer");
    }, 800);
  };

  if (submitted) {
    return (
      <section id="order" className="relative bg-bronze-50 py-28 lg:py-40">
        <div className="mx-auto max-w-2xl px-6 text-center lg:px-12">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-forest-100">
            <svg className="h-8 w-8 text-forest-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="font-[family-name:var(--font-cormorant)] text-4xl font-light text-bark-900 sm:text-5xl">
            Order sent.
          </h2>
          <p className="mt-4 font-[family-name:var(--font-dm-sans)] text-base font-light text-bark-600">
            Your order request has been opened in Instagram DM. If the window didn&apos;t open,
            send your order directly to{" "}
            <a
              href="https://instagram.com/canterburycandles2025"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-forest-700 underline underline-offset-2"
            >
              @canterburycandles2025
            </a>
          </p>

          {/* Order recap */}
          <div className="mx-auto mt-10 max-w-sm rounded-2xl border border-forest-800/10 bg-cream p-6 text-left">
            <h3 className="mb-4 font-[family-name:var(--font-dm-sans)] text-xs font-medium tracking-[0.2em] text-bark-500 uppercase">
              Order Summary
            </h3>
            {selectedScents.map(([scent, qty]) => (
              <div key={scent} className="flex justify-between border-b border-forest-100 py-2 last:border-0">
                <span className="font-[family-name:var(--font-dm-sans)] text-sm text-bark-800">
                  {qty}x {scent}
                </span>
                <span className="font-[family-name:var(--font-dm-sans)] text-sm text-bark-500">
                  ${qty * 14}
                </span>
              </div>
            ))}
            <div className="mt-3 flex justify-between border-t border-forest-200 pt-3">
              <span className="font-[family-name:var(--font-dm-sans)] text-sm font-medium text-bark-900">Total</span>
              <span className="font-[family-name:var(--font-cormorant)] text-xl font-medium text-forest-800">${totalPrice}</span>
            </div>
          </div>

          <button
            onClick={() => {
              setSubmitted(false);
              setName("");
              setContact("");
              setNotes("");
            }}
            className="mt-8 font-[family-name:var(--font-dm-sans)] text-sm font-medium text-bark-500 underline underline-offset-2 transition-colors hover:text-forest-700"
          >
            Place another order
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="order" className="relative bg-bronze-50 py-28 lg:py-40">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left: Info */}
          <Reveal>
          <div>
            <span className="mb-4 inline-block font-[family-name:var(--font-dm-sans)] text-xs font-medium tracking-[0.25em] text-bronze-600 uppercase">
              Place Your Order
            </span>
            <h2 className="font-[family-name:var(--font-cormorant)] text-4xl leading-[1.15] font-light text-bark-900 sm:text-5xl lg:text-6xl">
              Ready to
              <br />
              <span className="italic text-forest-800">light up?</span>
            </h2>
            <p className="mt-6 max-w-md font-[family-name:var(--font-dm-sans)] text-base leading-relaxed font-light text-bark-600">
              Select your scents above, fill in your details, and we&apos;ll send your
              order request via Instagram DM. Payment and pickup details will be
              confirmed directly.
            </p>

            {/* Order summary sidebar */}
            {hasSelections && (
              <div className="mt-10 rounded-2xl border border-forest-800/10 bg-cream p-6">
                <h3 className="mb-4 font-[family-name:var(--font-dm-sans)] text-xs font-medium tracking-[0.2em] text-bark-500 uppercase">
                  Your Selection
                </h3>
                <div className="space-y-2">
                  {selectedScents.map(([scent, qty]) => (
                    <div key={scent} className="flex justify-between">
                      <span className="font-[family-name:var(--font-dm-sans)] text-sm text-bark-700">
                        {qty}x {scent}
                      </span>
                      <span className="font-[family-name:var(--font-dm-sans)] text-sm text-bark-500">
                        ${qty * 14}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between border-t border-forest-100 pt-4">
                  <span className="font-[family-name:var(--font-dm-sans)] text-sm font-medium text-bark-900">
                    Total
                  </span>
                  <div className="text-right">
                    <span className="font-[family-name:var(--font-cormorant)] text-2xl font-medium text-forest-800">
                      ${totalPrice}
                    </span>
                    <span className="ml-2 font-[family-name:var(--font-dm-sans)] text-xs text-bark-500 line-through">
                      ${totalItems * 20}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {!hasSelections && (
              <div className="mt-10 rounded-2xl border border-dashed border-bark-500/20 bg-cream/50 p-8 text-center">
                <p className="font-[family-name:var(--font-dm-sans)] text-sm text-bark-500">
                  No scents selected yet.{" "}
                  <a href="#scents" className="font-medium text-forest-700 underline underline-offset-2">
                    Browse scents above
                  </a>{" "}
                  to start your order.
                </p>
              </div>
            )}
          </div>
          </Reveal>

          {/* Right: Form */}
          <Reveal delay={200}>
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block font-[family-name:var(--font-dm-sans)] text-xs font-medium tracking-[0.15em] text-bark-600 uppercase"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-xl border border-bark-800/10 bg-cream px-5 py-3.5 font-[family-name:var(--font-dm-sans)] text-sm text-bark-900 placeholder-bark-500/40 transition-colors focus:border-forest-700/40 focus:ring-2 focus:ring-forest-700/10 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="contact"
                  className="mb-2 block font-[family-name:var(--font-dm-sans)] text-xs font-medium tracking-[0.15em] text-bark-600 uppercase"
                >
                  Phone or Instagram
                </label>
                <input
                  type="text"
                  id="contact"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Phone number or @handle"
                  className="w-full rounded-xl border border-bark-800/10 bg-cream px-5 py-3.5 font-[family-name:var(--font-dm-sans)] text-sm text-bark-900 placeholder-bark-500/40 transition-colors focus:border-forest-700/40 focus:ring-2 focus:ring-forest-700/10 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="mb-2 block font-[family-name:var(--font-dm-sans)] text-xs font-medium tracking-[0.15em] text-bark-600 uppercase"
                >
                  Notes <span className="normal-case tracking-normal text-bark-500/50">(optional)</span>
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Pickup preferences, gift wrapping, etc."
                  className="w-full resize-none rounded-xl border border-bark-800/10 bg-cream px-5 py-3.5 font-[family-name:var(--font-dm-sans)] text-sm text-bark-900 placeholder-bark-500/40 transition-colors focus:border-forest-700/40 focus:ring-2 focus:ring-forest-700/10 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={!hasSelections || !name.trim() || !contact.trim() || isSubmitting}
                className="group mt-4 flex w-full items-center justify-center gap-3 rounded-xl bg-forest-900 px-8 py-4 font-[family-name:var(--font-dm-sans)] text-sm font-medium tracking-wide text-cream transition-all duration-300 hover:bg-forest-800 hover:shadow-lg hover:shadow-forest-900/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <>
                    Send Order via Instagram
                    <svg
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </>
                )}
              </button>

              <p className="text-center font-[family-name:var(--font-dm-sans)] text-[11px] text-bark-500/60">
                Your order request opens a pre-filled Instagram DM.
                <br />
                Payment and pickup details confirmed via DM.
              </p>
            </form>
          </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
