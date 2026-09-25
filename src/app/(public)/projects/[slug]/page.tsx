import { notFound } from "next/navigation";

import { GenericProjectContent } from "@/components/projects/generic-project-content";
import { ProjectContentShell } from "@/components/projects/project-content-shell";
import { mergeProjectImplementation } from "@/lib/projects/project-adapter";
import { getProjectImplementation } from "@/lib/projects/project-implementations";
import { getPublishedProjectBySlug } from "@/lib/projects/public-projects";

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const implementation = getProjectImplementation(slug);

  if (!implementation) {
    return <GenericProjectContent project={project} />;
  }

  return (
    <ProjectContentShell
      project={mergeProjectImplementation(project, implementation)}
      tour={implementation.tour}
    />
  );
}
