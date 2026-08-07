"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Item } from "./types";

export type AcquisitionSource = "box" | "marketplace";

export interface InventoryItem {
  uid: string;
  item: Item;
  source: AcquisitionSource;
  crateSlug?: string;
  crateName?: string;
  /** credits actually paid, only set for marketplace purchases */
  acquisitionPrice?: number;
  acquiredAt: number;
}

export interface PullRecord {
  uid: string;
  item: Item;
  crateSlug: string;
  crateName: string;
  timestamp: number;
}

interface StoreState {
  credits: number;
  inventory: InventoryItem[];
  recentPulls: PullRecord[];
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  spend: (amount: number) => boolean;
  recordPull: (item: Item, crateSlug: string, crateName: string) => string;
  keepPull: (pullUid: string) => void;
  sellPull: (pullUid: string) => void;
  sellInventoryItem: (uid: string) => void;
  sellInventoryItems: (uids: string[]) => void;
  buyListing: (item: Item, price: number) => boolean;
  resetAccount: () => void;
}

export const STARTING_CREDITS = 10000;

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      credits: STARTING_CREDITS,
      inventory: [],
      recentPulls: [],
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),

      spend: (amount) => {
        const { credits } = get();
        if (credits < amount) return false;
        set({ credits: credits - amount });
        return true;
      },

      recordPull: (item, crateSlug, crateName) => {
        const pullUid = uid();
        set((s) => ({
          recentPulls: [
            { uid: pullUid, item, crateSlug, crateName, timestamp: Date.now() },
            ...s.recentPulls,
          ].slice(0, 24),
        }));
        return pullUid;
      },

      keepPull: (pullUid) => {
        const pull = get().recentPulls.find((p) => p.uid === pullUid);
        if (!pull) return;
        set((s) => ({
          inventory: [
            {
              uid: pull.uid,
              item: pull.item,
              source: "box",
              crateSlug: pull.crateSlug,
              crateName: pull.crateName,
              acquiredAt: pull.timestamp,
            },
            ...s.inventory,
          ],
        }));
      },

      sellPull: (pullUid) => {
        const pull = get().recentPulls.find((p) => p.uid === pullUid);
        if (!pull) return;
        set((s) => ({ credits: s.credits + pull.item.buybackValue }));
      },

      sellInventoryItem: (invUid) => {
        const inv = get().inventory.find((i) => i.uid === invUid);
        if (!inv) return;
        set((s) => ({
          credits: s.credits + inv.item.buybackValue,
          inventory: s.inventory.filter((i) => i.uid !== invUid),
        }));
      },

      sellInventoryItems: (uids) => {
        const uidSet = new Set(uids);
        const sold = get().inventory.filter((i) => uidSet.has(i.uid));
        if (sold.length === 0) return;
        const total = sold.reduce((sum, i) => sum + i.item.buybackValue, 0);
        set((s) => ({
          credits: s.credits + total,
          inventory: s.inventory.filter((i) => !uidSet.has(i.uid)),
        }));
      },

      buyListing: (item, price) => {
        if (!get().spend(price)) return false;
        set((s) => ({
          inventory: [
            {
              uid: uid(),
              item,
              source: "marketplace",
              acquisitionPrice: price,
              acquiredAt: Date.now(),
            },
            ...s.inventory,
          ],
        }));
        return true;
      },

      resetAccount: () =>
        set({ credits: STARTING_CREDITS, inventory: [], recentPulls: [] }),
    }),
    {
      // v3: bumped for the marketplace-first data model (canonical products,
      // acquisition source tracking) — any previously cached v2 items don't
      // carry the fields this shape now expects.
      name: "slotcase-store-v3",
      skipHydration: true,
    }
  )
);
