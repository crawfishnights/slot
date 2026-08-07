"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Crate, Item } from "@/lib/types";
import { useStore } from "@/lib/store";
import { CrateArt } from "@/components/art/CrateArt";
import { Roulette } from "@/components/Roulette";
import { RevealPanel } from "./RevealPanel";
import { formatCredits } from "@/lib/format";

type Phase = "intro" | "spinning" | "reveal";

export function OpeningExperience({ crate, onClose }: { crate: Crate; onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [spinToken, setSpinToken] = useState(0);
  const [result, setResult] = useState<{ item: Item; pullUid: string } | null>(null);

  const credits = useStore((s) => s.credits);
  const spend = useStore((s) => s.spend);
  const recordPull = useStore((s) => s.recordPull);
  const keepPull = useStore((s) => s.keepPull);
  const sellPull = useStore((s) => s.sellPull);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => {
      setPhase("spinning");
      setSpinToken((x) => x + 1);
    }, 1100);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  function handleFinish(winner: Item) {
    const pullUid = recordPull(winner, crate.slug, crate.name);
    setResult({ item: winner, pullUid });
    setPhase("reveal");
  }

  function handleKeep() {
    if (!result) return;
    keepPull(result.pullUid);
    onClose();
  }

  function handleSell() {
    if (!result) return;
    sellPull(result.pullUid);
    onClose();
  }

  function handleOpenAgain() {
    if (!result) return;
    keepPull(result.pullUid);
    if (!spend(crate.price)) {
      onClose();
      return;
    }
    setResult(null);
    setPhase("spinning");
    setSpinToken((x) => x + 1);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <div className="grain pointer-events-none absolute inset-0" />
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{ background: `radial-gradient(60% 50% at 50% 40%, ${crate.palette.primary}14 0%, transparent 70%)` }}
      />

      <button
        onClick={onClose}
        aria-label="Close opening"
        className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border-soft bg-surface text-muted transition-colors hover:text-foreground"
      >
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
          <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div
            key="intro"
            className="relative flex flex-col items-center gap-4"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.4 }}
          >
            <CrateArt crate={crate} className="w-52 drop-shadow-2xl sm:w-64" />
            <h2 className="font-display text-2xl font-semibold">{crate.name}</h2>
            <p className="text-sm text-muted">{formatCredits(crate.price)} credits · opening…</p>
          </motion.div>
        )}

        {phase === "spinning" && (
          <motion.div
            key="spinning"
            className="relative w-full max-w-4xl px-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.25em] text-muted">
              {crate.name}
            </p>
            <Roulette items={crate.items} spinToken={spinToken} onFinish={handleFinish} />
          </motion.div>
        )}

        {phase === "reveal" && result && (
          <motion.div key="reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative">
            <RevealPanel
              item={result.item}
              onKeep={handleKeep}
              onSell={handleSell}
              onOpenAgain={handleOpenAgain}
              canAfford={credits >= crate.price}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
