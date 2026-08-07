# Slotcase

A fictional crate-opening marketplace, inspired by CS-style case openings and
mystery-box sites. Everything — the credits, the brands, the products — is
made up for fun. There's no real money, no real shipping, no accounts.

## What's here

- **6 themed crates** (Strawberry, Tropical, Gas Station, Frozen, Import,
  Luxury), each with its own 10-item loot pool, palette, and artwork.
- **A CS-style horizontal roulette.** The winning item is chosen first with
  weighted odds; the strip animation only reveals it.
- **A real economy.** 100 credits = $1 reference value. Every item has a
  permanent Market Value and an 80%-of-market Buyback Value. Every crate's
  odds sum to exactly 100% and its expected return sits at ~87% of the crate
  price (see `lib/data/crates.ts`).
- **Inventory.** Keep pulls or sell them back for credits; everything
  persists to `localStorage`.
- **All artwork is generated SVG** (product renders + crate box art) — no
  external images, no real brands.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion +
Zustand (persisted to `localStorage`).
