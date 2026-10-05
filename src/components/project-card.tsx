import Image from "next/image";
import {getTranslations} from "next-intl/server";
import {Badge, Card} from "@/components/ui";
import {Link} from "@/i18n/navigation";
import {cn} from "@/lib/cn";
import type {Project} from "@/types";

export async function ProjectCard({
  project,
  imagePriority = false,
  ordinal,
  variant = "featured",
}: {
  project: Project;
  imagePriority?: boolean;
  ordinal?: number;
  variant?: "featured" | "portfolio";
}) {
  const t = await getTranslations("Home.Featured");
  const projectsT = await getTranslations("Projects");
  const isPortfolio = variant === "portfolio";

  return (
    <Link
      href={`/projects/${project.slug}`}
      aria-label={`${t("viewProject")}: ${project.title}`}
      className="group block h-full rounded-card focus-visible:outline-offset-4"
    >
      <Card className={cn(
        "flex h-full flex-col overflow-hidden group-hover:border-primary/30",
        isPortfolio ? "transition-colors" : "transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-soft",
      )}>
        <div className="relative aspect-[16/9] overflow-hidden border-b border-border bg-surface-raised">
          <Image
            src={project.image}
            alt={project.title}
            fill
            loading={imagePriority ? "eager" : "lazy"}
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className={cn("object-cover", !isPortfolio && "transition-transform duration-500 group-hover:scale-[1.025]")}
          />
          {!isPortfolio ? <div className="absolute inset-0 bg-gradient-to-t from-background/75 via-transparent to-transparent" /> : null}
          <div className={isPortfolio
            ? "absolute bottom-4 right-4"
            : "absolute inset-x-5 bottom-5 flex items-end justify-between gap-4"}>
            {!isPortfolio ? <span className="text-4xl font-black tracking-[-0.08em] text-white/35">{ordinal ? String(ordinal).padStart(2, "0") : ""}</span> : null}
            <Badge className="border-white/15 bg-admin-sidebar/90 text-white">{project.category}</Badge>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-6">
          {!isPortfolio ? (
            <div className="mb-4 flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted">
              <span className={project.status === "published" ? "text-cyan" : "text-violet"}>●</span>
              {project.status === "published" ? projectsT("statusPublished") : projectsT("statusDraft")}
            </div>
          ) : null}
          <h3 className="text-xl font-bold tracking-tight">{project.title}</h3>
          <p className="mt-2 flex-1 text-sm leading-6 text-muted">{project.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.technologies.map((technology) => (
              <span key={technology} className={cn("rounded-full px-2.5 py-1 text-xs text-muted", isPortfolio ? "border border-border" : "bg-surface-raised")}>
                {technology}
              </span>
            ))}
          </div>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-strong">
            {t("viewProject")} <span aria-hidden="true">→</span>
          </span>
        </div>
      </Card>
    </Link>
  );
}
