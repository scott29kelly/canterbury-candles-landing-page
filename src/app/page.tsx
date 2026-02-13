"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";

const PRICE = 14;
const RETAIL_PRICE = 20;
const INSTAGRAM_URL = "https://www.instagram.com/canterburycandles2025/";

const scentCatalog = [
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
] as const;

const craftSteps = [
  {
    title: "Prep + wick",
    body: "Every 16oz mason jar is wicked, centered, and staged in small-batch runs so every candle burns evenly.",
    image: "/canterbury/process-empty-jars.webp",
    alt: "Empty mason jars with centered wicks prepared for pouring",
  },
  {
    title: "Melt + blend",
    body: "Coconut/soy wax is melted in controlled batches, then paired with fragrance oils at the right temperature for throw and consistency.",
    image: "/canterbury/process-melting-pots.webp",
    alt: "Melting pots prepared for candle wax blending",
  },
  {
    title: "Pour + cure",
    body: "Poured by hand, cooled with patience, then cured before final lid-down and label to lock in the handcrafted finish.",
    image: "/canterbury/process-prep-station.webp",
    alt: "Prepared jars and candle tools on an artisan station",
  },
] as const;

const featuredScents = [
  {
    name: "Blueberry Pancakes",
    image: "/canterbury/scent-blueberry-pancakes.webp",
    alt: "Blueberry Pancakes scented candle in a mason jar",
  },
  {
    name: "Cherry Cheesecake",
    image: "/canterbury/scent-cherry-cheesecake.webp",
    alt: "Cherry Cheesecake scented candle in a mason jar",
  },
  {
    name: "Lemon Pound Cake",
    image: "/canterbury/scent-lemon-pound-cake.webp",
    alt: "Lemon Pound Cake scented candle in a mason jar",
  },
  {
    name: "Strawberry Pound Cake",
    image: "/canterbury/scent-strawberry-pound-cake.webp",
    alt: "Strawberry Pound Cake scented candle in a mason jar",
  },
] as const;

type FormStatus = {
  type: "idle" | "error" | "success";
  message: string;
};

function toggleInArray(values: string[], item: string) {
  return values.includes(item)
    ? values.filter((value) => value !== item)
    : [...values, item];
}

function buildOrderDraft({
  name,
  contact,
  quantity,
  fulfillment,
  notes,
  scents,
}: {
  name: string;
  contact: string;
  quantity: number;
  fulfillment: string;
  notes: string;
  scents: string[];
}) {
  const lines = [
    "Hi Canterbury Candles!",
    "",
    "I would like to place an order request:",
    `Name: ${name}`,
    `Contact: ${contact}`,
    `Quantity: ${quantity} candle${quantity > 1 ? "s" : ""}`,
    `Fulfillment: ${fulfillment}`,
    `Scents: ${scents.join(", ")}`,
    `Estimated Total: $${quantity * PRICE} (${quantity} x $${PRICE})`,
    "",
    `Notes: ${notes || "None"}`,
  ];

  return lines.join("\n");
}

export default function Home() {
  const [selectedScents, setSelectedScents] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(2);
  const [formStatus, setFormStatus] = useState<FormStatus>({
    type: "idle",
    message: "",
  });
  const [draftMessage, setDraftMessage] = useState("");

  const estimatedTotal = quantity * PRICE;

  const handleScentToggle = (scent: string) => {
    setSelectedScents((current) => toggleInArray(current, scent));
  };

  const clearSelection = () => {
    setSelectedScents([]);
  };

  const copyDraft = async () => {
    if (!draftMessage) {
      return;
    }

    try {
      await navigator.clipboard.writeText(draftMessage);
      setFormStatus({
        type: "success",
        message:
          "Order text copied. Paste it into your DM after Instagram opens.",
      });
    } catch {
      setFormStatus({
        type: "success",
        message:
          "Instagram opened. Copy the message manually from the draft box below.",
      });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    if (selectedScents.length === 0) {
      setFormStatus({
        type: "error",
        message: "Select at least one scent before submitting.",
      });
      return;
    }

    const name = String(formData.get("name") ?? "").trim();
    const contact = String(formData.get("contact") ?? "").trim();
    const fulfillment = String(formData.get("fulfillment") ?? "").trim();
    const notes = String(formData.get("notes") ?? "").trim();

    const orderDraft = buildOrderDraft({
      name,
      contact,
      quantity,
      fulfillment,
      notes,
      scents: selectedScents,
    });

    setDraftMessage(orderDraft);

    try {
      await navigator.clipboard.writeText(orderDraft);
      setFormStatus({
        type: "success",
        message:
          "Order request drafted and copied. Instagram opened in a new tab for DM.",
      });
    } catch {
      setFormStatus({
        type: "success",
        message:
          "Order request drafted. Instagram opened in a new tab, then copy from the box below.",
      });
    }

    window.open(INSTAGRAM_URL, "_blank", "noopener,noreferrer");
    form.reset();
    setQuantity(2);
    setSelectedScents([]);
  };

  return (
    <div className="artisan-shell min-h-screen text-[#1f1a14]">
      <main>
        <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-16 pt-8 md:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-16 lg:pt-14">
          <div className="space-y-8">
            <p className="text-xs tracking-[0.34em] text-[#6c4f3a] uppercase">
              Canterbury Candles
            </p>

            <div className="space-y-5">
              <h1 className="[font-family:var(--font-display)] text-balance text-5xl leading-[0.92] font-semibold text-[#1d352d] sm:text-6xl lg:text-7xl">
                Hand-poured comfort, made in small batches.
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-[#4f3e31] sm:text-lg">
                Coconut/soy blend candles in 16oz mason jars with bronze lids.
                Crafted by hand with bakery-inspired and fresh signature scents.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="rounded-full border border-[#c6a07d] bg-[#fff7ef] px-4 py-2 text-sm font-medium text-[#5d432f]">
                14 signature scents
              </div>
              <div className="rounded-full border border-[#c6a07d] bg-[#fff7ef] px-4 py-2 text-sm font-medium text-[#5d432f]">
                $14 each
              </div>
              <div className="rounded-full border border-dashed border-[#b08a65] bg-[#f9efe2] px-4 py-2 text-sm text-[#6a4c35]">
                Normally ${RETAIL_PRICE}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="#shop"
                className="rounded-full bg-[#1f3a31] px-6 py-3 text-sm font-semibold tracking-wide text-[#f8f2e8] shadow-[0_8px_30px_rgba(22,44,36,0.25)] transition hover:-translate-y-0.5 hover:bg-[#173026] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f3a31] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f1e8]"
              >
                Browse Scents
              </a>
              <a
                href="#order"
                className="rounded-full border border-[#7c624a] bg-transparent px-6 py-3 text-sm font-semibold tracking-wide text-[#4f3c2d] transition hover:-translate-y-0.5 hover:bg-[#f4e7d7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7c624a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f1e8]"
              >
                Start Order Request
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-[#bea082] bg-[#ead7c4]/35 shadow-[0_30px_80px_rgba(53,35,20,0.2)]">
              <Image
                src="/canterbury/jar-real.webp"
                alt="Canterbury candle in a mason jar with bronze lid"
                fill
                sizes="(max-width: 1024px) 90vw, 42vw"
                className="object-cover transition duration-700 group-hover:scale-[1.03]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121111]/45 via-transparent to-transparent" />
              <p className="absolute bottom-5 left-5 rounded-full border border-white/45 bg-black/25 px-4 py-1.5 text-xs tracking-[0.2em] text-[#fff7eb] uppercase backdrop-blur">
                16oz Mason Jar
              </p>
            </div>

            <div className="absolute -top-4 -left-4 hidden w-44 overflow-hidden rounded-2xl border border-[#d0b498] bg-[#f6eee4] shadow-[0_20px_55px_rgba(51,35,18,0.24)] sm:block">
              <Image
                src="/canterbury/logo-bronze.webp"
                alt="Canterbury Candles bronze logo mockup"
                width={520}
                height={520}
                className="h-auto w-full object-cover"
              />
            </div>

            <div className="absolute -right-3 -bottom-6 hidden w-52 overflow-hidden rounded-2xl border border-[#d0b498] bg-[#f6eee4] shadow-[0_20px_55px_rgba(51,35,18,0.24)] md:block">
              <Image
                src="/canterbury/logo-leather.webp"
                alt="Canterbury Candles logo on leather texture"
                width={520}
                height={690}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section
          aria-labelledby="story-heading"
          className="mx-auto max-w-6xl px-6 pb-20 md:px-10"
        >
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-3">
              <p className="text-xs tracking-[0.3em] text-[#74563e] uppercase">
                The craft
              </p>
              <h2
                id="story-heading"
                className="[font-family:var(--font-display)] text-4xl leading-tight font-semibold text-[#1a342c] sm:text-5xl"
              >
                From prep table to warm room.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-[#5c4736] sm:text-base">
              Every pour is intentionally small-batch to protect scent character
              and finish quality.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {craftSteps.map((step) => (
              <article
                key={step.title}
                className="group overflow-hidden rounded-3xl border border-[#ceb195] bg-[#fff9f1]/85 shadow-[0_10px_35px_rgba(57,40,23,0.12)] transition hover:-translate-y-1"
              >
                <div className="relative aspect-[5/4] overflow-hidden">
                  <Image
                    src={step.image}
                    alt={step.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-2 px-5 py-5">
                  <h3 className="text-lg font-semibold text-[#234136]">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#5a4737]">
                    {step.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="shop"
          aria-labelledby="scent-heading"
          className="mx-auto grid max-w-6xl gap-10 px-6 pb-20 md:px-10 lg:grid-cols-[1fr_0.95fr]"
        >
          <div className="space-y-7">
            <div className="space-y-3">
              <p className="text-xs tracking-[0.3em] text-[#74563e] uppercase">
                Scent selection
              </p>
              <h2
                id="scent-heading"
                className="[font-family:var(--font-display)] text-4xl leading-tight font-semibold text-[#1a342c] sm:text-5xl"
              >
                Choose the fragrances for your order.
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-[#5c4736] sm:text-base">
                Tap each scent to build your request, then submit below. Your
                selected scents stay attached to the order form.
              </p>
            </div>

            <div className="rounded-3xl border border-[#ceb195] bg-[#fff8ee]/85 p-4 sm:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[#264238]">
                  {selectedScents.length} scent
                  {selectedScents.length === 1 ? "" : "s"} selected
                </p>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="rounded-full border border-[#9b7b5d] px-3 py-1 text-xs font-semibold tracking-wide text-[#5c4533] transition hover:bg-[#f1dfcc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7f6248] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fff8ee]"
                >
                  Clear
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {scentCatalog.map((scent) => {
                  const isSelected = selectedScents.includes(scent);
                  return (
                    <button
                      key={scent}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => handleScentToggle(scent)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                        isSelected
                          ? "border-[#1f3a31] bg-[#1f3a31] text-[#f8f2e8] shadow-[0_10px_25px_rgba(25,49,40,0.22)] focus-visible:ring-[#1f3a31] focus-visible:ring-offset-[#fff8ee]"
                          : "border-[#c5a486] bg-[#fffdf9] text-[#4f3d2f] hover:bg-[#f7eadc] focus-visible:ring-[#7c624a] focus-visible:ring-offset-[#fff8ee]"
                      }`}
                    >
                      {scent}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-[#ceb195] bg-[#fff8ee] shadow-[0_15px_45px_rgba(57,40,23,0.12)]">
              <div className="relative aspect-[16/9]">
                <Image
                  src="/canterbury/batch-tray.webp"
                  alt="Freshly poured candle batch arranged on metal trays"
                  fill
                  sizes="(max-width: 1024px) 100vw, 54vw"
                  className="object-cover"
                />
              </div>
              <div className="space-y-2 px-5 py-5">
                <h3 className="text-lg font-semibold text-[#264238]">
                  Small batch, intentionally paced
                </h3>
                <p className="text-sm leading-relaxed text-[#5d4a38]">
                  The curing process is never rushed. Every jar is poured, set,
                  and finished by hand before release.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {featuredScents.map((item) => (
              <article
                key={item.name}
                className="group overflow-hidden rounded-3xl border border-[#d0b498] bg-[#fffaf4] shadow-[0_10px_35px_rgba(57,40,23,0.12)]"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="px-4 py-4">
                  <p className="text-sm font-semibold tracking-wide text-[#244137]">
                    {item.name}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="order"
          aria-labelledby="order-heading"
          className="bg-[#1d322a] py-20 text-[#f6efe2]"
        >
          <div className="mx-auto grid max-w-6xl gap-8 px-6 md:px-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs tracking-[0.3em] text-[#d5b28a] uppercase">
                  Pre-order
                </p>
                <h2
                  id="order-heading"
                  className="[font-family:var(--font-display)] text-4xl leading-tight font-semibold text-[#fff6e8] sm:text-5xl"
                >
                  Submit your order request.
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-[#e6d4bc] sm:text-base">
                  We draft your order text, copy it for you, and open Instagram
                  so you can send it instantly via DM.
                </p>
              </div>

              <div className="rounded-2xl border border-[#486255] bg-[#213b31] p-5">
                <p className="text-xs tracking-[0.2em] text-[#d7bb96] uppercase">
                  Current request
                </p>
                <p className="mt-2 text-sm text-[#f7ecd9]">
                  {selectedScents.length > 0
                    ? selectedScents.join(" • ")
                    : "No scents selected yet"}
                </p>
                <p className="mt-4 text-sm text-[#e8d5bf]">
                  Estimated total:{" "}
                  <span className="font-semibold text-[#ffe8cd]">
                    ${estimatedTotal}
                  </span>{" "}
                  ({quantity} x ${PRICE})
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-[#4f685c] bg-[#243e34]">
                <Image
                  src="/canterbury/menu-flyer.webp"
                  alt="Canterbury Candles flyer with complete scent list and pricing"
                  width={607}
                  height={1080}
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-[#466154] bg-[#213a31]/85 p-6 shadow-[0_20px_60px_rgba(11,20,17,0.45)] sm:p-7">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm">
                    <span className="font-semibold text-[#f6ebda]">Name</span>
                    <input
                      name="name"
                      required
                      autoComplete="name"
                      className="w-full rounded-xl border border-[#5f796d] bg-[#152921] px-3 py-2.5 text-[#fff3e1] placeholder:text-[#9cb2a8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d3ac80]"
                      placeholder="Your name"
                    />
                  </label>

                  <label className="space-y-2 text-sm">
                    <span className="font-semibold text-[#f6ebda]">Contact</span>
                    <input
                      name="contact"
                      required
                      autoComplete="email"
                      className="w-full rounded-xl border border-[#5f796d] bg-[#152921] px-3 py-2.5 text-[#fff3e1] placeholder:text-[#9cb2a8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d3ac80]"
                      placeholder="Email, phone, or @handle"
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm">
                    <span className="font-semibold text-[#f6ebda]">
                      Quantity
                    </span>
                    <input
                      name="quantity"
                      type="number"
                      min={1}
                      max={36}
                      required
                      value={quantity}
                      onChange={(event) =>
                        setQuantity(Math.min(36, Math.max(1, Number(event.target.value) || 1)))
                      }
                      className="w-full rounded-xl border border-[#5f796d] bg-[#152921] px-3 py-2.5 text-[#fff3e1] placeholder:text-[#9cb2a8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d3ac80]"
                    />
                  </label>

                  <label className="space-y-2 text-sm">
                    <span className="font-semibold text-[#f6ebda]">
                      Fulfillment
                    </span>
                    <select
                      name="fulfillment"
                      defaultValue="Local pickup"
                      className="w-full rounded-xl border border-[#5f796d] bg-[#152921] px-3 py-2.5 text-[#fff3e1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d3ac80]"
                    >
                      <option>Local pickup</option>
                      <option>Local delivery</option>
                      <option>Ship if available</option>
                    </select>
                  </label>
                </div>

                <label className="block space-y-2 text-sm">
                  <span className="font-semibold text-[#f6ebda]">Notes</span>
                  <textarea
                    name="notes"
                    rows={4}
                    placeholder="Scent split, gifting notes, timing, etc."
                    className="w-full rounded-xl border border-[#5f796d] bg-[#152921] px-3 py-2.5 text-[#fff3e1] placeholder:text-[#9cb2a8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d3ac80]"
                  />
                </label>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#d5a474] px-4 py-3 text-sm font-bold tracking-[0.08em] text-[#2f2014] uppercase transition hover:bg-[#e0b487] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7cf9f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#213a31]"
                >
                  Submit order request
                </button>
              </form>

              {formStatus.type !== "idle" && (
                <div
                  className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
                    formStatus.type === "error"
                      ? "border-[#a34f4f] bg-[#4f2121] text-[#ffd6d6]"
                      : "border-[#5e7a6d] bg-[#1a2f27] text-[#f6ebd9]"
                  }`}
                >
                  {formStatus.message}
                </div>
              )}

              {draftMessage && (
                <div className="mt-4 space-y-3 rounded-xl border border-[#4c695c] bg-[#172c24] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs font-semibold tracking-[0.18em] text-[#d8ba95] uppercase">
                      DM-ready order draft
                    </p>
                    <button
                      type="button"
                      onClick={copyDraft}
                      className="rounded-full border border-[#799286] px-3 py-1 text-xs font-semibold tracking-wide text-[#f3e8d8] transition hover:bg-[#29453a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4ae83] focus-visible:ring-offset-2 focus-visible:ring-offset-[#172c24]"
                    >
                      Copy draft
                    </button>
                  </div>
                  <pre className="max-h-56 overflow-auto whitespace-pre-wrap rounded-lg bg-[#102118] p-3 text-xs leading-relaxed text-[#f1e5d2]">
                    {draftMessage}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#ceb195] bg-[#f6ecdf]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-[#5a4735] md:flex-row md:items-center md:justify-between md:px-10">
          <p>
            <span className="font-semibold text-[#2a463a]">Canterbury Candles</span>{" "}
            • Hand-poured coconut/soy blend • 16oz mason jars
          </p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#1f3a31] underline decoration-[#9f7a58] decoration-2 underline-offset-4 transition hover:text-[#142920] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f3a31] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6ecdf]"
          >
            @canterburycandles2025
          </a>
        </div>
      </footer>
    </div>
  );
}
