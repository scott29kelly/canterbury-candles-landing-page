"use client";

import { useEffect, useState } from "react";

interface FloatingCartProps {
  totalItems: number;
  totalPrice: number;
}

export default function FloatingCart({ totalItems, totalPrice }: FloatingCartProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show after scrolling past the hero
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (totalItems === 0 || !visible) return null;

  return (
    <a
      href="#order"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full bg-forest px-5 py-3 shadow-xl shadow-forest/30 transition-all hover:bg-forest-light hover:shadow-2xl hover:shadow-forest/40 active:scale-95"
      aria-label={`View order: ${totalItems} items, $${totalPrice}`}
    >
      {/* Cart icon */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-cream/70"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.6 8H19M7 13L5.4 5M9 21a1 1 0 11-2 0 1 1 0 012 0zM18 21a1 1 0 11-2 0 1 1 0 012 0z"
        />
      </svg>

      {/* Count badge */}
      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-bronze px-1.5 text-[10px] font-bold text-cream">
        {totalItems}
      </span>

      <span className="text-sm font-medium text-cream">${totalPrice}</span>
    </a>
  );
}
