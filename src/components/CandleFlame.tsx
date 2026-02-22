"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

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

export default function CandleFlame() {
  const prefersReduced = useReducedMotion();
  const isMobile = useIsMobile();

  const flameHeight = isMobile ? 22 : 35;
  const flameWidth = Math.round(flameHeight * 0.5);
  const numOctaves = isMobile ? 2 : 3;

  // SVG viewBox dimensions
  const vw = 20;
  const vh = 32;

  return (
    <div
      className="absolute z-20 pointer-events-none"
      style={{
        top: "6%",
        left: "50%",
        transform: "translateX(-50%)",
        width: flameWidth,
        height: flameHeight,
      }}
    >
      {/* Warm radial glow beneath flame */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/3 rounded-full"
        style={{
          width: flameWidth * 2.5,
          height: flameHeight * 1.5,
          background:
            "radial-gradient(ellipse at center, rgba(212,168,67,0.45) 0%, rgba(184,134,11,0.15) 50%, transparent 75%)",
          filter: "blur(8px)",
        }}
        animate={
          prefersReduced
            ? { opacity: 0.6 }
            : { opacity: [0.5, 0.7, 0.5] }
        }
        transition={
          prefersReduced
            ? undefined
            : {
                duration: 3,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }
        }
      />

      {/* SVG flame */}
      <motion.svg
        viewBox={`0 0 ${vw} ${vh}`}
        width={flameWidth}
        height={flameHeight}
        className="relative"
        animate={
          prefersReduced
            ? undefined
            : {
                scaleY: [1, 1.08, 0.92, 1],
                x: [0, 1, -1, 0],
              }
        }
        transition={
          prefersReduced
            ? undefined
            : {
                scaleY: {
                  duration: 2.5,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                },
                x: {
                  duration: 3.2,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                },
              }
        }
        style={{ transformOrigin: "bottom center" }}
      >
        <defs>
          {/* Flame gradient — bright tip to warm base */}
          <linearGradient id="flameGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#FF8C00" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#B8860B" stopOpacity="0.7" />
          </linearGradient>

          {/* Inner bright core gradient */}
          <linearGradient id="flameCoreGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFBE6" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#FFD700" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FF8C00" stopOpacity="0" />
          </linearGradient>

          {/* Turbulence filter for organic distortion */}
          {!prefersReduced && (
            <filter id="flameTurbulence" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence
                type="turbulence"
                baseFrequency="0.02 0.08"
                numOctaves={numOctaves}
                result="turbulence"
              >
                <animate
                  attributeName="seed"
                  from="0"
                  to="100"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feDisplacementMap
                in="SourceGraphic"
                in2="turbulence"
                scale="5"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          )}
        </defs>

        {/* Outer flame shape — teardrop */}
        <path
          d={`M${vw / 2} 1 Q${vw * 0.85} ${vh * 0.35} ${vw * 0.78} ${vh * 0.6} Q${vw * 0.7} ${vh * 0.85} ${vw / 2} ${vh - 1} Q${vw * 0.3} ${vh * 0.85} ${vw * 0.22} ${vh * 0.6} Q${vw * 0.15} ${vh * 0.35} ${vw / 2} 1Z`}
          fill="url(#flameGrad)"
          filter={prefersReduced ? undefined : "url(#flameTurbulence)"}
        />

        {/* Inner bright core */}
        <path
          d={`M${vw / 2} ${vh * 0.2} Q${vw * 0.65} ${vh * 0.45} ${vw * 0.6} ${vh * 0.6} Q${vw * 0.55} ${vh * 0.8} ${vw / 2} ${vh - 3} Q${vw * 0.45} ${vh * 0.8} ${vw * 0.4} ${vh * 0.6} Q${vw * 0.35} ${vh * 0.45} ${vw / 2} ${vh * 0.2}Z`}
          fill="url(#flameCoreGrad)"
          filter={prefersReduced ? undefined : "url(#flameTurbulence)"}
        />
      </motion.svg>
    </div>
  );
}
