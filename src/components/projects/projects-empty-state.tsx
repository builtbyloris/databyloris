import {getTranslations} from "next-intl/server";
import {buttonStyles} from "@/components/ui";
import {Link} from "@/i18n/navigation";

export async function ProjectsEmptyState() {
  const t = await getTranslations("Projects");

  return (
    <div className="data-grid relative overflow-hidden rounded-card border border-border bg-surface-raised px-6 py-16 text-center sm:py-20">
      <div className="relative mx-auto max-w-md">
        <span className="mx-auto grid size-12 place-items-center rounded-full border border-primary/20 bg-primary/10 text-primary">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4 4M8.5 11h5" />
          </svg>
        </span>
        <h2 className="mt-5 text-2xl font-bold tracking-tight">{t("emptyTitle")}</h2>
        <p className="mt-3 text-sm leading-6 text-muted">{t("emptyDescription")}</p>
        <Link href="/projects" className={buttonStyles({variant: "secondary", className: "mt-6"})}>
          {t("resetFilters")}
        </Link>
      </div>
    </div>
  );
}
