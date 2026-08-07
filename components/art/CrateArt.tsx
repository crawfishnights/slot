"use client";

import { useId } from "react";
import { Crate } from "@/lib/types";

interface CrateArtProps {
  crate: Pick<Crate, "palette" | "pattern" | "name">;
  className?: string;
}

function shade(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  let r = (num >> 16) + Math.round((percent / 100) * 255);
  let g = ((num >> 8) & 0x00ff) + Math.round((percent / 100) * 255);
  let b = (num & 0x0000ff) + Math.round((percent / 100) * 255);
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function CrateArt({ crate, className }: CrateArtProps) {
  const uid = useId().replace(/[:]/g, "");
  const { primary, secondary, accent, glow } = crate.palette;
  const front = `front-${uid}`;
  const lid = `lid-${uid}`;
  const side = `side-${uid}`;
  const glowId = `glow-${uid}`;
  const clipId = `clip-${uid}`;
  const mark = crate.name.replace("Crate", "").trim().charAt(0);

  return (
    <svg viewBox="0 0 320 320" className={className} role="img" aria-label={`${crate.name} artwork`}>
      <defs>
        <linearGradient id={front} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={shade(primary, 12)} />
          <stop offset="55%" stopColor={primary} />
          <stop offset="100%" stopColor={shade(secondary, -20)} />
        </linearGradient>
        <linearGradient id={lid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={shade(accent, 10)} />
          <stop offset="100%" stopColor={shade(primary, -5)} />
        </linearGradient>
        <linearGradient id={side} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={shade(secondary, -35)} />
          <stop offset="100%" stopColor={shade(secondary, -55)} />
        </linearGradient>
        <radialGradient id={glowId} cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor={glow} stopOpacity="0.55" />
          <stop offset="100%" stopColor={glow} stopOpacity="0" />
        </radialGradient>
        <clipPath id={clipId}>
          <path d="M60 110 L160 70 L260 110 L260 250 L160 290 L60 250 Z" />
        </clipPath>
      </defs>

      <rect width="320" height="320" fill={`url(#${glowId})`} />
      <ellipse cx="160" cy="284" rx="108" ry="16" fill="#000" opacity="0.35" />

      {/* side face */}
      <path d="M60 110 L60 250 L160 290 L160 150 Z" fill={`url(#${side})`} />
      {/* front face */}
      <path d="M160 150 L160 290 L260 250 L260 110 Z" fill={`url(#${front})`} />
      {/* lid / top face */}
      <path d="M60 110 L160 70 L260 110 L160 150 Z" fill={`url(#${lid})`} />

      {/* decorative pattern, clipped to the whole box silhouette */}
      <g clipPath={`url(#${clipId})`} opacity="0.16">
        <PatternFill pattern={crate.pattern} accent={accent} />
      </g>

      {/* strapping */}
      <path d="M160 70 L160 290" stroke={shade(secondary, -45)} strokeWidth="10" opacity="0.55" />
      <path d="M60 178 L160 218 L260 178" stroke={shade(secondary, -45)} strokeWidth="8" fill="none" opacity="0.5" />
      <path d="M60 178 L160 218 L260 178" stroke={accent} strokeWidth="2" fill="none" opacity="0.8" />

      {/* brand plaque */}
      <g transform="translate(160 205)">
        <circle r="34" fill="rgba(10,10,16,0.55)" stroke={accent} strokeWidth="2" />
        <circle r="34" fill="none" stroke={shade(accent, 20)} strokeWidth="0.75" opacity="0.6" />
        <text
          y="12"
          textAnchor="middle"
          fontSize="34"
          fontWeight="800"
          fill={accent}
          fontFamily="var(--font-display, sans-serif)"
        >
          {mark}
        </text>
      </g>

      {/* lid seam highlight */}
      <path d="M60 110 L160 70 L260 110" stroke={shade(accent, 25)} strokeWidth="1.5" fill="none" opacity="0.7" />
    </svg>
  );
}

function PatternFill({ pattern, accent }: { pattern: Crate["pattern"]; accent: string }) {
  switch (pattern) {
    case "drip":
      return (
        <g fill={accent}>
          {Array.from({ length: 24 }).map((_, i) => {
            const x = (i % 6) * 55 + 20;
            const y = Math.floor(i / 6) * 60 + 60;
            return <path key={i} d={`M${x} ${y} q8 14 0 24 q-8 -10 0 -24`} />;
          })}
        </g>
      );
    case "citrus":
      return (
        <g stroke={accent} strokeWidth="2" fill="none">
          {Array.from({ length: 12 }).map((_, i) => {
            const cx = (i % 4) * 80 + 40;
            const cy = Math.floor(i / 4) * 80 + 60;
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r="20" />
                {Array.from({ length: 8 }).map((__, j) => (
                  <line
                    key={j}
                    x1={cx}
                    y1={cy}
                    x2={cx + 20 * Math.cos((j * Math.PI) / 4)}
                    y2={cy + 20 * Math.sin((j * Math.PI) / 4)}
                  />
                ))}
              </g>
            );
          })}
        </g>
      );
    case "frost":
      return (
        <g stroke={accent} strokeWidth="2">
          {Array.from({ length: 16 }).map((_, i) => {
            const cx = (i % 4) * 80 + 40;
            const cy = Math.floor(i / 4) * 80 + 50;
            return (
              <g key={i}>
                {[0, 60, 120].map((deg) => (
                  <line
                    key={deg}
                    x1={cx - 18 * Math.cos((deg * Math.PI) / 180)}
                    y1={cy - 18 * Math.sin((deg * Math.PI) / 180)}
                    x2={cx + 18 * Math.cos((deg * Math.PI) / 180)}
                    y2={cy + 18 * Math.sin((deg * Math.PI) / 180)}
                  />
                ))}
              </g>
            );
          })}
        </g>
      );
    case "bolt":
      return (
        <g fill={accent}>
          {Array.from({ length: 10 }).map((_, i) => {
            const x = (i % 5) * 64 + 20;
            const y = Math.floor(i / 5) * 100 + 60;
            return <path key={i} d={`M${x + 14} ${y} L${x} ${y + 24} L${x + 10} ${y + 24} L${x - 4} ${y + 52} L${x + 22} ${y + 22} L${x + 12} ${y + 22} Z`} />;
          })}
        </g>
      );
    case "crest":
      return (
        <g stroke={accent} strokeWidth="1.5" fill="none">
          {Array.from({ length: 9 }).map((_, i) => {
            const cx = (i % 3) * 100 + 60;
            const cy = Math.floor(i / 3) * 90 + 70;
            return <path key={i} d={`M${cx} ${cy - 22} L${cx + 18} ${cy - 8} L${cx + 12} ${cy + 20} L${cx} ${cy + 26} L${cx - 12} ${cy + 20} L${cx - 18} ${cy - 8} Z`} />;
          })}
        </g>
      );
    case "diamond":
    default:
      return (
        <g stroke={accent} strokeWidth="1.5" fill="none">
          {Array.from({ length: 20 }).map((_, i) => {
            const x = (i % 5) * 60 + 30;
            const y = Math.floor(i / 5) * 55 + 40;
            return <rect key={i} x={x - 12} y={y - 12} width="24" height="24" transform={`rotate(45 ${x} ${y})`} />;
          })}
        </g>
      );
  }
}
