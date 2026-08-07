"use client";

import { useId } from "react";
import { Crate } from "@/lib/types";
import { getBrand } from "@/lib/data/brands";
import { sortedByValueDesc } from "@/lib/data/crates";
import { ProductArt } from "./ProductArt";

interface CrateArtProps {
  crate: Crate;
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

/**
 * The crate's artwork is a promotional collage of its own top products —
 * not a colored cube. The headliner sits large and centered with a glow;
 * two supporting pulls flank it smaller and rotated, like product photography
 * arranged for a poster. A crate-specific pattern gives each box its own
 * printed-packaging texture.
 */
export function CrateArt({ crate, className }: CrateArtProps) {
  const uid = useId().replace(/[:]/g, "");
  const { primary, secondary, ink, accent } = crate.palette;
  const bgId = `bg-${uid}`;
  const glowId = `glow-${uid}`;
  const vignetteId = `vin-${uid}`;

  const featured = sortedByValueDesc(crate).slice(0, 3);
  const [center, left, right] = featured;

  return (
    <svg viewBox="0 0 320 380" className={className} role="img" aria-label={`${crate.name} artwork`}>
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={shade(primary, 8)} />
          <stop offset="60%" stopColor={shade(secondary, -8)} />
          <stop offset="100%" stopColor={ink} />
        </linearGradient>
        <radialGradient id={glowId} cx="50%" cy="46%" r="42%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.55" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={vignetteId} cx="50%" cy="50%" r="72%">
          <stop offset="60%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
        </radialGradient>
        <clipPath id={`panel-${uid}`}>
          <rect x="8" y="8" width="304" height="364" rx="20" />
        </clipPath>
      </defs>

      <g clipPath={`url(#panel-${uid})`}>
        <rect x="8" y="8" width="304" height="364" fill={`url(#${bgId})`} />
        <PatternOverlay crate={crate} accent={accent} />
        <rect x="8" y="8" width="304" height="364" fill={`url(#${glowId})`} />

        {left && (
          <g transform="translate(46,238) rotate(-11)" opacity="0.92">
            <ellipse cx="40" cy="112" rx="34" ry="8" fill="#000" opacity="0.35" />
            <svg x="0" y="0" width="90" height="118" viewBox="0 0 200 260">
              <ProductArtInline item={left} />
            </svg>
          </g>
        )}
        {right && (
          <g transform="translate(196,244) rotate(9)" opacity="0.92">
            <ellipse cx="38" cy="106" rx="32" ry="8" fill="#000" opacity="0.35" />
            <svg x="0" y="0" width="86" height="112" viewBox="0 0 200 260">
              <ProductArtInline item={right} />
            </svg>
          </g>
        )}
        {center && (
          <g transform="translate(88,88)">
            <ellipse cx="52" cy="196" rx="52" ry="12" fill="#000" opacity="0.4" />
            <svg x="0" y="0" width="140" height="184" viewBox="0 0 200 260">
              <ProductArtInline item={center} />
            </svg>
          </g>
        )}

        <rect x="8" y="8" width="304" height="364" fill={`url(#${vignetteId})`} />
      </g>
      <rect x="8" y="8" width="304" height="364" rx="20" fill="none" stroke={shade(accent, 10)} strokeOpacity="0.35" strokeWidth="1.5" />
    </svg>
  );
}

function ProductArtInline({ item }: { item: ReturnType<typeof sortedByValueDesc>[number] }) {
  const brand = getBrand(item.brandId);
  return (
    <ProductArt
      renderShape={item.renderShape}
      brand={brand}
      flavorOrEdition={item.flavorOrEdition}
    />
  );
}

function PatternOverlay({ crate, accent }: { crate: Crate; accent: string }) {
  switch (crate.slug) {
    case "corner-store":
      return (
        <g stroke={accent} strokeWidth="10" opacity="0.1">
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={i} x1={-40 + i * 70} y1="400" x2={40 + i * 70} y2="-20" />
          ))}
        </g>
      );
    case "strawberry-stash":
      return (
        <g fill={accent} opacity="0.14">
          {Array.from({ length: 30 }).map((_, i) => {
            const x = (i % 6) * 56 + 20;
            const y = Math.floor(i / 6) * 76 + 30;
            return <circle key={i} cx={x} cy={y} r="4.5" />;
          })}
        </g>
      );
    case "after-hours-reserve":
      return (
        <g stroke={accent} strokeWidth="1" opacity="0.22" fill="none">
          {Array.from({ length: 12 }).map((_, i) => {
            const cx = (i % 4) * 84 + 40;
            const cy = Math.floor(i / 4) * 110 + 60;
            return <rect key={i} x={cx - 16} y={cy - 16} width="32" height="32" transform={`rotate(45 ${cx} ${cy})`} />;
          })}
        </g>
      );
    default:
      return null;
  }
}
