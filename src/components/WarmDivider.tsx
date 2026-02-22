export default function WarmDivider({
  className = "",
  variant = "wide",
}: {
  className?: string;
  variant?: "wide" | "narrow";
}) {
  const base =
    variant === "wide"
      ? "w-full"
      : "w-12 mx-auto";

  return (
    <div className={`relative ${base} ${className}`}>
      {/* Soft glow aura beneath */}
      <div
        className="absolute inset-0 h-px warm-glow-line opacity-50"
        style={{ filter: "blur(4px)" }}
      />
      {/* Main ember line */}
      <div className="h-px warm-glow-line" />
    </div>
  );
}
