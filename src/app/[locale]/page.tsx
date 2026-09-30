import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {FeaturedProjects} from "@/components/home/featured-projects";
import {Hero} from "@/components/home/hero";
import {HomeCta} from "@/components/home/home-cta";
import {HowItWorks} from "@/components/home/how-it-works";
import {StatsStrip} from "@/components/home/stats-strip";
import {ProjectsDataError} from "@/components/projects/projects-data-error";
import {Container, Section} from "@/components/ui";
import type {AppLocale} from "@/i18n/routing";
import {listPublishedProjects} from "@/lib/repositories/projects-repository";
import {createLocalizedMetadata, getAbsoluteUrl, serializeJsonLd} from "@/lib/seo";
import type {Project} from "@/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({params}: {params: Promise<{locale: AppLocale}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "Metadata"});

  return createLocalizedMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    absoluteTitle: true,
  });
}

export default async function HomePage({params}: {params: Promise<{locale: AppLocale}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "Metadata"});
  let projects: Project[] = [];
  let dataError = false;

  try {
    projects = await listPublishedProjects(locale);
  } catch {
    dataError = true;
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": `${getAbsoluteUrl(locale)}#website`,
            url: getAbsoluteUrl(locale),
            name: "databyloris",
            description: t("description"),
            inLanguage: locale,
          }),
        }}
      />
      <Hero />
      {dataError ? (
        <Section className="relative z-10 -mt-7 pb-6 pt-0 sm:-mt-9">
          <Container><ProjectsDataError retryHref="/" /></Container>
        </Section>
      ) : (
        <>
          <StatsStrip projects={projects} />
          <FeaturedProjects projects={projects} />
        </>
      )}
      <HowItWorks />
      <HomeCta />
    </>
  );
}
