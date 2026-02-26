"use client";

import { useRef, useEffect } from "react";
import { useReducedMotion } from "motion/react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  size: number;
  isSpark: boolean;
}

// Brand color temperature ramp (white-hot → gold → amber → deep orange)
const COLOR_RAMP = [
  [255, 248, 232], // #FFF8E8 white-hot
  [255, 208, 106], // #FFD06A gold
  [224, 122, 32],  // #E07A20 amber
  [192, 80, 26],   // #C0501A deep orange
];

function lerpColor(t: number): [number, number, number, number] {
  // t: 0 = newborn (white-hot), 1 = dying (deep orange → transparent)
  const clamped = Math.max(0, Math.min(1, t));
  const idx = clamped * (COLOR_RAMP.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.min(lo + 1, COLOR_RAMP.length - 1);
  const frac = idx - lo;
  const r = COLOR_RAMP[lo][0] + (COLOR_RAMP[hi][0] - COLOR_RAMP[lo][0]) * frac;
  const g = COLOR_RAMP[lo][1] + (COLOR_RAMP[hi][1] - COLOR_RAMP[lo][1]) * frac;
  const b = COLOR_RAMP[lo][2] + (COLOR_RAMP[hi][2] - COLOR_RAMP[lo][2]) * frac;
  // Fade out as particle dies
  const alpha = clamped < 0.7 ? 1 : 1 - (clamped - 0.7) / 0.3;
  return [r, g, b, alpha];
}

export default function CandleFlameCanvas({
  width = 96,
  height = 128,
  intensity = 1,
}: {
  width?: number;
  height?: number;
  intensity?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // HiDPI setup
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Reduced motion: static golden glow
    if (prefersReduced) {
      const grd = ctx.createRadialGradient(
        width / 2, height * 0.55, 2,
        width / 2, height * 0.55, width * 0.4
      );
      grd.addColorStop(0, "rgba(255,248,232,0.9)");
      grd.addColorStop(0.3, "rgba(255,208,106,0.6)");
      grd.addColorStop(0.6, "rgba(224,122,32,0.3)");
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, width, height);
      return;
    }

    const particles: Particle[] = [];
    let animId = 0;
    let startTime = performance.now();

    function spawnParticle(currentIntensity: number) {
      // Elliptical spawn area at flame base
      const angle = Math.random() * Math.PI * 2;
      const rx = 6 * Math.random();
      const ry = 3 * Math.random();
      const isSpark = Math.random() < 0.08;

      particles.push({
        x: width / 2 + Math.cos(angle) * rx,
        y: height * 0.72 + Math.sin(angle) * ry,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(1.2 + Math.random() * 1.8) * currentIntensity,
        life: 1,
        decay: 0.008 + Math.random() * 0.012,
        size: isSpark ? (1.5 + Math.random() * 2) : (4 + Math.random() * 6),
        isSpark,
      });
    }

    function render() {
      ctx!.clearRect(0, 0, width, height);
      ctx!.globalCompositeOperation = "lighter";

      const elapsed = (performance.now() - startTime) / 1000;
      // Ignition ramp: 0→1 over 0.5s, then use prop intensity
      const ignitionRamp = Math.min(1, elapsed / 0.5);
      const currentIntensity = ignitionRamp * intensity;

      // Spawn particles based on intensity
      const spawnCount = Math.round(3 + currentIntensity * 2);
      for (let i = 0; i < spawnCount; i++) {
        if (particles.length < 100) {
          spawnParticle(currentIntensity);
        }
      }

      // Update + draw
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        // Horizontal turbulence
        p.vx += (Math.sin(elapsed * 3 + p.y * 0.1) * 0.05 + (Math.random() - 0.5) * 0.08);
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const age = 1 - p.life; // 0 = new, 1 = dead
        const [r, g, b, a] = lerpColor(age);
        const currentSize = p.size * p.life * currentIntensity;

        if (currentSize < 0.3) continue;

        // Each particle is a soft radial gradient halo
        const grd = ctx!.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, currentSize
        );
        const baseAlpha = a * (p.isSpark ? 0.9 : 0.35) * currentIntensity;
        grd.addColorStop(0, `rgba(${r|0},${g|0},${b|0},${baseAlpha.toFixed(3)})`);
        grd.addColorStop(1, `rgba(${r|0},${g|0},${b|0},0)`);

        ctx!.fillStyle = grd;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx!.fill();
      }

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [width, height, intensity, prefersReduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ width, height }}
      className="block"
    />
  );
}
