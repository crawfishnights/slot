"use client";

import Link from "next/link";
import { Crate } from "@/lib/types";
import { CrateArt } from "@/components/art/CrateArt";
import { ProductArt } from "@/components/art/ProductArt";
import { formatCredits, formatUsd } from "@/lib/format";
import { sortedByValueDesc } from "@/lib/data/crates";

export function CrateCard({ crate, featured = false }: { crate: Crate; featured?: boolean }) {
  const chaseItems = sortedByValueDesc(crate).slice(0, 3);

  return (
    <Link
      href={`/crates/${crate.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-white/15"
      style={{
        boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset",
      }}
    >
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(120% 100% at 50% 0%, ${crate.palette.glow}22 0%, transparent 60%)`,
        }}
      />

      <div
        className="relative flex items-center justify-center overflow-hidden pt-8"
        style={{ background: `linear-gradient(180deg, ${crate.palette.primary}14, transparent 70%)` }}
      >
        <div className="float-glow w-full max-w-[220px] transition-transform duration-500 group-hover:scale-105">
          <CrateArt crate={crate} className="w-full drop-shadow-2xl" />
        </div>
      </div>

      <div className="relative flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-lg font-bold leading-tight">{crate.name}</h3>
            <p className="mt-1 text-sm text-muted">{crate.tagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">
            Chase pulls
          </span>
          <div className="flex -space-x-3">
            {chaseItems.map((item) => (
              <div
                key={item.id}
                className="h-9 w-9 overflow-hidden rounded-full border-2 border-surface bg-surface-2 ring-1 ring-white/10"
                title={item.name}
              >
                <ProductArt
                  category={item.category}
                  colors={item.colors}
                  brandTier={item.brand.tier}
                  brandInitial={item.brand.name.charAt(0)}
                  className="h-full w-full scale-150 translate-y-1"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <div>
            <div className="font-display text-xl font-extrabold tabular-nums">
              {formatCredits(crate.price)}
              <span className="ml-1 text-xs font-medium text-muted">cr</span>
            </div>
            <div className="text-xs text-muted">{formatUsd(crate.price)} value</div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-black transition-transform group-hover:scale-105">
            Open
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M8 3.5L11.5 7 8 10.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>

      {featured && (
        <span className="absolute right-4 top-4 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
          Featured
        </span>
      )}
    </Link>
  );
}
