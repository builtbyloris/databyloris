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
import {DEFAULT_PROJECT_IMAGE} from "@/lib/project-media";
import {getPublishedProjectWithDetailBySlug} from "@/lib/repositories/projects-repository";
import {createLocalizedMetadata, getAbsoluteUrl, getSiteUrl, serializeJsonLd} from "@/lib/seo";
import type {Project, ProjectDetail} from "@/types";

interface ProjectPageProps {
  params: Promise<{locale: AppLocale; slug: string}>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({params}: ProjectPageProps): Promise<Metadata> {
  const {locale, slug} = await params;

  try {
    const result = await getPublishedProjectWithDetailBySlug(slug, locale);
    return result ? createLocalizedMetadata({
      locale,
      pathname: `/projects/${slug}`,
      title: result.project.title,
      description: result.project.description,
      image: result.project.image === DEFAULT_PROJECT_IMAGE ? undefined : result.project.image,
    }) : {};
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
  const projectUrl = getAbsoluteUrl(locale, `/projects/${project.slug}`);
  const projectImage = project.image === DEFAULT_PROJECT_IMAGE
    ? undefined
    : new URL(project.image, getSiteUrl()).toString();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "@id": `${projectUrl}#project`,
            url: projectUrl,
            name: project.title,
            description: project.description,
            inLanguage: locale,
            ...(projectImage ? {image: projectImage} : {}),
          }),
        }}
      />
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
        <ProjectDetailSection id="overview" title={t("overview.title")}>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-primary-strong">{t("overview.contextLabel")}</h3>
              <p className="mt-3 text-base leading-7 text-muted sm:text-lg sm:leading-8">{localize(detail.context, locale)}</p>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-primary-strong">{t("overview.objectiveLabel")}</h3>
              <p className="mt-3 text-base leading-7 text-muted sm:text-lg sm:leading-8">{localize(detail.objective, locale)}</p>
            </div>
          </div>
        </ProjectDetailSection>
        <ProjectDetailSection id="dataset" title={t("dataset.title")}>
          <DatasetSummaryCard dataset={detail.dataset} locale={locale} />
        </ProjectDetailSection>
        <ProjectDetailSection id="methodology" title={t("methodology.title")}>
          <MethodologySteps steps={detail.methodology} locale={locale} />
        </ProjectDetailSection>
        <ProjectDetailSection id="insights" title={t("insights.title")}>
          <ProjectInsights insights={detail.insights} locale={locale} />
        </ProjectDetailSection>
        {project.dashboardAvailable
          ? <DashboardPreview slug={project.slug} />
          : <ProjectFinalCta slug={project.slug} dashboardAvailable={false} />}
      </Container>
    </>
  );
}
