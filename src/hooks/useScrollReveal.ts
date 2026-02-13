"use client";

import { useEffect, useRef } from "react";

export function useScrollReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    // Observe the element and all children with data-animate
    const animatedChildren = el.querySelectorAll("[data-animate]");
    animatedChildren.forEach((child) => observer.observe(child));
    if (el.hasAttribute("data-animate")) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
