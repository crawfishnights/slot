import Link from "next/link";
import { CATEGORIES } from "@/lib/data/categories";
import { PRODUCTS } from "@/lib/data/products";

export function CategoryTiles() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {CATEGORIES.map((c) => {
        const count = PRODUCTS.filter((p) => p.category === c.id).length;
        return (
          <Link
            key={c.id}
            href={`/marketplace?category=${c.id}`}
            className="group flex flex-col gap-2 rounded-2xl border border-border-soft bg-surface p-4 transition-colors hover:border-border"
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
              style={{ background: `${c.color}18`, color: c.color }}
            >
              {c.short}
            </span>
            <div>
              <div className="text-sm font-semibold leading-tight">{c.label}</div>
              <div className="mt-0.5 text-[11px] text-muted">{count} products</div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
