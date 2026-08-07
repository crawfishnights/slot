"use client";

import { useStore } from "@/lib/store";
import { ProductArt } from "@/components/art/ProductArt";
import { formatCredits } from "@/lib/format";

export function RecentPulls() {
  const pulls = useStore((s) => s.recentPulls);
  const hasHydrated = useStore((s) => s.hasHydrated);

  if (!hasHydrated || pulls.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold">Recent pulls</h2>
        <span className="text-xs text-muted">This session</span>
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
        {pulls.map((pull) => (
          <div
            key={pull.uid}
            className="glass-card flex min-w-[168px] shrink-0 flex-col gap-2 rounded-2xl p-3"
          >
            <div className="flex aspect-square items-center justify-center rounded-xl bg-surface-2/60">
              <ProductArt
                category={pull.item.category}
                colors={pull.item.colors}
                brandTier={pull.item.brand.tier}
                brandInitial={pull.item.brand.name.charAt(0)}
                className="h-full w-full p-2"
              />
            </div>
            <div>
              <div className="truncate text-xs font-semibold">{pull.item.name}</div>
              <div className="truncate text-[10px] text-muted">{pull.crateName}</div>
              <div className="mt-0.5 font-display text-xs font-bold text-credit">
                {formatCredits(pull.item.marketValue)} cr
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
