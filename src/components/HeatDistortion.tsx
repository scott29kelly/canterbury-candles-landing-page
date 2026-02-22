"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useState } from "react";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [breakpoint]);
  return isMobile;
}

export default function HeatDistortion() {
  const prefersReduced = useReducedMotion();
  const isMobile = useIsMobile();
  const filterId = useId().replace(/:/g, "_");

  if (prefersReduced) return null;

  const numOctaves = isMobile ? 2 : 3;
  const displacementScale = isMobile ? 4 : 6;

  return (
    <>
      {/* Hidden SVG filter definition */}
      <svg
        width="0"
        height="0"
        className="absolute"
        aria-hidden="true"
      >
        <defs>
          <filter id={filterId}>
            <feTurbulence
              type="turbulence"
              baseFrequency="0.018 0.025"
              numOctaves={numOctaves}
              result="turbulence"
            >
              <animate
                attributeName="seed"
                from="0"
                to="100"
                dur="8s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale={displacementScale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Heat distortion overlay — upper portion of image */}
      <div
        className="absolute inset-x-0 top-0 z-10 pointer-events-none"
        style={{
          height: "45%",
          backdropFilter: `url(#${filterId})`,
          WebkitBackdropFilter: `url(#${filterId})`,
          maskImage:
            "linear-gradient(to bottom, black 30%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 30%, transparent 100%)",
        }}
      />

      {/* Warm glow point at flame source */}
      <motion.div
        className="absolute z-20 pointer-events-none"
        style={{
          top: "6%",
          left: "50%",
          transform: "translateX(-50%)",
          width: isMobile ? 20 : 30,
          height: isMobile ? 20 : 30,
          background:
            "radial-gradient(circle, rgba(212,168,67,0.6) 0%, rgba(184,134,11,0.2) 50%, transparent 75%)",
          filter: "blur(8px)",
          borderRadius: "50%",
        }}
        animate={{ opacity: [0.5, 0.75, 0.5] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
    </>
  );
}
