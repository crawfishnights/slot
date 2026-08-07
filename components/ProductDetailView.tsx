"use client";

import { useState } from "react";
import Link from "next/link";
import { Product, SUBTYPE_LABEL } from "@/lib/types";
import { getBrand } from "@/lib/data/brands";
import { relatedProducts, productToItem } from "@/lib/data/products";
import { boxesContainingProduct } from "@/lib/data/crates";
import { getListings, totalAvailable } from "@/lib/marketSim";
import { useStore } from "@/lib/store";
import { formatCredits, formatUsd } from "@/lib/format";
import { ProductArt } from "@/components/art/ProductArt";
import { CategoryBadge } from "@/components/CategoryBadge";
import { MarketTierBadge } from "@/components/MarketTierBadge";
import { ChaseTierBadge } from "@/components/ChaseTierBadge";
import { MarketItemCard } from "@/components/MarketItemCard";

export function ProductDetailView({ product }: { product: Product }) {
  const brand = getBrand(product.brandId);
  const listings = getListings(product);
  const available = totalAvailable(product);
  const inBoxes = boxesContainingProduct(product.id);
  const related = relatedProducts(product);

  const credits = useStore((s) => s.credits);
  const hasHydrated = useStore((s) => s.hasHydrated);
  const buyListing = useStore((s) => s.buyListing);
  const [notice, setNotice] = useState<string | null>(null);
  const [boughtId, setBoughtId] = useState<string | null>(null);

  function handleBuy(listingId: string, price: number) {
    const ok = buyListing(productToItem(product), price);
    if (!ok) {
      setNotice("Not enough credits for this listing.");
      setTimeout(() => setNotice(null), 2200);
      return;
    }
    setBoughtId(listingId);
    setTimeout(() => setBoughtId(null), 1600);
  }

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-5 py-9 sm:px-8">
      <nav className="mb-6 text-xs text-muted">
        <Link href="/marketplace" className="hover:text-foreground">
          Marketplace
        </Link>
        <span className="mx-1.5">/</span>
        <span>{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[380px_1fr]">
        <div>
          <div className="paper-card flex aspect-[4/5] items-center justify-center rounded-3xl p-8">
            <ProductArt
              renderShape={product.renderShape}
              brand={brand}
              flavorOrEdition={product.variant}
              className="h-full w-full drop-shadow-2xl"
            />
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <MarketTierBadge tier={product.marketTier} size="md" />
            <CategoryBadge category={product.category} size="md" />
            <span className="rounded-full border border-border-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted">
              {SUBTYPE_LABEL[product.subtype]}
            </span>
          </div>

          <span className="mt-4 block text-xs font-bold uppercase tracking-wider" style={{ color: brand.colors[0] }}>
            {brand.name}
          </span>
          <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight">{product.name}</h1>
          <p className="mt-1 text-sm text-muted">{product.variant}</p>
          <p className="mt-3 max-w-lg text-sm text-muted">{product.blurb}</p>

          <div className="mt-6 flex flex-wrap items-end gap-6">
            <div>
              <div className="text-[10px] uppercase tracking-wide text-muted">Market Value</div>
              <div className="font-display text-2xl font-semibold tabular-nums">
                {formatCredits(product.marketValue)} <span className="text-sm text-muted">cr</span>
              </div>
              <div className="text-[11px] text-muted">{formatUsd(product.marketValue)} reference</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wide text-muted">Buyback</div>
              <div className="font-display text-xl font-semibold tabular-nums text-positive">
                {formatCredits(Math.round(product.marketValue * 0.8))} cr
              </div>
              <div className="text-[11px] text-muted">80% instant offer</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wide text-muted">Available</div>
              <div className="font-display text-xl font-semibold tabular-nums">{available}</div>
              <div className="text-[11px] text-muted">across {listings.length} listings</div>
            </div>
          </div>

          {notice && <p className="mt-3 text-sm font-medium text-[#e2492c]">{notice}</p>}

          {/* Listings */}
          <div className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-wide">Marketplace Listings</h2>
            <div className="mt-3 flex flex-col gap-2">
              {listings.map((listing, i) => (
                <div
                  key={listing.id}
                  className="flex items-center justify-between rounded-xl border border-border-soft bg-surface px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="font-display text-base font-semibold tabular-nums">
                      {formatCredits(listing.price)} <span className="text-xs font-normal text-muted">cr</span>
                    </div>
                    {i === 0 && (
                      <span className="rounded-full bg-positive/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-positive">
                        Lowest
                      </span>
                    )}
                    <span className="text-[11px] text-muted">
                      @{listing.seller} · qty {listing.quantity}
                    </span>
                  </div>
                  <button
                    onClick={() => handleBuy(listing.id, listing.price)}
                    disabled={!hasHydrated || credits < listing.price}
                    className="rounded-full bg-cream px-4 py-1.5 text-xs font-semibold text-background transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {boughtId === listing.id ? "Added ✓" : "Buy"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Boxes containing this item */}
          {inBoxes.length > 0 && (
            <div className="mt-8">
              <h2 className="text-sm font-bold uppercase tracking-wide">Boxes Containing This Item</h2>
              <div className="mt-3 flex flex-col gap-2">
                {inBoxes.map(({ crate, odds, role }) => (
                  <Link
                    key={crate.slug}
                    href={`/boxes/${crate.slug}`}
                    className="flex items-center justify-between rounded-xl border border-border-soft bg-surface px-4 py-3 transition-colors hover:border-border"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold">{crate.name}</span>
                      <ChaseTierBadge tier={role} />
                    </div>
                    <span className="text-xs text-muted">{odds}% odds · {formatCredits(crate.price)} cr to open</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="text-sm font-bold uppercase tracking-wide">Related Products</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <MarketItemCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
