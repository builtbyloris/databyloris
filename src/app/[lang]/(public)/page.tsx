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

const steps = [
  {
    number: "01",
    title: "Discover",
    description: "Find an analysis that interests you.",
  },
  {
    number: "02",
    title: "Understand",
    description: "Follow the key findings and data story.",
  },
  {
    number: "03",
    title: "Explore",
    description: "Use filters and visualizations to investigate the data yourself.",
  },
];

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
          <p className="text-overline">Interactive Data Stories</p>
          <h1 className="mt-4">Explore what data has to say.</h1>
          <p className="text-lead mt-6">
            Interactive analyses that turn real-world datasets into insights, stories
            and explorable dashboards.
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
            Discover <span aria-hidden="true">→</span> Understand{" "}
            <span aria-hidden="true">→</span> Explore
          </p>
        </div>

        <AnalyticsPreview />
      </section>

      {featuredProject ? (
        <FeaturedAnalysis locale={lang} project={featuredProject} />
      ) : null}
      {spotifyProject ? <FeaturedInsights /> : null}

      <section aria-labelledby="how-it-works-title" className="container-page section-separation">
        <div className="mb-7 max-w-2xl space-y-3">
          <p className="text-overline">How it works</p>
          <h2 id="how-it-works-title">From discovery to your own questions.</h2>
        </div>

        <ol className="grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
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
            <p className="text-overline">Continue exploring</p>
            <h2 id="home-cta-title">Ready to explore the data?</h2>
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
