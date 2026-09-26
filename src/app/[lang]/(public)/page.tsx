import { notFound } from "next/navigation";

import { AnalyticsPreview } from "@/components/analytics/analytics-preview";
import { FeaturedInsights } from "@/components/analytics/featured-insights";
import { FeaturedAnalysis } from "@/components/projects/featured-analysis";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { isLocale, localizePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { SPOTIFY_PROJECT_PATH, SPOTIFY_PROJECT_SLUG } from "@/lib/projects/project-identifiers";
import {
  getPublishedProjectBySlug,
  listFeaturedPublishedProjects,
} from "@/lib/projects/public-projects";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);
  const [featuredProjects, spotifyProject] = await Promise.all([
    listFeaturedPublishedProjects(),
    getPublishedProjectBySlug(SPOTIFY_PROJECT_SLUG),
  ]);
  const [featuredProject] = featuredProjects;

  return (
    <div>
      <section className="container-page page-frame grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <div className="max-w-2xl">
          <p className="text-overline">{dictionary.home.eyebrow}</p>
          <h1 className="mt-4">{dictionary.home.title}</h1>
          <p className="text-lead mt-6">
            {dictionary.home.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={localizePath(lang, "/explore")} size="lg">
              {dictionary.home.exploreProjects}
              <span aria-hidden="true">→</span>
            </ButtonLink>
            {spotifyProject ? (
              <ButtonLink
                href={localizePath(lang, SPOTIFY_PROJECT_PATH)}
                size="lg"
                variant="secondary"
              >
                {dictionary.home.tryDemo}
              </ButtonLink>
            ) : null}
          </div>
          <p className="mt-8 text-sm font-medium text-text-muted">
            {dictionary.home.journey.map((item, index) => (
              <span key={item}>
                {index > 0 ? <span aria-hidden="true"> → </span> : null}
                {item}
              </span>
            ))}
          </p>
        </div>

        <AnalyticsPreview strings={dictionary.home.preview} />
      </section>

      {featuredProject ? (
        <FeaturedAnalysis coverStrings={dictionary.project.cover} locale={lang} project={featuredProject} strings={dictionary.home.featured} />
      ) : null}
      {spotifyProject ? <FeaturedInsights strings={dictionary.home.featuredInsights} /> : null}

      <section aria-labelledby="how-it-works-title" className="container-page section-separation">
        <div className="mb-7 max-w-2xl space-y-3">
          <p className="text-overline">{dictionary.home.howItWorksEyebrow}</p>
          <h2 id="how-it-works-title">{dictionary.home.howItWorksTitle}</h2>
        </div>

        <ol className="grid gap-4 md:grid-cols-3">
          {dictionary.home.steps.map((step) => (
            <li key={step.number}>
              <Card className="h-full p-5 sm:p-6">
                <Badge variant="accent">{step.number}</Badge>
                <h3 className="mt-5">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  {step.description}
                </p>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="home-cta-title" className="container-page pb-16 sm:pb-24">
        <Card
          className="flex flex-col items-start justify-between gap-6 p-6 sm:flex-row sm:items-center sm:p-8"
          surface="secondary"
        >
          <div className="space-y-2">
            <p className="text-overline">{dictionary.home.finalEyebrow}</p>
            <h2 id="home-cta-title">{dictionary.home.finalTitle}</h2>
          </div>
          <ButtonLink
            className="shrink-0"
            href={localizePath(lang, "/explore")}
            size="lg"
          >
            {dictionary.home.exploreProjects}
            <span aria-hidden="true">→</span>
          </ButtonLink>
        </Card>
      </section>
    </div>
  );
}
