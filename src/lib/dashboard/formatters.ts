import type {KPIFormat} from "@/types";

const COMPACT_NUMBER_THRESHOLD = 1_000_000;

export function formatNumber(value: number, locale: string, maximumFractionDigits = 0) {
  return new Intl.NumberFormat(locale, {maximumFractionDigits}).format(value);
}

export function formatSales(value: number, locale: string) {
  return `${formatNumber(value, locale, 2)}M`;
}

function formatCompactNumber(value: number, locale: string, maximumFractionDigits = 2) {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits,
  }).format(value);
}

export function formatDashboardValue(value: number, format: KPIFormat | "sales", locale: string) {
  if (format === "sales") return formatSales(value, locale);
  if (format === "percentage") return `${formatNumber(value, locale, 1)}%`;
  if (format === "currency") {
    return new Intl.NumberFormat(locale, {style: "currency", currency: "EUR", maximumFractionDigits: 0}).format(value);
  }
  if (format === "duration") return `${formatNumber(value, locale, 1)}h`;
  return formatNumber(value, locale);
}

export function formatCompactDashboardValue(value: number, format: KPIFormat | "sales", locale: string) {
  if (Math.abs(value) < COMPACT_NUMBER_THRESHOLD) return formatDashboardValue(value, format, locale);
  if (format === "sales") return `${formatCompactNumber(value, locale)}M`;
  if (format === "percentage") return `${formatCompactNumber(value, locale, 1)}%`;
  if (format === "currency") {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 2,
    }).format(value);
  }
  if (format === "duration") return `${formatCompactNumber(value, locale, 1)}h`;
  return formatCompactNumber(value, locale);
}
