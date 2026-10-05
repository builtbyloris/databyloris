import {getTranslations} from "next-intl/server";
import {ProjectCard} from "@/components/project-card";
import {Container, Section, buttonStyles} from "@/components/ui";
import {Link} from "@/i18n/navigation";
import type {Project} from "@/types";

export async function RecruiterMode({projects}: {projects: Project[]}) {
  const t = await getTranslations("Recruiter");
  const homeT = await getTranslations("Home.Hero");
  const selectedProjects = projects.some((project) => project.featured)
    ? projects.filter((project) => project.featured).slice(0, 3)
    : projects.slice(0, 3);
  const technologies = Array.from(new Set(projects.flatMap((project) => project.technologies)));

  return (
    <Section className="relative overflow-hidden py-14 sm:py-20 lg:py-24">
      <div className="data-grid pointer-events-none absolute inset-x-0 top-0 h-[24rem]" />
      <Container className="relative">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{t("eyebrow")}</p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.055em] sm:text-6xl">{t("title")}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">{t("intro")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/projects" className={buttonStyles({size: "lg", className: "w-full sm:w-auto"})}>
              {t("portfolioCta")} <span aria-hidden="true">→</span>
            </Link>
            <Link href="/" className={buttonStyles({variant: "secondary", size: "lg", className: "w-full sm:w-auto"})}>
              {t("exitCta")}
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-16">
          <div className="space-y-10">
            <section aria-labelledby="recruiter-profile-title">
              <h2 id="recruiter-profile-title" className="text-xl font-bold tracking-tight">{t("profileTitle")}</h2>
              <p className="mt-3 leading-7 text-muted">{homeT("description")}</p>
            </section>

            {technologies.length > 0 ? (
              <section aria-labelledby="recruiter-technologies-title">
                <h2 id="recruiter-technologies-title" className="text-xl font-bold tracking-tight">{t("technologiesTitle")}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{t("technologiesDescription")}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {technologies.map((technology) => <span key={technology} className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted">{technology}</span>)}
                </div>
              </section>
            ) : null}
          </div>

          <section aria-labelledby="recruiter-projects-title">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <h2 id="recruiter-projects-title" className="text-xl font-bold tracking-tight">{t("projectsTitle")}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{t("projectsDescription")}</p>
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{t("projectCount", {count: selectedProjects.length})}</span>
            </div>
            {selectedProjects.length > 0 ? (
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {selectedProjects.map((project, index) => <ProjectCard key={project.id} project={project} imagePriority={index === 0} variant="portfolio" />)}
              </div>
            ) : (
              <p className="mt-6 rounded-card border border-border bg-card p-6 text-sm text-muted">{t("noProjects")}</p>
            )}
          </section>
        </div>

        <div className="mt-16 border-t border-border pt-6 text-sm text-muted">
          <Link href="/" className="font-semibold text-primary-strong hover:text-primary">{t("exitLink")}</Link>
        </div>
      </Container>
    </Section>
  );
}
