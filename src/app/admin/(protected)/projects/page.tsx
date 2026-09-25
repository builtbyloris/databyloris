import type { Metadata } from "next";

import { AdminDataError } from "@/components/admin/admin-data-error";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { listAdminProjects } from "@/lib/projects/admin-projects";
import type { ProjectDatabaseRow } from "@/types/project-database";

export const metadata: Metadata = {
  title: "Projects | databyloris Admin",
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string }>;
}) {
  const { deleted } = await searchParams;
  let projects: ProjectDatabaseRow[] | null = null;

  try {
    projects = await listAdminProjects();
  } catch {
    projects = null;
  }

  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-overline">Publishing</p>
          <h1 className="text-3xl sm:text-4xl">Projects</h1>
          <p className="text-text-secondary">
            Create, edit, and publish persisted project records.
          </p>
        </div>
        <ButtonLink href="/admin/projects/new">New project</ButtonLink>
      </header>

      {deleted === "1" ? (
        <p
          className="rounded-control border border-success/25 bg-success-subtle px-4 py-3 text-sm text-success"
          role="status"
        >
          Project deleted.
        </p>
      ) : null}

      {deleted === "cover-cleanup" ? (
        <p
          className="rounded-control border border-warning/25 bg-warning-subtle px-4 py-3 text-sm text-warning"
          role="status"
        >
          Project deleted, but its cover object could not be cleaned up. Review
          the project-covers bucket when convenient.
        </p>
      ) : null}

      {projects === null ? <AdminDataError /> : null}

      {projects?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-4 py-8 sm:py-10">
            <div className="space-y-1">
              <h2 className="text-xl">No stored projects yet</h2>
              <p className="text-sm text-text-secondary">
                Create the first Admin project record. Public catalog data will
                remain unchanged.
              </p>
            </div>
            <ButtonLink href="/admin/projects/new">New project</ButtonLink>
          </CardContent>
        </Card>
      ) : null}

      {projects && projects.length > 0 ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
              <thead className="bg-surface-secondary text-xs uppercase tracking-[0.08em] text-text-muted">
                <tr>
                  <th className="px-5 py-3 font-semibold" scope="col">Project</th>
                  <th className="px-5 py-3 font-semibold" scope="col">Category</th>
                  <th className="px-5 py-3 font-semibold" scope="col">Status</th>
                  <th className="px-5 py-3 font-semibold" scope="col">Updated</th>
                  <th className="px-5 py-3 text-right font-semibold" scope="col">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.map((project) => (
                  <tr key={project.id} className="bg-surface-primary">
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <p className="font-medium text-text-primary">{project.title}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {project.featured ? <Badge variant="accent">Featured</Badge> : null}
                          {project.demo ? <Badge variant="neutral">Demo</Badge> : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-text-secondary">{project.category}</td>
                    <td className="px-5 py-4">
                      <Badge variant={project.status === "published" ? "success" : "warning"}>
                        {project.status === "published" ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-text-secondary">
                      <time dateTime={project.updated_at}>
                        {dateFormatter.format(new Date(project.updated_at))}
                      </time>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <ButtonLink href={`/admin/projects/${project.id}/edit`} size="sm" variant="secondary">
                        Edit
                      </ButtonLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
