export type ProductCategory =
  | "can"
  | "bottle"
  | "jar"
  | "box"
  | "pouch"
  | "bar"
  | "tin"
  | "flask";

export type BrandTier =
  | "budget"
  | "mainstream"
  | "premium"
  | "luxury"
  | "collectible";

export type TierKey =
  | "ground_a"
  | "ground_b"
  | "ground_c"
  | "ground_d"
  | "near_breakeven"
  | "modest_profit"
  | "profitable"
  | "small_chase"
  | "big_chase"
  | "massive_chase";

export interface Brand {
  name: string;
  tier: BrandTier;
}

export interface Item {
  id: string;
  name: string;
  brand: Brand;
  category: ProductCategory;
  tier: TierKey;
  marketValue: number; // credits
  buybackValue: number; // credits, 80% of marketValue
  odds: number; // percent, e.g. 24.0
  /** primary/secondary hex colors driving the generated product art */
  colors: [string, string];
  tagline: string;
}

export interface Crate {
  slug: string;
  name: string;
  tagline: string;
  price: number; // credits
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
  };
  pattern: "drip" | "citrus" | "frost" | "bolt" | "crest" | "diamond";
  items: Item[];
}
