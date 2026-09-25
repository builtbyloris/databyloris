import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Admin | databyloris",
  description: "Manage databyloris projects and publishing.",
};

const summaries = [
  { label: "Projects", value: "—" },
  { label: "Published", value: "—" },
  { label: "Drafts", value: "—" },
];

export default function AdminPage() {
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
        <Badge variant="neutral">Project storage pending</Badge>
      </header>

      <section aria-labelledby="projects-heading" id="projects">
        <div className="mb-4 space-y-1">
          <h2 className="text-xl" id="projects-heading">
            Project summary
          </h2>
          <p className="text-sm text-text-muted">
            Placeholder values until project persistence is implemented.
          </p>
        </div>

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
      </section>
    </div>
  );
}
