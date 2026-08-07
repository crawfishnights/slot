// ---------------------------------------------------------------------------
// Product classification
// ---------------------------------------------------------------------------

export type ProductCategory =
  | "vapor"
  | "alcohol"
  | "herbal"
  | "mushroom"
  | "accessories"
  | "collectibles";

export const CATEGORY_LABEL: Record<ProductCategory, string> = {
  vapor: "Vapor",
  alcohol: "Alcohol",
  herbal: "Herbal",
  mushroom: "Mushroom / Alternative",
  accessories: "Accessories",
  collectibles: "Collectibles",
};

/** Specific subcategory within a category — real classification, used for filtering/labels. */
export type ProductSubtype =
  // vapor
  | "disposable"
  | "pod-system"
  | "device"
  | "hardware"
  // alcohol
  | "beer"
  | "rtd-cocktail"
  | "vodka"
  | "tequila"
  | "whiskey"
  | "rum"
  | "wine"
  | "premium-bottle"
  // herbal
  | "tincture"
  | "topical"
  | "capsule"
  | "loose-blend"
  // mushroom / alternative
  | "extract"
  | "gummy"
  | "coffee-blend"
  // accessories
  | "lighter"
  | "grinder"
  | "tray"
  | "storage"
  | "glass"
  | "barware"
  | "collectible-accessory"
  // collectibles
  | "display-case"
  | "apparel"
  | "pin"
  | "art-print";

export const SUBTYPE_LABEL: Record<ProductSubtype, string> = {
  disposable: "Disposable",
  "pod-system": "Pod System",
  device: "Device",
  hardware: "Hardware",
  beer: "Beer",
  "rtd-cocktail": "RTD / Canned Cocktail",
  vodka: "Vodka",
  tequila: "Tequila",
  whiskey: "Whiskey",
  rum: "Rum",
  wine: "Wine",
  "premium-bottle": "Premium Bottle",
  tincture: "Tincture",
  topical: "Topical",
  capsule: "Capsule",
  "loose-blend": "Loose Blend",
  extract: "Extract",
  gummy: "Gummy",
  "coffee-blend": "Coffee Blend",
  lighter: "Lighter",
  grinder: "Grinder",
  tray: "Tray",
  storage: "Storage",
  glass: "Glass",
  barware: "Barware",
  "collectible-accessory": "Collectible Accessory",
  "display-case": "Display Case",
  apparel: "Apparel",
  pin: "Pin",
  "art-print": "Art Print",
};

/**
 * Which of the hand-built SVG shapes renders this product. Decoupled from
 * `subtype` (the real-world classification) on purpose — several taxonomy
 * subtypes share a physical silhouette (a tincture and an extract are both
 * small dropper bottles, a lighter is a lighter regardless of brand tier).
 */
export type RenderShape =
  | "vape-stick"
  | "vape-cloud"
  | "pod-system"
  | "reserve-device"
  | "can"
  | "bottle-round"
  | "bottle-tall"
  | "sachet"
  | "tin"
  | "canister"
  | "shot-bottle"
  | "pouch"
  | "lighter"
  | "grinder"
  | "display-case";

// ---------------------------------------------------------------------------
// Market Tier — an expandable numeric scale (T0..T8, room to grow). This is
// a product's standing within its OWN category, and is deliberately
// independent of price, rarity, and any box's drop odds.
// ---------------------------------------------------------------------------

export type MarketTier = number;

export function tierLabel(tier: MarketTier): string {
  return `T${tier}`;
}

// ---------------------------------------------------------------------------
// Brands — the fictional companies whose products fill the catalog
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
// Canonical product catalog — the single source of truth. Boxes, the
// marketplace, and the collection all reference these records by id; none
// of them store their own copy of a product's value or identity.
// ---------------------------------------------------------------------------

export interface Product {
  id: string;
  name: string;
  brandId: string;
  category: ProductCategory;
  subtype: ProductSubtype;
  renderShape: RenderShape;
  /** flavor / edition / size descriptor, e.g. "Strawberry Cream", "750ml" */
  variant: string;
  marketTier: MarketTier;
  /** canonical reference value in credits — identical everywhere this product appears */
  marketValue: number;
  blurb: string;
  /** 1-100, drives the "Popular" marketplace sort */
  popularity: number;
  /** higher = added to the catalog more recently, drives "Newly added" sort */
  addedIndex: number;
}

export function buybackValue(product: Pick<Product, "marketValue">): number {
  return Math.round(product.marketValue * 0.8);
}

// ---------------------------------------------------------------------------
// Simulated marketplace listings — separate from Market Value
// ---------------------------------------------------------------------------

export interface Listing {
  id: string;
  productId: string;
  price: number;
  quantity: number;
  seller: string;
}

// ---------------------------------------------------------------------------
// Box roles — describe a product's position INSIDE one specific box. Not a
// permanent property of the product: the same item can be Ground Loot in an
// expensive box and a Major Chase in a cheap one.
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

/** A resolved product as it appears inside one specific box — the box's
 * odds/role merged onto the canonical product's own data. This is a
 * computed view, never stored: see lib/data/boxes.ts's resolveBoxItems(). */
export interface Item {
  id: string;
  name: string;
  brandId: string;
  category: ProductCategory;
  subtype: ProductSubtype;
  renderShape: RenderShape;
  marketTier: MarketTier;
  chaseTier: ChaseTier;
  marketValue: number;
  buybackValue: number;
  odds: number;
  flavorOrEdition: string;
  blurb: string;
}

/** A box's loot table entry: which product, at what odds, playing what role
 * inside this particular box. No product data is duplicated here. */
export interface BoxEntry {
  productId: string;
  odds: number;
  role: ChaseTier;
}

export interface Crate {
  slug: string;
  name: string;
  shortDescription: string;
  reasonForExisting: string;
  price: number; // credits
  /** 1-5, derived from this box's actual value distribution, not cosmetic */
  spiceLevel: 1 | 2 | 3 | 4 | 5;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    ink: string; // dark base tone for this box's own surfaces
  };
  /** authoritative loot table: which canonical products, at what odds, in what role */
  entries: BoxEntry[];
  /** entries resolved against the product catalog — computed, never authored directly */
  items: Item[];
}
