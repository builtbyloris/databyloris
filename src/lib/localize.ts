import type {AppLocale} from "@/i18n/routing";
import type {LocalizedText} from "@/types";

export function localize(text: LocalizedText, locale: AppLocale) {
  return text[locale];
}
