"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { formatCredits, formatUsd } from "@/lib/format";

function LogoMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
      <rect x="1" y="1" width="24" height="24" rx="5" fill="var(--cream)" />
      <path d="M8 17.5V9.5L13 7l5 2.5v8L13 20z" fill="none" stroke="var(--background)" strokeWidth="1.4" />
      <path d="M8 9.5 13 12l5-2.5M13 12v8" fill="none" stroke="var(--background)" strokeWidth="1.4" />
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const credits = useStore((s) => s.credits);
  const hasHydrated = useStore((s) => s.hasHydrated);
  const inventoryCount = useStore((s) => s.inventory.length);

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={`text-[13px] font-medium tracking-wide uppercase transition-colors ${
        pathname === href
          ? "text-foreground"
          : "text-muted hover:text-foreground"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border-soft bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <div className="flex items-center gap-9">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark />
            <span className="font-display text-[17px] font-semibold tracking-tight">
              Slotcase
            </span>
          </Link>
          <nav className="hidden items-center gap-7 sm:flex">
            {navLink("/marketplace", "Marketplace")}
            {navLink("/boxes", "Boxes")}
            <Link
              href="/collection"
              className={`flex items-center gap-1.5 text-[13px] font-medium tracking-wide uppercase transition-colors ${
                pathname === "/collection" ? "text-foreground" : "text-muted hover:text-foreground"
              }`}
            >
              Collection
              {hasHydrated && inventoryCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-cream px-1 text-[10px] font-bold normal-case text-background">
                  {inventoryCount}
                </span>
              )}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-border-soft bg-surface py-1.5 pl-3 pr-3.5">
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
              <circle cx="8" cy="8" r="7" fill="var(--credit)" opacity="0.18" />
              <circle cx="8" cy="8" r="5.2" fill="none" stroke="var(--credit)" strokeWidth="1.3" />
              <path d="M8 5v6M6.2 6.4c0-.9.8-1.4 1.8-1.4s1.8.5 1.8 1.3c0 1.8-3.6.9-3.6 2.7 0 .8.8 1.3 1.8 1.3s1.8-.5 1.8-1.4" stroke="var(--credit)" strokeWidth="0.9" fill="none" strokeLinecap="round" />
            </svg>
            <span className="font-display text-[13px] font-semibold tabular-nums">
              {hasHydrated ? formatCredits(credits) : "…"}
            </span>
            <span className="hidden text-[11px] text-muted sm:inline">
              {hasHydrated ? `· ${formatUsd(credits)}` : ""}
            </span>
          </div>

          <Link
            href="/collection"
            className="relative flex h-9 items-center gap-1.5 rounded-full border border-border-soft px-3.5 text-[13px] font-medium text-foreground transition-colors hover:bg-surface sm:hidden"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 5.5L8 2l6 3.5v5L8 14l-6-3.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            </svg>
            {hasHydrated && inventoryCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-cream px-1 text-[10px] font-bold text-background">
                {inventoryCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
