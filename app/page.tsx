import { CRATES } from "@/lib/data/crates";
import { CrateCard } from "@/components/CrateCard";
import { RecentPulls } from "@/components/RecentPulls";

export default function Home() {
  const hero = CRATES.find((c) => c.slug === "strawberry-stash")!;
  const others = CRATES.filter((c) => c.slug !== hero.slug);

  return (
    <div className="flex flex-1 flex-col gap-10 pb-20 pt-7">
      <section className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-2">
          Three crates. Real brands. One grail each.
        </p>
      </section>

      <RecentPulls />

      <section className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <CrateCard crate={hero} size="hero" />
          </div>
          <div className="flex flex-col gap-5 lg:col-span-2">
            {others.map((crate) => (
              <CrateCard key={crate.slug} crate={crate} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-3 border-t border-border-soft pt-6 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>Every drop rate is posted on the crate page — fixed odds, not chosen by anything you do.</p>
          <p className="whitespace-nowrap font-medium text-foreground">100 credits = $1.00 reference value · buyback pays 80%</p>
        </div>
      </section>
    </div>
  );
}
