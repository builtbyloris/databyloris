import {ProjectCard} from "@/components/project-card";
import {ProjectsEmptyState} from "@/components/projects/projects-empty-state";
import type {Project} from "@/types";

export function ProjectsGrid({projects}: {projects: Project[]}) {
  return (
    <div className="portfolio-results mt-6 sm:mt-8">
      {projects.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <div key={project.id} className="portfolio-grid-item min-w-0" style={{animationDelay: `${Math.min(index, 8) * 85}ms`}}>
              <ProjectCard project={project} imagePriority={index === 0} variant="portfolio" />
            </div>
          ))}
        </div>
      ) : (
        <ProjectsEmptyState />
      )}
    </div>
  );
}
