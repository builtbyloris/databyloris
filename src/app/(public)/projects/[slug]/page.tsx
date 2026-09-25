import { notFound } from "next/navigation";

import { ProjectContentShell } from "@/components/projects/project-content-shell";
import { getPublishedProjectBySlug, PUBLISHED_PROJECTS } from "@/data/projects";

export function generateStaticParams() {
  return PUBLISHED_PROJECTS.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getPublishedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <ProjectContentShell project={project} />;
}
