import { Brand } from "../types";

// Eight fictional brands with distinct market positions, packaging
// languages, and price bands, spanning the six product categories. Products
// in lib/data/products.ts reference these by id — the same brand shows up
// across multiple products and multiple boxes so its identity reads as
// consistent, not randomly generated.

export const BRANDS: Record<string, Brand> = {
  "nite-owl": {
    id: "nite-owl",
    name: "Nite Owl",
    position: "budget",
    tagline: "Open when everything else is closed.",
    packaging: "Bright plastic clamshells and thin printed cans, blocky caps lock-up, '24HR' motif",
    priceRange: "$1 – $12",
    colors: ["#ff6b1a", "#1a8fff"],
    finish: "plastic",
    wordmark: "NITE OWL",
  },
  fizzworks: {
    id: "fizzworks",
    name: "Fizzworks",
    position: "mainstream",
    tagline: "Loud flavor, louder can.",
    packaging: "Glossy saturated color, bubble typography, fruit-splash graphics",
    priceRange: "$3 – $10",
    colors: ["#ff2e93", "#ffd23f"],
    finish: "gloss",
    wordmark: "Fizzworks",
  },
  "halo-vapor": {
    id: "halo-vapor",
    name: "Halo Vapor Co.",
    position: "premium",
    tagline: "Slower burn, cleaner design.",
    packaging: "Minimalist pastel-gradient boxes, brushed-silver device bodies, ring logo",
    priceRange: "$8 – $60",
    colors: ["#b8a1ff", "#8fe3c8"],
    finish: "pastel-matte",
    wordmark: "HALO",
  },
  "botanica-supply": {
    id: "botanica-supply",
    name: "Botanica Supply",
    position: "mainstream",
    tagline: "Small batch, hand-stamped.",
    packaging: "Kraft brown and sage, illustrated botanical linework, twine ties",
    priceRange: "$6 – $45",
    colors: ["#8a6d4a", "#7a8c6c"],
    finish: "kraft",
    wordmark: "BOTANICA",
  },
  mycora: {
    id: "mycora",
    name: "Mycora",
    position: "mainstream",
    tagline: "Functional mushroom wellness, dosed consistently.",
    packaging: "Matte earth tones, spore-print linework, clinical-but-warm labeling",
    priceRange: "$6 – $30",
    colors: ["#7a5c3e", "#c9a24b"],
    finish: "kraft",
    wordmark: "MYCORA",
  },
  "backroad-supply": {
    id: "backroad-supply",
    name: "Backroad Supply",
    position: "mainstream",
    tagline: "Built for the glovebox and the bar cart alike.",
    packaging: "Powder-coated metal and canvas, utilitarian stamped logo, olive/rust palette",
    priceRange: "$5 – $30",
    colors: ["#7a5c1a", "#3a3a3a"],
    finish: "plastic",
    wordmark: "BACKROAD",
  },
  "marchetti-vane": {
    id: "marchetti-vane",
    name: "Marchetti & Vane",
    position: "luxury",
    tagline: "Imported. Numbered. Not reordered.",
    packaging: "Dark glass bottles, gold foil labels, wax seals, embossed crest",
    priceRange: "$20 – $500+",
    colors: ["#0d1f17", "#c9a24b"],
    finish: "dark-glass",
    wordmark: "M&V",
  },
  "void-society": {
    id: "void-society",
    name: "Void Society",
    position: "collectible",
    tagline: "You weren't supposed to pull this.",
    packaging: "Matte black boxes, holographic foil, cryptic glyphs, lettered editions",
    priceRange: "Rare — value set by the drop, not a shelf price",
    colors: ["#ff2ee6", "#2ee6ff"],
    finish: "holo",
    wordmark: "VOID SOCIETY",
  },
};

export function getBrand(id: string): Brand {
  const brand = BRANDS[id];
  if (!brand) throw new Error(`Unknown brand id: ${id}`);
  return brand;
}
