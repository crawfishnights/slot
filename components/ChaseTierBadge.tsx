import { CHASE_TIER_LABEL, ChaseTier } from "@/lib/types";

const TIER_STYLE: Record<ChaseTier, { color: string; bg: string }> = {
  headliner: { color: "#f4c95d", bg: "rgba(244,201,93,0.14)" },
  major_chase: { color: "#e2492c", bg: "rgba(226,73,44,0.14)" },
  solid_hit: { color: "#8bb98a", bg: "rgba(139,185,138,0.14)" },
  break_even: { color: "#a89f8f", bg: "rgba(168,159,143,0.12)" },
  ground_loot: { color: "#766f61", bg: "rgba(118,111,97,0.12)" },
};

export function ChaseTierBadge({ tier }: { tier: ChaseTier }) {
  const style = TIER_STYLE[tier];
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
      style={{ color: style.color, background: style.bg }}
    >
      {CHASE_TIER_LABEL[tier]}
    </span>
  );
}
