"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Item } from "@/lib/types";
import { buildStrip, pickWeightedItem, StripEntry, WINNER_INDEX } from "@/lib/roulette";
import { ProductArt } from "@/components/art/ProductArt";
import { formatCredits } from "@/lib/format";

const CARD_WIDTH = 152;
const CARD_GAP = 14;
const PITCH = CARD_WIDTH + CARD_GAP;
const SPIN_DURATION = 6.4;
const SPIN_EASE: [number, number, number, number] = [0.1, 0.74, 0.15, 1];

interface RouletteProps {
  items: Item[];
  spinToken: number;
  onFinish: (winner: Item) => void;
}

interface SpinState {
  strip: StripEntry[];
  winner: Item;
  targetOffset: number;
}

function tierGlow(item: Item) {
  if (item.tier === "massive_chase" || item.tier === "big_chase") return item.colors[0];
  return null;
}

export function Roulette({ items, spinToken, onFinish }: RouletteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [spin, setSpin] = useState<SpinState | null>(null);
  const [settled, setSettled] = useState(false);
  const lastToken = useRef(0);

  useEffect(() => {
    if (spinToken === 0 || spinToken === lastToken.current) return;
    lastToken.current = spinToken;

    const winner = pickWeightedItem(items);
    const nextStrip = buildStrip(items, winner);
    const containerWidth = containerRef.current?.offsetWidth ?? 800;
    const jitter = (Math.random() - 0.5) * CARD_WIDTH * 0.5;
    const winnerCenter = WINNER_INDEX * PITCH + CARD_WIDTH / 2;
    const targetOffset = winnerCenter - containerWidth / 2 + jitter;

    setSettled(false);
    setSpin({ strip: nextStrip, winner, targetOffset });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinToken]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-2/60">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r from-surface-2 to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l from-surface-2 to-transparent sm:w-28" />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-center">
        <div className="h-3 w-3 translate-y-1 rotate-45 bg-accent shadow-[0_0_12px_rgba(124,92,255,0.9)]" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center">
        <div className="h-3 w-3 -translate-y-1 rotate-45 bg-accent shadow-[0_0_12px_rgba(124,92,255,0.9)]" />
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-px -translate-x-1/2 bg-gradient-to-b from-accent/0 via-accent/70 to-accent/0" />

      <div ref={containerRef} className="relative h-52 overflow-hidden py-3">
        {!spin ? (
          <IdleStrip items={items} />
        ) : (
          <motion.div
            key={spinToken}
            className="flex h-full items-center gap-3.5"
            initial={{ x: 0 }}
            animate={{ x: -spin.targetOffset }}
            transition={{ duration: SPIN_DURATION, ease: SPIN_EASE }}
            onAnimationComplete={() => {
              setSettled(true);
              onFinish(spin.winner);
            }}
            style={{ willChange: "transform" }}
          >
            {spin.strip.map((entry, i) => {
              const glow = tierGlow(entry.item);
              const isWinner = i === WINNER_INDEX;
              return (
                <div
                  key={entry.key}
                  className="relative flex shrink-0 flex-col items-center justify-center rounded-xl border bg-surface p-2"
                  style={{
                    width: CARD_WIDTH,
                    height: 176,
                    borderColor: isWinner && settled ? "rgba(255,255,255,0.4)" : "var(--border)",
                    boxShadow: glow ? `0 0 24px -6px ${glow}88 inset` : undefined,
                  }}
                >
                  <ProductArt
                    category={entry.item.category}
                    colors={entry.item.colors}
                    brandTier={entry.item.brand.tier}
                    brandInitial={entry.item.brand.name.charAt(0)}
                    className="h-24 w-full"
                  />
                  <div className="mt-1 line-clamp-1 w-full px-1 text-center text-[10px] font-medium text-muted">
                    {entry.item.brand.name}
                  </div>
                  <div className="line-clamp-1 w-full px-1 text-center text-[11px] font-semibold">
                    {formatCredits(entry.item.marketValue)} cr
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function IdleStrip({ items }: { items: Item[] }) {
  const preview = [...items, ...items].slice(0, 12);
  return (
    <div className="flex h-full items-center gap-3.5 pl-4 opacity-40 grayscale">
      {preview.map((item, i) => (
        <div
          key={`${item.id}-${i}`}
          className="flex shrink-0 flex-col items-center justify-center rounded-xl border border-border bg-surface p-2"
          style={{ width: CARD_WIDTH, height: 176 }}
        >
          <ProductArt
            category={item.category}
            colors={item.colors}
            brandTier={item.brand.tier}
            brandInitial={item.brand.name.charAt(0)}
            className="h-24 w-full"
          />
        </div>
      ))}
    </div>
  );
}
