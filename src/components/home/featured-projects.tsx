import {getTranslations} from "next-intl/server";
import {ProjectCard} from "@/components/project-card";
import {Container, Section} from "@/components/ui";
import {projects} from "@/data/projects";
import {Link} from "@/i18n/navigation";

export async function FeaturedProjects() {
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
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
        </div>
      </Container>
    </Section>
  );
}
