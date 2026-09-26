import "server-only";

import type { Locale } from "./config";
import type { PublicDictionary } from "./types";

const dictionaries: Record<Locale, () => Promise<PublicDictionary>> = {
  en: () => import("./dictionaries/en").then((module) => module.default),
  it: () => import("./dictionaries/it").then((module) => module.default),
};

export function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}
