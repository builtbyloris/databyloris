"use client";

import {useCallback} from "react";
import {useLocale, useTranslations} from "next-intl";
import {resolveDashboardText} from "@/lib/dashboard/dashboard-text";
import type {DashboardText} from "@/types";

export function useDashboardText() {
  const locale = useLocale();
  const t = useTranslations("Dashboard");

  return useCallback(
    (value: DashboardText | null | undefined) => resolveDashboardText(value, locale, {
      has: (key) => t.has(key),
      translate: (key) => t(key),
    }),
    [locale, t],
  );
}
