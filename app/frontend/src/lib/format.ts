import { DISPLAY_TIME_ZONE } from "./config";

const numberFormat = new Intl.NumberFormat("en-GB");

export function formatNumber(n: number): string {
  return numberFormat.format(n);
}

/** Share as a whole percentage, e.g. 0.547 -> "55%". */
export function formatShare(part: number, total: number): string {
  if (total === 0) return "0%";
  return `${Math.round((part / total) * 100)}%`;
}

/** Signed change with a true minus sign, e.g. 0.515 -> "+52%", -0.33 -> "−33%". */
export function formatChange(change: number): string {
  const pct = Math.round(change * 100);
  if (pct === 0) return "0%";
  return `${pct > 0 ? "+" : "−"}${Math.abs(pct)}%`;
}

export function formatConfidence(c: number): string {
  return c.toFixed(2);
}

const dateTimeFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: DISPLAY_TIME_ZONE,
});

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: DISPLAY_TIME_ZONE,
});

const shortDateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  timeZone: DISPLAY_TIME_ZONE,
});

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: DISPLAY_TIME_ZONE,
});

/** "18 Oct, 12:00" */
export function formatDateTime(iso: string): string {
  return dateTimeFormat.format(new Date(iso));
}

/** "18 Oct 2026" */
export function formatDate(iso: string): string {
  return dateFormat.format(new Date(iso));
}

/** "18 Oct" */
export function formatShortDate(iso: string): string {
  return shortDateFormat.format(new Date(iso));
}

/** "12:00" */
export function formatTime(iso: string): string {
  return timeFormat.format(new Date(iso));
}

/** Compact counts for axis ticks: 1,200 -> "1.2K". */
export function formatCompact(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return String(n);
}
