"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Item } from "@/lib/types";
import { getBrand } from "@/lib/data/brands";
import { ProductArt } from "@/components/art/ProductArt";
import { CategoryBadge } from "@/components/CategoryBadge";
import { ChaseTierBadge } from "@/components/ChaseTierBadge";
import { formatCredits, formatUsd } from "@/lib/format";

interface RevealPanelProps {
  item: Item;
  onKeep: () => void;
  onSell: () => void;
  onOpenAgain: () => void;
  canAfford: boolean;
}

export function RevealPanel({ item, onKeep, onSell, onOpenAgain, canAfford }: RevealPanelProps) {
  const brand = getBrand(item.brandId);
  const isBig = item.chaseTier === "headliner" || item.chaseTier === "major_chase";

  return (
    <motion.div
      className="flex w-full max-w-3xl flex-col items-center px-5 text-center"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
    >
      <span className="text-xs font-bold uppercase tracking-[0.25em] text-muted">You pulled</span>

      <div className="relative mt-4 flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64">
        {isBig && (
          <div
            className="pulse-ring absolute inset-8 rounded-full"
            style={{ background: item.chaseTier === "headliner" ? "rgba(244,201,93,0.18)" : "rgba(226,73,44,0.16)" }}
          />
        )}
        <div
          className="absolute inset-0 rounded-full blur-2xl"
          style={{ background: `radial-gradient(circle, ${brand.colors[0]}33, transparent 70%)` }}
        />
        <ProductArt
          renderShape={item.renderShape}
          brand={brand}
          flavorOrEdition={item.flavorOrEdition}
          className="relative h-full w-full drop-shadow-2xl"
        />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <ChaseTierBadge tier={item.chaseTier} />
        <CategoryBadge category={item.category} size="md" />
      </div>

      <span className="mt-3 text-xs font-bold uppercase tracking-wider" style={{ color: brand.colors[0] }}>
        {brand.name}
      </span>
      <h2 className="font-display mt-1 text-2xl font-semibold sm:text-3xl">{item.name}</h2>
      <p className="mt-1 text-sm text-muted">{item.flavorOrEdition}</p>

      <div className="mt-6 grid w-full max-w-md grid-cols-3 gap-3">
        <div className="rounded-2xl border border-border-soft bg-surface p-3">
          <div className="text-[10px] uppercase tracking-wide text-muted">Market</div>
          <div className="font-display text-base font-semibold tabular-nums">{formatCredits(item.marketValue)}</div>
          <div className="text-[10px] text-muted">{formatUsd(item.marketValue)}</div>
        </div>
        <div className="rounded-2xl border border-border-soft bg-surface p-3">
          <div className="text-[10px] uppercase tracking-wide text-muted">Buyback</div>
          <div className="font-display text-base font-semibold tabular-nums text-positive">{formatCredits(item.buybackValue)}</div>
          <div className="text-[10px] text-muted">{formatUsd(item.buybackValue)}</div>
        </div>
        <div className="rounded-2xl border border-border-soft bg-surface p-3">
          <div className="text-[10px] uppercase tracking-wide text-muted">Odds</div>
          <div className="font-display text-base font-semibold tabular-nums">{item.odds}%</div>
          <div className="text-[10px] text-muted">posted rate</div>
        </div>
      </div>

      <div className="mt-7 flex w-full max-w-md flex-col gap-2.5">
        <div className="flex w-full gap-2.5">
          <button
            onClick={onKeep}
            className="flex-1 rounded-full bg-cream py-3 text-sm font-semibold text-background transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Keep Item
          </button>
          <button
            onClick={onSell}
            className="flex-1 rounded-full border border-positive/40 bg-positive/10 py-3 text-sm font-semibold text-positive transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Sell for {formatCredits(item.buybackValue)}
          </button>
        </div>
        <div className="flex w-full gap-2.5">
          <button
            onClick={onOpenAgain}
            disabled={!canAfford}
            className="flex-1 rounded-full border border-border-soft py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
          >
            Keep &amp; Open Again
          </button>
          <Link
            href={`/marketplace/${item.id}`}
            className="flex flex-1 items-center justify-center rounded-full border border-border-soft py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface"
          >
            View Market Item
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
