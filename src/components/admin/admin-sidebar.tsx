"use client";

import {useTranslations} from "next-intl";
import type {AdminView} from "@/types";

const items: {id: AdminView; icon: string}[] = [
  {id: "overview", icon: "◫"},
  {id: "projects", icon: "◇"},
  {id: "builder", icon: "⌁"},
  {id: "media", icon: "▧"},
];

export function AdminSidebar({view, onChange}: {view: AdminView; onChange: (view: AdminView) => void}) {
  const t = useTranslations("Admin.nav");
  return (
    <aside className="rounded-card border border-border bg-admin-sidebar p-3 text-white shadow-card lg:sticky lg:top-24 lg:min-h-[34rem] lg:p-4">
      <div className="mb-4 hidden border-b border-white/10 px-3 pb-5 lg:block">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan">databyloris</p>
        <p className="mt-2 text-sm text-white/60">{t("workspace")}</p>
      </div>
      <nav aria-label={t("label")} className="flex gap-2 overflow-x-auto lg:flex-col">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            aria-current={view === item.id ? "page" : undefined}
            className={`flex min-w-max items-center gap-3 rounded-control px-3 py-2.5 text-left text-sm font-semibold transition-colors lg:w-full ${view === item.id ? "bg-white/12 text-white" : "text-white/60 hover:bg-white/7 hover:text-white"}`}
          >
            <span aria-hidden="true" className="w-4 text-center text-cyan">{item.icon}</span>
            {t(item.id)}
          </button>
        ))}
      </nav>
      <div className="mt-6 hidden rounded-control border border-white/10 bg-white/5 p-3 text-xs leading-5 text-white/55 lg:block">
        {t("sessionNote")}
      </div>
    </aside>
  );
}
