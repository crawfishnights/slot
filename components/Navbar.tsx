"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { formatCredits, formatUsd } from "@/lib/format";

function LogoMark() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
      <defs>
        <linearGradient id="nav-logo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9d85ff" />
          <stop offset="100%" stopColor="#ff5c9a" />
        </linearGradient>
      </defs>
      <path d="M15 2 L27 8.5 L27 21.5 L15 28 L3 21.5 L3 8.5 Z" fill="url(#nav-logo)" />
      <path d="M15 2 L27 8.5 L15 15 L3 8.5 Z" fill="#ffffff" opacity="0.25" />
      <path d="M15 15 L15 28 L3 21.5 L3 8.5 Z" fill="#000000" opacity="0.15" />
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
      className={`text-sm font-medium transition-colors ${
        pathname === href
          ? "text-foreground"
          : "text-muted hover:text-foreground"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark />
            <span className="font-display text-lg font-bold tracking-tight">
              SLOTCASE
            </span>
          </Link>
          <nav className="hidden items-center gap-6 sm:flex">
            {navLink("/", "Crates")}
            {navLink("/inventory", "Inventory")}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="glass-card flex items-center gap-2 rounded-full py-1.5 pl-3 pr-4">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <circle cx="8" cy="8" r="7" fill="var(--credit)" opacity="0.2" />
              <circle cx="8" cy="8" r="5.2" fill="none" stroke="var(--credit)" strokeWidth="1.4" />
              <path d="M8 5v6M6.2 6.4c0-.9.8-1.4 1.8-1.4s1.8.5 1.8 1.3c0 1.8-3.6.9-3.6 2.7 0 .8.8 1.3 1.8 1.3s1.8-.5 1.8-1.4" stroke="var(--credit)" strokeWidth="1" fill="none" strokeLinecap="round" />
            </svg>
            <span className="font-display text-sm font-bold tabular-nums">
              {hasHydrated ? formatCredits(credits) : "…"}
            </span>
            <span className="hidden text-xs text-muted sm:inline">
              {hasHydrated ? `(${formatUsd(credits)})` : ""}
            </span>
          </div>

          <Link
            href="/inventory"
            className="relative flex h-9 items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 5.5L8 2l6 3.5v5L8 14l-6-3.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
              <path d="M2 5.5L8 9l6-3.5M8 9v5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            </svg>
            <span className="hidden sm:inline">Inventory</span>
            {hasHydrated && inventoryCount > 0 && (
              <span className="ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                {inventoryCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
