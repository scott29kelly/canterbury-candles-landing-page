"use client";

import { useState, useRef, useEffect, FormEvent } from "react";

type OrderFormProps = {
  selected: string[];
  onRemove: (name: string) => void;
};

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function OrderForm({ selected, onRemove }: OrderFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const total = selected.length * 14;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitState("submitting");

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          scents: selected,
        }),
      });

      if (res.ok) {
        setSubmitState("success");
      } else {
        // Fallback to mailto
        openMailto();
        setSubmitState("success");
      }
    } catch {
      // Fallback to mailto on network error
      openMailto();
      setSubmitState("success");
    }
  };

  const openMailto = () => {
    const subject = encodeURIComponent("Canterbury Candles Order Request");
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone || "N/A"}\n\nScents:\n${selected.map((s) => `  - ${s} ($14)`).join("\n")}\n\nTotal: $${total}\n\nNotes: ${formData.message || "None"}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <section
      id="order"
      ref={sectionRef}
      className="relative py-28 lg:py-36 bg-[var(--color-cream)]"
    >
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div
          className={`transition-all duration-1000 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Header */}
          <div className="mb-16">
            <p className="text-[var(--color-bronze)] text-sm tracking-[0.3em] uppercase mb-4">
              Place Your Order
            </p>
            <h2 className="font-[family-name:var(--font-serif)] text-[var(--color-forest-deep)] text-4xl sm:text-5xl leading-tight">
              Almost there
            </h2>
          </div>

          {submitState === "success" ? (
            <div className="text-center py-20 animate-fade-up">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--color-forest)] flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-[var(--color-cream)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-serif)] text-[var(--color-forest-deep)] text-3xl mb-4">
                Order request received!
              </h3>
              <p className="text-[var(--color-warm-brown-light)] text-lg max-w-md mx-auto mb-8">
                We&apos;ll reach out soon to confirm your order. You can also contact us directly on Instagram.
              </p>
              <a
                href="https://instagram.com/canterburycandles2025"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[var(--color-bronze)] hover:text-[var(--color-bronze-dark)] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                @canterburycandles2025
              </a>
            </div>
          ) : (
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
              {/* Left — Order summary */}
              <div className="lg:col-span-2">
                <h3 className="font-[family-name:var(--font-serif)] text-[var(--color-forest-deep)] text-xl mb-6">
                  Your Selection
                </h3>

                {selected.length === 0 ? (
                  <div className="border-2 border-dashed border-[var(--color-cream-dark)] p-8 text-center rounded-sm">
                    <p className="text-[var(--color-warm-brown-light)] text-sm">
                      No scents selected yet.
                      <br />
                      <a
                        href="#scents"
                        className="text-[var(--color-bronze)] underline mt-2 inline-block"
                      >
                        Browse scents above
                      </a>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selected.map((name, i) => (
                      <div
                        key={name}
                        className="flex items-center justify-between bg-[var(--color-cream-dark)] p-4 group rounded-sm animate-fade-up"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <div>
                          <span className="font-[family-name:var(--font-serif)] text-[var(--color-forest-deep)] text-sm">
                            {name}
                          </span>
                          <span className="text-[var(--color-warm-brown-light)] text-xs ml-3">
                            $14
                          </span>
                        </div>
                        <button
                          onClick={() => onRemove(name)}
                          className="w-6 h-6 flex items-center justify-center text-[var(--color-warm-brown-light)]/40 hover:text-red-400 hover:bg-red-50 transition-all text-lg leading-none cursor-pointer rounded-full"
                          aria-label={`Remove ${name}`}
                        >
                          &times;
                        </button>
                      </div>
                    ))}

                    {/* Total */}
                    <div className="flex items-center justify-between pt-4 mt-2 border-t border-[var(--color-cream-dark)]">
                      <span className="text-[var(--color-warm-brown-light)] text-sm tracking-[0.1em] uppercase">
                        Total ({selected.length} candle{selected.length !== 1 ? "s" : ""})
                      </span>
                      <span className="font-[family-name:var(--font-serif)] text-[var(--color-forest-deep)] text-2xl">
                        ${total}
                      </span>
                    </div>

                    <p className="text-[var(--color-warm-brown-light)]/40 text-xs pt-1">
                      You save ${selected.length * 6} vs retail
                    </p>
                  </div>
                )}
              </div>

              {/* Right — Form */}
              <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="order-name"
                      className="text-[var(--color-warm-brown)] text-xs tracking-[0.15em] uppercase mb-2 block"
                    >
                      Name
                    </label>
                    <input
                      id="order-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-transparent border-b-2 border-[var(--color-cream-dark)] focus:border-[var(--color-bronze)] outline-none py-3 text-[var(--color-forest-deep)] transition-colors placeholder:text-[var(--color-warm-brown-light)]/30"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="order-email"
                      className="text-[var(--color-warm-brown)] text-xs tracking-[0.15em] uppercase mb-2 block"
                    >
                      Email
                    </label>
                    <input
                      id="order-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-transparent border-b-2 border-[var(--color-cream-dark)] focus:border-[var(--color-bronze)] outline-none py-3 text-[var(--color-forest-deep)] transition-colors placeholder:text-[var(--color-warm-brown-light)]/30"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="order-phone"
                    className="text-[var(--color-warm-brown)] text-xs tracking-[0.15em] uppercase mb-2 block"
                  >
                    Phone{" "}
                    <span className="text-[var(--color-warm-brown-light)]/40 normal-case tracking-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="order-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full bg-transparent border-b-2 border-[var(--color-cream-dark)] focus:border-[var(--color-bronze)] outline-none py-3 text-[var(--color-forest-deep)] transition-colors placeholder:text-[var(--color-warm-brown-light)]/30"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label
                    htmlFor="order-message"
                    className="text-[var(--color-warm-brown)] text-xs tracking-[0.15em] uppercase mb-2 block"
                  >
                    Notes{" "}
                    <span className="text-[var(--color-warm-brown-light)]/40 normal-case tracking-normal">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    id="order-message"
                    rows={3}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full bg-transparent border-b-2 border-[var(--color-cream-dark)] focus:border-[var(--color-bronze)] outline-none py-3 text-[var(--color-forest-deep)] transition-colors resize-none placeholder:text-[var(--color-warm-brown-light)]/30"
                    placeholder="Gift wrapping, delivery preferences, questions..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={selected.length === 0 || submitState === "submitting"}
                  className={`w-full py-4 text-sm tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer rounded-sm ${
                    selected.length > 0 && submitState !== "submitting"
                      ? "bg-[var(--color-forest-deep)] text-[var(--color-cream)] hover:bg-[var(--color-forest)] hover:translate-y-[-2px] hover:shadow-lg"
                      : "bg-[var(--color-cream-dark)] text-[var(--color-warm-brown-light)]/40 cursor-not-allowed"
                  }`}
                >
                  {submitState === "submitting"
                    ? "Sending..."
                    : selected.length > 0
                      ? `Submit Order Request — $${total}`
                      : "Select scents to continue"}
                </button>

                <p className="text-[var(--color-warm-brown-light)]/50 text-xs text-center leading-relaxed">
                  We&apos;ll confirm your order via email or Instagram DM.
                  <br />
                  Follow us{" "}
                  <a
                    href="https://instagram.com/canterburycandles2025"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-bronze)] hover:underline"
                  >
                    @canterburycandles2025
                  </a>
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
