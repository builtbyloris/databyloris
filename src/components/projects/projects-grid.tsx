import {ProjectCard} from "@/components/project-card";
import {ProjectsEmptyState} from "@/components/projects/projects-empty-state";
import {MotionReveal} from "@/components/ui/motion-reveal";
import type {Project} from "@/types";

export function ProjectsGrid({projects}: {projects: Project[]}) {
  return (
    <div className="portfolio-results mt-6 sm:mt-8">
      {projects.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <MotionReveal key={project.id} delay={Math.min(index, 5) * 0.07} className="min-w-0">
              <ProjectCard project={project} imagePriority={index === 0} variant="portfolio" />
            </MotionReveal>
          ))}
        </div>
      ) : (
        <ProjectsEmptyState />
      )}
    </div>
  );
}
