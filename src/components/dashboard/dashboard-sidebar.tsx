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
      <nav aria-label={t("label")} className="flex gap-2 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-col lg:overflow-visible lg:pb-0">
        {links.map((link) => (
          <Link key={link.href} href={link.href} aria-current={link.active ? "page" : undefined} data-active={Boolean(link.active)} className="dashboard-nav-link shrink-0">
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
