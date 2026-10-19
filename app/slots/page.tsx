"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { formatCredits } from "@/lib/format";
import {
  BET_OPTIONS,
  REEL_COUNT,
  SYMBOLS,
  SlotSymbol,
  SpinResult,
  machineStats,
  randomSymbol,
  spinReels,
  symbolOdds,
} from "@/lib/slots";
import { CELL_HEIGHT, SlotReel, VISIBLE_ROWS } from "@/components/SlotReel";

const BASE_SPIN_MS = 1400;
const REEL_STAGGER_MS = 450;
const FILLER_PER_REEL = 18;

/** Filler on top, the result second from the bottom, one filler under it. */
function buildStrip(result: SlotSymbol, reelIndex: number): SlotSymbol[] {
  const filler = Array.from({ length: FILLER_PER_REEL + reelIndex * 6 }, randomSymbol);
  return [...filler, result, randomSymbol()];
}

function idleStrip(): SlotSymbol[] {
  return [SYMBOLS[1], SYMBOLS[5], SYMBOLS[0]];
}

function formatRange(bet: number, [min, max]: [number, number]): string {
  return `${formatCredits(bet * min)}–${formatCredits(bet * max)}`;
}

interface HistoryEntry {
  id: number;
  result: SpinResult;
  bet: number;
}

export default function SlotsPage() {
  const credits = useStore((s) => s.credits);
  const hasHydrated = useStore((s) => s.hasHydrated);
  const spend = useStore((s) => s.spend);
  const award = useStore((s) => s.award);

  const [bet, setBet] = useState(BET_OPTIONS[1]);
  const [strips, setStrips] = useState<SlotSymbol[][]>(() =>
    Array.from({ length: REEL_COUNT }, idleStrip)
  );
  const [spinId, setSpinId] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [shown, setShown] = useState<HistoryEntry | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const pending = useRef<HistoryEntry | null>(null);
  const stoppedReels = useRef(0);

  const stats = useMemo(() => machineStats(), []);

  const spin = () => {
    if (spinning) return;
    if (!spend(bet)) {
      setError("Not enough credits for that bet.");
      return;
    }
    setError(null);
    const result = spinReels(bet);
    pending.current = { id: spinId + 1, result, bet };
    stoppedReels.current = 0;
    setStrips(result.reels.map(buildStrip));
    setShown(null);
    setSpinning(true);
    setSpinId((id) => id + 1);
  };

  const handleReelStop = useCallback(() => {
    stoppedReels.current += 1;
    if (stoppedReels.current < REEL_COUNT || !pending.current) return;
    const entry = pending.current;
    pending.current = null;
    if (entry.result.payout > 0) award(entry.result.payout);
    setShown(entry);
    setHistory((h) => [entry, ...h].slice(0, 10));
    setSpinning(false);
  }, [award]);

  const net = history.reduce((sum, h) => sum + h.result.payout - h.bet, 0);
  const canAfford = hasHydrated && credits >= bet;

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-5 py-9 sm:px-8">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Slots</h1>
          <p className="mt-1 text-sm text-muted">
            Three reels, one payline. Every win pays a range, rolled fresh each time and scaled to your bet.
          </p>
        </div>
        <div className="paper-card flex divide-x divide-border-soft rounded-2xl text-sm">
          <div className="px-4 py-3">
            <div className="text-[10px] uppercase tracking-wide text-muted">Return</div>
            <div className="font-display font-semibold tabular-nums">{(stats.rtp * 100).toFixed(1)}%</div>
          </div>
          <div className="px-4 py-3">
            <div className="text-[10px] uppercase tracking-wide text-muted">Hit rate</div>
            <div className="font-display font-semibold tabular-nums">{(stats.hitRate * 100).toFixed(1)}%</div>
          </div>
          <div className="px-4 py-3">
            <div className="text-[10px] uppercase tracking-wide text-muted">Session</div>
            <div
              className={`font-display font-semibold tabular-nums ${net > 0 ? "text-positive" : net < 0 ? "text-[#e0566b]" : ""}`}
            >
              {net > 0 ? "+" : ""}
              {formatCredits(net)} cr
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <section className="paper-card grain flex flex-col gap-6 rounded-3xl p-5 sm:p-7 lg:col-span-3">
          <div className="relative">
            <div className="grid grid-cols-3 gap-3">
              {strips.map((strip, i) => (
                <SlotReel
                  key={i}
                  strip={strip}
                  spinId={spinId}
                  duration={BASE_SPIN_MS + i * REEL_STAGGER_MS}
                  onStop={handleReelStop}
                />
              ))}
            </div>
            <div
              className="pointer-events-none absolute inset-x-0 border-y-2 border-credit/60"
              style={{ top: CELL_HEIGHT * Math.floor(VISIBLE_ROWS / 2), height: CELL_HEIGHT }}
            />
          </div>

          <div className="flex min-h-14 items-center justify-center text-center" aria-live="polite">
            {spinning ? (
              <p className="text-sm text-muted">Spinning…</p>
            ) : shown ? (
              shown.result.match ? (
                <div className="animate-rise-in">
                  <p className="font-display text-2xl font-semibold text-positive">
                    +{formatCredits(shown.result.payout)} cr
                  </p>
                  <p className="text-xs text-muted">
                    {shown.result.kind === "triple" ? "Three" : "Two"} {shown.result.match.label.toLowerCase()}s
                    {" · "}
                    {shown.result.multiplier}x your {formatCredits(shown.bet)} cr bet
                  </p>
                </div>
              ) : (
                <p className="animate-fade-in text-sm text-muted">No match. Spin again.</p>
              )
            ) : error ? (
              <p className="text-sm text-[#e0566b]">{error}</p>
            ) : (
              <p className="text-sm text-muted">Pick a bet and pull.</p>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap justify-center gap-2">
              {BET_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => setBet(option)}
                  disabled={spinning}
                  className={`rounded-full border px-4 py-1.5 text-[13px] font-semibold tabular-nums transition-colors disabled:opacity-50 ${
                    bet === option
                      ? "border-credit bg-credit/15 text-credit"
                      : "border-border-soft text-muted hover:border-border hover:text-foreground"
                  }`}
                >
                  {formatCredits(option)}
                </button>
              ))}
            </div>
            <button
              onClick={spin}
              disabled={spinning || !canAfford}
              className="mx-auto w-full max-w-xs rounded-full bg-cream py-3.5 text-sm font-bold uppercase tracking-wider text-background transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {spinning ? "Spinning" : `Spin for ${formatCredits(bet)} cr`}
            </button>
          </div>
        </section>

        <aside className="flex flex-col gap-6 lg:col-span-2">
          <section className="paper-card rounded-3xl p-5">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-lg font-semibold">Paytable</h2>
              <span className="text-[11px] text-muted">at {formatCredits(bet)} cr bet</span>
            </div>
            <table className="mt-3 w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wide text-muted">
                  <th className="pb-2 font-medium">Symbol</th>
                  <th className="pb-2 font-medium">Reel odds</th>
                  <th className="pb-2 text-right font-medium">Two</th>
                  <th className="pb-2 text-right font-medium">Three</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft">
                {[...SYMBOLS].reverse().map((symbol) => (
                  <tr key={symbol.id}>
                    <td className="py-2">
                      <span className="mr-2 text-lg">{symbol.glyph}</span>
                      <span className="text-[13px]" style={{ color: symbol.color }}>
                        {symbol.label}
                      </span>
                    </td>
                    <td className="py-2 tabular-nums text-muted">{Math.round(symbolOdds(symbol) * 100)}%</td>
                    <td className="py-2 text-right tabular-nums text-muted">{formatRange(bet, symbol.pair)}</td>
                    <td className="py-2 text-right font-semibold tabular-nums">{formatRange(bet, symbol.triple)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-[11px] leading-relaxed text-muted-2">
              Payouts in credits. Each win rolls a random amount inside its range. Return is the long-run
              average using range midpoints.
            </p>
          </section>

          <section className="paper-card rounded-3xl p-5">
            <h2 className="font-display text-lg font-semibold">Recent spins</h2>
            {history.length === 0 ? (
              <p className="mt-2 text-sm text-muted">Nothing yet.</p>
            ) : (
              <ul className="mt-3 flex flex-col gap-1.5">
                {history.map((h) => (
                  <li key={h.id} className="flex items-center justify-between text-sm">
                    <span className="tracking-widest">{h.result.reels.map((r) => r.glyph).join(" ")}</span>
                    <span
                      className={`tabular-nums ${h.result.payout > 0 ? "font-semibold text-positive" : "text-muted-2"}`}
                    >
                      {h.result.payout > 0 ? `+${formatCredits(h.result.payout)}` : `−${formatCredits(h.bet)}`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
