import { Item } from "./types";

/**
 * Weighted random selection using each item's posted odds (percent, sums to 100).
 * This is the ONLY place a winner is determined — the roulette animation never
 * influences the outcome, it only reveals it.
 */
export function pickWeightedItem(items: Item[]): Item {
  const roll = Math.random() * 100;
  let cumulative = 0;
  for (const item of items) {
    cumulative += item.odds;
    if (roll <= cumulative) return item;
  }
  return items[items.length - 1];
}

export interface StripEntry {
  key: string;
  item: Item;
}

export const STRIP_LENGTH = 70;
export const WINNER_INDEX = 58;

/**
 * Builds the long horizontal strip of cards for the roulette animation.
 * The winner (already chosen by pickWeightedItem) is placed at a fixed
 * index; every other slot is filled with a random item drawn using the
 * same odds, so rare items can plausibly appear as near-misses nearby.
 */
export function buildStrip(items: Item[], winner: Item): StripEntry[] {
  const strip: StripEntry[] = [];
  for (let i = 0; i < STRIP_LENGTH; i++) {
    if (i === WINNER_INDEX) {
      strip.push({ key: `winner-${i}`, item: winner });
    } else {
      const filler = pickWeightedItem(items);
      strip.push({
        key: `filler-${i}-${Math.random().toString(36).slice(2, 8)}`,
        item: filler,
      });
    }
  }
  return strip;
}
