"use client";

import { motion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

const DRIPS = [
  { left: "22%", width: 3, height: 14, delay: 0 },
  { left: "55%", width: 4, height: 18, delay: 0.15 },
  { left: "78%", width: 3, height: 11, delay: 0.3 },
];

export default function WaxDrip({ active }: { active: boolean }) {
  return (
    <div className="hidden md:block absolute inset-x-0 top-0 z-10 pointer-events-none">
      {DRIPS.map((drip, i) => (
        <motion.div
          key={i}
          className="absolute top-0 rounded-b-full"
          style={{
            left: drip.left,
            width: drip.width,
            background:
              "linear-gradient(to bottom, #D4A843, #B8860B)",
          }}
          initial={{ height: 0, opacity: 0 }}
          animate={
            active
              ? { height: drip.height, opacity: 0.85 }
              : { height: 0, opacity: 0 }
          }
          transition={{
            duration: 0.5,
            ease: EASE,
            delay: active ? drip.delay : 0,
          }}
        />
      ))}
    </div>
  );
}
