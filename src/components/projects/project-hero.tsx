import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import type { ProjectDetail } from "@/types/project";

interface ProjectHeroProps {
  project: ProjectDetail;
}

export function ProjectHero({ project }: ProjectHeroProps) {
  return (
    <header className="max-w-3xl">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="accent">{project.category}</Badge>
        {project.demo ? <Badge>Interactive demo</Badge> : null}
      </div>

      <h1 className="mt-5">{project.title}</h1>
      <p className="mt-4 text-lg font-medium leading-7 text-text-primary sm:text-xl">
        {project.subtitle}
      </p>

      <div className="mt-8 border-l-2 border-accent pl-5">
        <p className="text-overline">Main question</p>
        <p className="mt-2 text-xl font-semibold leading-8 text-text-primary sm:text-2xl">
          {project.question}
        </p>
      </div>

      <p className="text-lead mt-7 max-w-2xl">{project.description}</p>

      <div className="mt-8">
        <ButtonLink href="#explore" size="lg">
          Start exploring
          <span aria-hidden="true">↓</span>
        </ButtonLink>
      </div>
    </header>
  );
}
