"use client";

import { ReactNode } from "react";
import { Item } from "@/lib/types";
import { ProductArt } from "@/components/art/ProductArt";
import { formatCredits, formatUsd } from "@/lib/format";

const TIER_LABEL: Record<Item["brand"]["tier"], string> = {
  budget: "Budget",
  mainstream: "Mainstream",
  premium: "Premium",
  luxury: "Luxury Import",
  collectible: "Collectible",
};

const TIER_COLOR: Record<Item["brand"]["tier"], string> = {
  budget: "#9497a8",
  mainstream: "#8ecae6",
  premium: "#f2d675",
  luxury: "#e8c766",
  collectible: "#ff8fd6",
};

interface ProductCardProps {
  item: Item;
  crateName?: string;
  showOdds?: boolean;
  footer?: ReactNode;
  highlight?: boolean;
}

export function ProductCard({ item, crateName, showOdds, footer, highlight }: ProductCardProps) {
  const isChase = item.tier === "massive_chase" || item.tier === "big_chase";

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-surface transition-colors ${
        highlight ? "border-white/20" : "border-border hover:border-white/12"
      }`}
    >
      {isChase && (
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background: `radial-gradient(90% 70% at 50% 15%, ${item.colors[0]}33 0%, transparent 70%)`,
          }}
        />
      )}
      <div className="relative flex aspect-[4/5] items-center justify-center bg-surface-2/60 p-3">
        <ProductArt
          category={item.category}
          colors={item.colors}
          brandTier={item.brand.tier}
          brandInitial={item.brand.name.charAt(0)}
          className="h-full w-full drop-shadow-xl"
        />
        {isChase && (
          <span
            className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
            style={{ background: `${TIER_COLOR[item.brand.tier]}22`, color: TIER_COLOR[item.brand.tier] }}
          >
            Chase
          </span>
        )}
        {showOdds && (
          <span className="absolute right-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
            {item.odds}%
          </span>
        )}
      </div>

      <div className="relative flex flex-1 flex-col gap-1 p-3">
        <div className="flex items-center justify-between gap-2">
          <span
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: TIER_COLOR[item.brand.tier] }}
          >
            {item.brand.name}
          </span>
          <span className="text-[10px] text-muted">{TIER_LABEL[item.brand.tier]}</span>
        </div>
        <h4 className="text-sm font-semibold leading-snug">{item.name}</h4>
        {crateName && <p className="text-[11px] text-muted">From {crateName}</p>}

        <div className="mt-1.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wide text-muted">Market</div>
            <div className="font-display text-sm font-bold tabular-nums">
              {formatCredits(item.marketValue)}
              <span className="ml-0.5 text-[10px] font-medium text-muted">cr</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wide text-muted">Buyback</div>
            <div className="font-display text-sm font-bold tabular-nums text-positive">
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
