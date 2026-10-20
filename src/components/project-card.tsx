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
  const isPortfolio = variant === "portfolio";

  return (
    <Link
      href={`/projects/${project.slug}`}
      aria-label={`${t("viewProject")}: ${project.title}`}
      className="group block h-full rounded-card focus-visible:outline-offset-4"
    >
      <Card className="flex h-full flex-col overflow-hidden transition-[border-color,box-shadow,transform] duration-300 ease-out group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:shadow-card motion-reduce:transform-none">
        <div className={cn("relative aspect-[16/9] overflow-hidden border-b border-border bg-surface-raised", isPortfolio && "portfolio-card-cover")}>
          <Image
            src={project.image}
            alt={project.title}
            fill
            loading={imagePriority ? "eager" : "lazy"}
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025] motion-reduce:transform-none"
          />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <Badge>{project.category}</Badge>
            {!isPortfolio && ordinal ? <span className="site-overline text-muted">{String(ordinal).padStart(2, "0")}</span> : null}
          </div>
          <h3 className="font-editorial text-2xl leading-tight sm:text-3xl">{project.title}</h3>
          <p className="mt-2 flex-1 text-sm leading-6 text-muted">{project.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.technologies.map((technology) => (
              <span key={technology} className={cn("rounded-full px-2.5 py-1 text-xs text-muted", isPortfolio ? "border border-border" : "bg-surface-raised")}>
                {technology}
              </span>
            ))}
          </div>
          <span className="mt-6 inline-flex items-center gap-2 border-t border-border pt-4 text-sm font-semibold text-primary-strong">
            {t("viewProject")} <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none">→</span>
          </span>
        </div>
      </Card>
    </Link>
  );
}
