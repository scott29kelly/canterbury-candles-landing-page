"use client";

import { useState, useRef, useEffect, FormEvent } from "react";

type OrderFormProps = {
  selected: string[];
  onRemove: (name: string) => void;
};

export default function OrderForm({ selected, onRemove }: OrderFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Build mailto or form action
    const subject = encodeURIComponent("Canterbury Candles Order Request");
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nScents:\n${selected.map((s) => `- ${s} ($14)`).join("\n")}\n\nTotal: $${total}\n\nNotes: ${formData.message || "None"}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setSubmitted(true);
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

          {submitted ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-6">&#10003;</div>
              <h3 className="font-[family-name:var(--font-serif)] text-[var(--color-forest-deep)] text-3xl mb-4">
                Order request prepared!
              </h3>
              <p className="text-[var(--color-warm-brown-light)] text-lg">
                Your email client should open with the order details. If it
                didn&apos;t, send us a DM on Instagram{" "}
                <a
                  href="https://instagram.com/canterburycandles2025"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-bronze)] underline"
                >
                  @canterburycandles2025
                </a>
              </p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
              {/* Left — Order summary */}
              <div className="lg:col-span-2">
                <h3 className="font-[family-name:var(--font-serif)] text-[var(--color-forest-deep)] text-xl mb-6">
                  Your Selection
                </h3>

                {selected.length === 0 ? (
                  <div className="border-2 border-dashed border-[var(--color-cream-dark)] p-8 text-center">
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
                  <div className="space-y-3">
                    {selected.map((name) => (
                      <div
                        key={name}
                        className="flex items-center justify-between bg-[var(--color-cream-dark)] p-4 group"
                      >
                        <div>
                          <span className="font-[family-name:var(--font-serif)] text-[var(--color-forest-deep)]">
                            {name}
                          </span>
                          <span className="text-[var(--color-warm-brown-light)] text-sm ml-3">
                            $14
                          </span>
                        </div>
                        <button
                          onClick={() => onRemove(name)}
                          className="text-[var(--color-warm-brown-light)]/40 hover:text-red-400 transition-colors text-lg leading-none cursor-pointer"
                          aria-label={`Remove ${name}`}
                        >
                          &times;
                        </button>
                      </div>
                    ))}

                    {/* Total */}
                    <div className="flex items-center justify-between pt-4 border-t border-[var(--color-cream-dark)]">
                      <span className="text-[var(--color-warm-brown-light)] text-sm tracking-[0.1em] uppercase">
                        Total
                      </span>
                      <span className="font-[family-name:var(--font-serif)] text-[var(--color-forest-deep)] text-2xl">
                        ${total}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right — Form */}
              <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="text-[var(--color-warm-brown)] text-sm tracking-[0.1em] uppercase mb-2 block"
                    >
                      Name
                    </label>
                    <input
                      id="name"
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
                      htmlFor="email"
                      className="text-[var(--color-warm-brown)] text-sm tracking-[0.1em] uppercase mb-2 block"
                    >
                      Email
                    </label>
                    <input
                      id="email"
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
                    htmlFor="phone"
                    className="text-[var(--color-warm-brown)] text-sm tracking-[0.1em] uppercase mb-2 block"
                  >
                    Phone <span className="text-[var(--color-warm-brown-light)]/40">(optional)</span>
                  </label>
                  <input
                    id="phone"
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
                    htmlFor="message"
                    className="text-[var(--color-warm-brown)] text-sm tracking-[0.1em] uppercase mb-2 block"
                  >
                    Notes <span className="text-[var(--color-warm-brown-light)]/40">(optional)</span>
                  </label>
                  <textarea
                    id="message"
                    rows={3}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full bg-transparent border-b-2 border-[var(--color-cream-dark)] focus:border-[var(--color-bronze)] outline-none py-3 text-[var(--color-forest-deep)] transition-colors resize-none placeholder:text-[var(--color-warm-brown-light)]/30"
                    placeholder="Anything we should know? Gift wrapping, delivery preferences..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={selected.length === 0}
                  className={`w-full py-4 text-sm tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer ${
                    selected.length > 0
                      ? "bg-[var(--color-forest-deep)] text-[var(--color-cream)] hover:bg-[var(--color-forest)] hover:translate-y-[-2px] hover:shadow-lg"
                      : "bg-[var(--color-cream-dark)] text-[var(--color-warm-brown-light)]/40 cursor-not-allowed"
                  }`}
                >
                  {selected.length > 0
                    ? `Submit Order Request — $${total}`
                    : "Select scents to continue"}
                </button>

                <p className="text-[var(--color-warm-brown-light)]/50 text-xs text-center">
                  This opens your email with order details. You can also DM us
                  on Instagram.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
