interface SectionDividerProps {
  variant?: "forest-to-cream" | "cream-to-forest" | "cream-to-cream-dark" | "cream-dark-to-forest";
}

export default function SectionDivider({ variant = "forest-to-cream" }: SectionDividerProps) {
  const colors: Record<string, [string, string]> = {
    "forest-to-cream": ["#1B3A2D", "#FFF8F0"],
    "cream-to-forest": ["#FFF8F0", "#1B3A2D"],
    "cream-to-cream-dark": ["#FFF8F0", "#F5EDDF"],
    "cream-dark-to-forest": ["#F5EDDF", "#1B3A2D"],
  };

  const [from, to] = colors[variant];

  return (
    <div className="relative h-24 w-full overflow-hidden" style={{ background: from }}>
      <svg
        viewBox="0 0 1440 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-0 left-0 w-full"
        preserveAspectRatio="none"
      >
        <path
          d="M0 96L1440 96L1440 32C1280 8 1120 0 960 8C800 16 640 40 480 48C320 56 160 48 80 44L0 40L0 96Z"
          fill={to}
        />
      </svg>
    </div>
  );
}
