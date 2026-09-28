import {getTranslations} from "next-intl/server";
import {Card, buttonStyles} from "@/components/ui";
import {Link} from "@/i18n/navigation";

export async function DashboardPreview({slug}: {slug: string}) {
  const t = await getTranslations("ProjectDetail.dashboard");

  return (
    <section className="py-14 sm:py-20">
      <Card className="overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1fr] lg:items-center lg:gap-14">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet">{t("eyebrow")}</p>
            <h2 className="mt-3 text-2xl font-bold tracking-[-0.035em] sm:text-3xl">{t("title")}</h2>
            <p className="mt-4 text-base leading-7 text-muted">{t("description")}</p>
            <Link href={`/projects/${slug}/dashboard`} className={buttonStyles({className: "mt-7 w-full sm:w-auto"})}>
              {t("action")} <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div role="img" aria-label={t("previewLabel")} className="data-grid relative min-h-72 overflow-hidden rounded-card border border-border bg-surface-raised p-5 shadow-soft sm:p-6">
            <div className="grid grid-cols-3 gap-3">
              {["67.8M", "24", "+12.4%"].map((value, index) => (
                <div key={value} className="rounded-control border border-border bg-card p-3">
                  <div className="h-1.5 w-10 rounded-full bg-primary/25" />
                  <p className="mt-3 text-sm font-bold sm:text-base">{value}</p>
                  <p className="mt-1 text-[0.6rem] uppercase tracking-wider text-muted">KPI 0{index + 1}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex h-36 items-end gap-2 rounded-control border border-border bg-card p-4">
              {[38, 62, 48, 78, 58, 91, 72, 84].map((height, index) => (
                <div key={`${height}-${index}`} className="brand-gradient flex-1 rounded-t-sm opacity-75" style={{height: `${height}%`}} />
              ))}
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
