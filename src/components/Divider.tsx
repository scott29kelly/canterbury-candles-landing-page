interface DividerProps {
  variant?: "cream-to-dark" | "dark-to-cream" | "cream-to-cream";
}

export default function Divider({ variant = "cream-to-dark" }: DividerProps) {
  const colors = {
    "cream-to-dark": { from: "from-cream", to: "to-forest-950" },
    "dark-to-cream": { from: "from-forest-950", to: "to-bronze-50" },
    "cream-to-cream": { from: "from-cream", to: "to-cream" },
  };

  const { from, to } = colors[variant];

  return (
    <div className={`relative h-24 bg-gradient-to-b ${from} ${to}`}>
      <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-center">
        <div className="h-px w-16 bg-bronze-500/20" />
        <div className="mx-4 h-1.5 w-1.5 rotate-45 border border-bronze-500/30" />
        <div className="h-px w-16 bg-bronze-500/20" />
      </div>
    </div>
  );
}
