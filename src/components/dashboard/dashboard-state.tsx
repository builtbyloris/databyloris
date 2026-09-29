import {getTranslations} from "next-intl/server";
import {buttonStyles, Card, Container} from "@/components/ui";
import {Link} from "@/i18n/navigation";
import type {Project} from "@/types";
import {DashboardSidebar} from "./dashboard-sidebar";

type DashboardStateKind = "missing-config" | "missing-dataset" | "invalid-config" | "error";

export async function DashboardState({kind, project, retryHref}: {
  kind: DashboardStateKind;
  project?: Pick<Project, "slug" | "title">;
  retryHref?: `/projects/${string}/dashboard`;
}) {
  const t = await getTranslations("Dashboard");
  const state = kind === "missing-config" || kind === "missing-dataset" ? "preparing" : kind;

  return (
    <section className="relative min-h-[75vh] overflow-hidden py-8 sm:py-10 lg:py-12">
      <div className="data-grid pointer-events-none absolute inset-x-0 top-0 h-[26rem]" />
      <Container className="relative">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <Link href="/projects" className="font-medium hover:text-foreground">{t("breadcrumb.projects")}</Link>
          {project ? <><span aria-hidden="true">/</span><Link href={`/projects/${project.slug}`} className="font-medium hover:text-foreground">{project.title}</Link></> : null}
          <span aria-hidden="true">/</span>
          <span className="font-semibold text-foreground">{t("breadcrumb.dashboard")}</span>
        </div>
        <div className={`mt-8 grid gap-5 ${project ? "lg:grid-cols-[12rem_minmax(0,1fr)]" : ""} lg:gap-6`}>
          {project ? <DashboardSidebar slug={project.slug} /> : null}
          <Card className="flex min-h-72 flex-col items-center justify-center border-dashed p-8 text-center sm:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-strong">{t("eyebrow")}</p>
            <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">{t(`states.${state}.title`)}</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted">{t(`states.${kind}.description`)}</p>
            <Link href={kind === "error" ? retryHref ?? "/projects" : project ? `/projects/${project.slug}` : "/projects"} className={buttonStyles({variant: "secondary", className: "mt-6"})}>
              {t(kind === "error" ? "states.error.retry" : "states.backToProject")}
            </Link>
          </Card>
        </div>
      </Container>
    </section>
  );
}
