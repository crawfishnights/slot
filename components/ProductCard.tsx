"use client";

import { ReactNode } from "react";
import { Item } from "@/lib/types";
import { ProductArt } from "@/components/art/ProductArt";
import { getBrand } from "@/lib/data/brands";
import { CategoryBadge } from "@/components/CategoryBadge";
import { ChaseTierBadge } from "@/components/ChaseTierBadge";
import { formatCredits, formatUsd } from "@/lib/format";

interface ProductCardProps {
  item: Item;
  crateName?: string;
  showOdds?: boolean;
  footer?: ReactNode;
  quantity?: number;
}

export function ProductCard({ item, crateName, showOdds, footer, quantity }: ProductCardProps) {
  const brand = getBrand(item.brandId);
  const isStandout = item.chaseTier === "headliner" || item.chaseTier === "major_chase";
  const isHeadliner = item.chaseTier === "headliner";

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-surface transition-all duration-200 hover:-translate-y-0.5 ${
        isStandout ? "foil-sweep" : ""
      }`}
      style={{
        borderColor: isHeadliner ? "rgba(244,201,93,0.4)" : isStandout ? "rgba(226,73,44,0.28)" : "var(--border-soft)",
      }}
    >
      {isStandout && (
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background: isHeadliner
              ? "radial-gradient(90% 60% at 50% 8%, rgba(244,201,93,0.16) 0%, transparent 70%)"
              : "radial-gradient(90% 60% at 50% 8%, rgba(226,73,44,0.13) 0%, transparent 70%)",
          }}
        />
      )}

      <div className="relative flex aspect-[4/5] items-center justify-center bg-surface-2/70 p-3">
        <ProductArt
          subtype={item.subtype}
          brand={brand}
          flavorOrEdition={item.flavorOrEdition}
          className="h-full w-full drop-shadow-xl"
        />
        <div className="absolute left-2 top-2">
          <ChaseTierBadge tier={item.chaseTier} />
        </div>
        {showOdds && (
          <span className="absolute right-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-cream backdrop-blur">
            {item.odds}%
          </span>
        )}
        {quantity && quantity > 1 && (
          <span className="absolute bottom-2 right-2 flex h-5 min-w-5 items-center justify-center rounded-md border border-border bg-black/70 px-1 text-[11px] font-bold text-cream backdrop-blur">
            ×{quantity}
          </span>
        )}
      </div>

      <div className="relative flex flex-1 flex-col gap-1.5 p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: brand.colors[0] }}>
            {brand.name}
          </span>
          <CategoryBadge category={item.category} />
        </div>
        <h4 className="text-sm font-semibold leading-snug">{item.name}</h4>
        {crateName && <p className="text-[11px] text-muted">From {crateName}</p>}

        <div className="mt-1.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wide text-muted">Market</div>
            <div className="font-display text-sm font-semibold tabular-nums">
              {formatCredits(item.marketValue)}
              <span className="ml-0.5 text-[10px] font-medium text-muted">cr</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wide text-muted">Buyback</div>
            <div className="font-display text-sm font-semibold tabular-nums text-positive">
              {formatCredits(item.buybackValue)}
              <span className="ml-0.5 text-[10px] font-medium text-muted">cr</span>
            </div>
          </div>
        </div>
        <div className="text-[10px] text-muted">{formatUsd(item.marketValue)} ref. value</div>

        {footer && <div className="mt-2">{footer}</div>}
      </div>
    </div>
  );
}
