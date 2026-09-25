import type { Metadata } from "next";

import { AdminDataError } from "@/components/admin/admin-data-error";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminProjectCounts } from "@/lib/projects/admin-projects";
import type { AdminProjectCounts } from "@/types/project-database";

export const metadata: Metadata = {
  title: "Admin | databyloris",
  description: "Manage databyloris projects and publishing.",
};

export default async function AdminPage() {
  let counts: AdminProjectCounts | null = null;

  try {
    counts = await getAdminProjectCounts();
  } catch {
    counts = null;
  }

  const summaries = counts
    ? [
        { label: "Projects", value: counts.projects },
        { label: "Published", value: counts.published },
        { label: "Drafts", value: counts.drafts },
      ]
    : [];

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-overline">Overview</p>
          <h1 className="text-3xl sm:text-4xl">Admin</h1>
          <p className="max-w-2xl text-text-secondary">
            Manage databyloris projects and publishing.
          </p>
        </div>
        <ButtonLink href="/admin/projects/new">New project</ButtonLink>
      </header>

      <section aria-labelledby="projects-heading" id="projects">
        <div className="mb-4 space-y-1">
          <h2 className="text-xl" id="projects-heading">
            Project summary
          </h2>
          <p className="text-sm text-text-muted">
            Live values from persisted Admin project records.
          </p>
        </div>

        {counts ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {summaries.map((summary) => (
              <Card key={summary.label}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-text-secondary">
                    {summary.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold tracking-tight text-text-primary">
                    {summary.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <AdminDataError />
        )}

        <div className="mt-5 flex items-center gap-3">
          <ButtonLink href="/admin/projects" variant="secondary">
            Manage projects
          </ButtonLink>
          <Badge variant="neutral">Public catalog remains local</Badge>
        </div>
      </section>
    </div>
  );
}
