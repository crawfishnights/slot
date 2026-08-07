import { MarketTier, tierLabel } from "@/lib/types";

export function MarketTierBadge({ tier, size = "sm" }: { tier: MarketTier; size?: "sm" | "md" }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border border-border font-mono font-bold tracking-wide text-muted ${
        size === "md" ? "px-2 py-0.5 text-[11px]" : "px-1.5 py-0.5 text-[10px]"
      }`}
      title="Market Tier — this product's standing within its own category, independent of price or drop odds"
    >
      {tierLabel(tier)}
    </span>
  );
}
