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
    description: "Disposables, pod systems, devices, and hardware.",
  },
  {
    id: "alcohol",
    label: "Alcohol",
    short: "ALC",
    color: "#e2492c",
    description: "Beer, RTD cocktails, and premium bottles.",
  },
  {
    id: "herbal",
    label: "Herbal",
    short: "HRB",
    color: "#8fae74",
    description: "Tinctures, topicals, capsules, and loose blends.",
  },
  {
    id: "mushroom",
    label: "Mushroom / Alternative",
    short: "MSH",
    color: "#c9a24b",
    description: "Functional extracts, capsules, and coffee blends.",
  },
  {
    id: "accessories",
    label: "Accessories",
    short: "ACC",
    color: "#ff9d3d",
    description: "Lighters, grinders, trays, storage, and barware.",
  },
  {
    id: "collectibles",
    label: "Collectibles",
    short: "CLC",
    color: "#2ee6d6",
    description: "Display cases and lettered-edition pieces.",
  },
];

export function getCategoryMeta(id: ProductCategory): CategoryMeta {
  const meta = CATEGORIES.find((c) => c.id === id);
  if (!meta) throw new Error(`Unknown category: ${id}`);
  return meta;
}
