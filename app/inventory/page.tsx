"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { CRATES } from "@/lib/data/crates";
import { Item } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { formatCredits } from "@/lib/format";

interface Stack {
  key: string;
  item: Item;
  crateSlug: string;
  crateName: string;
  uids: string[];
}

export default function InventoryPage() {
  const inventory = useStore((s) => s.inventory);
  const hasHydrated = useStore((s) => s.hasHydrated);
  const sellInventoryItem = useStore((s) => s.sellInventoryItem);
  const sellInventoryItems = useStore((s) => s.sellInventoryItems);

  const [crateFilter, setCrateFilter] = useState<"all" | string>("all");

  const totalMarket = inventory.reduce((sum, i) => sum + i.item.marketValue, 0);
  const totalBuyback = inventory.reduce((sum, i) => sum + i.item.buybackValue, 0);

  const stacks = useMemo<Stack[]>(() => {
    const byKey = new Map<string, Stack>();
    for (const inv of inventory) {
      const key = `${inv.crateSlug}:${inv.item.id}`;
      const existing = byKey.get(key);
      if (existing) {
        existing.uids.push(inv.uid);
      } else {
        byKey.set(key, {
          key,
          item: inv.item,
          crateSlug: inv.crateSlug,
          crateName: inv.crateName,
          uids: [inv.uid],
        });
      }
    }
    return Array.from(byKey.values()).sort((a, b) => b.item.marketValue - a.item.marketValue);
  }, [inventory]);

  const filteredStacks = crateFilter === "all" ? stacks : stacks.filter((s) => s.crateSlug === crateFilter);

  const progressByCrate = useMemo(() => {
    const ownedIds = new Set(inventory.map((i) => `${i.crateSlug}:${i.item.id}`));
    return CRATES.map((crate) => ({
      crate,
      owned: crate.items.filter((i) => ownedIds.has(`${crate.slug}:${i.id}`)).length,
      total: crate.items.length,
    }));
  }, [inventory]);

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-5 py-9 sm:px-8">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Inventory</h1>
          <p className="mt-1 text-sm text-muted">
            Items you&rsquo;ve kept from crate openings. Sell any time for 80% of market value.
          </p>
        </div>
        {hasHydrated && inventory.length > 0 && (
          <div className="paper-card flex divide-x divide-border-soft rounded-2xl text-sm">
            <div className="px-4 py-3">
              <div className="text-[10px] uppercase tracking-wide text-muted">Items held</div>
              <div className="font-display font-semibold tabular-nums">{inventory.length}</div>
            </div>
            <div className="px-4 py-3">
              <div className="text-[10px] uppercase tracking-wide text-muted">Market total</div>
              <div className="font-display font-semibold tabular-nums">{formatCredits(totalMarket)} cr</div>
            </div>
            <div className="px-4 py-3">
              <div className="text-[10px] uppercase tracking-wide text-muted">Buyback total</div>
              <div className="font-display font-semibold tabular-nums text-positive">
                {formatCredits(totalBuyback)} cr
              </div>
            </div>
          </div>
        )}
      </div>

      {hasHydrated && inventory.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {progressByCrate.map(({ crate, owned, total }) => {
            const pct = Math.round((owned / total) * 100);
            const active = crateFilter === crate.slug;
            return (
              <button
                key={crate.slug}
                onClick={() => setCrateFilter(active ? "all" : crate.slug)}
                className={`flex flex-col gap-2 rounded-2xl border p-3.5 text-left transition-colors ${
                  active ? "border-cream/40 bg-surface" : "border-border-soft bg-surface hover:border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">{crate.name}</span>
                  <span className="text-[11px] tabular-nums text-muted">
                    {owned}/{total}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${crate.palette.primary}, ${crate.palette.secondary})`,
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {!hasHydrated ? (
        <div className="mt-10 text-sm text-muted">Loading inventory…</div>
      ) : inventory.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center gap-3 text-center">
          <div className="paper-card flex h-16 w-16 items-center justify-center rounded-2xl">
            <svg width="28" height="28" viewBox="0 0 16 16" fill="none">
              <path d="M2 5.5L8 2l6 3.5v5L8 14l-6-3.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" opacity="0.6" />
              <path d="M2 5.5L8 9l6-3.5M8 9v5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" opacity="0.6" />
            </svg>
          </div>
          <p className="font-display text-lg font-semibold">Nothing kept yet</p>
          <p className="max-w-sm text-sm text-muted">
            Open a crate and choose &ldquo;Keep Item&rdquo; to start building your inventory.
          </p>
          <Link
            href="/"
            className="mt-2 rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-background transition-transform hover:scale-[1.03]"
          >
            Browse crates
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {filteredStacks.map((stack) => {
            const qty = stack.uids.length;
            return (
              <ProductCard
                key={stack.key}
                item={stack.item}
                crateName={stack.crateName}
                quantity={qty}
                footer={
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => sellInventoryItem(stack.uids[0])}
                      className="w-full rounded-full border border-positive/40 bg-positive/10 py-2 text-xs font-semibold text-positive transition-colors hover:bg-positive/20"
                    >
                      Sell 1 for {formatCredits(stack.item.buybackValue)} cr
                    </button>
                    {qty > 1 && (
                      <button
                        onClick={() => sellInventoryItems(stack.uids)}
                        className="w-full rounded-full text-[11px] font-medium text-muted transition-colors hover:text-foreground"
                      >
                        Sell all {qty} for {formatCredits(stack.item.buybackValue * qty)} cr
                      </button>
                    )}
                  </div>
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
