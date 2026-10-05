import {getTranslations} from "next-intl/server";
import {buttonStyles} from "@/components/ui";
import {Link} from "@/i18n/navigation";

export async function DashboardPreview({slug}: {slug: string}) {
  const t = await getTranslations("ProjectDetail.dashboard");

  return (
    <section className="py-12 sm:py-16">
      <div className="grid gap-6 border-y border-border py-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:py-10">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet">{t("eyebrow")}</p>
          <h2 className="mt-3 text-2xl font-bold tracking-[-0.035em] sm:text-3xl">{t("title")}</h2>
          <p className="mt-3 text-base leading-7 text-muted">{t("description")}</p>
        </div>
        <Link href={`/projects/${slug}/dashboard`} className={buttonStyles({size: "lg", className: "w-full sm:w-auto"})}>
          {t("action")} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
