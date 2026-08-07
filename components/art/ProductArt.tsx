"use client";

import { useId } from "react";
import { Brand, RenderShape } from "@/lib/types";

interface ProductArtProps {
  renderShape: RenderShape;
  brand: Brand;
  flavorOrEdition: string;
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

function truncate(s: string, n: number) {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}

/** Shared render context threaded into every shape. */
interface Ctx {
  uid: string;
  c1: string;
  c2: string;
  dark: string;
  darker: string;
  light: string;
  finish: Brand["finish"];
  wordmark: string;
  flavor: string;
  bodyGrad: string;
  labelGrad: string;
  metalGrad: string;
  glowId: string;
  outline: string;
  outlineW: number;
}

function useCtx(brand: Brand, flavorOrEdition: string): Ctx {
  const uid = useId().replace(/[:]/g, "");
  const [c1, c2] = brand.colors;
  const dark = shade(c1, -32);
  const darker = shade(c1, -52);
  const light = shade(c2, 22);
  const outline =
    brand.finish === "plastic" || brand.finish === "holo"
      ? "#0b0a09"
      : shade(dark, -20);
  return {
    uid,
    c1,
    c2,
    dark,
    darker,
    light,
    finish: brand.finish,
    wordmark: brand.wordmark,
    flavor: truncate(flavorOrEdition, 16),
    bodyGrad: `body-${uid}`,
    labelGrad: `label-${uid}`,
    metalGrad: `metal-${uid}`,
    glowId: `glow-${uid}`,
    outline,
    outlineW: brand.finish === "plastic" ? 2.5 : brand.finish === "pastel-matte" ? 1.2 : 2,
  };
}

/** Gradient + filter <defs> shared by every shape, keyed by finish. */
function FinishDefs({ ctx }: { ctx: Ctx }) {
  const { uid, c1, c2, dark, light, darker, finish } = ctx;
  return (
    <defs>
      <linearGradient id={ctx.bodyGrad} x1="0" y1="0" x2="1" y2="1">
        {finish === "dark-glass" ? (
          <>
            <stop offset="0%" stopColor={shade(c1, 18)} />
            <stop offset="55%" stopColor={c1} />
            <stop offset="100%" stopColor={darker} />
          </>
        ) : finish === "holo" ? (
          <>
            <stop offset="0%" stopColor="#141316" />
            <stop offset="100%" stopColor="#0a0a0c" />
          </>
        ) : finish === "kraft" ? (
          <>
            <stop offset="0%" stopColor={shade(c1, 14)} />
            <stop offset="100%" stopColor={shade(c1, -14)} />
          </>
        ) : finish === "pastel-matte" ? (
          <>
            <stop offset="0%" stopColor={light} />
            <stop offset="100%" stopColor={c2} />
          </>
        ) : (
          <>
            <stop offset="0%" stopColor={light} />
            <stop offset="45%" stopColor={c1} />
            <stop offset="100%" stopColor={dark} />
          </>
        )}
      </linearGradient>
      <linearGradient id={ctx.labelGrad} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={shade(c2, 20)} />
        <stop offset="100%" stopColor={shade(c2, -18)} />
      </linearGradient>
      <linearGradient id={ctx.metalGrad} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#efe6c8" />
        <stop offset="45%" stopColor="#c9a24b" />
        <stop offset="100%" stopColor="#8a6d2c" />
      </linearGradient>
      <linearGradient id={`holo-${uid}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ff2ee6" />
        <stop offset="50%" stopColor="#8f7bff" />
        <stop offset="100%" stopColor="#2ee6f2" />
      </linearGradient>
      <radialGradient id={ctx.glowId} cx="50%" cy="86%" r="55%">
        <stop offset="0%" stopColor={c1} stopOpacity="0.5" />
        <stop offset="100%" stopColor={c1} stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`gloss-${uid}`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
        <stop offset="16%" stopColor="#ffffff" stopOpacity="0.15" />
        <stop offset="32%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
    </defs>
  );
}

/** Decorative overlay applied on top of the base body shape per finish. */
function FinishOverlay({
  ctx,
  clipPath,
  w = 200,
  h = 260,
}: {
  ctx: Ctx;
  clipPath?: string;
  w?: number;
  h?: number;
}) {
  const { finish, uid } = ctx;
  return (
    <g clipPath={clipPath}>
      {(finish === "gloss" || finish === "plastic") && (
        <rect x={w * 0.1} y={0} width={w * 0.22} height={h} fill={`url(#gloss-${uid})`} />
      )}
      {finish === "kraft" && (
        <g stroke={shade(ctx.c1, -30)} strokeWidth="0.6" opacity="0.35">
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={i} x1={0} y1={i * (h / 10)} x2={w} y2={i * (h / 10) + 6} />
          ))}
        </g>
      )}
      {finish === "holo" && (
        <>
          <rect x={0} y={h * 0.18} width={w} height={h * 0.22} fill={`url(#holo-${uid})`} opacity="0.55" transform={`rotate(-8 ${w / 2} ${h / 2})`} />
          <rect x={0} y={h * 0.58} width={w} height={h * 0.12} fill={`url(#holo-${uid})`} opacity="0.35" transform={`rotate(-8 ${w / 2} ${h / 2})`} />
        </>
      )}
      {finish === "dark-glass" && (
        <>
          <rect x={w * 0.16} y={0} width={w * 0.08} height={h} fill="#ffffff" opacity="0.18" />
          <rect x={w * 0.28} y={0} width={w * 0.03} height={h} fill="#ffffff" opacity="0.12" />
        </>
      )}
    </g>
  );
}

function LabelPlate({
  ctx,
  x,
  y,
  w,
  h,
  compact,
}: {
  ctx: Ctx;
  x: number;
  y: number;
  w: number;
  h: number;
  compact?: boolean;
}) {
  const textColor = ctx.finish === "kraft" ? "#2b2317" : ctx.finish === "holo" ? "#f2eefc" : "#ffffff";
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={ctx.finish === "kraft" ? 3 : 6}
        fill={ctx.finish === "holo" ? "#0e0d10" : `url(#${ctx.labelGrad})`}
        stroke={ctx.finish === "holo" ? `url(#holo-${ctx.uid})` : ctx.outline}
        strokeWidth={ctx.finish === "holo" ? 1.4 : 1}
        opacity={ctx.finish === "kraft" ? 0.95 : 1}
      />
      <text
        x={x + w / 2}
        y={y + h * 0.42}
        textAnchor="middle"
        fontSize={compact ? 8.5 : 10}
        fontWeight={800}
        letterSpacing="0.02em"
        fill={textColor}
        fontFamily="var(--font-display, sans-serif)"
      >
        {ctx.wordmark}
      </text>
      <text
        x={x + w / 2}
        y={y + h * 0.74}
        textAnchor="middle"
        fontSize={compact ? 6.5 : 7.5}
        fontWeight={500}
        fill={textColor}
        opacity="0.85"
      >
        {ctx.flavor}
      </text>
    </g>
  );
}

export function ProductArt({ renderShape, brand, flavorOrEdition, className }: ProductArtProps) {
  const ctx = useCtx(brand, flavorOrEdition);

  return (
    <svg viewBox="0 0 200 260" className={className} role="img" aria-label={`${brand.name} ${flavorOrEdition}`}>
      <FinishDefs ctx={ctx} />
      <ellipse cx="100" cy="228" rx="66" ry="16" fill={`url(#${ctx.glowId})`} />
      <ellipse cx="100" cy="234" rx="42" ry="8" fill="#000" opacity="0.4" />

      {renderShape === "vape-stick" && <VapeStick ctx={ctx} />}
      {renderShape === "vape-cloud" && <VapeCloud ctx={ctx} />}
      {renderShape === "pod-system" && <VapePodSystem ctx={ctx} />}
      {renderShape === "reserve-device" && <VapeReserve ctx={ctx} />}
      {renderShape === "can" && <BottleSoda ctx={ctx} />}
      {renderShape === "bottle-round" && <BottleNectar ctx={ctx} />}
      {renderShape === "bottle-tall" && <BottleCordial ctx={ctx} />}
      {renderShape === "sachet" && <HerbalSachet ctx={ctx} />}
      {renderShape === "tin" && <HerbalTin ctx={ctx} />}
      {renderShape === "canister" && <HerbalCanister ctx={ctx} />}
      {renderShape === "shot-bottle" && <ConvEnergyShot ctx={ctx} />}
      {renderShape === "pouch" && <ConvSnack ctx={ctx} />}
      {renderShape === "lighter" && <ConvLighter ctx={ctx} />}
      {renderShape === "grinder" && <ClcGrinder ctx={ctx} />}
      {renderShape === "display-case" && <ClcDisplayCase ctx={ctx} />}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// VAPOR
// ---------------------------------------------------------------------------

function VapeStick({ ctx }: { ctx: Ctx }) {
  const clip = `clip-${ctx.uid}`;
  return (
    <g>
      {ctx.finish === "plastic" && (
        <rect x="48" y="60" width="104" height="150" rx="10" fill="none" stroke="#cfcfcf" strokeWidth="1.5" opacity="0.5" strokeDasharray="2 3" />
      )}
      <defs>
        <clipPath id={clip}>
          <rect x="82" y="50" width="36" height="150" rx="15" />
        </clipPath>
      </defs>
      <rect x="82" y="50" width="36" height="150" rx="15" fill={`url(#${ctx.bodyGrad})`} stroke={ctx.outline} strokeWidth={ctx.outlineW} />
      <FinishOverlay ctx={ctx} clipPath={`url(#${clip})`} />
      <rect x="88" y="34" width="24" height="22" rx="5" fill={ctx.darker} stroke={ctx.outline} strokeWidth={ctx.outlineW} />
      <rect x="94" y="24" width="12" height="14" rx="4" fill="#3a3a3a" />
      <circle cx="100" cy="188" r="4" fill={ctx.finish === "pastel-matte" ? "#fff" : ctx.c2} opacity="0.85" />
      <LabelPlate ctx={ctx} x={70} y={96} w={60} h={40} compact />
    </g>
  );
}

function VapeCloud({ ctx }: { ctx: Ctx }) {
  const clip = `clip-${ctx.uid}`;
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <rect x="66" y="56" width="68" height="150" rx="20" />
        </clipPath>
      </defs>
      <rect x="66" y="56" width="68" height="150" rx="20" fill={`url(#${ctx.bodyGrad})`} stroke={ctx.outline} strokeWidth={ctx.outlineW} />
      <FinishOverlay ctx={ctx} clipPath={`url(#${clip})`} />
      <rect x="84" y="34" width="32" height="26" rx="7" fill={ctx.darker} stroke={ctx.outline} strokeWidth={ctx.outlineW} />
      <rect x="92" y="22" width="16" height="16" rx="5" fill="#3a3a3a" />
      <circle cx="100" cy="194" r="5" fill={ctx.c2} opacity="0.9" />
      <circle cx="100" cy="194" r="8" fill="none" stroke={ctx.c2} strokeWidth="1" opacity="0.5" />
      <LabelPlate ctx={ctx} x={72} y={100} w={56} h={46} />
    </g>
  );
}

function VapePodSystem({ ctx }: { ctx: Ctx }) {
  const clip = `clip-${ctx.uid}`;
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <rect x="70" y="90" width="60" height="110" rx="12" />
        </clipPath>
      </defs>
      {/* battery base */}
      <rect x="70" y="90" width="60" height="110" rx="12" fill={`url(#${ctx.bodyGrad})`} stroke={ctx.outline} strokeWidth={ctx.outlineW} />
      <FinishOverlay ctx={ctx} clipPath={`url(#${clip})`} />
      <circle cx="100" cy="180" r="4" fill="#3a3a3a" />
      <rect x="85" y="150" width="30" height="4" rx="2" fill="#00000030" />
      {/* pod cartridge */}
      <rect x="82" y="46" width="36" height="52" rx="8" fill={ctx.finish === "dark-glass" ? "#e8e8e8" : "#f4f4f4"} stroke={ctx.outline} strokeWidth="1.5" opacity="0.94" />
      <rect x="90" y="34" width="20" height="16" rx="3" fill={ctx.darker} />
      <LabelPlate ctx={ctx} x={74} y={104} w={52} h={40} compact />
    </g>
  );
}

function VapeReserve({ ctx }: { ctx: Ctx }) {
  const clip = `clip-${ctx.uid}`;
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <rect x="78" y="44" width="44" height="160" rx="18" />
        </clipPath>
      </defs>
      <rect x="78" y="44" width="44" height="160" rx="18" fill={`url(#${ctx.metalGrad})`} stroke="#5a4520" strokeWidth="1.5" />
      <g clipPath={`url(#${clip})`}>
        <rect x="78" y="90" width="44" height="10" fill="#00000025" />
        <rect x="78" y="130" width="44" height="10" fill="#00000025" />
        <rect x="86" y="44" width="8" height="160" fill="#ffffff" opacity="0.35" />
      </g>
      <rect x="88" y="30" width="24" height="18" rx="5" fill="#2a2a2a" stroke="#5a4520" strokeWidth="1.2" />
      <ellipse cx="100" cy="196" rx="16" ry="6" fill={ctx.c1} opacity="0.9" />
      <text x="100" y="200" textAnchor="middle" fontSize="6" fontWeight={700} fill="#1a1408">
        {ctx.flavor.slice(0, 10)}
      </text>
      <LabelPlate ctx={ctx} x={80} y={102} w={40} h={24} compact />
    </g>
  );
}

// ---------------------------------------------------------------------------
// BOTTLES
// ---------------------------------------------------------------------------

function BottleSoda({ ctx }: { ctx: Ctx }) {
  const clip = `clip-${ctx.uid}`;
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <rect x="55" y="40" width="90" height="180" rx="14" />
        </clipPath>
      </defs>
      <rect x="55" y="40" width="90" height="180" rx="14" fill={`url(#${ctx.bodyGrad})`} stroke={ctx.outline} strokeWidth={ctx.outlineW} />
      <FinishOverlay ctx={ctx} clipPath={`url(#${clip})`} />
      <ellipse cx="100" cy="42" rx="45" ry="9" fill={shade(ctx.c2, -10)} stroke={ctx.outline} strokeWidth="1.2" />
      <ellipse cx="100" cy="219" rx="45" ry="8" fill={ctx.darker} opacity="0.9" />
      <LabelPlate ctx={ctx} x={58} y={118} w={84} h={44} />
    </g>
  );
}

function BottleNectar({ ctx }: { ctx: Ctx }) {
  const clip = `clip-${ctx.uid}`;
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <path d="M78 32 h44 v26 c0 10 18 16 18 40 v90 a16 16 0 0 1 -16 16 h-48 a16 16 0 0 1 -16 -16 v-90 c0 -24 18 -30 18 -40 z" />
        </clipPath>
      </defs>
      <path
        d="M78 32 h44 v26 c0 10 18 16 18 40 v90 a16 16 0 0 1 -16 16 h-48 a16 16 0 0 1 -16 -16 v-90 c0 -24 18 -30 18 -40 z"
        fill={`url(#${ctx.bodyGrad})`}
        stroke={ctx.outline}
        strokeWidth={ctx.outlineW}
      />
      <FinishOverlay ctx={ctx} clipPath={`url(#${clip})`} />
      <rect x="82" y="20" width="36" height="18" rx="4" fill={shade(ctx.c2, -12)} stroke={ctx.outline} strokeWidth="1.2" />
      <LabelPlate ctx={ctx} x={64} y={128} w={72} h={46} />
    </g>
  );
}

function BottleCordial({ ctx }: { ctx: Ctx }) {
  const clip = `clip-${ctx.uid}`;
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <path d="M90 24 h20 v34 l16 20 v106 a10 10 0 0 1 -10 10 h-32 a10 10 0 0 1 -10 -10 v-106 l16 -20 z" />
        </clipPath>
      </defs>
      <path
        d="M90 24 h20 v34 l16 20 v106 a10 10 0 0 1 -10 10 h-32 a10 10 0 0 1 -10 -10 v-106 l16 -20 z"
        fill={`url(#${ctx.bodyGrad})`}
        stroke={ctx.outline}
        strokeWidth={ctx.outlineW}
      />
      <FinishOverlay ctx={ctx} clipPath={`url(#${clip})`} />
      {/* cork */}
      <rect x="92" y="10" width="16" height="16" rx="2" fill="#c9a877" stroke="#8a6d40" strokeWidth="1" />
      {/* wax seal */}
      <circle cx="100" cy="82" r="13" fill="#8a1f2b" stroke="#5c1119" strokeWidth="1" />
      <text x="100" y="86" textAnchor="middle" fontSize="12" fontWeight={800} fill="#e8c98a">
        {ctx.wordmark.charAt(0)}
      </text>
      <LabelPlate ctx={ctx} x={76} y={140} w={48} h={50} compact />
      <text x="100" y="200" textAnchor="middle" fontSize="6.5" fontWeight={600} fill={shade(ctx.c2, 40)} opacity="0.85">
        {ctx.flavor.slice(0, 14)}
      </text>
    </g>
  );
}

// ---------------------------------------------------------------------------
// HERBAL
// ---------------------------------------------------------------------------

function HerbalSachet({ ctx }: { ctx: Ctx }) {
  const clip = `clip-${ctx.uid}`;
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <path d="M58 82 q-6 -28 42 -28 q48 0 42 28 q14 8 14 42 q0 58 -56 62 q-56 -4 -56 -62 q0 -34 14 -42 z" />
        </clipPath>
      </defs>
      <path
        d="M58 82 q-6 -28 42 -28 q48 0 42 28 q14 8 14 42 q0 58 -56 62 q-56 -4 -56 -62 q0 -34 14 -42 z"
        fill={`url(#${ctx.bodyGrad})`}
        stroke={ctx.outline}
        strokeWidth={ctx.outlineW}
      />
      <FinishOverlay ctx={ctx} clipPath={`url(#${clip})`} />
      <rect x="64" y="50" width="72" height="12" rx="6" fill={ctx.darker} opacity="0.7" />
      <circle cx="100" cy="56" r="3" fill={shade(ctx.c2, 30)} />
      <circle cx="100" cy="140" r="24" fill="#f4efe0" stroke={ctx.outline} strokeWidth="1.4" />
      <path d="M92 146 q8 -14 16 0 M96 138 v14" stroke="#5c6b48" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <text x="100" y="176" textAnchor="middle" fontSize="7" fontWeight={700} fill="#f4efe0">
        {ctx.wordmark}
      </text>
    </g>
  );
}

function HerbalTin({ ctx }: { ctx: Ctx }) {
  const clip = `clip-${ctx.uid}`;
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <rect x="48" y="78" width="104" height="112" rx="10" />
        </clipPath>
      </defs>
      <rect x="48" y="78" width="104" height="112" rx="10" fill={`url(#${ctx.bodyGrad})`} stroke={ctx.outline} strokeWidth={ctx.outlineW} />
      <FinishOverlay ctx={ctx} clipPath={`url(#${clip})`} />
      <rect x="48" y="78" width="104" height="14" rx="6" fill={ctx.darker} opacity="0.55" />
      <rect x="94" y="78" width="12" height="112" fill="#00000018" />
      <LabelPlate ctx={ctx} x={58} y={118} w={84} h={46} />
      <circle cx="138" cy="184" r="7" fill="none" stroke={shade(ctx.c2, 30)} strokeWidth="1.2" opacity="0.8" />
    </g>
  );
}

function HerbalCanister({ ctx }: { ctx: Ctx }) {
  const clip = `clip-${ctx.uid}`;
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <rect x="60" y="58" width="80" height="146" rx="14" />
        </clipPath>
      </defs>
      <rect x="60" y="58" width="80" height="146" rx="14" fill={`url(#${ctx.bodyGrad})`} stroke={ctx.outline} strokeWidth={ctx.outlineW} />
      <FinishOverlay ctx={ctx} clipPath={`url(#${clip})`} />
      <ellipse cx="100" cy="58" rx="40" ry="10" fill={ctx.darker} stroke={ctx.outline} strokeWidth="1.2" />
      <circle cx="100" cy="58" r="15" fill="#8a1f2b" opacity="0.9" />
      <text x="100" y="62" textAnchor="middle" fontSize="10" fontWeight={800} fill="#e8c98a">
        {ctx.wordmark.charAt(0)}
      </text>
      <LabelPlate ctx={ctx} x={68} y={122} w={64} h={48} />
    </g>
  );
}

// ---------------------------------------------------------------------------
// CONVENIENCE
// ---------------------------------------------------------------------------

function ConvEnergyShot({ ctx }: { ctx: Ctx }) {
  const clip = `clip-${ctx.uid}`;
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <path d="M82 60 h36 v18 c0 6 10 10 10 26 v78 a10 10 0 0 1 -10 10 h-36 a10 10 0 0 1 -10 -10 v-78 c0 -16 10 -20 10 -26 z" />
        </clipPath>
      </defs>
      <path
        d="M82 60 h36 v18 c0 6 10 10 10 26 v78 a10 10 0 0 1 -10 10 h-36 a10 10 0 0 1 -10 -10 v-78 c0 -16 10 -20 10 -26 z"
        fill={`url(#${ctx.bodyGrad})`}
        stroke={ctx.outline}
        strokeWidth={ctx.outlineW}
      />
      <FinishOverlay ctx={ctx} clipPath={`url(#${clip})`} />
      <rect x="86" y="48" width="28" height="16" rx="3" fill={ctx.darker} stroke={ctx.outline} strokeWidth="1.2" />
      <LabelPlate ctx={ctx} x={70} y={122} w={60} h={44} compact />
    </g>
  );
}

function ConvSnack({ ctx }: { ctx: Ctx }) {
  const clip = `clip-${ctx.uid}`;
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <path d="M56 56 q44 -14 88 0 q10 66 -4 108 q-40 20 -80 0 q-14 -42 -4 -108 z" />
        </clipPath>
      </defs>
      <path
        d="M56 56 q44 -14 88 0 q10 66 -4 108 q-40 20 -80 0 q-14 -42 -4 -108 z"
        fill={`url(#${ctx.bodyGrad})`}
        stroke={ctx.outline}
        strokeWidth={ctx.outlineW}
      />
      <FinishOverlay ctx={ctx} clipPath={`url(#${clip})`} />
      <rect x="52" y="48" width="96" height="14" rx="6" fill={ctx.darker} />
      <rect x="52" y="164" width="96" height="12" rx="6" fill={ctx.darker} opacity="0.85" />
      <circle cx="100" cy="108" r="30" fill="#ffffff" opacity="0.92" />
      <text x="100" y="104" textAnchor="middle" fontSize="9" fontWeight={800} fill={ctx.dark}>
        {ctx.wordmark}
      </text>
      <text x="100" y="118" textAnchor="middle" fontSize="7" fontWeight={600} fill={ctx.dark} opacity="0.8">
        {ctx.flavor.slice(0, 12)}
      </text>
    </g>
  );
}

function ConvLighter({ ctx }: { ctx: Ctx }) {
  const clip = `clip-${ctx.uid}`;
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <rect x="76" y="78" width="48" height="120" rx="8" />
        </clipPath>
      </defs>
      <rect x="76" y="78" width="48" height="120" rx="8" fill={`url(#${ctx.bodyGrad})`} stroke={ctx.outline} strokeWidth={ctx.outlineW} />
      <FinishOverlay ctx={ctx} clipPath={`url(#${clip})`} />
      <rect x="82" y="58" width="36" height="22" rx="4" fill="#c7c7c7" stroke="#7a7a7a" strokeWidth="1.2" />
      <circle cx="112" cy="68" r="5" fill="#9c9c9c" stroke="#5f5f5f" strokeWidth="1" />
      <path d="M96 50 q4 -10 8 0 q2 6 -4 8 q-6 -2 -4 -8 z" fill="#ffb63d" opacity="0.9" />
      <LabelPlate ctx={ctx} x={80} y={122} w={40} h={40} compact />
    </g>
  );
}

// ---------------------------------------------------------------------------
// COLLECTIBLES
// ---------------------------------------------------------------------------

function ClcGrinder({ ctx }: { ctx: Ctx }) {
  const clip = `clip-${ctx.uid}`;
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <rect x="56" y="70" width="88" height="100" rx="18" />
        </clipPath>
      </defs>
      <ellipse cx="100" cy="70" rx="44" ry="14" fill={`url(#${ctx.bodyGrad})`} stroke={ctx.outline} strokeWidth={ctx.outlineW} />
      <rect x="56" y="70" width="88" height="100" rx="18" fill={`url(#${ctx.bodyGrad})`} stroke={ctx.outline} strokeWidth={ctx.outlineW} />
      <g clipPath={`url(#${clip})`}>
        {ctx.finish === "holo" && <rect x="0" y="90" width="200" height="30" fill={`url(#holo-${ctx.uid})`} opacity="0.55" transform="rotate(-6 100 100)" />}
        {Array.from({ length: 8 }).map((_, i) => (
          <circle key={i} cx={70 + i * 8.5} cy="90" r="2.4" fill="#00000030" />
        ))}
      </g>
      <ellipse cx="100" cy="170" rx="44" ry="12" fill={ctx.darker} />
      <ellipse cx="100" cy="70" rx="44" ry="14" fill="none" stroke={ctx.outline} strokeWidth="1.4" />
      <circle cx="100" cy="70" r="20" fill="none" stroke={shade(ctx.c2, 30)} strokeWidth="1" opacity="0.6" />
      <text x="100" y="132" textAnchor="middle" fontSize="8" fontWeight={800} fill="#f2eefc" opacity="0.9">
        {ctx.wordmark}
      </text>
      <text x="100" y="146" textAnchor="middle" fontSize="6.5" fontWeight={500} fill="#f2eefc" opacity="0.7">
        {ctx.flavor.slice(0, 16)}
      </text>
    </g>
  );
}

function ClcDisplayCase({ ctx }: { ctx: Ctx }) {
  const clip = `clip-${ctx.uid}`;
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <rect x="46" y="66" width="108" height="130" rx="10" />
        </clipPath>
      </defs>
      <rect x="46" y="66" width="108" height="130" rx="10" fill={ctx.finish === "holo" ? "#0e0d10" : `url(#${ctx.bodyGrad})`} stroke={ctx.outline} strokeWidth={ctx.outlineW + 0.5} />
      <g clipPath={`url(#${clip})`}>
        {ctx.finish === "holo" && (
          <rect x="0" y="90" width="220" height="46" fill={`url(#holo-${ctx.uid})`} opacity="0.5" transform="rotate(-7 100 120)" />
        )}
        <rect x="52" y="72" width="96" height="102" rx="6" fill="#0b0a0d" opacity="0.55" />
      </g>
      {/* glass-front window with the piece glowing inside */}
      <rect x="58" y="80" width="84" height="90" rx="6" fill="#100e12" stroke={shade(ctx.c2, 15)} strokeWidth="1.4" />
      <ellipse cx="100" cy="126" rx="30" ry="30" fill={ctx.c1} opacity="0.35" />
      <path
        d="M100 100 l16 12 -6 20 h-20 l-6 -20 z"
        fill={`url(#${ctx.metalGrad})`}
        stroke="#5a4520"
        strokeWidth="1.2"
      />
      <rect x="58" y="80" width="84" height="26" fill="#ffffff" opacity="0.06" />
      <rect x="46" y="66" width="108" height="10" fill="#00000030" />
      <LabelPlate ctx={ctx} x={62} y={178} w={76} h={16} compact />
    </g>
  );
}
