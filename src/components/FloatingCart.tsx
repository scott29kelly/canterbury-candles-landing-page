"use client";

export default function FloatingCart({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <a
      href="#order"
      className="fixed bottom-6 right-6 z-50 bg-[var(--color-forest-deep)] text-[var(--color-cream)] px-5 py-3 shadow-xl flex items-center gap-3 transition-all duration-300 hover:bg-[var(--color-forest)] hover:translate-y-[-2px] hover:shadow-2xl animate-fade-up rounded-sm"
    >
      <div className="relative">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-[var(--color-bronze)] text-[var(--color-cream)] text-[10px] font-bold rounded-full flex items-center justify-center">
          {count}
        </span>
      </div>
      <span className="text-sm tracking-[0.1em] uppercase">
        ${count * 14}
      </span>
    </a>
  );
}
