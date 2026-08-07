import { Brand } from "../types";

// Six fictional brands with distinct market positions, packaging languages,
// and price bands. Products in lib/data/crates.ts reference these by id —
// the same brand shows up across multiple crates so its identity reads as
// consistent, not randomly generated.

export const BRANDS: Record<string, Brand> = {
  "nite-owl": {
    id: "nite-owl",
    name: "Nite Owl",
    position: "budget",
    tagline: "Open when everything else is closed.",
    packaging: "Bright plastic wrap and thin cans, blocky caps lock-up, '24HR' motif",
    priceRange: "$1 – $8",
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
    priceRange: "$2 – $18",
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
    priceRange: "$6 – $45",
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
    priceRange: "$5 – $60",
    colors: ["#8a6d4a", "#7a8c6c"],
    finish: "kraft",
    wordmark: "BOTANICA",
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
