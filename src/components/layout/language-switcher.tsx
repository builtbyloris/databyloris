"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { MouseEvent } from "react";

import { localizePath, type Locale } from "@/i18n/config";
import type { PublicDictionary } from "@/i18n/types";

interface LanguageSwitcherProps {
  labels: PublicDictionary["languageSwitcher"];
  locale: Locale;
}

export function LanguageSwitcher({ labels, locale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  function preserveUrlState(
    event: MouseEvent<HTMLAnchorElement>,
    destination: string,
  ) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const suffix = `${window.location.search}${window.location.hash}`;
    if (!suffix) return;

    event.preventDefault();
    router.push(`${destination}${suffix}`);
  }

  return (
    <nav aria-label={labels.label}>
      <ul className="flex items-center gap-0.5 rounded-control bg-surface-secondary p-0.5">
        {(["en", "it"] as const).map((targetLocale) => {
          const active = locale === targetLocale;
          const destination = localizePath(targetLocale, pathname);
          const languageLabel =
            targetLocale === "en" ? labels.english : labels.italian;

          return (
            <li key={targetLocale}>
              <Link
                aria-current={active ? "page" : undefined}
                aria-label={languageLabel}
                className={`inline-flex min-h-8 items-center rounded-control px-2 text-xs font-semibold uppercase tracking-wide ${
                  active
                    ? "bg-accent-subtle text-accent"
                    : "text-text-secondary hover:bg-surface-primary hover:text-text-primary"
                }`}
                href={destination}
                hrefLang={targetLocale}
                lang={targetLocale}
                onClick={(event) => preserveUrlState(event, destination)}
              >
                {targetLocale}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
