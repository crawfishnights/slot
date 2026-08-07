"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PRODUCTS } from "@/lib/data/products";
import { CATEGORIES } from "@/lib/data/categories";
import { ProductCategory } from "@/lib/types";
import { MarketItemCard } from "@/components/MarketItemCard";

type SortKey = "popular" | "recent" | "expensive" | "cheap";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "popular", label: "Popular" },
  { key: "recent", label: "Newly Added" },
  { key: "expensive", label: "Most Expensive" },
  { key: "cheap", label: "Lowest Price" },
];

const CATEGORY_IDS = new Set(CATEGORIES.map((c) => c.id));

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  const [category, setCategory] = useState<"all" | ProductCategory>(
    initialCategory && CATEGORY_IDS.has(initialCategory as ProductCategory)
      ? (initialCategory as ProductCategory)
      : "all"
  );
  const [sort, setSort] = useState<SortKey>("popular");
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    let list = PRODUCTS;
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.variant.toLowerCase().includes(q)
      );
    }
    const sorted = [...list];
    switch (sort) {
      case "popular":
        sorted.sort((a, b) => b.popularity - a.popularity);
        break;
      case "recent":
        sorted.sort((a, b) => b.addedIndex - a.addedIndex);
        break;
      case "expensive":
        sorted.sort((a, b) => b.marketValue - a.marketValue);
        break;
      case "cheap":
        sorted.sort((a, b) => a.marketValue - b.marketValue);
        break;
    }
    return sorted;
  }, [category, sort, query]);

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-5 py-9 sm:px-8">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Marketplace</h1>
        <p className="text-sm text-muted">
          The full product catalog — every item that can appear in a box also lives here on its own.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <div className="relative">
          <svg
            width="15"
            height="15"
            viewBox="0 0 16 16"
            fill="none"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          >
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full max-w-sm rounded-full border border-border-soft bg-surface py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted focus:border-border focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            <FilterPill active={category === "all"} onClick={() => setCategory("all")}>
              All
            </FilterPill>
            {CATEGORIES.map((c) => (
              <FilterPill key={c.id} active={category === c.id} onClick={() => setCategory(c.id)}>
                {c.label}
              </FilterPill>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SORTS.map((s) => (
              <FilterPill key={s.key} active={sort === s.key} onClick={() => setSort(s.key)}>
                {s.label}
              </FilterPill>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-5 text-xs text-muted">
        {results.length} product{results.length === 1 ? "" : "s"}
      </p>

      {results.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center gap-2 text-center">
          <p className="font-display text-lg font-semibold">No products match</p>
          <p className="text-sm text-muted">Try a different category or search term.</p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {results.map((product) => (
            <MarketItemCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={null}>
      <MarketplaceContent />
    </Suspense>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? "border-cream bg-cream text-background"
          : "border-border-soft text-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
