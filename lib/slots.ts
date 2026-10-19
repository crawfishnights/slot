/**
 * Slot machine math. Like the crates, the outcome is decided up front by
 * spinReels(), and the reel animation only reveals it.
 *
 * Every winning line pays a *range* rather than a fixed amount. The range is
 * a multiplier of the bet, so it scales with whatever bet is chosen, and the
 * exact payout inside that range is rolled fresh on every win.
 */

export interface SlotSymbol {
  id: string;
  glyph: string;
  label: string;
  /** Relative weight on each reel. All reels share the same strip. */
  weight: number;
  /** Bet multiplier range for three of a kind, inclusive. */
  triple: [number, number];
  /** Bet multiplier range for exactly two of a kind, inclusive. */
  pair: [number, number];
  color: string;
}

export const SYMBOLS: SlotSymbol[] = [
  { id: "cherry", glyph: "🍒", label: "Cherry", weight: 30, triple: [3, 6], pair: [0.5, 1], color: "#e0566b" },
  { id: "lemon", glyph: "🍋", label: "Lemon", weight: 25, triple: [5, 10], pair: [0.5, 1], color: "#e8cf4f" },
  { id: "bell", glyph: "🔔", label: "Bell", weight: 20, triple: [10, 20], pair: [0.5, 1.5], color: "#d9a441" },
  { id: "clover", glyph: "🍀", label: "Clover", weight: 13, triple: [20, 40], pair: [1, 2], color: "#8bb98a" },
  { id: "diamond", glyph: "💎", label: "Diamond", weight: 8, triple: [50, 100], pair: [1.5, 3], color: "#7fc4e8" },
  { id: "seven", glyph: "7️⃣", label: "Seven", weight: 4, triple: [150, 300], pair: [2, 5], color: "#f4efe6" },
];

export const BET_OPTIONS = [10, 25, 50, 100, 250, 500];
export const REEL_COUNT = 3;

const TOTAL_WEIGHT = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);

export function symbolOdds(symbol: SlotSymbol): number {
  return symbol.weight / TOTAL_WEIGHT;
}

function pickSymbol(): SlotSymbol {
  let roll = Math.random() * TOTAL_WEIGHT;
  for (const symbol of SYMBOLS) {
    roll -= symbol.weight;
    if (roll < 0) return symbol;
  }
  return SYMBOLS[SYMBOLS.length - 1];
}

export interface SpinResult {
  reels: SlotSymbol[];
  kind: "triple" | "pair" | "none";
  /** The symbol that formed the win, if any. */
  match: SlotSymbol | null;
  multiplier: number;
  payout: number;
}

/** Finds the matched symbol and win kind for a set of reels. */
function evaluate(reels: SlotSymbol[]): Pick<SpinResult, "kind" | "match"> {
  const [a, b, c] = reels;
  if (a.id === b.id && b.id === c.id) return { kind: "triple", match: a };
  const pair = a.id === b.id || a.id === c.id ? a : b.id === c.id ? b : null;
  return pair ? { kind: "pair", match: pair } : { kind: "none", match: null };
}

/** Rolls a multiplier inside [min, max], snapped to 0.1x steps. */
function rollInRange([min, max]: [number, number]): number {
  return Math.round((min + Math.random() * (max - min)) * 10) / 10;
}

export function spinReels(bet: number): SpinResult {
  const reels = Array.from({ length: REEL_COUNT }, pickSymbol);
  const { kind, match } = evaluate(reels);
  const multiplier = match ? rollInRange(kind === "triple" ? match.triple : match.pair) : 0;
  return { reels, kind, match, multiplier, payout: Math.round(bet * multiplier) };
}

/**
 * Exact long-run return and hit rate, enumerated over every reel combination
 * using the midpoint of each payout range. Shown on the page so the odds are
 * posted, not hidden.
 */
export function machineStats(): { rtp: number; hitRate: number } {
  let rtp = 0;
  let hitRate = 0;
  for (const a of SYMBOLS)
    for (const b of SYMBOLS)
      for (const c of SYMBOLS) {
        const p = symbolOdds(a) * symbolOdds(b) * symbolOdds(c);
        const { kind, match } = evaluate([a, b, c]);
        if (!match) continue;
        const [min, max] = kind === "triple" ? match.triple : match.pair;
        rtp += p * ((min + max) / 2);
        hitRate += p;
      }
  return { rtp, hitRate };
}

export function randomSymbol(): SlotSymbol {
  return pickSymbol();
}
