"use client";

import {useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";

export function DashboardSidebar({slug}: {slug: string}) {
  const t = useTranslations("Dashboard.navigation");
  const links = [
    {href: `/projects/${slug}` as const, label: t("overview")},
    {href: `/projects/${slug}/dashboard` as const, label: t("dashboard"), active: true},
    {href: `/projects/${slug}#dataset` as const, label: t("dataset")},
    {href: `/projects/${slug}#insights` as const, label: t("insights")},
  ];

  return (
    <aside className="lg:sticky lg:top-[6.5rem] lg:self-start">
      <nav aria-label={t("label")} className="flex gap-1 overflow-x-auto border-b border-border pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-col lg:border-b-0 lg:border-l lg:pb-0 lg:pl-3">
        {links.map((link) => (
          <Link key={link.href} href={link.href} aria-current={link.active ? "page" : undefined} className={`shrink-0 rounded-control px-3.5 py-2.5 text-sm font-semibold transition-colors ${link.active ? "bg-surface-raised text-foreground" : "text-muted hover:bg-surface-raised hover:text-foreground"}`}>
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
