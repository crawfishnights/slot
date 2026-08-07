import { ProductCategory } from "@/lib/types";
import { getCategoryMeta } from "@/lib/data/categories";

export function CategoryBadge({
  category,
  size = "sm",
}: {
  category: ProductCategory;
  size?: "sm" | "md";
}) {
  const meta = getCategoryMeta(category);
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-bold uppercase tracking-wider ${
        size === "md" ? "px-2.5 py-1 text-[10px]" : "px-2 py-0.5 text-[9px]"
      }`}
      style={{
        borderColor: `${meta.color}55`,
        color: meta.color,
        background: `${meta.color}14`,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.color }} />
      {meta.label}
    </span>
  );
}

export function CategoryDot({ category }: { category: ProductCategory }) {
  const meta = getCategoryMeta(category);
  return (
    <span
      title={meta.label}
      className="inline-block h-2 w-2 rounded-full"
      style={{ background: meta.color }}
    />
  );
}
