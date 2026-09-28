import type {Metadata} from "next";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {
  DashboardPreview,
  DatasetSummaryCard,
  MethodologySteps,
  ProjectDetailHero,
  ProjectDetailNav,
  ProjectDetailSection,
  ProjectFinalCta,
  ProjectInsights,
} from "@/components/projects/detail";
import {Container} from "@/components/ui";
import {getProjectBySlug, projects} from "@/data/projects";
import type {AppLocale} from "@/i18n/routing";
import {localize} from "@/lib/localize";

interface ProjectPageProps {
  params: Promise<{locale: AppLocale; slug: string}>;
}

export function generateStaticParams() {
  return projects.map(({slug}) => ({slug}));
}

export async function generateMetadata({params}: ProjectPageProps): Promise<Metadata> {
  const {locale, slug} = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  const contentT = await getTranslations({locale, namespace: "ProjectContent"});
  return {title: project.title, description: contentT(`${project.slug}.description`)};
}

export default async function ProjectPage({params}: ProjectPageProps) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const project = getProjectBySlug(slug);
  if (!project?.detail) notFound();
  const t = await getTranslations("ProjectDetail.sections");
  const detail = project.detail;

  return (
    <>
      <section className="relative overflow-hidden pb-14 pt-10 sm:pb-20 sm:pt-14 lg:pt-16">
        <div className="data-grid pointer-events-none absolute inset-x-0 top-0 h-[34rem]" />
        <Container className="relative">
          <ProjectDetailHero project={project} locale={locale} />
        </Container>
      </section>
      <ProjectDetailNav />
      <Container className="max-w-6xl">
        <ProjectDetailSection id="overview" eyebrow="01" title={t("overview.title")}>
          <p className="max-w-3xl text-lg leading-8 text-muted">{localize(detail.context, locale)}</p>
        </ProjectDetailSection>
        <ProjectDetailSection id="dataset" eyebrow="02" title={t("dataset.title")}>
          <DatasetSummaryCard dataset={detail.dataset} locale={locale} />
        </ProjectDetailSection>
        <ProjectDetailSection id="objective" eyebrow="03" title={t("objective.title")}>
          <p className="max-w-3xl text-lg leading-8 text-muted">{localize(detail.objective, locale)}</p>
        </ProjectDetailSection>
        <ProjectDetailSection id="methodology" eyebrow="04" title={t("methodology.title")}>
          <MethodologySteps steps={detail.methodology} locale={locale} />
        </ProjectDetailSection>
        <ProjectDetailSection id="insights" eyebrow="05" title={t("insights.title")}>
          <ProjectInsights insights={detail.insights} locale={locale} />
        </ProjectDetailSection>
        {project.dashboardAvailable ? <DashboardPreview slug={project.slug} /> : null}
        <ProjectFinalCta slug={project.slug} dashboardAvailable={Boolean(project.dashboardAvailable)} />
      </Container>
    </>
  );
}
