import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {ProjectCard} from "@/components/project-card";
import {RoutePlaceholder} from "@/components/route-placeholder";
import {projects} from "@/data/projects";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Projects");
  return {title: t("title"), description: t("description")};
}

export default async function ProjectsPage() {
  const t = await getTranslations("Projects");

  return (
    <RoutePlaceholder eyebrow={t("eyebrow")} title={t("title")} description={t("description")}>
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => <ProjectCard key={project.id} project={project} />)}
      </div>
    </RoutePlaceholder>
  );
}
