import { clsx, type ClassValue } from "clsx";

export function cn(...values: ClassValue[]) {
  return clsx(values);
}

export const buttonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-amber-200/20 bg-amber-300 px-4 py-2 text-sm font-semibold text-stone-950 shadow-sm transition hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-200 disabled:cursor-not-allowed disabled:opacity-50";

export const ghostButtonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-stone-700/70 bg-stone-950/50 px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-200 disabled:cursor-not-allowed disabled:opacity-50";
