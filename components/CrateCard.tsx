"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { Crate } from "@/lib/types";
import { CrateArt } from "@/components/art/CrateArt";
import { ProductArt } from "@/components/art/ProductArt";
import { getBrand } from "@/lib/data/brands";
import { SpiceLevel } from "@/components/SpiceLevel";
import { getCategoryMeta } from "@/lib/data/categories";
import { formatCredits, formatUsd } from "@/lib/format";
import { sortedByValueDesc } from "@/lib/data/crates";

const TIER_RING: Record<string, string> = {
  headliner: "rgba(244,201,93,0.65)",
  major_chase: "rgba(226,73,44,0.55)",
};

export function CrateCard({ crate, size = "standard" }: { crate: Crate; size?: "hero" | "standard" }) {
  const chaseItems = sortedByValueDesc(crate).slice(0, size === "hero" ? 4 : 3);
  const categories = Array.from(new Set(crate.items.map((i) => i.category)));
  const isHero = size === "hero";

  return (
    <Link
      href={`/crates/${crate.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border-soft bg-surface shadow-[0_1px_0_rgba(255,255,255,0.03)_inset,0_18px_36px_-24px_rgba(0,0,0,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--crate-accent)] hover:shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_24px_44px_-20px_rgba(0,0,0,0.8)]"
      style={{ "--crate-accent": `${crate.palette.primary}55` } as CSSProperties}
    >
      <div
        className="h-[3px] w-full shrink-0"
        style={{ background: `linear-gradient(90deg, ${crate.palette.primary}, ${crate.palette.secondary})` }}
      />

      <div
        className={`relative flex items-center justify-center overflow-hidden ${isHero ? "min-h-[276px] flex-[1.3]" : "min-h-[186px] flex-1"}`}
        style={{ background: `linear-gradient(180deg, ${crate.palette.primary}12, transparent 65%)` }}
      >
        <div
          className={`float-slow transition-transform duration-500 group-hover:scale-[1.03] ${isHero ? "w-full max-w-[290px]" : "w-full max-w-[182px]"}`}
        >
          <CrateArt crate={crate} className="w-full drop-shadow-2xl" />
        </div>
      </div>

      <div className="relative flex flex-1 flex-col gap-3 border-t border-border-soft p-5">
        <div>
          <h3 className={`font-display font-semibold leading-tight ${isHero ? "text-2xl" : "text-lg"}`}>
            {crate.name}
          </h3>
          <p className={`mt-1 text-muted ${isHero ? "text-sm" : "text-[13px]"}`}>{crate.shortDescription}</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-y-1.5">
          <SpiceLevel level={crate.spiceLevel} />
          <div className="flex items-center gap-1">
            {categories.map((c) => {
              const meta = getCategoryMeta(c);
              return (
                <span
                  key={c}
                  title={meta.label}
                  className="flex h-4 items-center rounded-full px-1.5 text-[8px] font-bold uppercase tracking-wide"
                  style={{ color: meta.color, background: `${meta.color}16` }}
                >
                  {meta.short}
                </span>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2.5 pt-1">
          <span className="text-[10px] font-bold uppercase tracking-wide text-muted-2">Chase pulls</span>
          <div className="flex -space-x-2">
            {chaseItems.map((item) => {
              const brand = getBrand(item.brandId);
              const ring = TIER_RING[item.chaseTier];
              return (
                <div
                  key={item.id}
                  className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border-2 bg-surface-2 shadow-sm"
                  style={{ borderColor: ring ?? "var(--surface)" }}
                  title={`${item.name} · ${formatCredits(item.marketValue)} cr`}
                >
                  <ProductArt
                    subtype={item.subtype}
                    brand={brand}
                    flavorOrEdition={item.flavorOrEdition}
                    className="h-full w-full scale-[1.7] translate-y-1"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border-soft pt-4">
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
