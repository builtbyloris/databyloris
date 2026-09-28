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
  ProjectDetailState,
  ProjectFinalCta,
  ProjectInsights,
} from "@/components/projects/detail";
import {Container} from "@/components/ui";
import type {AppLocale} from "@/i18n/routing";
import {localize} from "@/lib/localize";
import {getPublishedProjectWithDetailBySlug} from "@/lib/repositories/projects-repository";
import type {Project, ProjectDetail} from "@/types";

interface ProjectPageProps {
  params: Promise<{locale: AppLocale; slug: string}>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({params}: ProjectPageProps): Promise<Metadata> {
  const {locale, slug} = await params;

  try {
    const result = await getPublishedProjectWithDetailBySlug(slug, locale);
    return result ? {title: result.project.title, description: result.project.description} : {};
  } catch {
    return {};
  }
}

export default async function ProjectPage({params}: ProjectPageProps) {
  const {locale, slug} = await params;
  setRequestLocale(locale);

  let result;
  try {
    result = await getPublishedProjectWithDetailBySlug(slug, locale);
  } catch {
    return (
      <section className="relative overflow-hidden py-section">
        <div className="data-grid pointer-events-none absolute inset-x-0 top-0 h-[34rem]" />
        <Container className="relative max-w-4xl">
          <ProjectDetailState kind="error" retryHref={`/projects/${slug}`} />
        </Container>
      </section>
    );
  }

  if (!result) notFound();

  const {project, detail} = result;

  return (
    <>
      <section className="relative overflow-hidden pb-14 pt-10 sm:pb-20 sm:pt-14 lg:pt-16">
        <div className="data-grid pointer-events-none absolute inset-x-0 top-0 h-[34rem]" />
        <Container className="relative">
          <ProjectDetailHero project={project} locale={locale} updatedAt={detail?.updatedAt} />
        </Container>
      </section>
      {detail ? (
        <ProjectCaseStudy project={project} detail={detail} locale={locale} />
      ) : (
        <Container className="max-w-6xl">
          <ProjectDetailState kind="missing" />
          <ProjectFinalCta slug={project.slug} dashboardAvailable={Boolean(project.dashboardAvailable)} />
        </Container>
      )}
    </>
  );
}

async function ProjectCaseStudy({
  project,
  detail,
  locale,
}: {
  project: Project;
  detail: ProjectDetail;
  locale: AppLocale;
}) {
  const t = await getTranslations("ProjectDetail.sections");

  return (
    <>
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
