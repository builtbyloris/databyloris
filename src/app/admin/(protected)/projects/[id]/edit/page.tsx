import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminDataError } from "@/components/admin/admin-data-error";
import { DeleteProjectButton } from "@/components/admin/delete-project-button";
import { ProjectForm } from "@/components/admin/project-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getAdminProjectById } from "@/lib/projects/admin-projects";
import type { ProjectDatabaseRow } from "@/types/project-database";

export const metadata: Metadata = {
  title: "Edit project | databyloris Admin",
};

export default async function EditAdminProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const [{ id }, { saved }] = await Promise.all([params, searchParams]);
  let project: ProjectDatabaseRow | null | undefined;

  try {
    project = await getAdminProjectById(id);
  } catch {
    project = undefined;
  }

  if (project === null) notFound();

  if (!project) {
    return <AdminDataError title="This project could not be loaded" />;
  }

  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-overline">Projects</p>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl sm:text-4xl">Edit project</h1>
            <Badge variant={project.status === "published" ? "success" : "warning"}>
              {project.status === "published" ? "Published" : "Draft"}
            </Badge>
          </div>
          <p className="text-text-secondary">{project.title}</p>
        </div>
        <DeleteProjectButton id={project.id} title={project.title} />
      </header>

      {saved ? (
        <p
          className="rounded-control border border-success/25 bg-success-subtle px-4 py-3 text-sm text-success"
          role="status"
        >
          {saved === "created" ? "Project created." : "Project changes saved."}
        </p>
      ) : null}

      <Card>
        <CardContent className="pt-5 sm:pt-6">
          <ProjectForm mode="edit" project={project} />
        </CardContent>
      </Card>
    </div>
  );
}
