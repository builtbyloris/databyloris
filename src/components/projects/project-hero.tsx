import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import type { PublicProjectMetadata } from "@/types/project";

interface ProjectHeroProps {
  project: PublicProjectMetadata;
  ctaHref?: string | null;
}

export function ProjectHero({ project, ctaHref = "#explore" }: ProjectHeroProps) {
  return (
    <header className="max-w-3xl">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="accent">{project.category}</Badge>
        {project.demo ? <Badge>Interactive demo</Badge> : null}
      </div>

      <h1 className="mt-5">{project.title}</h1>
      {project.subtitle ? (
        <p className="mt-4 text-lg font-medium leading-7 text-text-primary sm:text-xl">
          {project.subtitle}
        </p>
      ) : null}

      {project.question ? (
        <div className="mt-8 border-l-2 border-accent pl-5">
          <p className="text-overline">Main question</p>
          <p className="mt-2 text-xl font-semibold leading-8 text-text-primary sm:text-2xl">
            {project.question}
          </p>
        </div>
      ) : null}

      <p className="text-lead mt-7 max-w-2xl">{project.description}</p>

      {ctaHref ? (
        <div className="mt-8">
          <ButtonLink href={ctaHref} size="lg">
            Start exploring
            <span aria-hidden="true">↓</span>
          </ButtonLink>
        </div>
      ) : null}
    </header>
  );
}
