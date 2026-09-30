import type {DashboardText} from "@/types";

interface DashboardTextTranslations {
  has: (key: string) => boolean;
  translate: (key: string) => string;
}

export function resolveDashboardText(
  value: DashboardText | null | undefined,
  locale: string,
  translations: DashboardTextTranslations,
): string {
  if (value === null || value === undefined) return "";

  if (typeof value === "string") {
    return translations.has(value) ? translations.translate(value) : value;
  }

  return locale === "en" ? value.en : value.it;
}
