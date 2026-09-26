import { notFound } from "next/navigation";

import { GenericProjectContent } from "@/components/projects/generic-project-content";
import { ProjectContentShell } from "@/components/projects/project-content-shell";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale, localizePath } from "@/i18n/config";
import { mergeProjectImplementation } from "@/lib/projects/project-adapter";
import { getProjectImplementation } from "@/lib/projects/project-implementations";
import { localizeProjectImplementation } from "@/lib/projects/localize-project-implementation";
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

  const dictionary = await getDictionary(lang);
  const implementation = getProjectImplementation(slug);

  if (!implementation) {
    return <GenericProjectContent dictionary={dictionary} project={project} />;
  }
  const localizedImplementation = localizeProjectImplementation(
    implementation,
    dictionary.spotify,
  );

  return (
    <ProjectContentShell
      dictionary={dictionary}
      project={mergeProjectImplementation(project, localizedImplementation)}
      projectPath={localizePath(lang, `/projects/${project.slug}`)}
      tour={localizedImplementation.tour}
    />
  );
}
