import { BoxEntry, buybackValue, Crate, Item } from "../types";
import { getProduct } from "./products";

// ---------------------------------------------------------------------------
// Boxes are curated, randomized acquisition pools built from the canonical
// product catalog (lib/data/products.ts). A box entry only stores a
// productId, its odds inside this box, and its role in this box's chase
// hierarchy — never a copy of the product's name, value, or category. The
// same product can appear in multiple boxes at different odds and different
// roles: Void Society's grinder is Corner Store's Headliner (0.3%) and just
// a Solid Hit in After Hours Reserve (12%) — same product, same market
// value, completely different position depending on the box.
//
// Every box's odds sum to exactly 100% and its RTP (sum of value*odds /
// price) lands in the 85-90% band. Spice Level is read off the resulting
// value spread, not assigned by hand: see /scratchpad econ.py and
// verify-catalog script for the derivation.
// ---------------------------------------------------------------------------

function resolveItems(entries: BoxEntry[]): Item[] {
  return entries.map((entry) => {
    const product = getProduct(entry.productId);
    return {
      id: product.id,
      name: product.name,
      brandId: product.brandId,
      category: product.category,
      subtype: product.subtype,
      renderShape: product.renderShape,
      marketTier: product.marketTier,
      chaseTier: entry.role,
      marketValue: product.marketValue,
      buybackValue: buybackValue(product),
      odds: entry.odds,
      flavorOrEdition: product.variant,
      blurb: product.blurb,
    };
  });
}

interface CrateSeed {
  slug: string;
  name: string;
  shortDescription: string;
  reasonForExisting: string;
  price: number;
  spiceLevel: 1 | 2 | 3 | 4 | 5;
  palette: Crate["palette"];
  entries: BoxEntry[];
}

const SEEDS: CrateSeed[] = [
  {
    slug: "corner-store",
    name: "Corner Store",
    shortDescription:
      "Late-night shelf, low buy-in, always something worth grabbing.",
    reasonForExisting:
      "The lowest-priced box. Wide budget-and-mainstream selection across five categories, built for frequent, recognizable pulls rather than a huge jackpot.",
    price: 600,
    spiceLevel: 2,
    palette: {
      primary: "#ff6b1a",
      secondary: "#1a8fff",
      accent: "#ffd23f",
      ink: "#1a1410",
    },
    entries: [
      { productId: "nite-owl-stix-disposable", odds: 20, role: "ground_loot" },
      { productId: "fizzworks-seltzer-4pack", odds: 18, role: "ground_loot" },
      { productId: "botanica-wellness-tincture", odds: 16, role: "ground_loot" },
      { productId: "nite-owl-chrome-mini-lighter", odds: 14, role: "ground_loot" },
      { productId: "mycora-daily-capsules", odds: 12, role: "break_even" },
      { productId: "fizzworks-premium-cocktail", odds: 10, role: "break_even" },
      { productId: "halo-stick-blue-razz", odds: 6, role: "solid_hit" },
      { productId: "backroad-rolling-tray", odds: 2.5, role: "solid_hit" },
      { productId: "halo-cloud-watermelon", odds: 1.2, role: "major_chase" },
      { productId: "void-society-grinder", odds: 0.3, role: "headliner" },
    ],
  },
  {
    slug: "strawberry-stash",
    name: "Strawberry Stash",
    shortDescription:
      "One flavor, every price point — from freezer aisle to vintage reserve.",
    reasonForExisting:
      "A focused single-flavor box spanning vapor, alcohol, herbal and functional-mushroom products, proving value comes from the brand and product line, not the flavor.",
    price: 900,
    spiceLevel: 3,
    palette: {
      primary: "#ff2d6a",
      secondary: "#ff8fab",
      accent: "#ffd6e0",
      ink: "#22090f",
    },
    entries: [
      { productId: "nite-owl-stix-strawberry", odds: 23, role: "ground_loot" },
      { productId: "fizzworks-strawberry-cocktail", odds: 18, role: "ground_loot" },
      { productId: "botanica-strawberry-hibiscus-tincture", odds: 15, role: "ground_loot" },
      { productId: "mycora-strawberry-gummies", odds: 15, role: "break_even" },
      { productId: "halo-stick-strawberry-cream", odds: 11, role: "break_even" },
      { productId: "halo-cloud-strawberry-kiwi", odds: 9, role: "solid_hit" },
      { productId: "botanica-strawberry-blend-tin", odds: 5.5, role: "solid_hit" },
      { productId: "marchetti-vane-fragola-cordial", odds: 3, role: "major_chase" },
      { productId: "marchetti-vane-fragola-doro", odds: 0.5, role: "headliner" },
    ],
  },
  {
    slug: "after-hours-reserve",
    name: "After Hours Reserve",
    shortDescription:
      "The back case. Numbered editions, dark glass, one real grail.",
    reasonForExisting:
      "The premium box. Import-grade alcohol, top-shelf devices, and collectible-grade cases, with the widest gap between ground loot and headliner in the lineup.",
    price: 3000,
    spiceLevel: 5,
    palette: {
      primary: "#c9a24b",
      secondary: "#0d1f17",
      accent: "#e6c878",
      ink: "#07100c",
    },
    entries: [
      { productId: "nite-owl-stix-mini", odds: 25, role: "ground_loot" },
      { productId: "fizzworks-whiskey-cola", odds: 20, role: "ground_loot" },
      { productId: "botanica-recovery-topical", odds: 16, role: "ground_loot" },
      { productId: "halo-pod-system-obsidian", odds: 14, role: "break_even" },
      { productId: "void-society-grinder", odds: 12, role: "solid_hit" },
      { productId: "halo-reserve-gunmetal", odds: 8, role: "solid_hit" },
      { productId: "marchetti-vane-reserve-cask-whiskey", odds: 4, role: "major_chase" },
      { productId: "void-marchetti-eclipse-collab", odds: 0.8, role: "major_chase" },
      { productId: "void-society-eclipse-one-of-one", odds: 0.2, role: "headliner" },
    ],
  },
];

export const CRATES: Crate[] = SEEDS.map((seed) => ({
  ...seed,
  items: resolveItems(seed.entries),
}));

export function getCrateBySlug(slug: string): Crate | undefined {
  return CRATES.find((c) => c.slug === slug);
}

export function crateRTP(crate: Crate): number {
  const ev = crate.items.reduce(
    (sum, item) => sum + item.marketValue * (item.odds / 100),
    0
  );
  return ev / crate.price;
}

const CHASE_TIER_ORDER: Record<Item["chaseTier"], number> = {
  headliner: 0,
  major_chase: 1,
  solid_hit: 2,
  break_even: 3,
  ground_loot: 4,
};

export function sortedByValueDesc(crate: Crate): Item[] {
  return [...crate.items].sort((a, b) => b.marketValue - a.marketValue);
}

export function sortedByChaseTier(crate: Crate): Item[] {
  return [...crate.items].sort(
    (a, b) =>
      CHASE_TIER_ORDER[a.chaseTier] - CHASE_TIER_ORDER[b.chaseTier] ||
      b.marketValue - a.marketValue
  );
}

export function headliner(crate: Crate): Item {
  return crate.items.find((i) => i.chaseTier === "headliner") ?? crate.items[0];
}

export function majorChases(crate: Crate): Item[] {
  return crate.items.filter((i) => i.chaseTier === "major_chase");
}

/** Every box (slug + odds + role) that contains this product, for the
 * product detail page's "boxes containing this item" section. */
export function boxesContainingProduct(
  productId: string
): { crate: Crate; odds: number; role: Item["chaseTier"] }[] {
  return CRATES.flatMap((crate) => {
    const entry = crate.entries.find((e) => e.productId === productId);
    return entry ? [{ crate, odds: entry.odds, role: entry.role }] : [];
  });
}
