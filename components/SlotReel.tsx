"use client";

import { useEffect, useRef } from "react";
import { SlotSymbol } from "@/lib/slots";

export const CELL_HEIGHT = 104;
export const VISIBLE_ROWS = 3;

interface SlotReelProps {
  /** Symbols top to bottom. The result sits second from the bottom. */
  strip: SlotSymbol[];
  spinId: number;
  duration: number;
  onStop: () => void;
}

export function SlotReel({ strip, spinId, duration, onStop }: SlotReelProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const onStopRef = useRef(onStop);

  useEffect(() => {
    onStopRef.current = onStop;
  }, [onStop]);

  useEffect(() => {
    const el = stripRef.current;
    if (!el || spinId === 0) return;
    const finalY = -(strip.length - VISIBLE_ROWS) * CELL_HEIGHT;
    const animation = el.animate(
      [{ transform: "translateY(0px)" }, { transform: `translateY(${finalY}px)` }],
      { duration, easing: "cubic-bezier(0.15, 0.85, 0.25, 1.02)", fill: "forwards" }
    );
    animation.finished.then(() => onStopRef.current(), () => {});
    return () => animation.cancel();
    // Only a new spin should restart the animation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinId]);

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border bg-surface-2"
      style={{ height: CELL_HEIGHT * VISIBLE_ROWS }}
    >
      <div ref={stripRef} className="will-change-transform">
        {strip.map((symbol, i) => (
          <div
            key={`${spinId}-${i}`}
            className="flex items-center justify-center text-5xl sm:text-6xl select-none"
            style={{ height: CELL_HEIGHT }}
            aria-hidden={i !== strip.length - 2}
          >
            {symbol.glyph}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-background/85 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/85 to-transparent" />
    </div>
  );
}
