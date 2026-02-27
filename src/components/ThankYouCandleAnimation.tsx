"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/* ─── Types ─── */
type Phase = "entrance" | "lid-removing" | "unlit" | "igniting" | "burning";
type PType = "blue" | "core" | "inner" | "outer" | "ember" | "smoke";

interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  type: PType;
  seed: number;
}

/* ─── Layout constants ─── */
const W = 180;
const H = 300;
const WICK = { x: 90, y: 120 };

/* ─── Helpers ─── */
const rng = (lo: number, hi: number) => lo + Math.random() * (hi - lo);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function pColor(type: PType, t: number): string {
  switch (type) {
    case "blue":
      return `rgba(80,140,255,${lerp(0.18, 0, t).toFixed(2)})`;
    case "core":
      return `rgba(255,${Math.round(lerp(252, 200, t))},${Math.round(lerp(235, 120, t))},${lerp(0.35, 0, t).toFixed(2)})`;
    case "inner":
      return `rgba(255,${Math.round(lerp(210, 150, t))},${Math.round(lerp(50, 0, t))},${lerp(0.28, 0, t).toFixed(2)})`;
    case "outer":
      return `rgba(255,${Math.round(lerp(160, 75, t))},${Math.round(lerp(45, 15, t))},${lerp(0.12, 0, t).toFixed(2)})`;
    case "ember":
      return `rgba(255,${Math.round(lerp(210, 130, t))},${Math.round(lerp(75, 20, t))},${lerp(0.55, 0, t).toFixed(2)})`;
    case "smoke":
      return `rgba(180,175,170,${lerp(0.055, 0, t).toFixed(3)})`;
  }
}

/* ─── Flame base glow (primary flame body — large teardrop) ─── */
function drawFlameGlow(ctx: CanvasRenderingContext2D, time: number) {
  const flicker = 0.92 + 0.08 * Math.sin(time * 0.004) * Math.sin(time * 0.0067 + 0.7);
  const sway = Math.sin(time * 0.003) * 0.5;
  const cx = WICK.x + sway;

  /* Main flame body — wider, taller teardrop */
  const cyMain = WICK.y - 12;
  const rxMain = 12 * flicker;
  const ryMain = 26 * flicker;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.translate(cx, cyMain);
  ctx.scale(rxMain / ryMain, 1);

  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, ryMain);
  g.addColorStop(0, `rgba(255,255,240,${(0.70 * flicker).toFixed(2)})`);
  g.addColorStop(0.25, `rgba(255,220,120,${(0.55 * flicker).toFixed(2)})`);
  g.addColorStop(0.55, `rgba(255,170,60,${(0.28 * flicker).toFixed(2)})`);
  g.addColorStop(0.8, `rgba(255,140,40,${(0.08 * flicker).toFixed(2)})`);
  g.addColorStop(1, "transparent");

  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, ryMain, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  /* Flame tip — narrow bright point at top */
  const cyTip = WICK.y - 18;
  const rxTip = 5 * flicker;
  const ryTip = 16 * flicker;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.translate(cx, cyTip);
  ctx.scale(rxTip / ryTip, 1);

  const gTip = ctx.createRadialGradient(0, 0, 0, 0, 0, ryTip);
  gTip.addColorStop(0, `rgba(255,255,250,${(0.60 * flicker).toFixed(2)})`);
  gTip.addColorStop(0.3, `rgba(255,240,200,${(0.35 * flicker).toFixed(2)})`);
  gTip.addColorStop(0.6, `rgba(255,200,100,${(0.12 * flicker).toFixed(2)})`);
  gTip.addColorStop(1, "transparent");

  ctx.fillStyle = gTip;
  ctx.beginPath();
  ctx.arc(0, 0, ryTip, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/* ─── Dynamic light scatter on glass + wax ─── */
function drawLightScatter(ctx: CanvasRenderingContext2D, time: number) {
  const flicker = 0.92 + 0.08 * Math.sin(time * 0.004) * Math.sin(time * 0.0067 + 0.7);

  ctx.save();
  ctx.globalCompositeOperation = "source-over";

  /* a) Wax surface glow — warm pooled light on melted wax */
  const waxG = ctx.createRadialGradient(WICK.x, 136, 0, WICK.x, 136, 30);
  waxG.addColorStop(0, `rgba(255,210,120,${(0.08 * flicker).toFixed(3)})`);
  waxG.addColorStop(1, "transparent");
  ctx.fillStyle = waxG;
  ctx.beginPath();
  ctx.save();
  ctx.translate(WICK.x, 136);
  ctx.scale(1, 4 / 30);
  ctx.arc(0, 0, 30, 0, Math.PI * 2);
  ctx.restore();
  ctx.fill();

  /* b) Left glass wall highlight */
  const leftSway = Math.sin(time * 0.0025) * 1.5;
  const leftG = ctx.createRadialGradient(46, 140 + leftSway, 0, 46, 140 + leftSway, 35);
  leftG.addColorStop(0, `rgba(255,200,100,${(0.04 * flicker).toFixed(3)})`);
  leftG.addColorStop(1, "transparent");
  ctx.fillStyle = leftG;
  ctx.beginPath();
  ctx.save();
  ctx.translate(46, 140 + leftSway);
  ctx.scale(3 / 35, 1);
  ctx.arc(0, 0, 35, 0, Math.PI * 2);
  ctx.restore();
  ctx.fill();

  /* c) Right glass wall highlight — slightly dimmer, offset timing */
  const rightSway = Math.sin(time * 0.003 + 1.2) * 1.2;
  const rightG = ctx.createRadialGradient(134, 145 + rightSway, 0, 134, 145 + rightSway, 28);
  rightG.addColorStop(0, `rgba(255,200,100,${(0.025 * flicker).toFixed(3)})`);
  rightG.addColorStop(1, "transparent");
  ctx.fillStyle = rightG;
  ctx.beginPath();
  ctx.save();
  ctx.translate(134, 145 + rightSway);
  ctx.scale(2.5 / 28, 1);
  ctx.arc(0, 0, 28, 0, Math.PI * 2);
  ctx.restore();
  ctx.fill();

  ctx.restore();
}

/* ─── Particle factories ─── */
function mkFlame(time: number): P {
  const f = 0.85 + 0.3 * Math.sin(time * 0.003) * Math.sin(time * 0.0073 + 1.3);
  const r = Math.random();
  if (r < 0.2)
    return {
      x: WICK.x + rng(-1, 1) * f, y: WICK.y + rng(1, 4),
      vx: rng(-0.06, 0.06), vy: rng(-0.2, -0.4),
      life: 0, maxLife: rng(14, 24), size: rng(4, 6), type: "blue", seed: Math.random(),
    };
  if (r < 0.45)
    return {
      x: WICK.x + rng(-1.5, 1.5) * f, y: WICK.y + rng(-2, 2),
      vx: rng(-0.06, 0.06), vy: rng(-0.35, -0.7),
      life: 0, maxLife: rng(18, 30), size: rng(5, 7), type: "core", seed: Math.random(),
    };
  if (r < 0.7)
    return {
      x: WICK.x + rng(-2.5, 2.5) * f, y: WICK.y + rng(-3, 2),
      vx: rng(-0.1, 0.1), vy: rng(-0.5, -0.9),
      life: 0, maxLife: rng(20, 32), size: rng(5, 8), type: "inner", seed: Math.random(),
    };
  return {
    x: WICK.x + rng(-4, 4) * f, y: WICK.y + rng(-3, 3),
    vx: rng(-0.12, 0.12), vy: rng(-0.3, -0.55),
    life: 0, maxLife: rng(22, 36), size: rng(6, 10), type: "outer", seed: Math.random(),
  };
}

function mkEmber(): P {
  return {
    x: WICK.x + rng(-8, 8), y: WICK.y + rng(-15, -5),
    vx: rng(-0.25, 0.25), vy: rng(-0.22, -0.5),
    life: 0, maxLife: rng(60, 115), size: rng(1, 2.4), type: "ember", seed: Math.random(),
  };
}

function mkSmoke(): P {
  return {
    x: WICK.x + rng(-3, 3), y: WICK.y + rng(-18, -8),
    vx: rng(-0.08, 0.08), vy: rng(-0.14, -0.28),
    life: 0, maxLife: rng(80, 140), size: rng(4, 6), type: "smoke", seed: Math.random(),
  };
}

/* ─── Component ─── */
export default function ThankYouCandleAnimation({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("entrance");
  const phaseRef = useRef<Phase>("entrance");

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  /* Timeline */
  useEffect(() => {
    if (reduced) {
      setPhase("burning");
      return;
    }
    const t = [
      setTimeout(() => setPhase("lid-removing"), 350),
      setTimeout(() => setPhase("unlit"), 1200),
      setTimeout(() => setPhase("igniting"), 1500),
      setTimeout(() => setPhase("burning"), 1780),
    ];
    return () => t.forEach(clearTimeout);
  }, [reduced]);

  /* Canvas particle loop */
  useEffect(() => {
    if (reduced) return;
    const cvs = canvasRef.current;
    if (!cvs) return;
    const maybeCtx = cvs.getContext("2d");
    if (!maybeCtx) return;
    const ctx = maybeCtx;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cvs.width = W * dpr;
    cvs.height = H * dpr;
    ctx.scale(dpr, dpr);

    const ps: P[] = [];
    let raf = 0;
    let frame = 0;
    let ignFrame = -1;
    let nextEmber = 45;
    let nextSmoke = 70;

    function tick(time: number) {
      const ph = phaseRef.current;
      const lit = ph === "igniting" || ph === "burning";
      ctx.clearRect(0, 0, W, H);
      frame++;

      /* spawn flame */
      if (lit) {
        if (ignFrame < 0) ignFrame = frame;
        const since = frame - ignFrame;
        const rate = since < 15 ? 4 : 1;
        for (let i = 0; i < rate; i++) {
          const p = mkFlame(time);
          if (since < 15) p.size *= 1.35;
          ps.push(p);
        }
        /* ignition flash */
        if (since < 15) {
          ctx.globalCompositeOperation = "lighter";
          const a = Math.max(0, 1 - since / 15) * 0.45;
          const g = ctx.createRadialGradient(WICK.x, WICK.y, 0, WICK.x, WICK.y, 22);
          g.addColorStop(0, `rgba(255,255,240,${a})`);
          g.addColorStop(0.5, `rgba(255,200,80,${a * 0.4})`);
          g.addColorStop(1, "transparent");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(WICK.x, WICK.y, 22, 0, Math.PI * 2);
          ctx.fill();
        }

      }

      /* sporadic embers */
      if (ph === "burning" && frame >= nextEmber) {
        ps.push(mkEmber());
        nextEmber = frame + 35 + Math.floor(Math.random() * 45);
      }
      /* sporadic smoke */
      if (ph === "burning" && frame >= nextSmoke) {
        ps.push(mkSmoke());
        nextSmoke = frame + 35 + Math.floor(Math.random() * 50);
      }

      /* update + draw particles first (beneath flame glow) */
      ctx.filter = "blur(1.5px)";
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.life++;
        if (p.life >= p.maxLife) { ps.splice(i, 1); continue; }

        const t = p.life / p.maxLife;
        p.x += p.vx;
        p.y += p.vy;

        if (p.type === "ember") p.x += Math.sin(p.life * 0.05 + p.seed * 10) * 0.3;
        if (p.type === "smoke") {
          p.x += Math.sin(p.life * 0.02 + p.seed * 10) * 0.18;
          p.size += 0.07;
        }

        ctx.globalCompositeOperation = p.type === "smoke" ? "source-over" : "lighter";
        const sz = p.type === "smoke" ? p.size : p.size * (1 - t * 0.5);
        const col = pColor(p.type, t);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, sz);
        g.addColorStop(0, col);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, sz, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.filter = "none";

      /* soft teardrop glow on top of particles */
      if (lit) drawFlameGlow(ctx, time);

      /* dynamic light scatter on glass + wax */
      if (lit) drawLightScatter(ctx, time);

      /* hard cap on particles for safety */
      if (ps.length > 200) ps.splice(0, ps.length - 200);

      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const lidGone = phase !== "entrance";
  const lit = phase === "igniting" || phase === "burning";
  const burning = phase === "burning";

  return (
    <div
      className={className}
      style={{ position: "relative", width: W, height: H }}
      aria-hidden="true"
    >
      {/* ── Ambient light spill (larger, softer) ── */}
      <div
        className={burning && !reduced ? "glow-breathe" : undefined}
        style={{
          position: "absolute",
          left: "50%",
          top: WICK.y,
          width: 300,
          height: 300,
          borderRadius: "50%",
          transform: "translate(-50%,-50%)",
          background:
            "radial-gradient(circle,rgba(255,200,80,0.12) 0%,rgba(255,155,40,0.05) 45%,transparent 70%)",
          opacity: lit ? 1 : 0,
          transition: "opacity 0.8s ease",
          pointerEvents: "none",
        }}
      />

      {/* ── Background glow ── */}
      <div
        className={burning && !reduced ? "glow-breathe glow-flicker" : undefined}
        style={{
          position: "absolute",
          left: "50%",
          top: WICK.y,
          width: 130,
          height: 130,
          borderRadius: "50%",
          transform: "translate(-50%,-50%)",
          background:
            "radial-gradient(circle,rgba(255,200,80,0.22) 0%,rgba(255,155,40,0.08) 55%,transparent 72%)",
          opacity: lit ? 1 : 0,
          transition: "opacity 0.8s ease",
          pointerEvents: "none",
        }}
      />

      {/* ── Jar SVG ── */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* jar body */}
        <rect x={36} y={88} width={108} height={178} rx={8} fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth={1.5} />
        <rect x={37} y={89} width={106} height={176} rx={7} fill="rgba(255,255,255,0.03)" />

        {/* glass highlights */}
        <rect x={43} y={100} width={2} height={140} rx={1} fill="white" opacity={0.08} />
        <rect x={137} y={106} width={1.5} height={118} rx={0.75} fill="white" opacity={0.045} />

        {/* warm flame reflections on glass */}
        <ellipse cx={44} cy={103} rx={2.5} ry={18} fill="#FFC850" className={lit && !reduced ? "glass-flicker" : undefined} opacity={lit ? 0.035 : 0} style={{ transition: "opacity 0.6s ease" }} />
        <ellipse cx={136} cy={108} rx={2} ry={14} fill="#FFC850" className={lit && !reduced ? "glass-flicker-alt" : undefined} opacity={lit ? 0.025 : 0} style={{ transition: "opacity 0.6s ease" }} />

        {/* neck / thread ring — fades out with the lid */}
        <motion.rect
          x={33} y={78} width={114} height={14} rx={3}
          fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.11)" strokeWidth={1}
          initial={{ opacity: 1 }}
          animate={{ opacity: lidGone ? 0 : 1 }}
          transition={{ duration: 0.4, delay: lidGone ? 0.3 : 0 }}
        />

        {/* wax fill */}
        <rect x={38} y={134} width={104} height={128} rx={6} fill="#F5E8D0" opacity={0.85} />
        <ellipse cx={90} cy={134} rx={50} ry={6} fill="#F0DFC0" />
        <ellipse cx={90} cy={134} rx={24} ry={3.5} fill="#E8D4B0" />

        {/* wick */}
        <line x1={90} y1={134} x2={90} y2={WICK.y} stroke="#4A3728" strokeWidth={1.5} strokeLinecap="round" />
        {lit && <circle cx={90} cy={WICK.y} r={2} fill="#FF6600" opacity={0.75} />}

        {/* ── Label ── */}
        <rect x={46} y={160} width={88} height={55} rx={3} fill="#5C2434" opacity={0.82} />
        <rect x={49} y={163} width={82} height={49} rx={2} fill="none" stroke="#D4A843" strokeWidth={0.5} opacity={0.45} />
        <rect x={52} y={166} width={76} height={43} rx={1.5} fill="none" stroke="#D4A843" strokeWidth={0.3} opacity={0.28} />

        {/* emboss highlight */}
        <text x={90} y={181} textAnchor="middle" fill="rgba(255,255,255,0.055)" fontSize={8} fontFamily="'Playfair Display',serif" letterSpacing={2.5}>
          CANTERBURY
        </text>
        <text x={90} y={181.6} textAnchor="middle" fill="#D4A843" fontSize={8} fontFamily="'Playfair Display',serif" letterSpacing={2.5}>
          CANTERBURY
        </text>

        <line x1={60} y1={187.5} x2={120} y2={187.5} stroke="#D4A843" strokeWidth={0.35} opacity={0.38} />

        <text x={90} y={201} textAnchor="middle" fill="rgba(255,255,255,0.055)" fontSize={11} fontFamily="'Playfair Display',serif" letterSpacing={1.5} fontStyle="italic">
          Candles
        </text>
        <text x={90} y={201.6} textAnchor="middle" fill="#D4A843" fontSize={11} fontFamily="'Playfair Display',serif" letterSpacing={1.5} fontStyle="italic">
          Candles
        </text>

        {/* ── Lid (animated) ── */}
        <motion.g
          style={{ transformOrigin: "90px 72px" }}
          initial={{ y: 0, rotate: 0, opacity: 1 }}
          animate={
            lidGone
              ? {
                  y: [0, -1.5, 1.5, -2, 0, -22, -42],
                  rotate: [0, -2.5, 2.5, -2, 0.5, 7.5, 10],
                  opacity: [1, 1, 1, 1, 1, 0.45, 0],
                }
              : undefined
          }
          transition={
            lidGone
              ? {
                  duration: 0.85,
                  ease: [0.16, 1, 0.3, 1],
                  times: [0, 0.09, 0.19, 0.28, 0.35, 0.72, 1],
                }
              : undefined
          }
        >
          {/* lid band */}
          <rect x={30} y={65} width={120} height={16} rx={3} fill="#8B7355" />
          <rect x={33} y={66} width={114} height={5} rx={2} fill="#A8935C" opacity={0.45} />
          {/* warm reflection on lid */}
          <rect x={33} y={66} width={114} height={5} rx={2} fill="#FFC850" opacity={0.06} />
          {/* lid cap */}
          <rect x={32} y={58} width={116} height={10} rx={4} fill="#7A6548" />
          <rect x={35} y={59} width={110} height={4} rx={2} fill="#A08A60" opacity={0.35} />
        </motion.g>
      </svg>

      {/* ── Canvas (flame + embers + smoke) ── */}
      {!reduced && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ width: W, height: H }}
        />
      )}

      {/* ── Heat distortion ── */}
      {burning && !reduced && (
        <svg
          className="absolute pointer-events-none"
          style={{ left: 55, top: 26, width: 70, height: 82 }}
          viewBox="0 0 70 82"
        >
          <defs>
            <filter id="ty-heat" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="turbulence" baseFrequency="0.02 0.04" numOctaves={2} seed={2} result="n">
                <animate attributeName="baseFrequency" values="0.02 0.04;0.025 0.05;0.018 0.035;0.02 0.04" dur="4s" repeatCount="indefinite" />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="n" scale={5} xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <linearGradient id="ty-hg" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#FFC850" stopOpacity={0.07} />
              <stop offset="100%" stopColor="#FFC850" stopOpacity={0} />
            </linearGradient>
          </defs>
          <ellipse cx={35} cy={48} rx={24} ry={34} fill="url(#ty-hg)" filter="url(#ty-heat)" />
        </svg>
      )}

      {/* ── Reduced-motion fallback: static glow ── */}
      {reduced && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: WICK.y,
            width: 80,
            height: 80,
            borderRadius: "50%",
            transform: "translate(-50%,-50%)",
            background: "radial-gradient(circle,rgba(255,200,80,0.18) 0%,transparent 70%)",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}
