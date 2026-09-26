import { notFound } from "next/navigation";

import { ProjectCatalog } from "@/components/projects/project-catalog";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale } from "@/i18n/config";
import { listPublishedProjects } from "@/lib/projects/public-projects";

export default async function ExplorePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);
  const projects = await listPublishedProjects();

  return (
    <div className="container-dashboard page-frame">
      <header className="max-w-3xl">
        <p className="text-overline">{dictionary.explore.eyebrow}</p>
        <h1 className="mt-4">{dictionary.explore.title}</h1>
        <p className="text-lead mt-5">
          {dictionary.explore.description}
        </p>
      </header>

      <ProjectCatalog
        locale={lang}
        projects={projects}
        strings={dictionary.explore.catalog}
      />
    </div>
  );
}
