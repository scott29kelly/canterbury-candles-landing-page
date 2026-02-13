"use client";

import { useState, FormEvent } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface OrderFormProps {
  selected: Record<string, number>;
  onRemove: (name: string) => void;
}

export default function OrderForm({ selected, onRemove }: OrderFormProps) {
  const sectionRef = useScrollReveal<HTMLElement>(0.1);
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const items = Object.entries(selected).filter(([, qty]) => qty > 0);
  const totalQty = items.reduce((sum, [, qty]) => sum + qty, 0);
  const totalPrice = totalQty * 14;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) return;

    setFormState("sending");

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      notes: formData.get("notes"),
      items: items.map(([name, qty]) => ({ scent: name, quantity: qty })),
      total: totalPrice,
    };

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setFormState("sent");
      } else {
        setFormState("error");
      }
    } catch {
      setFormState("error");
    }
  }

  return (
    <section
      id="order"
      ref={sectionRef}
      className="relative bg-cream py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-2">
          {/* Left — Order summary */}
          <div data-animate className="opacity-0">
            <span className="mb-4 inline-block text-xs tracking-[0.4em] text-bronze uppercase">
              Your Order
            </span>
            <h2 className="font-heading text-4xl leading-tight text-forest lg:text-5xl">
              Almost there.
            </h2>
            <p className="mt-4 max-w-md text-base text-bark-light/70">
              Review your selections, fill in your details, and we&apos;ll
              confirm your order.
            </p>

            {/* Selected items list */}
            <div className="mt-10">
              {items.length === 0 ? (
                <div className="rounded-xl border border-dashed border-bark-light/20 p-8 text-center">
                  <p className="text-sm text-bark-light/50">
                    No scents selected yet.
                    <br />
                    <a
                      href="#scents"
                      className="mt-2 inline-block text-bronze underline underline-offset-4 transition-colors hover:text-bronze-light"
                    >
                      Browse scents above
                    </a>
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map(([name, qty]) => (
                    <div
                      key={name}
                      className="flex items-center justify-between rounded-lg bg-cream-dark/50 px-5 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-heading text-base text-forest">
                          {name}
                        </span>
                        <span className="text-xs text-bark-light/50">
                          x{qty}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-bronze">
                          ${qty * 14}
                        </span>
                        <button
                          onClick={() => onRemove(name)}
                          className="text-bark-light/30 transition-colors hover:text-red-500"
                          aria-label={`Remove ${name}`}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path d="M1 1l12 12M13 1L1 13" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Total */}
                  <div className="mt-4 flex items-center justify-between border-t border-bark-light/10 pt-4">
                    <span className="text-sm tracking-wider text-bark-light/50 uppercase">
                      Total ({totalQty} {totalQty === 1 ? "candle" : "candles"})
                    </span>
                    <span className="font-heading text-2xl text-forest">
                      ${totalPrice}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right — Form */}
          <div data-animate className="opacity-0" style={{ animationDelay: "150ms" }}>
            {formState === "sent" ? (
              <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-forest px-8 py-16 text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-bronze/20">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-bronze-light"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="font-heading text-2xl text-cream">
                  Order Request Sent
                </h3>
                <p className="mt-3 max-w-xs text-sm text-cream/50">
                  We&apos;ll review your order and reach out to confirm details
                  and arrange payment.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-xs tracking-wider text-bark-light/60 uppercase"
                  >
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full rounded-lg border border-bark-light/15 bg-white px-4 py-3 text-base text-charcoal outline-none transition-all placeholder:text-bark-light/30 focus:border-bronze focus:ring-1 focus:ring-bronze/30"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs tracking-wider text-bark-light/60 uppercase"
                  >
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-lg border border-bark-light/15 bg-white px-4 py-3 text-base text-charcoal outline-none transition-all placeholder:text-bark-light/30 focus:border-bronze focus:ring-1 focus:ring-bronze/30"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-xs tracking-wider text-bark-light/60 uppercase"
                  >
                    Phone (optional)
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="w-full rounded-lg border border-bark-light/15 bg-white px-4 py-3 text-base text-charcoal outline-none transition-all placeholder:text-bark-light/30 focus:border-bronze focus:ring-1 focus:ring-bronze/30"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="mb-2 block text-xs tracking-wider text-bark-light/60 uppercase"
                  >
                    Notes (optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    className="w-full resize-none rounded-lg border border-bark-light/15 bg-white px-4 py-3 text-base text-charcoal outline-none transition-all placeholder:text-bark-light/30 focus:border-bronze focus:ring-1 focus:ring-bronze/30"
                    placeholder="Any special requests or questions..."
                  />
                </div>

                {formState === "error" && (
                  <p className="text-sm text-red-500">
                    Something went wrong. Please try again or DM us on Instagram.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={items.length === 0 || formState === "sending"}
                  className="w-full rounded-lg bg-forest py-4 text-sm font-medium tracking-widest text-cream uppercase transition-all hover:bg-forest-light disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {formState === "sending" ? (
                    <span className="inline-flex items-center gap-2">
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="opacity-25"
                        />
                        <path
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v2a6 6 0 00-6 6H4z"
                          className="opacity-75"
                        />
                      </svg>
                      Submitting...
                    </span>
                  ) : items.length === 0 ? (
                    "Select scents to order"
                  ) : (
                    `Submit Order — $${totalPrice}`
                  )}
                </button>

                <p className="text-center text-xs text-bark-light/40">
                  This submits a request — we&apos;ll confirm availability and
                  arrange payment separately.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
