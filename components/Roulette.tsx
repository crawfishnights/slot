"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Item } from "@/lib/types";
import { getBrand } from "@/lib/data/brands";
import { buildStrip, pickWeightedItem, StripEntry, WINNER_INDEX } from "@/lib/roulette";
import { ProductArt } from "@/components/art/ProductArt";
import { formatCredits } from "@/lib/format";

const CARD_WIDTH = 176;
const CARD_GAP = 16;
const PITCH = CARD_WIDTH + CARD_GAP;
const SPIN_DURATION = 6.6;
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
  if (item.chaseTier === "headliner") return "#f4c95d";
  if (item.chaseTier === "major_chase") return "#e2492c";
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
    const containerWidth = containerRef.current?.offsetWidth ?? 900;
    const jitter = (Math.random() - 0.5) * CARD_WIDTH * 0.5;
    const winnerCenter = WINNER_INDEX * PITCH + CARD_WIDTH / 2;
    const targetOffset = winnerCenter - containerWidth / 2 + jitter;

    setSettled(false);
    setSpin({ strip: nextStrip, winner, targetOffset });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinToken]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border-soft bg-surface-2/60">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-20 bg-gradient-to-r from-surface-2 to-transparent sm:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-20 bg-gradient-to-l from-surface-2 to-transparent sm:w-40" />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-center">
        <div className="h-4 w-4 translate-y-1.5 rotate-45 bg-cream shadow-[0_0_18px_rgba(244,239,230,0.9)]" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center">
        <div className="h-4 w-4 -translate-y-1.5 rotate-45 bg-cream shadow-[0_0_18px_rgba(244,239,230,0.9)]" />
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-0.5 -translate-x-1/2 bg-gradient-to-b from-cream/0 via-cream/80 to-cream/0" />

      <div ref={containerRef} className="relative h-[260px] overflow-hidden py-4 sm:h-[300px]">
        {!spin ? (
          <IdleStrip items={items} />
        ) : (
          <motion.div
            key={spinToken}
            className="flex h-full items-center gap-4"
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
              const brand = getBrand(entry.item.brandId);
              return (
                <div
                  key={entry.key}
                  className="relative flex shrink-0 flex-col items-center justify-center rounded-2xl border bg-surface p-3"
                  style={{
                    width: CARD_WIDTH,
                    height: 224,
                    borderColor: isWinner && settled ? "rgba(244,239,230,0.5)" : "var(--border-soft)",
                    boxShadow: glow ? `0 0 28px -6px ${glow}99 inset` : undefined,
                  }}
                >
                  <ProductArt
                    subtype={entry.item.subtype}
                    brand={brand}
                    flavorOrEdition={entry.item.flavorOrEdition}
                    className="h-32 w-full"
                  />
                  <div className="mt-1.5 line-clamp-1 w-full px-1 text-center text-[10px] font-semibold uppercase tracking-wide text-muted">
                    {brand.name}
                  </div>
                  <div className="line-clamp-1 w-full px-1 text-center text-[12px] font-semibold">
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
  const preview = [...items, ...items].slice(0, 14);
  return (
    <div className="flex h-full items-center gap-4 pl-4 opacity-35 grayscale">
      {preview.map((item, i) => {
        const brand = getBrand(item.brandId);
        return (
          <div
            key={`${item.id}-${i}`}
            className="flex shrink-0 flex-col items-center justify-center rounded-2xl border border-border-soft bg-surface p-3"
            style={{ width: CARD_WIDTH, height: 224 }}
          >
            <ProductArt subtype={item.subtype} brand={brand} flavorOrEdition={item.flavorOrEdition} className="h-32 w-full" />
          </div>
        );
      })}
    </div>
  );
}
