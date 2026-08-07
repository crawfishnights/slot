import { Listing, Product } from "./types";

// Deterministic, seeded simulation of marketplace listings — separate from
// a product's canonical Market Value. Seeded off the product id so the same
// product always shows the same simulated listings across renders and
// navigations (no backend, no Math.random() at render time, no hydration
// mismatch). No real money changes hands anywhere in this simulation.

function mulberry32(seed: number) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFromString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return h;
}

const SELLERS = [
  "nightowl_vault",
  "reserve.case",
  "afterhrs_drop",
  "cornerstash",
  "glassware_hq",
  "fragola_reserve",
  "void_listing",
  "backroad_gear",
  "halo_authorized",
  "stashkeeper",
];

export function getListings(product: Pick<Product, "id" | "marketValue">): Listing[] {
  const rand = mulberry32(seedFromString(product.id));
  const count = 2 + Math.floor(rand() * 3); // 2-4 simulated listings
  const listings: Listing[] = [];
  let multiplier = 0.9 + rand() * 0.07; // lowest listing: 90-97% of market value

  for (let i = 0; i < count; i++) {
    const price = Math.max(5, Math.round((product.marketValue * multiplier) / 5) * 5);
    listings.push({
      id: `${product.id}-listing-${i}`,
      productId: product.id,
      price,
      quantity: 1 + Math.floor(rand() * 6),
      seller: SELLERS[Math.floor(rand() * SELLERS.length)],
    });
    multiplier += 0.06 + rand() * 0.09; // each next listing sits higher
  }

  return listings.sort((a, b) => a.price - b.price);
}

export function lowestListing(product: Pick<Product, "id" | "marketValue">): Listing {
  return getListings(product)[0];
}

export function totalAvailable(product: Pick<Product, "id" | "marketValue">): number {
  return getListings(product).reduce((sum, l) => sum + l.quantity, 0);
}
