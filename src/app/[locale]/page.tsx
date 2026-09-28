import {getTranslations} from "next-intl/server";
import {ProjectCard} from "@/components/project-card";
import {Badge, Card, Container, Section, buttonStyles} from "@/components/ui";
import {projects} from "@/data/projects";
import {Link} from "@/i18n/navigation";

export default async function HomePage() {
  const t = await getTranslations("Home");
  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <>
      <Section className="relative overflow-hidden pb-16 pt-20 sm:pt-28 lg:pb-24 lg:pt-36">
        <div className="data-grid pointer-events-none absolute inset-0" />
        <Container className="relative grid items-center gap-14 lg:grid-cols-[1.12fr_0.88fr]">
          <div className="max-w-3xl">
            <Badge>{t("eyebrow")}</Badge>
            <h1 className="mt-7 text-5xl font-black leading-[0.98] tracking-[-0.055em] sm:text-7xl lg:text-[5.4rem]">
              {t("title").split(" ").slice(0, 4).join(" ")} {" "}
              <span className="text-gradient">{t("title").split(" ").slice(4).join(" ")}</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted">{t("description")}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/projects" className={buttonStyles({size: "lg"})}>
                {t("primaryCta")} <span aria-hidden="true">→</span>
              </Link>
              <Link href="/playground" className={buttonStyles({variant: "secondary", size: "lg"})}>
                {t("secondaryCta")}
              </Link>
            </div>
          </div>

          <Card className="relative overflow-hidden p-3 sm:p-4">
            <div className="relative min-h-[25rem] overflow-hidden rounded-[calc(var(--radius-card-value)-0.25rem)] bg-surface-raised p-6 sm:p-8">
              <div className="data-grid absolute inset-0" />
              <div className="brand-gradient absolute -right-16 -top-12 size-56 rounded-full opacity-20 blur-3xl" />
              <div className="relative flex h-full min-h-[21rem] flex-col justify-between">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">{t("panelLabel")}</p>
                    <p className="mt-3 max-w-xs text-2xl font-bold tracking-tight">{t("panelTitle")}</p>
                  </div>
                  <div className="rounded-card border border-border bg-card p-4 text-right backdrop-blur">
                    <p className="text-3xl font-black tracking-tight text-primary">{t("signalValue")}</p>
                    <p className="mt-1 text-[0.65rem] uppercase tracking-wider text-muted">{t("signalLabel")}</p>
                  </div>
                </div>
                <div>
                  <div className="flex h-36 items-end gap-2" aria-hidden="true">
                    {[44, 62, 48, 78, 58, 88, 70, 96, 82, 100].map((height, index) => (
                      <span
                        key={index}
                        className="brand-gradient flex-1 rounded-t-md opacity-75"
                        style={{height: `${height}%`}}
                      />
                    ))}
                  </div>
                  <p className="mt-5 max-w-md text-sm leading-6 text-muted">{t("panelDescription")}</p>
                </div>
              </div>
            </div>
          </Card>
        </Container>
      </Section>

      <Section className="border-t border-border bg-surface/35">
        <Container>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{t("featuredEyebrow")}</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-5xl">{t("featuredTitle")}</h2>
              <p className="mt-4 leading-7 text-muted">{t("featuredDescription")}</p>
            </div>
            <Link href="/projects" className="text-sm font-semibold text-primary-strong">
              {t("viewAll")} <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
