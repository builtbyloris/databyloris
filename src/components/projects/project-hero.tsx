import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import type { PublicProjectMetadata } from "@/types/project";
import type { PublicDictionary } from "@/i18n/types";

import { ProjectCoverImage } from "./project-cover-image";

interface ProjectHeroProps {
  project: PublicProjectMetadata;
  strings: PublicDictionary["project"]["hero"];
  coverStrings?: PublicDictionary["project"]["cover"];
  ctaHref?: string | null;
}

export function ProjectHero({ project, strings, coverStrings, ctaHref = "#explore" }: ProjectHeroProps) {
  return (
    <header className="max-w-3xl">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="accent">{project.category}</Badge>
        {project.demo ? <Badge>{strings.interactiveDemo}</Badge> : null}
      </div>

      <h1 className="mt-5">{project.title}</h1>
      {project.subtitle ? (
        <p className="mt-4 text-lg font-medium leading-7 text-text-primary sm:text-xl">
          {project.subtitle}
        </p>
      ) : null}

      {project.question ? (
        <div className="mt-8 border-l-2 border-accent pl-5">
          <p className="text-overline">{strings.mainQuestion}</p>
          <p className="mt-2 text-xl font-semibold leading-8 text-text-primary sm:text-2xl">
            {project.question}
          </p>
        </div>
      ) : null}

      <p className="text-lead mt-7 max-w-2xl">{project.description}</p>

      {project.coverUrl ? (
        <ProjectCoverImage
          className="mt-8 rounded-card border border-border shadow-elevated"
          coverUrl={project.coverUrl}
          priority
          sizes="(max-width: 1023px) 100vw, 720px"
          title={project.title}
          strings={coverStrings}
        />
      ) : null}

      {ctaHref ? (
        <div className="mt-8">
          <ButtonLink href={ctaHref} size="lg">
            {strings.startExploring}
            <span aria-hidden="true">↓</span>
          </ButtonLink>
        </div>
      ) : null}
    </header>
  );
}
