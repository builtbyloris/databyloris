export const locales = ["en", "it"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localizePath(locale: Locale, path: string) {
  if (path.startsWith("#")) return path;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const localePrefix = /^\/(en|it)(?=\/|$)/;

  if (localePrefix.test(normalizedPath)) {
    return normalizedPath.replace(localePrefix, `/${locale}`);
  }

  return normalizedPath === "/" ? `/${locale}` : `/${locale}${normalizedPath}`;
}
