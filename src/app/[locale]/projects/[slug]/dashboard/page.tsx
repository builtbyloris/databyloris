import {getTranslations} from "next-intl/server";
import {notFound} from "next/navigation";
import {RoutePlaceholder} from "@/components/route-placeholder";
import {Card} from "@/components/ui";
import {getProjectBySlug} from "@/data/projects";

interface DashboardPageProps {
  params: Promise<{slug: string}>;
}

export default async function DashboardPage({params}: DashboardPageProps) {
  const project = getProjectBySlug((await params).slug);
  if (!project) notFound();
  const t = await getTranslations("Dashboard");

  return (
    <RoutePlaceholder
      eyebrow={`${t("eyebrow")} · ${project.title}`}
      title={t("title")}
      description={t("description")}
    >
      <div className="mt-12 grid gap-5 lg:grid-cols-4">
        {[t("kpi"), t("kpi"), t("kpi")].map((label, index) => (
          <Card key={index} className="min-h-32 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label} {index + 1}</p>
            <div className="mt-5 h-7 w-24 animate-pulse rounded-md bg-primary/15" />
          </Card>
        ))}
        <Card className="min-h-32 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">{t("filters")}</p>
          <div className="mt-5 h-7 w-full rounded-md border border-border bg-surface-raised" />
        </Card>
        <Card className="lg:col-span-4 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">{t("chart")}</p>
          <div className="data-grid mt-5 min-h-72 rounded-card border border-border bg-surface-raised" />
        </Card>
      </div>
    </RoutePlaceholder>
  );
}
