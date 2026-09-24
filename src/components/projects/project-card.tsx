import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ProjectCoverType, ProjectSummary } from "@/types/project";

interface ProjectCardProps {
  project: ProjectSummary;
}

const coverLabels: Record<ProjectCoverType, string> = {
  listening: "Listening signals",
  catalog: "Catalog composition",
  market: "Market movement",
  geography: "Travel flows",
  economy: "Digital adoption",
};

const coverPaths: Record<ProjectCoverType, string> = {
  listening: "M0 90C35 82 52 57 84 65C116 73 130 42 165 49C198 56 224 25 280 18",
  catalog: "M0 76C39 79 58 48 94 55C129 62 152 71 185 52C219 32 237 42 280 22",
  market: "M0 92C36 90 53 81 84 72C116 63 139 75 171 51C204 27 228 47 280 21",
  geography: "M0 82C32 48 59 73 91 54C124 34 146 75 178 56C214 35 242 54 280 25",
  economy: "M0 94C31 88 55 92 86 71C118 49 144 61 176 43C211 23 242 40 280 16",
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

export function ProjectCard({ project }: ProjectCardProps) {
  const href = project.status === "published" ? project.href : undefined;

  return (
    <article className="h-full">
      <Card className="flex h-full flex-col overflow-hidden" surface="primary">
        <ProjectCover coverType={project.coverType} />

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="accent">{project.category}</Badge>
            {project.demo ? <Badge>Interactive demo</Badge> : null}
            {project.status === "upcoming" ? (
              <Badge variant="warning">Upcoming</Badge>
            ) : null}
          </div>

          <h2 className="text-xl font-semibold tracking-tight text-text-primary">
            {project.title}
          </h2>
          <p className="mt-3 text-sm font-medium leading-6 text-text-primary">
            {project.question}
          </p>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            {project.description}
          </p>

          <div className="mt-5 border-t border-border pt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
              {project.period}
            </p>
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
          </div>

          <div className="mt-auto pt-6">
            {href ? (
              <ButtonLink
                aria-label={`Explore ${project.title}`}
                className="w-full"
                href={href}
              >
                Explore project
                <span aria-hidden="true">→</span>
              </ButtonLink>
            ) : (
              <Button className="w-full" disabled variant="secondary">
                Coming soon
              </Button>
            )}
          </div>
        </div>
      </Card>
    </article>
  );
}
