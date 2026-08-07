import { Crate, Item } from "../types";

// ---------------------------------------------------------------------------
// Every crate's odds sum to exactly 100% and its RTP (sum of value*odds /
// price) lands at 86.5-87.4%. Spice Level is not cosmetic — it's read
// directly off the value distribution: Corner Store's cheapest item is 42%
// of its price and its headliner is 7.5x price (spice 2); After Hours
// Reserve's cheapest item is under 6% of its price while its headliner is
// 68x price (spice 5). See /scratchpad econ.py for the derivation.
// ---------------------------------------------------------------------------

function buildItems(raw: Omit<Item, "id" | "buybackValue">[]): Item[] {
  return raw.map((r, i) => ({
    ...r,
    id: `${r.chaseTier}-${i}-${r.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    buybackValue: Math.round(r.marketValue * 0.8),
  }));
}

// ---------------------------------------------------------------------------
// CORNER STORE — low price, low Spice Level (2). Wide selection of budget
// and mainstream products; the appeal is variety and frequent recognizable
// pulls, not a huge jackpot.
// ---------------------------------------------------------------------------
const cornerStoreItems = buildItems([
  {
    name: "Nite Owl “Boost” Energy Shot",
    brandId: "nite-owl",
    category: "convenience",
    subtype: "energy-shot",
    chaseTier: "ground_loot",
    marketValue: 250,
    odds: 20,
    flavorOrEdition: "Original",
    blurb: "Two ounces, one register-counter impulse buy.",
  },
  {
    name: "Fizzworks Classic Cola Soda",
    brandId: "fizzworks",
    category: "bottles",
    subtype: "soda",
    chaseTier: "ground_loot",
    marketValue: 350,
    odds: 18,
    flavorOrEdition: "Classic Cola",
    blurb: "The can everyone's cooler is stocked with.",
  },
  {
    name: "Nite Owl Cheddar Blast Chips",
    brandId: "nite-owl",
    category: "convenience",
    subtype: "snack",
    chaseTier: "ground_loot",
    marketValue: 425,
    odds: 16,
    flavorOrEdition: "Cheddar Blast",
    blurb: "Bright bag, brighter cheese dust.",
  },
  {
    name: "Nite Owl Stix",
    brandId: "nite-owl",
    category: "vapor",
    subtype: "stick",
    chaseTier: "ground_loot",
    marketValue: 525,
    odds: 14,
    flavorOrEdition: "Mint",
    blurb: "Entry-level disposable, plastic clamshell.",
  },
  {
    name: "Fizzworks Tropical Nectar",
    brandId: "fizzworks",
    category: "bottles",
    subtype: "nectar",
    chaseTier: "break_even",
    marketValue: 625,
    odds: 12,
    flavorOrEdition: "Tropical",
    blurb: "Bottled, pulpy, glossy label.",
  },
  {
    name: "Botanica Chamomile Dream Tea Sachet",
    brandId: "botanica-supply",
    category: "herbal",
    subtype: "tea-sachet",
    chaseTier: "break_even",
    marketValue: 725,
    odds: 10,
    flavorOrEdition: "Chamomile Dream",
    blurb: "Kraft pouch, hand-stamped seal.",
  },
  {
    name: "Halo Vapor Stick",
    brandId: "halo-vapor",
    category: "vapor",
    subtype: "stick",
    chaseTier: "solid_hit",
    marketValue: 950,
    odds: 6,
    flavorOrEdition: "Blue Razz",
    blurb: "Halo's entry line — same ring logo, smaller box.",
  },
  {
    name: "Nite Owl Chrome Flame Lighter",
    brandId: "nite-owl",
    category: "convenience",
    subtype: "lighter",
    chaseTier: "solid_hit",
    marketValue: 1200,
    odds: 2.5,
    flavorOrEdition: "Chrome Flame",
    blurb: "The counter-display lighter people actually keep.",
  },
  {
    name: "Halo Vapor Cloud",
    brandId: "halo-vapor",
    category: "vapor",
    subtype: "cloud",
    chaseTier: "major_chase",
    marketValue: 1800,
    odds: 1.2,
    flavorOrEdition: "Watermelon Ice",
    blurb: "Bigger device, bigger box, the one people ask for by name.",
  },
  {
    name: "Void Society “Blacklight” Grinder",
    brandId: "void-society",
    category: "collectibles",
    subtype: "grinder",
    chaseTier: "headliner",
    marketValue: 4500,
    odds: 0.3,
    flavorOrEdition: "Blacklight, Lettered Edition",
    blurb: "Holographic matte black. Nobody expects this out of a $6 box.",
  },
]);

// ---------------------------------------------------------------------------
// STRAWBERRY STASH — one flavor, every price point. Value comes from brand
// and product line, never from the flavor itself.
// ---------------------------------------------------------------------------
const strawberryStashItems = buildItems([
  {
    name: "Nite Owl Strawberry Freeze Bar",
    brandId: "nite-owl",
    category: "convenience",
    subtype: "snack",
    chaseTier: "ground_loot",
    marketValue: 150,
    odds: 23,
    flavorOrEdition: "Strawberry",
    blurb: "Melts before you finish the wrapper.",
  },
  {
    name: "Fizzworks Strawberry Soda",
    brandId: "fizzworks",
    category: "bottles",
    subtype: "soda",
    chaseTier: "ground_loot",
    marketValue: 275,
    odds: 18,
    flavorOrEdition: "Strawberry",
    blurb: "Same bubble can, pink label run.",
  },
  {
    name: "Fizzworks Strawberry Nectar",
    brandId: "fizzworks",
    category: "bottles",
    subtype: "nectar",
    chaseTier: "ground_loot",
    marketValue: 400,
    odds: 15,
    flavorOrEdition: "Strawberry",
    blurb: "Pulpy bottle, glossy strawberry-splash label.",
  },
  {
    name: "Botanica Strawberry-Hibiscus Tea Sachet",
    brandId: "botanica-supply",
    category: "herbal",
    subtype: "tea-sachet",
    chaseTier: "break_even",
    marketValue: 725,
    odds: 15,
    flavorOrEdition: "Strawberry-Hibiscus",
    blurb: "Small kraft pouch, illustrated berry linework.",
  },
  {
    name: "Halo Vapor Stick",
    brandId: "halo-vapor",
    category: "vapor",
    subtype: "stick",
    chaseTier: "break_even",
    marketValue: 925,
    odds: 11,
    flavorOrEdition: "Strawberry Cream",
    blurb: "Pastel box, one of Halo's steadiest sellers.",
  },
  {
    name: "Halo Vapor Cloud",
    brandId: "halo-vapor",
    category: "vapor",
    subtype: "cloud",
    chaseTier: "solid_hit",
    marketValue: 1350,
    odds: 9,
    flavorOrEdition: "Strawberry Kiwi",
    blurb: "The flavor people specifically hunt this crate for.",
  },
  {
    name: "Botanica Strawberry Fields Reserve Blend Tin",
    brandId: "botanica-supply",
    category: "herbal",
    subtype: "blend-tin",
    chaseTier: "solid_hit",
    marketValue: 1850,
    odds: 5.5,
    flavorOrEdition: "Strawberry Fields Reserve",
    blurb: "Hinged tin, wax-stamped, small production run.",
  },
  {
    name: "Marchetti & Vane Fragola Cordial",
    brandId: "marchetti-vane",
    category: "bottles",
    subtype: "cordial",
    chaseTier: "major_chase",
    marketValue: 4100,
    odds: 3,
    flavorOrEdition: "Fragola",
    blurb: "Imported, dark glass, gold foil neck label.",
  },
  {
    name: "Marchetti & Vane “Fragola d’Oro” Vintage Reserve",
    brandId: "marchetti-vane",
    category: "bottles",
    subtype: "cordial",
    chaseTier: "headliner",
    marketValue: 15600,
    odds: 0.5,
    flavorOrEdition: "Vintage Reserve, Numbered",
    blurb: "The headliner. Wax-sealed, hand-numbered, gold leaf on dark glass.",
  },
]);

// ---------------------------------------------------------------------------
// AFTER HOURS RESERVE — the expensive crate. Ground loot can sit well under
// the box price; the rare pulls are dramatically larger. Highest Spice
// Level in the lineup.
// ---------------------------------------------------------------------------
const afterHoursItems = buildItems([
  {
    name: "Nite Owl “Boost” Energy Shot",
    brandId: "nite-owl",
    category: "convenience",
    subtype: "energy-shot",
    chaseTier: "ground_loot",
    marketValue: 175,
    odds: 25,
    flavorOrEdition: "Original",
    blurb: "Even the reserve case has one gag pull.",
  },
  {
    name: "Fizzworks Classic Cola Soda",
    brandId: "fizzworks",
    category: "bottles",
    subtype: "soda",
    chaseTier: "ground_loot",
    marketValue: 375,
    odds: 20,
    flavorOrEdition: "Classic Cola",
    blurb: "A $3.75 can inside a $30 box — that's the spice.",
  },
  {
    name: "Botanica Tea Sachet Pouch",
    brandId: "botanica-supply",
    category: "herbal",
    subtype: "tea-sachet",
    chaseTier: "ground_loot",
    marketValue: 675,
    odds: 16,
    flavorOrEdition: "Midnight Chamomile",
    blurb: "Botanica's basic line, kraft pouch.",
  },
  {
    name: "Halo Vapor Pod System",
    brandId: "halo-vapor",
    category: "vapor",
    subtype: "pod-system",
    chaseTier: "break_even",
    marketValue: 2050,
    odds: 14,
    flavorOrEdition: "Obsidian",
    blurb: "Rechargeable, brushed-metal shell, magnetic pods.",
  },
  {
    name: "Botanica “After Hours” Reserve Canister",
    brandId: "botanica-supply",
    category: "herbal",
    subtype: "reserve-canister",
    chaseTier: "solid_hit",
    marketValue: 4100,
    odds: 12,
    flavorOrEdition: "After Hours Reserve",
    blurb: "Aged blend, sealed tin canister, wax stamp.",
  },
  {
    name: "Halo Vapor Reserve",
    brandId: "halo-vapor",
    category: "vapor",
    subtype: "reserve-device",
    chaseTier: "solid_hit",
    marketValue: 6000,
    odds: 8,
    flavorOrEdition: "Gunmetal Edition",
    blurb: "Halo's top shelf device, limited colorway.",
  },
  {
    name: "Marchetti & Vane Reserve Cask Cordial",
    brandId: "marchetti-vane",
    category: "bottles",
    subtype: "cordial",
    chaseTier: "major_chase",
    marketValue: 13000,
    odds: 4,
    flavorOrEdition: "Reserve Cask",
    blurb: "Cask-aged, embossed crest, hand-poured wax seal.",
  },
  {
    name: "Void Society × Marchetti & Vane “Eclipse” Collab Flask",
    brandId: "void-society",
    category: "collectibles",
    subtype: "display-case",
    chaseTier: "major_chase",
    marketValue: 24000,
    odds: 0.8,
    flavorOrEdition: "Eclipse Collab, Lettered",
    blurb: "Two brands, one case, holographic-foiled crest.",
  },
  {
    name: "Void Society “The Eclipse” One-of-One Display Case",
    brandId: "void-society",
    category: "collectibles",
    subtype: "display-case",
    chaseTier: "headliner",
    marketValue: 205000,
    odds: 0.2,
    flavorOrEdition: "One-of-One",
    blurb: "The grail. One numbered case, dramatically bigger than anything else in the room.",
  },
]);

export const CRATES: Crate[] = [
  {
    slug: "corner-store",
    name: "Corner Store",
    shortDescription:
      "Late-night shelf, low buy-in, always something worth grabbing.",
    reasonForExisting:
      "The lowest-priced crate. Wide budget-and-mainstream selection built for frequent, recognizable pulls rather than a huge jackpot.",
    price: 600,
    spiceLevel: 2,
    palette: {
      primary: "#ff6b1a",
      secondary: "#1a8fff",
      accent: "#ffd23f",
      ink: "#1a1410",
    },
    items: cornerStoreItems,
  },
  {
    slug: "strawberry-stash",
    name: "Strawberry Stash",
    shortDescription:
      "One flavor, every price point — from freezer aisle to vintage reserve.",
    reasonForExisting:
      "A focused single-flavor crate spanning every brand and category, proving value comes from the product line, not the flavor.",
    price: 900,
    spiceLevel: 3,
    palette: {
      primary: "#ff2d6a",
      secondary: "#ff8fab",
      accent: "#ffd6e0",
      ink: "#22090f",
    },
    items: strawberryStashItems,
  },
  {
    slug: "after-hours-reserve",
    name: "After Hours Reserve",
    shortDescription:
      "The back case. Numbered editions, dark glass, one real grail.",
    reasonForExisting:
      "The premium crate. Import and collectible-grade products with the widest gap between ground loot and headliner in the lineup.",
    price: 3000,
    spiceLevel: 5,
    palette: {
      primary: "#c9a24b",
      secondary: "#0d1f17",
      accent: "#e6c878",
      ink: "#07100c",
    },
    items: afterHoursItems,
  },
];

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
