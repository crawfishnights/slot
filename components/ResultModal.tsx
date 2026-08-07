"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Item } from "@/lib/types";
import { ProductArt } from "@/components/art/ProductArt";
import { formatCredits, formatUsd } from "@/lib/format";

interface ResultModalProps {
  item: Item | null;
  onKeep: () => void;
  onSell: () => void;
  onOpenAgain: () => void;
  canAfford: boolean;
}

const TIER_LABEL: Record<Item["brand"]["tier"], string> = {
  budget: "Budget",
  mainstream: "Mainstream",
  premium: "Premium",
  luxury: "Luxury Import",
  collectible: "Collectible",
};

export function ResultModal({ item, onKeep, onSell, onOpenAgain, canAfford }: ResultModalProps) {
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/15 bg-surface p-6"
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(90% 60% at 50% 0%, ${item.colors[0]}33 0%, transparent 70%)`,
              }}
            />

            <div className="relative flex flex-col items-center text-center">
              <span className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted">
                You pulled
              </span>
              <div className="relative flex h-40 w-40 items-center justify-center">
                <div
                  className="pulse-ring absolute inset-6 rounded-full"
                  style={{ background: `${item.colors[0]}22` }}
                />
                <ProductArt
                  category={item.category}
                  colors={item.colors}
                  brandTier={item.brand.tier}
                  brandInitial={item.brand.name.charAt(0)}
                  className="relative h-full w-full drop-shadow-2xl"
                />
              </div>

              <span className="text-[11px] font-bold uppercase tracking-wider text-accent-2">
                {item.brand.name} · {TIER_LABEL[item.brand.tier]}
              </span>
              <h3 className="font-display mt-1 text-xl font-extrabold">{item.name}</h3>
              <p className="mt-1 text-xs text-muted">{item.tagline}</p>

              <div className="mt-4 grid w-full grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-surface-2 p-3">
                  <div className="text-[10px] uppercase tracking-wide text-muted">Market Value</div>
                  <div className="font-display text-lg font-bold tabular-nums">
                    {formatCredits(item.marketValue)} cr
                  </div>
                  <div className="text-[10px] text-muted">{formatUsd(item.marketValue)}</div>
                </div>
                <div className="rounded-xl border border-border bg-surface-2 p-3">
                  <div className="text-[10px] uppercase tracking-wide text-muted">Buyback (80%)</div>
                  <div className="font-display text-lg font-bold tabular-nums text-positive">
                    {formatCredits(item.buybackValue)} cr
                  </div>
                  <div className="text-[10px] text-muted">{formatUsd(item.buybackValue)}</div>
                </div>
              </div>

              <div className="mt-5 flex w-full flex-col gap-2">
                <div className="flex w-full gap-2">
                  <button
                    onClick={onKeep}
                    className="flex-1 rounded-full bg-white py-2.5 text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Keep Item
                  </button>
                  <button
                    onClick={onSell}
                    className="flex-1 rounded-full border border-positive/40 bg-positive/10 py-2.5 text-sm font-bold text-positive transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Sell for {formatCredits(item.buybackValue)}
                  </button>
                </div>
                <button
                  onClick={onOpenAgain}
                  disabled={!canAfford}
                  className="w-full rounded-full border border-border py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Keep &amp; Open Again
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
