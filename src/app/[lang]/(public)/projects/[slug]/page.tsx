import { notFound } from "next/navigation";

import { GenericProjectContent } from "@/components/projects/generic-project-content";
import { ProjectContentShell } from "@/components/projects/project-content-shell";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale, localizePath } from "@/i18n/config";
import { mergeProjectImplementation } from "@/lib/projects/project-adapter";
import { getProjectImplementation } from "@/lib/projects/project-implementations";
import { getPublishedProjectBySlug } from "@/lib/projects/public-projects";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const implementation = getProjectImplementation(slug);

  if (!implementation) {
    return <GenericProjectContent project={project} />;
  }

  const dictionary = await getDictionary(lang);

  return (
    <ProjectContentShell
      project={mergeProjectImplementation(project, implementation)}
      projectNavigationLabels={dictionary.projectNavigation}
      projectPath={localizePath(lang, `/projects/${project.slug}`)}
      tour={implementation.tour}
    />
  );
}
