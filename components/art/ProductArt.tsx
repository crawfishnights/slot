"use client";

import { useId } from "react";
import { BrandTier, ProductCategory } from "@/lib/types";

interface ProductArtProps {
  category: ProductCategory;
  colors: [string, string];
  brandTier: BrandTier;
  brandInitial: string;
  className?: string;
}

/** Lighten/darken a hex color by a percent amount (-100..100). */
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

const TIER_TRIM: Record<BrandTier, string> = {
  budget: "#c9c9c9",
  mainstream: "#e8e8e8",
  premium: "#f2d675",
  luxury: "#e8c766",
  collectible: "#fff2b8",
};

export function ProductArt({
  category,
  colors,
  brandTier,
  brandInitial,
  className,
}: ProductArtProps) {
  const uid = useId().replace(/[:]/g, "");
  const [c1, c2] = colors;
  const dark = shade(c1, -35);
  const darker = shade(c1, -55);
  const light = shade(c2, 20);
  const trim = TIER_TRIM[brandTier];
  const isFancy = brandTier === "luxury" || brandTier === "collectible";

  const bodyGradId = `body-${uid}`;
  const glossGradId = `gloss-${uid}`;
  const capGradId = `cap-${uid}`;
  const glowId = `glow-${uid}`;

  return (
    <svg
      viewBox="0 0 200 260"
      className={className}
      role="img"
      aria-label="product artwork"
    >
      <defs>
        <linearGradient id={bodyGradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={light} />
          <stop offset="45%" stopColor={c1} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        <linearGradient id={capGradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={shade(c2, 25)} />
          <stop offset="100%" stopColor={shade(c2, -20)} />
        </linearGradient>
        <linearGradient id={glossGradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="18%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={glowId} cx="50%" cy="85%" r="55%">
          <stop offset="0%" stopColor={c1} stopOpacity="0.55" />
          <stop offset="100%" stopColor={c1} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="100" cy="225" rx="70" ry="18" fill={`url(#${glowId})`} />
      <ellipse cx="100" cy="232" rx="46" ry="9" fill="#000" opacity="0.35" />

      {category === "can" && (
        <CanArt
          bodyGrad={bodyGradId}
          capGrad={capGradId}
          glossGrad={glossGradId}
          darker={darker}
          trim={trim}
          initial={brandInitial}
          fancy={isFancy}
        />
      )}
      {category === "bottle" && (
        <BottleArt
          bodyGrad={bodyGradId}
          capGrad={capGradId}
          glossGrad={glossGradId}
          darker={darker}
          trim={trim}
          initial={brandInitial}
          fancy={isFancy}
        />
      )}
      {category === "jar" && (
        <JarArt
          bodyGrad={bodyGradId}
          capGrad={capGradId}
          glossGrad={glossGradId}
          darker={darker}
          trim={trim}
          initial={brandInitial}
          fancy={isFancy}
        />
      )}
      {category === "box" && (
        <BoxArt
          bodyGrad={bodyGradId}
          glossGrad={glossGradId}
          darker={darker}
          trim={trim}
          initial={brandInitial}
          fancy={isFancy}
        />
      )}
      {category === "pouch" && (
        <PouchArt
          bodyGrad={bodyGradId}
          glossGrad={glossGradId}
          darker={darker}
          trim={trim}
          initial={brandInitial}
          fancy={isFancy}
        />
      )}
      {category === "bar" && (
        <BarArt
          bodyGrad={bodyGradId}
          glossGrad={glossGradId}
          darker={darker}
          trim={trim}
          initial={brandInitial}
          fancy={isFancy}
        />
      )}
      {category === "tin" && (
        <TinArt
          bodyGrad={bodyGradId}
          capGrad={capGradId}
          glossGrad={glossGradId}
          darker={darker}
          trim={trim}
          initial={brandInitial}
          fancy={isFancy}
        />
      )}
      {category === "flask" && (
        <FlaskArt
          bodyGrad={bodyGradId}
          capGrad={capGradId}
          glossGrad={glossGradId}
          darker={darker}
          trim={trim}
          initial={brandInitial}
          fancy={isFancy}
        />
      )}
    </svg>
  );
}

interface ShapeProps {
  bodyGrad?: string;
  capGrad?: string;
  glossGrad: string;
  darker: string;
  trim: string;
  initial: string;
  fancy: boolean;
}

function Emblem({ initial, y = 148, trim }: { initial: string; y?: number; trim: string }) {
  return (
    <g>
      <circle cx="100" cy={y} r="20" fill="rgba(0,0,0,0.18)" stroke={trim} strokeWidth="1.5" />
      <text
        x="100"
        y={y + 7}
        textAnchor="middle"
        fontSize="20"
        fontWeight="700"
        fill={trim}
        fontFamily="var(--font-display, sans-serif)"
      >
        {initial}
      </text>
    </g>
  );
}

function CanArt({ bodyGrad, capGrad, glossGrad, darker, trim, initial, fancy }: ShapeProps) {
  return (
    <g>
      <rect x="55" y="40" width="90" height="180" rx="14" fill={`url(#${bodyGrad})`} stroke={darker} strokeWidth="2" />
      <rect x="55" y="40" width="90" height="180" rx="14" fill={`url(#${glossGrad})`} />
      <ellipse cx="100" cy="42" rx="45" ry="9" fill={`url(#${capGrad})`} stroke={darker} strokeWidth="1.5" />
      <ellipse cx="100" cy="219" rx="45" ry="8" fill={darker} opacity="0.9" />
      <rect x="55" y="118" width="90" height="34" fill="rgba(0,0,0,0.15)" />
      <rect x="55" y="118" width="90" height="3" fill={trim} opacity="0.8" />
      <rect x="55" y="149" width="90" height="3" fill={trim} opacity="0.8" />
      <Emblem initial={initial} y={135} trim={trim} />
      {fancy && (
        <>
          <rect x="61" y="46" width="78" height="4" rx="2" fill={trim} opacity="0.9" />
          <rect x="61" y="204" width="78" height="4" rx="2" fill={trim} opacity="0.9" />
        </>
      )}
    </g>
  );
}

function BottleArt({ bodyGrad, capGrad, glossGrad, darker, trim, initial, fancy }: ShapeProps) {
  return (
    <g>
      <path
        d="M85 30 h30 v28 c0 8 14 14 14 34 v104 a12 12 0 0 1 -12 12 h-34 a12 12 0 0 1 -12 -12 v-104 c0 -20 14 -26 14 -34 z"
        fill={`url(#${bodyGrad})`}
        stroke={darker}
        strokeWidth="2"
      />
      <path
        d="M85 30 h30 v28 c0 8 14 14 14 34 v104 a12 12 0 0 1 -12 12 h-34 a12 12 0 0 1 -12 -12 v-104 c0 -20 14 -26 14 -34 z"
        fill={`url(#${glossGrad})`}
      />
      <rect x="88" y="18" width="24" height="16" rx="3" fill={`url(#${capGrad})`} stroke={darker} strokeWidth="1.5" />
      <rect x="71" y="128" width="58" height="46" rx="4" fill="rgba(0,0,0,0.18)" />
      <rect x="71" y="128" width="58" height="3" fill={trim} opacity="0.85" />
      <rect x="71" y="171" width="58" height="3" fill={trim} opacity="0.85" />
      <Emblem initial={initial} y={151} trim={trim} />
      {fancy && <rect x="88" y="20" width="24" height="4" rx="2" fill={trim} />}
    </g>
  );
}

function JarArt({ bodyGrad, capGrad, glossGrad, darker, trim, initial, fancy }: ShapeProps) {
  return (
    <g>
      <rect x="62" y="70" width="76" height="130" rx="18" fill={`url(#${bodyGrad})`} stroke={darker} strokeWidth="2" />
      <rect x="62" y="70" width="76" height="130" rx="18" fill={`url(#${glossGrad})`} />
      <rect x="70" y="46" width="60" height="30" rx="8" fill={`url(#${capGrad})`} stroke={darker} strokeWidth="1.5" />
      <rect x="70" y="58" width="60" height="4" fill={darker} opacity="0.5" />
      <circle cx="100" cy="140" r="24" fill="rgba(255,255,255,0.9)" stroke={trim} strokeWidth="2" />
      <text x="100" y="147" textAnchor="middle" fontSize="22" fontWeight="700" fill={darker}>
        {initial}
      </text>
      {fancy && <rect x="66" y="180" width="68" height="4" rx="2" fill={trim} />}
    </g>
  );
}

function BoxArt({ bodyGrad, glossGrad, darker, trim, initial, fancy }: ShapeProps) {
  return (
    <g>
      <rect x="48" y="70" width="104" height="120" rx="6" fill={`url(#${bodyGrad})`} stroke={darker} strokeWidth="2" />
      <rect x="48" y="70" width="104" height="120" rx="6" fill={`url(#${glossGrad})`} />
      <rect x="48" y="70" width="104" height="26" fill="rgba(0,0,0,0.2)" />
      <rect x="94" y="70" width="12" height="120" fill={trim} opacity="0.85" />
      <rect x="48" y="120" width="104" height="12" fill={trim} opacity="0.85" />
      <circle cx="100" cy="126" r="16" fill="rgba(0,0,0,0.25)" stroke={trim} strokeWidth="1.5" />
      <text x="100" y="132" textAnchor="middle" fontSize="16" fontWeight="700" fill={trim}>
        {initial}
      </text>
      {fancy && (
        <>
          <rect x="52" y="74" width="96" height="2" fill={trim} opacity="0.6" />
          <rect x="52" y="182" width="96" height="2" fill={trim} opacity="0.6" />
        </>
      )}
    </g>
  );
}

function PouchArt({ bodyGrad, glossGrad, darker, trim, initial, fancy }: ShapeProps) {
  return (
    <g>
      <path
        d="M60 90 q-6 -30 40 -30 q46 0 40 30 q14 8 14 45 q0 60 -54 65 q-54 -5 -54 -65 q0 -37 14 -45 z"
        fill={`url(#${bodyGrad})`}
        stroke={darker}
        strokeWidth="2"
      />
      <path
        d="M60 90 q-6 -30 40 -30 q46 0 40 30 q14 8 14 45 q0 60 -54 65 q-54 -5 -54 -65 q0 -37 14 -45 z"
        fill={`url(#${glossGrad})`}
      />
      <rect x="66" y="56" width="68" height="14" rx="7" fill={darker} opacity="0.7" />
      <rect x="60" y="126" width="80" height="40" rx="6" fill="rgba(255,255,255,0.92)" />
      <text x="100" y="152" textAnchor="middle" fontSize="20" fontWeight="700" fill={darker}>
        {initial}
      </text>
      {fancy && <rect x="66" y="58" width="68" height="4" rx="2" fill={trim} />}
    </g>
  );
}

function BarArt({ bodyGrad, glossGrad, darker, trim, initial, fancy }: ShapeProps) {
  return (
    <g>
      <path d="M40 100 l20 -20 h80 l20 20 v70 l-20 20 h-80 l-20 -20 z" fill={`url(#${bodyGrad})`} stroke={darker} strokeWidth="2" />
      <path d="M40 100 l20 -20 h80 l20 20 v70 l-20 20 h-80 l-20 -20 z" fill={`url(#${glossGrad})`} />
      <rect x="60" y="118" width="80" height="34" rx="4" fill="rgba(0,0,0,0.2)" />
      <text x="100" y="141" textAnchor="middle" fontSize="18" fontWeight="700" fill={trim}>
        {initial}
      </text>
      {fancy && (
        <>
          <circle cx="52" cy="90" r="4" fill={trim} />
          <circle cx="148" cy="180" r="4" fill={trim} />
        </>
      )}
    </g>
  );
}

function TinArt({ bodyGrad, capGrad, glossGrad, darker, trim, initial, fancy }: ShapeProps) {
  return (
    <g>
      <rect x="50" y="80" width="100" height="110" rx="10" fill={`url(#${bodyGrad})`} stroke={darker} strokeWidth="2" />
      <rect x="50" y="80" width="100" height="110" rx="10" fill={`url(#${glossGrad})`} />
      <ellipse cx="100" cy="80" rx="50" ry="12" fill={`url(#${capGrad})`} stroke={darker} strokeWidth="1.5" />
      <ellipse cx="100" cy="80" rx="34" ry="7" fill="rgba(0,0,0,0.2)" />
      <circle cx="100" cy="145" r="22" fill="rgba(0,0,0,0.22)" stroke={trim} strokeWidth="1.5" />
      <text x="100" y="152" textAnchor="middle" fontSize="20" fontWeight="700" fill={trim}>
        {initial}
      </text>
      {fancy && <ellipse cx="100" cy="80" rx="50" ry="12" fill="none" stroke={trim} strokeWidth="1.5" />}
    </g>
  );
}

function FlaskArt({ bodyGrad, capGrad, glossGrad, darker, trim, initial, fancy }: ShapeProps) {
  return (
    <g>
      <path
        d="M92 30 h16 v40 l28 60 c8 16 -2 40 -22 40 h-28 c-20 0 -30 -24 -22 -40 l28 -60 z"
        fill={`url(#${bodyGrad})`}
        stroke={darker}
        strokeWidth="2"
      />
      <path
        d="M92 30 h16 v40 l28 60 c8 16 -2 40 -22 40 h-28 c-20 0 -30 -24 -22 -40 l28 -60 z"
        fill={`url(#${glossGrad})`}
      />
      <rect x="88" y="18" width="24" height="16" rx="3" fill={`url(#${capGrad})`} stroke={darker} strokeWidth="1.5" />
      <path d="M70 140 h60 v34 h-60 z" fill="rgba(0,0,0,0.22)" />
      <text x="100" y="163" textAnchor="middle" fontSize="18" fontWeight="700" fill={trim}>
        {initial}
      </text>
      {fancy && (
        <>
          <path d="M92 30 h16 v40 l28 60 c8 16 -2 40 -22 40 h-28 c-20 0 -30 -24 -22 -40 l28 -60 z" fill="none" stroke={trim} strokeWidth="1.2" opacity="0.8" />
          <circle cx="100" cy="112" r="3" fill={trim} />
        </>
      )}
    </g>
  );
}
