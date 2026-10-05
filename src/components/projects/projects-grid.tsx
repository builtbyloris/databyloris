import {ProjectCard} from "@/components/project-card";
import {ProjectsEmptyState} from "@/components/projects/projects-empty-state";
import type {Project} from "@/types";

export function ProjectsGrid({projects}: {projects: Project[]}) {
  return (
    <div className="mt-6 sm:mt-8">
      {projects.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} imagePriority={index === 0} variant="portfolio" />
          ))}
        </div>
      ) : (
        <ProjectsEmptyState />
      )}
    </div>
  );
}
