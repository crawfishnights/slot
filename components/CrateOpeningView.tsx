"use client";

import { useState } from "react";
import { Crate, Item } from "@/lib/types";
import { sortedByValueDesc } from "@/lib/data/crates";
import { useStore } from "@/lib/store";
import { formatCredits, formatUsd } from "@/lib/format";
import { CrateArt } from "@/components/art/CrateArt";
import { Roulette } from "@/components/Roulette";
import { ResultModal } from "@/components/ResultModal";
import { ProductCard } from "@/components/ProductCard";

export function CrateOpeningView({ crate }: { crate: Crate }) {
  const credits = useStore((s) => s.credits);
  const hasHydrated = useStore((s) => s.hasHydrated);
  const spend = useStore((s) => s.spend);
  const recordPull = useStore((s) => s.recordPull);
  const keepPull = useStore((s) => s.keepPull);
  const sellPull = useStore((s) => s.sellPull);

  const [spinToken, setSpinToken] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{ item: Item; pullUid: string } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const items = sortedByValueDesc(crate);
  const mainChase = items[0];
  const canAfford = hasHydrated && credits >= crate.price;

  function startSpin() {
    if (spinning) return;
    if (!spend(crate.price)) {
      setNotice("Not enough credits to open this crate.");
      setTimeout(() => setNotice(null), 2400);
      return;
    }
    setResult(null);
    setSpinning(true);
    setSpinToken((t) => t + 1);
  }

  function handleFinish(winner: Item) {
    const pullUid = recordPull(winner, crate.slug, crate.name);
    setResult({ item: winner, pullUid });
    setSpinning(false);
  }

  function handleKeep() {
    if (!result) return;
    keepPull(result.pullUid);
    setResult(null);
  }

  function handleSell() {
    if (!result) return;
    sellPull(result.pullUid);
    setResult(null);
  }

  function handleOpenAgain() {
    if (!result) return;
    keepPull(result.pullUid);
    setResult(null);
    startSpin();
  }

  return (
    <div className="flex flex-col gap-10 pb-20">
      {/* Hero */}
      <section
        className="relative overflow-hidden border-b border-border"
        style={{
          background: `linear-gradient(180deg, ${crate.palette.primary}1c 0%, transparent 60%)`,
        }}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[380px_1fr] lg:py-14">
          <div className="float-glow mx-auto w-full max-w-[300px] lg:max-w-none">
            <CrateArt crate={crate} className="w-full drop-shadow-2xl" />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: crate.palette.accent }}>
              Themed Crate
            </p>
            <h1 className="font-display mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {crate.name}
            </h1>
            <p className="mt-2 max-w-lg text-sm text-muted">{crate.tagline}</p>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <div className="glass-card rounded-2xl px-4 py-3">
                <div className="text-[10px] uppercase tracking-wide text-muted">Open price</div>
                <div className="font-display text-2xl font-extrabold tabular-nums">
                  {formatCredits(crate.price)} <span className="text-sm text-muted">cr</span>
                </div>
                <div className="text-[11px] text-muted">{formatUsd(crate.price)} value</div>
              </div>

              <div className="glass-card rounded-2xl px-4 py-3">
                <div className="text-[10px] uppercase tracking-wide text-muted">Main chase</div>
                <div className="text-sm font-bold">{mainChase.name}</div>
                <div className="text-[11px] text-muted">
                  {formatCredits(mainChase.marketValue)} cr · {mainChase.odds}% odds
                </div>
              </div>

              <button
                onClick={startSpin}
                disabled={spinning || !hasHydrated}
                className="relative flex h-14 items-center gap-2 rounded-full bg-white px-8 text-base font-bold text-black shadow-[0_8px_30px_-6px_rgba(255,255,255,0.35)] transition-transform hover:scale-[1.03] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {spinning ? "Opening…" : `Open Crate`}
              </button>
            </div>

            {notice && (
              <p className="mt-3 text-sm font-medium text-accent-2">{notice}</p>
            )}
            {!canAfford && hasHydrated && !notice && (
              <p className="mt-3 text-sm text-muted">
                You need {formatCredits(crate.price - credits)} more credits to open this crate.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Roulette */}
      <section className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <Roulette items={crate.items} spinToken={spinToken} onFinish={handleFinish} />
        <p className="mt-3 text-center text-xs text-muted">
          The winning item is chosen the instant you open the crate — the strip only reveals it.
        </p>
      </section>

      {/* Odds table */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Every possible reward</h2>
          <span className="text-xs text-muted">Odds sum to exactly 100%</span>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((item) => (
            <ProductCard key={item.id} item={item} showOdds />
          ))}
        </div>
      </section>

      <ResultModal
        item={result?.item ?? null}
        onKeep={handleKeep}
        onSell={handleSell}
        onOpenAgain={handleOpenAgain}
        canAfford={hasHydrated && credits >= crate.price}
      />
    </div>
  );
}
