"use client";

import Link from "next/link";
import { Crate } from "@/lib/types";
import { CrateArt } from "@/components/art/CrateArt";
import { ProductArt } from "@/components/art/ProductArt";
import { getBrand } from "@/lib/data/brands";
import { SpiceLevel } from "@/components/SpiceLevel";
import { CategoryDot } from "@/components/CategoryBadge";
import { formatCredits, formatUsd } from "@/lib/format";
import { sortedByValueDesc } from "@/lib/data/crates";

export function CrateCard({ crate, size = "standard" }: { crate: Crate; size?: "hero" | "standard" }) {
  const chaseItems = sortedByValueDesc(crate).slice(0, size === "hero" ? 4 : 3);
  const categories = Array.from(new Set(crate.items.map((i) => i.category)));
  const isHero = size === "hero";

  return (
    <Link
      href={`/crates/${crate.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border-soft bg-surface transition-all duration-300 hover:border-border"
    >
      <div
        className={`relative flex items-center justify-center overflow-hidden ${isHero ? "min-h-[280px] flex-[1.3]" : "min-h-[190px] flex-1"}`}
        style={{ background: `linear-gradient(180deg, ${crate.palette.primary}12, transparent 65%)` }}
      >
        <div
          className={`float-slow transition-transform duration-500 group-hover:scale-[1.03] ${isHero ? "w-full max-w-[300px]" : "w-full max-w-[190px]"}`}
        >
          <CrateArt crate={crate} className="w-full drop-shadow-2xl" />
        </div>
      </div>

      <div className="relative flex flex-col gap-3 border-t border-border-soft p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className={`font-display font-semibold leading-tight ${isHero ? "text-2xl" : "text-lg"}`}>
              {crate.name}
            </h3>
            <p className={`mt-1 text-muted ${isHero ? "text-sm" : "text-[13px]"}`}>{crate.shortDescription}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <SpiceLevel level={crate.spiceLevel} />
          <div className="flex items-center gap-1">
            {categories.map((c) => (
              <CategoryDot key={c} category={c} />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <span className="text-[10px] font-bold uppercase tracking-wide text-muted-2">Chase pulls</span>
          <div className="flex -space-x-2.5">
            {chaseItems.map((item) => {
              const brand = getBrand(item.brandId);
              return (
                <div
                  key={item.id}
                  className="h-8 w-8 overflow-hidden rounded-full border-2 border-surface bg-surface-2 ring-1 ring-border-soft"
                  title={item.name}
                >
                  <ProductArt
                    subtype={item.subtype}
                    brand={brand}
                    flavorOrEdition={item.flavorOrEdition}
                    className="h-full w-full scale-150 translate-y-1"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-1 flex items-center justify-between border-t border-border-soft pt-4">
          <div>
            <div className={`font-display font-semibold tabular-nums ${isHero ? "text-xl" : "text-lg"}`}>
              {formatCredits(crate.price)}
              <span className="ml-1 text-xs font-medium text-muted">cr</span>
            </div>
            <div className="text-[11px] text-muted">{formatUsd(crate.price)} to open</div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-cream px-4 py-2 text-sm font-semibold text-background transition-transform group-hover:scale-105">
            Open Crate
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
