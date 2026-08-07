"use client";

import { useStore } from "@/lib/store";
import { ProductArt } from "@/components/art/ProductArt";
import { getBrand } from "@/lib/data/brands";
import { formatCredits } from "@/lib/format";

export function RecentPulls() {
  const pulls = useStore((s) => s.recentPulls);
  const hasHydrated = useStore((s) => s.hasHydrated);

  if (!hasHydrated || pulls.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-5 sm:px-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-2">Your recent pulls</h2>
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
        {pulls.slice(0, 12).map((pull) => {
          const brand = getBrand(pull.item.brandId);
          const isBig = pull.item.chaseTier === "headliner" || pull.item.chaseTier === "major_chase";
          return (
            <div
              key={pull.uid}
              className="flex min-w-[140px] shrink-0 items-center gap-2.5 rounded-xl border p-2"
              style={{
                borderColor: isBig ? "rgba(244,201,93,0.35)" : "var(--border-soft)",
                background: isBig ? "rgba(244,201,93,0.05)" : "var(--surface)",
              }}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface-2/70">
                <ProductArt subtype={pull.item.subtype} brand={brand} flavorOrEdition={pull.item.flavorOrEdition} className="h-full w-full p-0.5" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-[12px] font-medium">{pull.item.name}</div>
                <div className="truncate text-[10px] text-muted">{pull.crateName}</div>
                <div className={`font-display text-[11px] font-semibold ${isBig ? "text-credit" : ""}`}>
                  {formatCredits(pull.item.marketValue)} cr
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
