import type {KPIFormat} from "@/types";

export function formatNumber(value: number, locale: string, maximumFractionDigits = 0) {
  return new Intl.NumberFormat(locale, {maximumFractionDigits}).format(value);
}

export function formatSales(value: number, locale: string) {
  return `${formatNumber(value, locale, 2)}M`;
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
