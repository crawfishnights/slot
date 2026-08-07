function ChiliIcon({ active }: { active: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M6 3c.5-1 1.8-1.6 2.6-.8"
        stroke={active ? "#5c8a4a" : "#4a463d"}
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M6.2 4.4c2.4-1.1 5 .3 5.9 3 1 3-1 7.6-4.3 8-2.6.3-4.8-2-4.8-4.8 0-2.6 1.2-5.1 3.2-6.2z"
        fill={active ? "#e2492c" : "#2a2721"}
        stroke={active ? "#a8341f" : "#35312a"}
        strokeWidth="0.6"
      />
      {active && <ellipse cx="8.4" cy="6.6" rx="1" ry="1.8" fill="#ff8a63" opacity="0.7" transform="rotate(-20 8.4 6.6)" />}
    </svg>
  );
}

export function SpiceLevel({
  level,
  size = "sm",
  showLabel = true,
}: {
  level: 1 | 2 | 3 | 4 | 5;
  size?: "sm" | "md";
  showLabel?: boolean;
}) {
  const LABELS: Record<number, string> = {
    1: "Mild",
    2: "Steady",
    3: "Spiced",
    4: "Hot",
    5: "Volatile",
  };
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <ChiliIcon key={i} active={i < level} />
        ))}
      </div>
      {showLabel && (
        <span className={`font-medium text-muted ${size === "md" ? "text-xs" : "text-[11px]"}`}>
          {LABELS[level]}
        </span>
      )}
    </div>
  );
}
