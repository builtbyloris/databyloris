import {getTranslations} from "next-intl/server";
import {ProjectCard} from "@/components/project-card";
import {ProjectsEmptyState} from "@/components/projects/projects-empty-state";
import type {Project} from "@/types";

export async function ProjectsGrid({projects}: {projects: Project[]}) {
  const t = await getTranslations("Projects");

  return (
    <div className="mt-8 border-t border-border pt-7">
      <p className="mb-6 text-sm font-semibold text-muted" aria-live="polite">
        {t("results", {count: projects.length})}
      </p>
      {projects.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} imagePriority={index === 0} />
          ))}
        </div>
      ) : (
        <ProjectsEmptyState />
      )}
    </div>
  );
}
