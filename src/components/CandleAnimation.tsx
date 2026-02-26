"use client";

import { useReducedMotion } from "motion/react";

export default function CandleAnimation({
  intensity = 1,
}: {
  intensity?: number;
}) {
  const prefersReduced = useReducedMotion();

  const showSmoke = intensity > 0.5 && !prefersReduced;
  const animClass = prefersReduced ? "" : "candle-animated";

  return (
    <div
      aria-hidden="true"
      className="relative"
      style={{ width: 120, height: 240 }}
    >
      {/* Smoke wisps */}
      {showSmoke && (
        <>
          <span
            className="absolute left-1/2 smoke-wisp"
            style={{
              top: 48,
              marginLeft: -3,
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(200,200,200,0.12) 0%, transparent 70%)",
              filter: "blur(2px)",
              mixBlendMode: "screen",
              animationDelay: "0s",
            }}
          />
          <span
            className="absolute left-1/2 smoke-wisp"
            style={{
              top: 50,
              marginLeft: 1,
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(200,200,200,0.10) 0%, transparent 70%)",
              filter: "blur(2.5px)",
              mixBlendMode: "screen",
              animationDelay: "1.2s",
            }}
          />
          <span
            className="absolute left-1/2 smoke-wisp"
            style={{
              top: 46,
              marginLeft: -5,
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(200,200,200,0.09) 0%, transparent 70%)",
              filter: "blur(3px)",
              mixBlendMode: "screen",
              animationDelay: "2.4s",
            }}
          />
        </>
      )}

      {/* Flame group — positioned at wick tip */}
      <div
        className="absolute left-1/2 flex items-center justify-center"
        style={{
          top: 42,
          transform: "translateX(-50%)",
          width: 40,
          height: 50,
          opacity: intensity,
          transition: "opacity 800ms ease, transform 800ms ease",
        }}
      >
        {/* Warm glow */}
        <div
          className={`absolute ${animClass ? "glow-pulse-anim" : ""}`}
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,200,80,0.3) 0%, rgba(255,180,60,0.1) 50%, transparent 70%)",
            filter: "blur(8px)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Sway wrapper */}
        <div className={animClass ? "flame-sway-anim" : ""}>
          {/* Outer flame — amber teardrop */}
          <div
            className={`absolute ${animClass ? "flame-flicker-shape-anim" : ""}`}
            style={{
              width: 18,
              height: 32,
              left: "50%",
              top: "50%",
              marginLeft: -9,
              marginTop: -18,
              borderRadius: "2% 87% 45% 85%",
              transform: "rotate(45deg)",
              background: "radial-gradient(ellipse at 50% 60%, #FFD700 0%, #FFA500 40%, #E07020 70%, transparent 100%)",
              filter: "blur(1px)",
              opacity: intensity,
              transition: "opacity 800ms ease",
            }}
          />
          {/* Inner flame — white-gold teardrop */}
          <div
            className={`absolute ${animClass ? "flame-flicker-shape-inner-anim" : ""}`}
            style={{
              width: 10,
              height: 20,
              left: "50%",
              top: "50%",
              marginLeft: -5,
              marginTop: -12,
              borderRadius: "2% 87% 45% 85%",
              transform: "rotate(45deg)",
              background: "radial-gradient(ellipse at 50% 60%, #FFF8E8 0%, #FFE4A0 40%, #FFD060 80%, transparent 100%)",
              filter: "blur(0.5px)",
              opacity: intensity,
              transition: "opacity 800ms ease",
            }}
          />
        </div>
      </div>

      {/* SVG Mason Jar */}
      <svg
        viewBox="0 0 120 200"
        className="absolute inset-0 w-full h-full"
        style={{ top: 40 }}
      >
        {/* Jar body — glass outline */}
        <rect
          x={20} y={45} width={80} height={130} rx={8}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={1.5}
        />
        {/* Glass tint fill */}
        <rect
          x={21} y={46} width={78} height={128} rx={7}
          fill="rgba(255,255,255,0.04)"
        />
        {/* Glass highlight — left */}
        <rect
          x={26} y={55} width={2} height={100} rx={1}
          fill="white" opacity={0.10}
        />
        {/* Glass highlight — right */}
        <rect
          x={92} y={60} width={1.5} height={90} rx={0.75}
          fill="white" opacity={0.06}
        />

        {/* Wax fill */}
        <rect
          x={22} y={90} width={76} height={82} rx={6}
          fill="#F5E8D0" opacity={0.85}
        />
        {/* Wax pool surface — outer */}
        <ellipse
          cx={60} cy={90} rx={36} ry={5}
          fill="#F0DFC0"
        />
        {/* Wax pool surface — inner (melted well) */}
        <ellipse
          cx={60} cy={90} rx={20} ry={3}
          fill="#E8D4B0"
        />

        {/* Wick */}
        <line
          x1={60} y1={90} x2={60} y2={68}
          stroke="#4A3728" strokeWidth={1.5}
          strokeLinecap="round"
        />

        {/* Jar rim / lid band */}
        <rect
          x={16} y={38} width={88} height={10} rx={2}
          fill="#8B7355"
        />
        {/* Rim highlight */}
        <rect
          x={18} y={39} width={84} height={3} rx={1}
          fill="#A8935C" opacity={0.5}
        />

        {/* Brand label */}
        <rect
          x={38} y={120} width={44} height={28} rx={3}
          fill="rgba(92,36,52,0.7)"
        />
        <text
          x={60} y={139}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#D4A843"
          fontSize={14}
          fontFamily="serif"
          fontWeight="bold"
          letterSpacing={2}
        >
          CC
        </text>
      </svg>
    </div>
  );
}
