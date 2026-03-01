"use client";

import { useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Inventory", href: "/admin/inventory" },
  { label: "Promo Codes", href: "/admin/promo-codes" },
  { label: "Image Generator", href: "/admin/image-generator" },
];

export default function AdminNav() {
  const pathname = usePathname();

  const handleLogout = useCallback(async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    window.location.href = "/admin";
  }, []);

  return (
    <nav className="flex items-center gap-1">
      {TABS.map((tab) => {
        const active = pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              active
                ? "bg-burgundy/10 text-burgundy"
                : "text-rose-gray hover:text-charcoal"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
      <span className="mx-1 text-rose-gray/30">|</span>
      <button
        onClick={handleLogout}
        className="px-3 py-1.5 rounded-lg text-sm font-medium text-rose-gray hover:text-red-600 transition-colors"
      >
        Logout
      </button>
    </nav>
  );
}
