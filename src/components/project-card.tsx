import {getTranslations} from "next-intl/server";
import {Badge, Card} from "@/components/ui";
import {Link} from "@/i18n/navigation";
import type {Project} from "@/types";

export async function ProjectCard({project}: {project: Project}) {
  const t = await getTranslations("Home");
  const projectsT = await getTranslations("Projects");

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1">
      <div className="relative h-40 overflow-hidden border-b border-border bg-surface-raised">
        <div className="data-grid absolute inset-0" />
        <div className="brand-gradient absolute -right-12 -top-12 size-36 rounded-full opacity-20 blur-2xl" />
        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
          <span className="text-4xl font-black tracking-[-0.08em] text-foreground/10">0{project.id.at(-1)}</span>
          <Badge className="bg-surface/80">{project.category}</Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted">
          <span className={project.status === "published" ? "text-cyan" : "text-violet"}>●</span>
          {project.status === "published" ? projectsT("statusPublished") : projectsT("statusDraft")}
        </div>
        <h3 className="text-xl font-bold tracking-tight">{project.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-muted">{project.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.technologies.map((technology) => (
            <span key={technology} className="rounded-full bg-surface-raised px-2.5 py-1 text-xs text-muted">
              {technology}
            </span>
          ))}
        </div>
        <Link
          href={`/projects/${project.slug}`}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-strong"
        >
          {t("viewProject")} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </Card>
  );
}
