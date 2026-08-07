import { ProductCategory } from "../types";

export interface CategoryMeta {
  id: ProductCategory;
  label: string;
  short: string; // for compact badges
  color: string;
  description: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: "vapor",
    label: "Vapor",
    short: "VPR",
    color: "#b8a1ff",
    description: "Disposables, pod systems, and reserve-grade devices.",
  },
  {
    id: "bottles",
    label: "Bottles",
    short: "BTL",
    color: "#ff2e93",
    description: "Sodas, nectars, and imported cordials.",
  },
  {
    id: "herbal",
    label: "Herbal",
    short: "HRB",
    color: "#8fae74",
    description: "Tea sachets, blend tins, and reserve canisters.",
  },
  {
    id: "convenience",
    label: "Convenience",
    short: "CVN",
    color: "#ff9d3d",
    description: "Snacks, energy shots, and register-counter goods.",
  },
  {
    id: "collectibles",
    label: "Collectibles",
    short: "CLC",
    color: "#2ee6d6",
    description: "Grinders, display cases, and lettered-edition pieces.",
  },
];

export function getCategoryMeta(id: ProductCategory): CategoryMeta {
  const meta = CATEGORIES.find((c) => c.id === id);
  if (!meta) throw new Error(`Unknown category: ${id}`);
  return meta;
}
