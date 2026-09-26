import Link from "next/link";

import { localizePath, type Locale } from "@/i18n/config";
import type { PublicDictionary } from "@/i18n/types";

import { PUBLIC_NAV_ITEMS } from "./navigation";

interface SiteFooterProps {
  dictionary: PublicDictionary;
  locale: Locale;
}

export function SiteFooter({ dictionary, locale }: SiteFooterProps) {
  const currentYear = new Date().getFullYear();
  const navItems = PUBLIC_NAV_ITEMS.map((item) => ({
    href: localizePath(locale, item.href),
    label: dictionary.navigation[item.labelKey],
  }));

  return (
    <footer className="border-t border-border bg-surface-primary">
      <div className="container-page flex flex-col gap-6 py-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-md space-y-2">
          <Link
            className="inline-block rounded-control font-semibold tracking-tight text-text-primary hover:text-accent"
            href={localizePath(locale, "/")}
          >
            data<span className="text-accent">byloris</span>
          </Link>
          <p className="text-sm leading-6 text-text-secondary">
            {dictionary.footer.description}
          </p>
          <p className="text-xs text-text-muted">© {currentYear} databyloris</p>
        </div>

        <nav aria-label={dictionary.footer.navigationLabel}>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  className="rounded-control text-sm text-text-secondary hover:text-accent"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
