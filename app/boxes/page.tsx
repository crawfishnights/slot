import { CRATES } from "@/lib/data/crates";
import { CrateCard } from "@/components/CrateCard";

export const metadata = {
  title: "Boxes — Slotcase",
  description: "Three curated boxes, built from the same product catalog as the marketplace.",
};

export default function BoxesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-5 py-9 sm:px-8">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Boxes</h1>
        <p className="text-sm text-muted">
          A box is a curated, randomized way to pull from the same catalog you can browse in the
          Marketplace — nothing inside is exclusive to opening one.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        {CRATES.map((crate) => (
          <CrateCard key={crate.slug} crate={crate} />
        ))}
      </div>
    </div>
  );
}
