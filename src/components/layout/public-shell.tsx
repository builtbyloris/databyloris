import type { ReactNode } from "react";

import type { Locale } from "@/i18n/config";
import type { PublicDictionary } from "@/i18n/types";

import { SiteFooter } from "./site-footer";
import { SiteNavbar } from "./site-navbar";

interface PublicShellProps {
  children: ReactNode;
  dictionary: PublicDictionary;
  locale: Locale;
}

export function PublicShell({ children, dictionary, locale }: PublicShellProps) {
  return (
    <div className="flex min-h-screen flex-col" lang={locale}>
      <SiteNavbar dictionary={dictionary} locale={locale} />
      <main className="flex min-w-0 flex-1 flex-col" id="main-content" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter dictionary={dictionary} locale={locale} />
    </div>
  );
}
