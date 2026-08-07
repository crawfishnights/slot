import { Brand, BrandTier, Crate, Item, ProductCategory, TierKey } from "../types";

// ---------------------------------------------------------------------------
// Shared economy shape: every crate uses this exact odds curve (sums to
// 100.0%) and multiplier curve, so RTP for every crate lands at ~87-88%,
// inside the 85-90% target band. See /scratchpad rtp_final.py for the
// derivation. Buyback is always exactly 80% of Market Value.
// ---------------------------------------------------------------------------
const ODDS: Record<TierKey, number> = {
  ground_a: 24.0,
  ground_b: 19.0,
  ground_c: 15.0,
  ground_d: 12.0,
  near_breakeven: 10.5,
  modest_profit: 8.5,
  profitable: 6.5,
  small_chase: 3.2,
  big_chase: 0.9,
  massive_chase: 0.4,
};

function brand(name: string, tier: BrandTier): Brand {
  return { name, tier };
}

interface RawItem {
  tier: TierKey;
  name: string;
  brand: Brand;
  category: ProductCategory;
  marketValue: number;
  colors: [string, string];
  tagline: string;
}

function buildItems(raw: RawItem[]): Item[] {
  return raw.map((r, i) => ({
    id: `${r.tier}-${i}-${r.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name: r.name,
    brand: r.brand,
    category: r.category,
    tier: r.tier,
    marketValue: r.marketValue,
    buybackValue: Math.round(r.marketValue * 0.8),
    odds: ODDS[r.tier],
    colors: r.colors,
    tagline: r.tagline,
  }));
}

// ---------------------------------------------------------------------------
// STRAWBERRY CRATE
// ---------------------------------------------------------------------------
const strawberryItems = buildItems([
  {
    tier: "ground_a",
    name: "Freeze Pop",
    brand: brand("Berrywell", "budget"),
    category: "pouch",
    marketValue: 125,
    colors: ["#ff4d6d", "#ffccd5"],
    tagline: "Corner-store classic, always in the freezer.",
  },
  {
    tier: "ground_b",
    name: "Toaster Tarts",
    brand: brand("SnackTime", "budget"),
    category: "box",
    marketValue: 225,
    colors: ["#ff5c77", "#ffe5ea"],
    tagline: "Two per pouch, gone in ninety seconds.",
  },
  {
    tier: "ground_c",
    name: "Fizzberry Soda",
    brand: brand("Fizzberry", "mainstream"),
    category: "can",
    marketValue: 300,
    colors: ["#ff2d55", "#ff96ad"],
    tagline: "The pink can everyone recognizes.",
  },
  {
    tier: "ground_d",
    name: "PinkBolt Energy",
    brand: brand("PinkBolt", "mainstream"),
    category: "can",
    marketValue: 400,
    colors: ["#ff1654", "#ff8fa3"],
    tagline: "Loud can, louder rush.",
  },
  {
    tier: "near_breakeven",
    name: "Strawberry Preserve",
    brand: brand("Meadow Farms", "mainstream"),
    category: "jar",
    marketValue: 475,
    colors: ["#e8395f", "#ffd6e0"],
    tagline: "Small-batch spread, farmstand label.",
  },
  {
    tier: "modest_profit",
    name: "Strawberry Gummies Tin",
    brand: brand("Ruby Orchard", "premium"),
    category: "tin",
    marketValue: 600,
    colors: ["#d81159", "#ffb3c6"],
    tagline: "Collector's tin, refillable pouch inside.",
  },
  {
    tier: "profitable",
    name: "Strawberry Truffle Box",
    brand: brand("Velvet Vine", "premium"),
    category: "box",
    marketValue: 875,
    colors: ["#a4133c", "#ff8fa3"],
    tagline: "Six-piece box, foiled wrap.",
  },
  {
    tier: "small_chase",
    name: "Strawberry Cordial",
    brand: brand("Crimson Reserve", "premium"),
    category: "bottle",
    marketValue: 1600,
    colors: ["#800f2f", "#ff4d6d"],
    tagline: "Small-batch, wax-sealed neck.",
  },
  {
    tier: "big_chase",
    name: "Imported Strawberry Liqueur",
    brand: brand("Château Fraise", "luxury"),
    category: "bottle",
    marketValue: 2700,
    colors: ["#590d22", "#ff758f"],
    tagline: "Imported. Etched glass. Serial numbered.",
  },
  {
    tier: "massive_chase",
    name: "'Grand Cru' Vintage Reserve",
    brand: brand("Château Fraise", "collectible"),
    category: "flask",
    marketValue: 9700,
    colors: ["#3d0814", "#ff4d6d"],
    tagline: "The chase pull. One vintage, hand-numbered.",
  },
]);

// ---------------------------------------------------------------------------
// TROPICAL CRATE
// ---------------------------------------------------------------------------
const tropicalItems = buildItems([
  {
    tier: "ground_a",
    name: "Pineapple Freeze Bar",
    brand: brand("SunCrest", "budget"),
    category: "bar",
    marketValue: 200,
    colors: ["#ff9f1c", "#ffe8a3"],
    tagline: "Melts before you finish the wrapper.",
  },
  {
    tier: "ground_b",
    name: "Mango Chews",
    brand: brand("Palmtree Pantry", "budget"),
    category: "pouch",
    marketValue: 350,
    colors: ["#ffb703", "#fff3b0"],
    tagline: "Bag-in-bag, sticky in the best way.",
  },
  {
    tier: "ground_c",
    name: "Tropical Punch",
    brand: brand("Fizzberry", "mainstream"),
    category: "can",
    marketValue: 500,
    colors: ["#fb8500", "#ffd166"],
    tagline: "Same pink can, tropical label run.",
  },
  {
    tier: "ground_d",
    name: "Sparkling Coconut Water",
    brand: brand("Coconami", "mainstream"),
    category: "bottle",
    marketValue: 650,
    colors: ["#2ec4b6", "#cbf3f0"],
    tagline: "Carbonated take on the beach classic.",
  },
  {
    tier: "near_breakeven",
    name: "Passionfruit Trail Mix",
    brand: brand("SunCrest", "mainstream"),
    category: "pouch",
    marketValue: 775,
    colors: ["#ff7f11", "#ffd23f"],
    tagline: "Dried fruit, not the candy kind.",
  },
  {
    tier: "modest_profit",
    name: "Dried Mango Tin",
    brand: brand("Kaha Bay", "premium"),
    category: "tin",
    marketValue: 950,
    colors: ["#f77f00", "#fcbf49"],
    tagline: "Sun-dried, hand-packed tin.",
  },
  {
    tier: "profitable",
    name: "Blood Orange Soda",
    brand: brand("Isola d'Oro", "premium"),
    category: "bottle",
    marketValue: 1400,
    colors: ["#e85d04", "#ffba08"],
    tagline: "Glass bottle, pressed-fruit finish.",
  },
  {
    tier: "small_chase",
    name: "Reserve Guava Nectar",
    brand: brand("Kaha Bay", "premium"),
    category: "bottle",
    marketValue: 2500,
    colors: ["#dc2f02", "#ffba08"],
    tagline: "Reserve label, limited harvest run.",
  },
  {
    tier: "big_chase",
    name: "Imported Limoncello Fizz",
    brand: brand("Isola d'Oro", "luxury"),
    category: "bottle",
    marketValue: 4300,
    colors: ["#9d0208", "#ffd60a"],
    tagline: "Coastal import, embossed glass.",
  },
  {
    tier: "massive_chase",
    name: "'Sole d'Oro' Numbered Edition",
    brand: brand("Isola d'Oro", "collectible"),
    category: "flask",
    marketValue: 15500,
    colors: ["#6a040f", "#ffd60a"],
    tagline: "The chase pull. Gold leaf, hand numbered.",
  },
]);

// ---------------------------------------------------------------------------
// GAS STATION CRATE
// ---------------------------------------------------------------------------
const gasStationItems = buildItems([
  {
    tier: "ground_a",
    name: "Beef Jerky Stick",
    brand: brand("QuickBite", "budget"),
    category: "pouch",
    marketValue: 300,
    colors: ["#e63946", "#ffd60a"],
    tagline: "Register-counter staple.",
  },
  {
    tier: "ground_b",
    name: "Nacho Chips",
    brand: brand("CornerStop", "budget"),
    category: "box",
    marketValue: 525,
    colors: ["#fb8500", "#ffb703"],
    tagline: "Bright bag, brighter cheese dust.",
  },
  {
    tier: "ground_c",
    name: "Energy Shot",
    brand: brand("Route9", "mainstream"),
    category: "flask",
    marketValue: 725,
    colors: ["#d00000", "#ffba08"],
    tagline: "Two-ounce bottle, one long shift.",
  },
  {
    tier: "ground_d",
    name: "Energy Drink — Original",
    brand: brand("Route9", "mainstream"),
    category: "can",
    marketValue: 950,
    colors: ["#dc2f02", "#ffd60a"],
    tagline: "The can every cooler is stocked with.",
  },
  {
    tier: "near_breakeven",
    name: "Trucker Jerky Tin",
    brand: brand("Backroad Supply", "mainstream"),
    category: "tin",
    marketValue: 1200,
    colors: ["#9d0208", "#ffba08"],
    tagline: "Road-trip tin, resealable lid.",
  },
  {
    tier: "modest_profit",
    name: "Blackout Energy — Limited Can",
    brand: brand("Route9", "premium"),
    category: "can",
    marketValue: 1400,
    colors: ["#370617", "#ffd60a"],
    tagline: "Matte black can, small print run.",
  },
  {
    tier: "profitable",
    name: "Flame Series Novelty Lighter",
    brand: brand("Sundown", "premium"),
    category: "box",
    marketValue: 2100,
    colors: ["#e85d04", "#ffba08"],
    tagline: "Refillable, collector-grade casing.",
  },
  {
    tier: "small_chase",
    name: "Reserve Smoked Jerky Box",
    brand: brand("Backroad Supply", "premium"),
    category: "box",
    marketValue: 3700,
    colors: ["#6a040f", "#ffba08"],
    tagline: "Small-batch smoke, numbered box.",
  },
  {
    tier: "big_chase",
    name: "'Overdrive' Collector's Can",
    brand: brand("Route9", "collectible"),
    category: "can",
    marketValue: 6500,
    colors: ["#780000", "#ffd60a"],
    tagline: "Chrome can, convention-exclusive run.",
  },
  {
    tier: "massive_chase",
    name: "Chrome Collector Lighter",
    brand: brand("Sundown", "collectible"),
    category: "tin",
    marketValue: 23200,
    colors: ["#4a0404", "#ffd60a"],
    tagline: "The chase pull. Polished chrome, hand engraved.",
  },
]);

// ---------------------------------------------------------------------------
// FROZEN CRATE
// ---------------------------------------------------------------------------
const frozenItems = buildItems([
  {
    tier: "ground_a",
    name: "Snow Cone Syrup Cup",
    brand: brand("IceCap", "budget"),
    category: "jar",
    marketValue: 475,
    colors: ["#48cae4", "#caf0f8"],
    tagline: "Blue raspberry, stains everything.",
  },
  {
    tier: "ground_b",
    name: "Freeze Pop Pack",
    brand: brand("Frostbite", "budget"),
    category: "pouch",
    marketValue: 800,
    colors: ["#00b4d8", "#ade8f4"],
    tagline: "Six-pack, straight from the chest freezer.",
  },
  {
    tier: "ground_c",
    name: "Blue Raspberry Slushie",
    brand: brand("Blue Glacier", "mainstream"),
    category: "bottle",
    marketValue: 1100,
    colors: ["#0096c7", "#90e0ef"],
    tagline: "Pre-mixed, just add ice.",
  },
  {
    tier: "ground_d",
    name: "Ice Cream Sandwich Box",
    brand: brand("Frostbite", "mainstream"),
    category: "box",
    marketValue: 1400,
    colors: ["#0077b6", "#caf0f8"],
    tagline: "Six-count box, classic wrap.",
  },
  {
    tier: "near_breakeven",
    name: "Sorbet Tub",
    brand: brand("Polar Reserve", "mainstream"),
    category: "tin",
    marketValue: 1700,
    colors: ["#03045e", "#90e0ef"],
    tagline: "Small tub, real fruit base.",
  },
  {
    tier: "modest_profit",
    name: "Arctic Mint Bar",
    brand: brand("IceCap", "premium"),
    category: "bar",
    marketValue: 2200,
    colors: ["#0096c7", "#ade8f4"],
    tagline: "Dark shell, mint center.",
  },
  {
    tier: "profitable",
    name: "Sparkling Glacier Water",
    brand: brand("Nordbrew", "premium"),
    category: "bottle",
    marketValue: 3100,
    colors: ["#03045e", "#48cae4"],
    tagline: "Glacier-sourced, embossed bottle.",
  },
  {
    tier: "small_chase",
    name: "Frozen Custard Collector Tin",
    brand: brand("Polar Reserve", "premium"),
    category: "tin",
    marketValue: 5600,
    colors: ["#023e8a", "#90e0ef"],
    tagline: "Reserve churn, collector tin.",
  },
  {
    tier: "big_chase",
    name: "Imported Arctic Cordial",
    brand: brand("Nordbrew", "luxury"),
    category: "flask",
    marketValue: 9700,
    colors: ["#03071e", "#00f5ff"],
    tagline: "Nordic import, frosted glass flask.",
  },
  {
    tier: "massive_chase",
    name: "'Aurora' Numbered Reserve",
    brand: brand("Nordbrew", "collectible"),
    category: "flask",
    marketValue: 34800,
    colors: ["#03071e", "#00f5ff"],
    tagline: "The chase pull. Aurora-glass, hand numbered.",
  },
]);

// ---------------------------------------------------------------------------
// IMPORT CRATE
// ---------------------------------------------------------------------------
const importItems = buildItems([
  {
    tier: "ground_a",
    name: "Sparkling Water",
    brand: brand("Marché Bleu", "budget"),
    category: "bottle",
    marketValue: 775,
    colors: ["#7b2cbf", "#e0aaff"],
    tagline: "Imported glass, simple label.",
  },
  {
    tier: "ground_b",
    name: "Rice Cracker Pouch",
    brand: brand("Tokaido", "budget"),
    category: "pouch",
    marketValue: 1300,
    colors: ["#9d4edd", "#c77dff"],
    tagline: "Individually wrapped, six per bag.",
  },
  {
    tier: "ground_c",
    name: "Ramune-Style Soda",
    brand: brand("Kaiju Import Co.", "mainstream"),
    category: "bottle",
    marketValue: 1800,
    colors: ["#5a189a", "#e0aaff"],
    tagline: "Marble-stopper bottle, imported line.",
  },
  {
    tier: "ground_d",
    name: "Butter Biscuit Tin",
    brand: brand("Marché Bleu", "mainstream"),
    category: "tin",
    marketValue: 2400,
    colors: ["#3c096c", "#c77dff"],
    tagline: "Blue tin, foil-wrapped biscuits.",
  },
  {
    tier: "near_breakeven",
    name: "Matcha Chocolate Box",
    brand: brand("Tokaido", "mainstream"),
    category: "box",
    marketValue: 2900,
    colors: ["#240046", "#9d4edd"],
    tagline: "Ceremonial-grade matcha shell.",
  },
  {
    tier: "modest_profit",
    name: "Yuzu Soda — Reserve",
    brand: brand("Kaiju Import Co.", "premium"),
    category: "bottle",
    marketValue: 3600,
    colors: ["#3c096c", "#ffd60a"],
    tagline: "Citrus reserve, limited import run.",
  },
  {
    tier: "profitable",
    name: "Imported Truffle Box",
    brand: brand("Maison Reserve", "premium"),
    category: "box",
    marketValue: 5200,
    colors: ["#240046", "#c77dff"],
    tagline: "Twelve-piece box, gold foil seal.",
  },
  {
    tier: "small_chase",
    name: "Reserve Wagyu Jerky Tin",
    brand: brand("Tokaido", "premium"),
    category: "tin",
    marketValue: 9300,
    colors: ["#10002b", "#e0aaff"],
    tagline: "Small import batch, lacquered tin.",
  },
  {
    tier: "big_chase",
    name: "Vintage Import Cordial",
    brand: brand("Maison Reserve", "luxury"),
    category: "flask",
    marketValue: 16200,
    colors: ["#10002b", "#ffd60a"],
    tagline: "Vintage import, wax-sealed flask.",
  },
  {
    tier: "massive_chase",
    name: "'Grand Voyage' Numbered Case",
    brand: brand("Maison Reserve", "collectible"),
    category: "flask",
    marketValue: 58100,
    colors: ["#10002b", "#ffd60a"],
    tagline: "The chase pull. Full case, hand numbered.",
  },
]);

// ---------------------------------------------------------------------------
// LUXURY CRATE
// ---------------------------------------------------------------------------
const luxuryItems = buildItems([
  {
    tier: "ground_a",
    name: "Sparkling Lemonade",
    brand: brand("Golden Coast", "mainstream"),
    category: "bottle",
    marketValue: 1500,
    colors: ["#d4af37", "#f4e4a6"],
    tagline: "Entry-shelf, still dressed well.",
  },
  {
    tier: "ground_b",
    name: "Artisan Shortbread Tin",
    brand: brand("Meadowcrest", "mainstream"),
    category: "tin",
    marketValue: 2700,
    colors: ["#b08d57", "#f4e4a6"],
    tagline: "Butter-forward, tartan tin.",
  },
  {
    tier: "ground_c",
    name: "Cold Brew — Original",
    brand: brand("Golden Coast", "mainstream"),
    category: "bottle",
    marketValue: 3700,
    colors: ["#8c6d1f", "#d4af37"],
    tagline: "Slow-steeped, glass bottle.",
  },
  {
    tier: "ground_d",
    name: "Honey Almond Box",
    brand: brand("Meadowcrest", "premium"),
    category: "box",
    marketValue: 4800,
    colors: ["#7a5c00", "#ffdd55"],
    tagline: "Twelve-piece, ribbon-tied box.",
  },
  {
    tier: "near_breakeven",
    name: "Dark Chocolate Collection",
    brand: brand("Velvet Vine", "premium"),
    category: "box",
    marketValue: 5800,
    colors: ["#1a1a1a", "#d4af37"],
    tagline: "Single-origin collection box.",
  },
  {
    tier: "modest_profit",
    name: "Reserve Sparkling Cuvée",
    brand: brand("Glacier Peak Co.", "premium"),
    category: "bottle",
    marketValue: 7200,
    colors: ["#1a1a1a", "#ffdd55"],
    tagline: "Reserve cuvée, foil-capped bottle.",
  },
  {
    tier: "profitable",
    name: "Numbered Cordial",
    brand: brand("Crimson Reserve", "luxury"),
    category: "flask",
    marketValue: 10400,
    colors: ["#1a1a1a", "#d4af37"],
    tagline: "Hand-numbered, wax-sealed flask.",
  },
  {
    tier: "small_chase",
    name: "Grand Cru Truffle Case",
    brand: brand("Maison Reserve", "luxury"),
    category: "box",
    marketValue: 18700,
    colors: ["#0d0d0d", "#ffdd55"],
    tagline: "Display case, twenty-four pieces.",
  },
  {
    tier: "big_chase",
    name: "'Summit' Vintage Reserve",
    brand: brand("Glacier Peak Co.", "luxury"),
    category: "flask",
    marketValue: 32400,
    colors: ["#0d0d0d", "#d4af37"],
    tagline: "Summit vintage, engraved flask.",
  },
  {
    tier: "massive_chase",
    name: "'Diamond Edition' Collector's Case",
    brand: brand("Château Fraise x Glacier Peak", "collectible"),
    category: "flask",
    marketValue: 116100,
    colors: ["#000000", "#ffffff"],
    tagline: "The chase pull. Two houses, one case, hand numbered.",
  },
]);

export const CRATES: Crate[] = [
  {
    slug: "strawberry",
    name: "Strawberry Crate",
    tagline: "Pink cans, ripe reserves, and one vintage cordial.",
    price: 500,
    palette: {
      primary: "#ff4d6d",
      secondary: "#c9184a",
      accent: "#ffccd5",
      glow: "#ff2d55",
    },
    pattern: "drip",
    items: strawberryItems,
  },
  {
    slug: "tropical",
    name: "Tropical Crate",
    tagline: "Island soda, dried fruit, and a gold-leaf chase.",
    price: 800,
    palette: {
      primary: "#ff9f1c",
      secondary: "#2ec4b6",
      accent: "#ffd23f",
      glow: "#fb8500",
    },
    pattern: "citrus",
    items: tropicalItems,
  },
  {
    slug: "gas-station",
    name: "Gas Station Crate",
    tagline: "Register-counter loot with one chrome grand prize.",
    price: 1200,
    palette: {
      primary: "#ffb703",
      secondary: "#e63946",
      accent: "#fb8500",
      glow: "#ffd60a",
    },
    pattern: "bolt",
    items: gasStationItems,
  },
  {
    slug: "frozen",
    name: "Frozen Crate",
    tagline: "Slushies and sorbet, topped by an aurora-glass flask.",
    price: 1800,
    palette: {
      primary: "#48cae4",
      secondary: "#0077b6",
      accent: "#caf0f8",
      glow: "#00f5ff",
    },
    pattern: "frost",
    items: frozenItems,
  },
  {
    slug: "import",
    name: "Import Crate",
    tagline: "Overseas shelves, one numbered case at the top.",
    price: 3000,
    palette: {
      primary: "#9d4edd",
      secondary: "#5a189a",
      accent: "#e0aaff",
      glow: "#c77dff",
    },
    pattern: "crest",
    items: importItems,
  },
  {
    slug: "luxury",
    name: "Luxury Crate",
    tagline: "Black-label everything, capped by a collector's case.",
    price: 6000,
    palette: {
      primary: "#d4af37",
      secondary: "#1a1a1a",
      accent: "#f4e4a6",
      glow: "#ffdd55",
    },
    pattern: "diamond",
    items: luxuryItems,
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

export function sortedByValueDesc(crate: Crate): Item[] {
  return [...crate.items].sort((a, b) => b.marketValue - a.marketValue);
}
