"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";
import { formatCredits } from "@/lib/format";

export default function InventoryPage() {
  const inventory = useStore((s) => s.inventory);
  const hasHydrated = useStore((s) => s.hasHydrated);
  const sellInventoryItem = useStore((s) => s.sellInventoryItem);

  const totalMarket = inventory.reduce((sum, i) => sum + i.item.marketValue, 0);
  const totalBuyback = inventory.reduce((sum, i) => sum + i.item.buybackValue, 0);

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">Inventory</h1>
          <p className="mt-1 text-sm text-muted">
            Items you&rsquo;ve kept from crate openings. Sell any time for 80% of market value.
          </p>
        </div>
        {hasHydrated && inventory.length > 0 && (
          <div className="glass-card flex gap-4 rounded-2xl px-4 py-3 text-sm">
            <div>
              <div className="text-[10px] uppercase tracking-wide text-muted">Market total</div>
              <div className="font-display font-bold tabular-nums">{formatCredits(totalMarket)} cr</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wide text-muted">Buyback total</div>
              <div className="font-display font-bold tabular-nums text-positive">
                {formatCredits(totalBuyback)} cr
              </div>
            </div>
          </div>
        )}
      </div>

      {!hasHydrated ? (
        <div className="mt-10 text-sm text-muted">Loading inventory…</div>
      ) : inventory.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center gap-3 text-center">
          <div className="glass-card flex h-16 w-16 items-center justify-center rounded-2xl">
            <svg width="28" height="28" viewBox="0 0 16 16" fill="none">
              <path d="M2 5.5L8 2l6 3.5v5L8 14l-6-3.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" opacity="0.6" />
              <path d="M2 5.5L8 9l6-3.5M8 9v5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" opacity="0.6" />
            </svg>
          </div>
          <p className="font-display text-lg font-bold">Nothing kept yet</p>
          <p className="max-w-sm text-sm text-muted">
            Open a crate and choose &ldquo;Keep Item&rdquo; to start building your inventory.
          </p>
          <Link
            href="/"
            className="mt-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black transition-transform hover:scale-[1.03]"
          >
            Browse crates
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {inventory.map((inv) => (
            <ProductCard
              key={inv.uid}
              item={inv.item}
              crateName={inv.crateName}
              footer={
                <button
                  onClick={() => sellInventoryItem(inv.uid)}
                  className="w-full rounded-full border border-positive/40 bg-positive/10 py-2 text-xs font-bold text-positive transition-colors hover:bg-positive/20"
                >
                  Sell for {formatCredits(inv.item.buybackValue)} cr
                </button>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
