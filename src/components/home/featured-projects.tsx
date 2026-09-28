import {getTranslations} from "next-intl/server";
import {ProjectCard} from "@/components/project-card";
import {Card, Container, Section} from "@/components/ui";
import {Link} from "@/i18n/navigation";
import type {Project} from "@/types";

export async function FeaturedProjects({projects}: {projects: Project[]}) {
  const t = await getTranslations("Home.Featured");
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 3);

  return (
    <Section>
      <Container>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{t("eyebrow")}</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.045em] sm:text-5xl">{t("title")}</h2>
            <p className="mt-4 text-base leading-7 text-muted">{t("description")}</p>
          </div>
          <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-strong transition-colors hover:text-primary">
            {t("viewAll")} <span aria-hidden="true">→</span>
          </Link>
        </div>
        {featuredProjects.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project, index) => <ProjectCard key={project.id} project={project} ordinal={index + 1} />)}
          </div>
        ) : (
          <Card className="mt-10 p-8 text-center sm:p-10">
            <h3 className="text-xl font-bold">{t("emptyTitle")}</h3>
            <p className="mt-2 text-sm text-muted">{t("emptyDescription")}</p>
          </Card>
        )}
      </Container>
    </Section>
  );
}
