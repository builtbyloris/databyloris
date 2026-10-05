"use client";

import {useLocale, useTranslations} from "next-intl";
import {useTransition} from "react";
import {usePathname, useRouter} from "@/i18n/navigation";
import type {AppLocale} from "@/i18n/routing";
import {cn} from "@/lib/cn";

const locales: AppLocale[] = ["it", "en"];

export function LanguageSwitcher() {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Language");
  const [isPending, startTransition] = useTransition();

  function changeLocale(nextLocale: AppLocale) {
    if (nextLocale === locale) return;
    const href = `${pathname}${window.location.search}`;
    startTransition(() => router.replace(href, {locale: nextLocale}));
  }

  return (
    <div
      className="flex rounded-control border border-border bg-surface p-0.5"
      aria-label={t("label")}
      role="group"
    >
      {locales.map((item) => (
        <button
          key={item}
          type="button"
          disabled={isPending}
          aria-pressed={locale === item}
          onClick={() => changeLocale(item)}
          className={cn(
            "h-7 rounded-lg px-2 text-[0.68rem] font-bold tracking-wider transition-colors",
            locale === item
              ? "bg-foreground text-background"
              : "text-muted hover:text-foreground",
          )}
        >
          {t(item)}
        </button>
      ))}
    </div>
  );
}
