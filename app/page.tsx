import Link from "next/link";
import { CRATES } from "@/lib/data/crates";
import { PRODUCTS } from "@/lib/data/products";
import { CrateCard } from "@/components/CrateCard";
import { RecentPulls } from "@/components/RecentPulls";
import { CategoryTiles } from "@/components/CategoryTiles";
import { MarketItemCard } from "@/components/MarketItemCard";

export default function Home() {
  const hero = CRATES.find((c) => c.slug === "strawberry-stash")!;
  const otherBoxes = CRATES.filter((c) => c.slug !== hero.slug);
  const trending = [...PRODUCTS].sort((a, b) => b.popularity - a.popularity).slice(0, 6);

  return (
    <div className="flex flex-1 flex-col gap-12 pb-20 pt-7">
      <section className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-2">
          A product marketplace, with boxes as one way in.
        </p>
      </section>

      {/* Browse categories */}
      <section className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Browse Categories</h2>
          <Link href="/marketplace" className="text-xs font-semibold text-muted hover:text-foreground">
            View marketplace →
          </Link>
        </div>
        <CategoryTiles />
      </section>

      {/* Featured boxes */}
      <section className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Featured Boxes</h2>
          <Link href="/boxes" className="text-xs font-semibold text-muted hover:text-foreground">
            All boxes →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <CrateCard crate={hero} size="hero" />
          </div>
          <div className="flex flex-col gap-5 lg:col-span-2">
            {otherBoxes.map((crate) => (
              <CrateCard key={crate.slug} crate={crate} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending market items */}
      <section className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Trending Market Items</h2>
          <Link href="/marketplace" className="text-xs font-semibold text-muted hover:text-foreground">
            View marketplace →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {trending.map((product) => (
            <MarketItemCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <RecentPulls />

      <section className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-3 border-t border-border-soft pt-6 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>Every box&rsquo;s drop rates are posted on its page — fixed odds, not chosen by anything you do.</p>
          <p className="whitespace-nowrap font-medium text-foreground">100 credits = $1.00 reference value · buyback pays 80%</p>
        </div>
      </section>
    </div>
  );
}
