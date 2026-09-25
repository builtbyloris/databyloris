import type { Metadata } from "next";

import { ProjectForm } from "@/components/admin/project-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "New project | databyloris Admin",
};

export default function NewAdminProjectPage() {
  return (
    <div className="space-y-7">
      <header className="space-y-2">
        <p className="text-overline">Projects</p>
        <h1 className="text-3xl sm:text-4xl">New project</h1>
        <p className="max-w-2xl text-text-secondary">
          Create a persisted project record for the Admin workflow.
        </p>
      </header>
      <Card>
        <CardContent className="pt-5 sm:pt-6">
          <ProjectForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
