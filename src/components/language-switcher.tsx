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
      className="language-switcher flex items-center gap-1"
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
            "language-switcher-option relative min-h-9 min-w-9 rounded-md px-2 text-[0.68rem] font-bold tracking-[0.12em] transition-colors",
            locale === item ? "text-foreground" : "text-muted hover:text-foreground",
          )}
        >
          {t(item)}
        </button>
      ))}
    </div>
  );
}
