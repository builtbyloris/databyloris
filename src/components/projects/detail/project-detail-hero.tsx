import Image from "next/image";
import {getTranslations} from "next-intl/server";
import {Badge, Card, buttonStyles} from "@/components/ui";
import type {AppLocale} from "@/i18n/routing";
import {Link} from "@/i18n/navigation";
import type {Project} from "@/types";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4 fill-none stroke-current" strokeWidth="1.8">
      <path d="M4 10h12M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.82a9.6 9.6 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

export async function ProjectDetailHero({project, locale, updatedAt}: {project: Project; locale: AppLocale; updatedAt?: string}) {
  const t = await getTranslations("ProjectDetail");
  const displayDate = updatedAt ?? project.publishedAt;
  const date = displayDate
    ? new Intl.DateTimeFormat(locale, {day: "numeric", month: "short", year: "numeric"}).format(new Date(displayDate))
    : null;

  return (
    <div>
      <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-foreground">
        <span aria-hidden="true">←</span> {t("back")}
      </Link>
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.78fr)] lg:items-center lg:gap-14">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{project.category}</Badge>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted">
              <span className={project.status === "published" ? "text-cyan" : "text-violet"}>●</span>
              {t(`status.${project.status}`)}
            </span>
          </div>
          <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-[-0.05em] sm:text-5xl lg:text-6xl">
            {project.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
            {project.description}
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {project.technologies.map((technology) => (
              <span key={technology} className="rounded-full border border-border bg-surface/70 px-3 py-1.5 text-xs font-medium text-muted">
                {technology}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {project.dashboardAvailable ? (
              <Link href={`/projects/${project.slug}/dashboard`} className={buttonStyles({size: "lg", className: "w-full sm:w-auto"})}>
                {t("openDashboard")} <ArrowIcon />
              </Link>
            ) : null}
            {project.repositoryUrl ? (
              <a href={project.repositoryUrl} target="_blank" rel="noreferrer" className={buttonStyles({variant: "secondary", size: "lg", className: "w-full sm:w-auto"})}>
                <GithubIcon /> {t("viewRepository")}
              </a>
            ) : null}
          </div>
        </div>

        <Card className="min-w-0 overflow-hidden p-2.5 sm:p-3">
          <div className="relative isolate aspect-video overflow-hidden rounded-[calc(var(--radius-card-value)-0.3rem)] bg-surface-raised">
            <Image src={project.image} alt={t("coverAlt", {title: project.title})} fill priority sizes="(max-width: 1023px) 100vw, 42vw" className="rounded-[inherit] object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/75 via-transparent to-transparent" />
            <div className="absolute inset-x-5 bottom-5 flex items-end justify-end gap-4">
              {date ? (
                <span className="rounded-full border border-white/15 bg-background/75 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
                  {t("updated")} · {date}
                </span>
              ) : null}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
