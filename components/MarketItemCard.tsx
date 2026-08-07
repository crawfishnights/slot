"use client";

import Link from "next/link";
import { Product } from "@/lib/types";
import { ProductArt } from "@/components/art/ProductArt";
import { getBrand } from "@/lib/data/brands";
import { CategoryBadge } from "@/components/CategoryBadge";
import { MarketTierBadge } from "@/components/MarketTierBadge";
import { lowestListing } from "@/lib/marketSim";
import { formatCredits } from "@/lib/format";

export function MarketItemCard({ product }: { product: Product }) {
  const brand = getBrand(product.brandId);
  const listing = lowestListing(product);

  return (
    <Link
      href={`/marketplace/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border-soft bg-surface transition-all duration-200 hover:-translate-y-0.5 hover:border-border"
    >
      <div className="relative flex aspect-[4/5] items-center justify-center bg-surface-2/70 p-3">
        <ProductArt
          renderShape={product.renderShape}
          brand={brand}
          flavorOrEdition={product.variant}
          className="h-full w-full drop-shadow-xl transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2">
          <MarketTierBadge tier={product.marketTier} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: brand.colors[0] }}>
            {brand.name}
          </span>
          <CategoryBadge category={product.category} />
        </div>
        <h4 className="text-sm font-semibold leading-snug">{product.name}</h4>
        <p className="text-[11px] text-muted">{product.variant}</p>

        <div className="mt-1.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wide text-muted">Market value</div>
            <div className="font-display text-sm font-semibold tabular-nums">
              {formatCredits(product.marketValue)}
              <span className="ml-0.5 text-[10px] font-medium text-muted">cr</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wide text-muted">Lowest listing</div>
            <div className="font-display text-sm font-semibold tabular-nums text-positive">
              {formatCredits(listing.price)}
              <span className="ml-0.5 text-[10px] font-medium text-muted">cr</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
