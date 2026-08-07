export const CREDITS_PER_DOLLAR = 100;

export function formatCredits(amount: number): string {
  return `${Math.round(amount).toLocaleString("en-US")}`;
}

export function formatUsd(credits: number): string {
  const dollars = credits / CREDITS_PER_DOLLAR;
  return dollars.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: dollars % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}
