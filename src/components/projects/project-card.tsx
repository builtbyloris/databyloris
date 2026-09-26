import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { localizePath, type Locale } from "@/i18n/config";
import type { PublicDictionary } from "@/i18n/types";
import type { ProjectCoverType, ProjectSummary } from "@/types/project";

import { ProjectCoverImage } from "./project-cover-image";

interface ProjectCardProps {
  locale: Locale;
  project: ProjectSummary;
  strings: PublicDictionary["explore"]["catalog"];
}

const coverLabels: Record<ProjectCoverType, string> = {
  listening: "Listening signals",
  catalog: "Catalog composition",
  market: "Market movement",
  geography: "Travel flows",
  economy: "Digital adoption",
  generic: "Data signals",
};

const coverPaths: Record<ProjectCoverType, string> = {
  listening: "M0 90C35 82 52 57 84 65C116 73 130 42 165 49C198 56 224 25 280 18",
  catalog: "M0 76C39 79 58 48 94 55C129 62 152 71 185 52C219 32 237 42 280 22",
  market: "M0 92C36 90 53 81 84 72C116 63 139 75 171 51C204 27 228 47 280 21",
  geography: "M0 82C32 48 59 73 91 54C124 34 146 75 178 56C214 35 242 54 280 25",
  economy: "M0 94C31 88 55 92 86 71C118 49 144 61 176 43C211 23 242 40 280 16",
  generic: "M0 88C34 74 55 81 88 62C120 44 148 70 181 48C215 26 244 43 280 24",
};

function ProjectCover({ coverType }: { coverType: ProjectCoverType }) {
  return (
    <div aria-hidden="true" className="border-b border-border bg-surface-secondary p-5">
      <div className="mb-6 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">
          {coverLabels[coverType]}
        </span>
        <span className="size-2 rounded-full bg-accent" />
      </div>
      <svg className="h-auto w-full" viewBox="0 0 280 110">
        <path
          className="text-border"
          d="M0 20H280M0 55H280M0 90H280"
          fill="none"
          stroke="currentColor"
          strokeDasharray="3 6"
        />
        <path
          className="text-accent-subtle"
          d={`${coverPaths[coverType]}V110H0Z`}
          fill="currentColor"
        />
        <path
          className="text-accent"
          d={coverPaths[coverType]}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
}

export function ProjectCard({ locale, project, strings }: ProjectCardProps) {
  const href = localizePath(
    locale,
    project.href ?? `/projects/${project.slug}`,
  );

  return (
    <article className="h-full">
      <Card className="flex h-full flex-col overflow-hidden" surface="primary">
        {project.coverUrl ? (
          <ProjectCoverImage
            className="border-b border-border"
            coverUrl={project.coverUrl}
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
            title={project.title}
          />
        ) : (
          <ProjectCover coverType={project.coverType} />
        )}

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="accent">{project.category}</Badge>
            {project.demo ? <Badge>{strings.interactiveDemo}</Badge> : null}
          </div>

          <h2 className="text-xl font-semibold tracking-tight text-text-primary">
            {project.title}
          </h2>
          {project.question ? (
            <p className="mt-3 text-sm font-medium leading-6 text-text-primary">
              {project.question}
            </p>
          ) : null}
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            {project.description}
          </p>

          {project.period || project.tags.length > 0 ? (
            <div className="mt-5 border-t border-border pt-4">
              {project.period ? (
                <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  {project.period}
                </p>
              ) : null}
              {project.tags.length > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-2" aria-label={`${project.title} tags`}>
                  {project.tags.map((tag) => (
                    <li
                      className="rounded-badge bg-surface-secondary px-2 py-1 text-xs text-text-secondary"
                      key={tag}
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          <div className="mt-auto pt-6">
            <ButtonLink
              aria-label={`${strings.exploreProjectAriaPrefix} ${project.title}`}
              className="w-full"
              href={href}
            >
              {strings.exploreProject}
              <span aria-hidden="true">→</span>
            </ButtonLink>
          </div>
        </div>
      </Card>
    </article>
  );
}
