// ---------------------------------------------------------------------------
// Product classification
// ---------------------------------------------------------------------------

export type ProductCategory =
  | "vapor"
  | "bottles"
  | "herbal"
  | "convenience"
  | "collectibles";

export const CATEGORY_LABEL: Record<ProductCategory, string> = {
  vapor: "Vapor",
  bottles: "Bottles",
  herbal: "Herbal",
  convenience: "Convenience",
  collectibles: "Collectibles",
};

/** Specific packaging/product family within a category — drives art + copy. */
export type ProductSubtype =
  // vapor
  | "stick"
  | "cloud"
  | "pod-system"
  | "reserve-device"
  // bottles
  | "soda"
  | "nectar"
  | "cordial"
  // herbal
  | "tea-sachet"
  | "blend-tin"
  | "reserve-canister"
  // convenience
  | "energy-shot"
  | "snack"
  | "lighter"
  // collectibles
  | "grinder"
  | "display-case";

export const SUBTYPE_LABEL: Record<ProductSubtype, string> = {
  stick: "Stick",
  cloud: "Cloud",
  "pod-system": "Pod System",
  "reserve-device": "Reserve Device",
  soda: "Soda",
  nectar: "Nectar",
  cordial: "Cordial",
  "tea-sachet": "Tea Sachet",
  "blend-tin": "Blend Tin",
  "reserve-canister": "Reserve Canister",
  "energy-shot": "Energy Shot",
  snack: "Snack",
  lighter: "Lighter",
  grinder: "Grinder",
  "display-case": "Display Case",
};

// ---------------------------------------------------------------------------
// Brands — the fictional companies whose products fill the crates
// ---------------------------------------------------------------------------

export type MarketPosition =
  | "budget"
  | "mainstream"
  | "premium"
  | "luxury"
  | "collectible";

export interface Brand {
  id: string;
  name: string;
  position: MarketPosition;
  tagline: string;
  /** short description of design language / packaging materials */
  packaging: string;
  priceRange: string;
  colors: [string, string];
  /** material finish, drives art rendering (foil, gloss, matte, glass, kraft...) */
  finish: "plastic" | "gloss" | "pastel-matte" | "kraft" | "dark-glass" | "holo";
  wordmark: string;
}

// ---------------------------------------------------------------------------
// Chase hierarchy — replaces generic common/rare/epic/legendary rarity
// ---------------------------------------------------------------------------

export type ChaseTier =
  | "headliner"
  | "major_chase"
  | "solid_hit"
  | "break_even"
  | "ground_loot";

export const CHASE_TIER_LABEL: Record<ChaseTier, string> = {
  headliner: "Headliner",
  major_chase: "Major Chase",
  solid_hit: "Solid Hit",
  break_even: "Break Even",
  ground_loot: "Ground Loot",
};

export interface Item {
  id: string;
  name: string;
  brandId: string;
  category: ProductCategory;
  subtype: ProductSubtype;
  chaseTier: ChaseTier;
  marketValue: number; // credits
  buybackValue: number; // credits, 80% of marketValue
  odds: number; // percent, sums to 100 within a crate
  flavorOrEdition: string;
  blurb: string;
}

// ---------------------------------------------------------------------------
// Crates
// ---------------------------------------------------------------------------

export interface Crate {
  slug: string;
  name: string;
  shortDescription: string;
  reasonForExisting: string;
  price: number; // credits
  /** 1-5, derived from this crate's actual value distribution, not cosmetic */
  spiceLevel: 1 | 2 | 3 | 4 | 5;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    ink: string; // dark base tone for this crate's own surfaces
  };
  items: Item[];
}
