"use client";

import {useTranslations} from "next-intl";

export type AdminSavePhase = "dirty" | "saving" | "saved" | "error" | "warning";

export function AdminSaveStatus({phase, detail, className = ""}: {
  phase: AdminSavePhase;
  detail?: string;
  className?: string;
}) {
  const t = useTranslations("Admin.common");
  const color = phase === "error" ? "text-red-600 dark:text-red-300"
    : phase === "warning" ? "text-amber-700 dark:text-amber-300"
      : phase === "dirty" ? "text-violet" : "text-muted";
  return <p role={phase === "error" ? "alert" : "status"} aria-live="polite" className={`text-sm font-semibold ${color} ${className}`}>
    {t(phase === "dirty" ? "unsaved" : phase)}{detail ? ` · ${detail}` : ""}
  </p>;
}
