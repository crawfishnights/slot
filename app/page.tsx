import { CRATES } from "@/lib/data/crates";
import { CrateCard } from "@/components/CrateCard";
import { RecentPulls } from "@/components/RecentPulls";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-10 pb-20 pt-8">
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              Which one are you opening?
            </h1>
            <p className="mt-1 text-sm text-muted">
              Six crates, six loot pools. Open one, watch the roulette land, and
              keep or sell whatever you pull.
            </p>
          </div>
          <div className="hidden items-center gap-4 text-xs text-muted sm:flex">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-positive" /> Buyback
              pays 80% of market value
            </div>
          </div>
        </div>
      </section>

      <RecentPulls />

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CRATES.map((crate, i) => (
            <CrateCard key={crate.slug} crate={crate} featured={i === CRATES.length - 1} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="glass-card flex flex-col gap-4 rounded-2xl p-5 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            All items are fictional and every drop rate is posted on the crate
            page. Outcomes are chosen by fixed odds, not by anything you do —
            the roulette only reveals the result.
          </p>
          <p className="whitespace-nowrap font-medium text-foreground">
            100 credits = $1.00 reference value
          </p>
        </div>
      </section>
    </div>
  );
}
