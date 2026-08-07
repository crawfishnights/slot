"use client";

import { useMemo, useState } from "react";
import { Crate, Item, ProductCategory } from "@/lib/types";
import { headliner, majorChases, sortedByChaseTier } from "@/lib/data/crates";
import { getBrand } from "@/lib/data/brands";
import { CATEGORIES } from "@/lib/data/categories";
import { useStore } from "@/lib/store";
import { formatCredits, formatUsd } from "@/lib/format";
import { CrateArt } from "@/components/art/CrateArt";
import { ProductArt } from "@/components/art/ProductArt";
import { SpiceLevel } from "@/components/SpiceLevel";
import { CategoryBadge } from "@/components/CategoryBadge";
import { ChaseTierBadge } from "@/components/ChaseTierBadge";
import { ProductCard } from "@/components/ProductCard";
import { OpeningExperience } from "@/components/opening/OpeningExperience";

const TIER_SECTIONS: { tier: Item["chaseTier"]; heading: string; sub: string }[] = [
  { tier: "headliner", heading: "Headliner", sub: "The one you're chasing." },
  { tier: "major_chase", heading: "Major Chases", sub: "Rare, and worth hunting for." },
  { tier: "solid_hit", heading: "Solid Hits", sub: "Comfortably profitable pulls." },
  { tier: "break_even", heading: "Break Even", sub: "Roughly what you paid." },
  { tier: "ground_loot", heading: "Ground Loot", sub: "The common, frequent pulls." },
];

export function CrateDetailView({ crate }: { crate: Crate }) {
  const credits = useStore((s) => s.credits);
  const hasHydrated = useStore((s) => s.hasHydrated);
  const spend = useStore((s) => s.spend);

  const [opening, setOpening] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | ProductCategory>("all");

  const head = headliner(crate);
  const headBrand = getBrand(head.brandId);
  const majors = majorChases(crate);
  const canAfford = hasHydrated && credits >= crate.price;

  const presentCategories = useMemo(
    () => CATEGORIES.filter((c) => crate.items.some((i) => i.category === c.id)),
    [crate]
  );

  const sorted = sortedByChaseTier(crate);
  const filtered = filter === "all" ? sorted : sorted.filter((i) => i.category === filter);

  function handleOpen() {
    if (!spend(crate.price)) {
      setNotice("Not enough credits to open this crate.");
      setTimeout(() => setNotice(null), 2200);
      return;
    }
    setOpening(true);
  }

  return (
    <div className="flex flex-col gap-14 pb-20">
      {/* Hero */}
      <section
        className="relative overflow-hidden border-b border-border-soft"
        style={{ background: `linear-gradient(180deg, ${crate.palette.primary}14 0%, transparent 60%)` }}
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[360px_1fr] lg:py-14">
          <div className="float-slow mx-auto w-full max-w-[300px] lg:max-w-none">
            <CrateArt crate={crate} className="w-full drop-shadow-2xl" />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-2">
              {crate.reasonForExisting}
            </p>
            <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {crate.name}
            </h1>
            <p className="mt-2 max-w-lg text-sm text-muted">{crate.shortDescription}</p>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <div className="paper-card rounded-2xl px-4 py-3">
                <div className="text-[10px] uppercase tracking-wide text-muted">Open price</div>
                <div className="font-display text-2xl font-semibold tabular-nums">
                  {formatCredits(crate.price)} <span className="text-sm text-muted">cr</span>
                </div>
                <div className="text-[11px] text-muted">{formatUsd(crate.price)}</div>
              </div>

              <div className="paper-card rounded-2xl px-4 py-3">
                <div className="text-[10px] uppercase tracking-wide text-muted">Spice Level</div>
                <div className="mt-1.5">
                  <SpiceLevel level={crate.spiceLevel} size="md" />
                </div>
              </div>

              <button
                onClick={handleOpen}
                disabled={opening || !hasHydrated}
                className="relative flex h-14 items-center gap-2 rounded-full bg-cream px-8 text-base font-semibold text-background shadow-[0_8px_30px_-6px_rgba(244,239,230,0.3)] transition-transform hover:scale-[1.03] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Open Crate
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {presentCategories.map((c) => (
                <CategoryBadge key={c.id} category={c.id} />
              ))}
            </div>

            {notice && <p className="mt-3 text-sm font-medium text-[#e2492c]">{notice}</p>}
            {!canAfford && hasHydrated && !notice && (
              <p className="mt-3 text-sm text-muted">
                You need {formatCredits(crate.price - credits)} more credits to open this crate.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Headliner + major chase spotlight */}
      <section className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="mb-5">
          <h2 className="font-display text-xl font-semibold">What you&rsquo;re chasing</h2>
          <p className="text-sm text-muted">The centerpiece, and the pulls right underneath it.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div
            className="relative flex flex-col items-center overflow-hidden rounded-3xl border p-6 text-center md:col-span-1"
            style={{ borderColor: "rgba(244,201,93,0.35)", background: "radial-gradient(120% 100% at 50% 0%, rgba(244,201,93,0.1), transparent 70%)" }}
          >
            <ChaseTierBadge tier="headliner" />
            <div className="mt-3 h-40 w-40">
              <ProductArt subtype={head.subtype} brand={headBrand} flavorOrEdition={head.flavorOrEdition} className="h-full w-full drop-shadow-2xl" />
            </div>
            <span className="mt-2 text-[11px] font-bold uppercase tracking-wide" style={{ color: headBrand.colors[0] }}>
              {headBrand.name}
            </span>
            <h3 className="font-display mt-0.5 text-lg font-semibold">{head.name}</h3>
            <div className="mt-3 flex items-center gap-4">
              <div>
                <div className="text-[10px] uppercase text-muted">Market</div>
                <div className="font-display text-base font-semibold">{formatCredits(head.marketValue)} cr</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-muted">Odds</div>
                <div className="font-display text-base font-semibold">{head.odds}%</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-2">
            {majors.map((item) => {
              const brand = getBrand(item.brandId);
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-2xl border p-4"
                  style={{ borderColor: "rgba(226,73,44,0.28)", background: "rgba(226,73,44,0.05)" }}
                >
                  <div className="h-20 w-20 shrink-0">
                    <ProductArt subtype={item.subtype} brand={brand} flavorOrEdition={item.flavorOrEdition} className="h-full w-full" />
                  </div>
                  <div className="min-w-0">
                    <ChaseTierBadge tier="major_chase" />
                    <div className="mt-1 truncate text-sm font-semibold">{item.name}</div>
                    <div className="text-[11px] text-muted">{brand.name}</div>
                    <div className="mt-1 font-display text-sm font-semibold">
                      {formatCredits(item.marketValue)} cr <span className="text-[11px] font-normal text-muted">· {item.odds}% odds</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Full contents, filterable */}
      <section className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold">Full contents</h2>
            <p className="text-sm text-muted">Odds sum to exactly 100%.</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <FilterPill active={filter === "all"} onClick={() => setFilter("all")}>
              All
            </FilterPill>
            {presentCategories.map((c) => (
              <FilterPill key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)}>
                {c.label}
              </FilterPill>
            ))}
          </div>
        </div>

        {filter === "all" ? (
          <div className="flex flex-col gap-8">
            {TIER_SECTIONS.map(({ tier, heading, sub }) => {
              const items = sorted.filter((i) => i.chaseTier === tier);
              if (items.length === 0) return null;
              return (
                <div key={tier}>
                  <div className="mb-3 flex items-baseline gap-2">
                    <h3 className="text-sm font-bold uppercase tracking-wide">{heading}</h3>
                    <span className="text-xs text-muted">{sub}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {items.map((item) => (
                      <ProductCard key={item.id} item={item} showOdds />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {filtered.map((item) => (
              <ProductCard key={item.id} item={item} showOdds />
            ))}
          </div>
        )}
      </section>

      {opening && <OpeningExperience crate={crate} onClose={() => setOpening(false)} />}
    </div>
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
