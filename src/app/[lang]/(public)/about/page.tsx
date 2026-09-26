import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { isLocale, localizePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

const philosophy = [
  {
    number: "01",
    title: "Discover",
    description:
      "Start with a real-world question and find an analysis worth investigating.",
  },
  {
    number: "02",
    title: "Understand",
    description:
      "Follow the context, evidence and key findings through a clear editorial story.",
  },
  {
    number: "03",
    title: "Explore",
    description:
      "Use the interactive dashboard to test the story and investigate your own questions.",
  },
] as const;

const projectContents = [
  {
    title: "Context",
    description: "The question, dataset and background needed to frame the analysis.",
  },
  {
    title: "KPIs",
    description: "A concise view of the measures that define the current data context.",
  },
  {
    title: "Data stories",
    description: "Authored insights that connect patterns to supporting visual evidence.",
  },
  {
    title: "Interactive exploration",
    description: "Filters, comparisons and detailed views for investigating the data directly.",
  },
  {
    title: "Methodology",
    description: "Transparent definitions, preparation choices, techniques and limitations.",
  },
] as const;

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);

  return (
    <div>
      <section className="container-page page-frame">
        <div className="max-w-4xl">
          <Badge variant="accent">{dictionary.about.badge}</Badge>
          <h1 className="mt-5">{dictionary.about.title}</h1>
          <p className="text-lead mt-6 max-w-3xl">
            {dictionary.about.description}
          </p>
        </div>
      </section>

      <section
        aria-labelledby="philosophy-title"
        className="container-page section-separation border-y border-border py-12 sm:py-16"
      >
        <div className="max-w-2xl">
          <p className="text-overline">Product philosophy</p>
          <h2 className="mt-3" id="philosophy-title">
            Discover <span aria-hidden="true">→</span> Understand{" "}
            <span aria-hidden="true">→</span> Explore
          </h2>
          <p className="mt-5 leading-7 text-text-secondary">
            Each project moves from an accessible entry point to a guided explanation,
            then opens the same analysis for independent exploration.
          </p>
        </div>

        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {philosophy.map((step) => (
            <li className="border-t border-border pt-5" key={step.number}>
              <span className="font-mono text-xs font-semibold text-accent">
                {step.number}
              </span>
              <h3 className="mt-3 text-xl">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="project-contents-title"
        className="container-page section-separation"
      >
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div className="max-w-xl">
            <p className="text-overline">Inside every project</p>
            <h2 className="mt-3" id="project-contents-title">
              One analysis, multiple ways to understand it.
            </h2>
            <p className="mt-5 leading-7 text-text-secondary">
              The structure stays consistent so visitors can move confidently from
              orientation to evidence without learning a new interface each time.
            </p>
          </div>

          <ol className="divide-y divide-border border-y border-border">
            {projectContents.map((item, index) => (
              <li
                className="grid gap-2 py-5 sm:grid-cols-[2.5rem_10rem_1fr] sm:items-start sm:gap-5"
                key={item.title}
              >
                <span className="font-mono text-xs font-semibold text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-base">{item.title}</h3>
                <p className="text-sm leading-6 text-text-secondary">
                  {item.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        aria-labelledby="purpose-title"
        className="container-page section-separation"
      >
        <Card className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14" surface="secondary">
          <div>
            <p className="text-overline">Why databyloris exists</p>
            <h2 className="mt-3" id="purpose-title">
              Clarity should not end at the chart.
            </h2>
          </div>
          <div className="space-y-4 text-lg leading-8 text-text-secondary">
            <p>
              Data analysis is easier to trust when the question, definitions and
              limitations remain close to the result.
            </p>
            <p>
              databyloris is designed to make analysis understandable, explorable and
              transparent—combining guided storytelling with the freedom to inspect the
              data from another angle.
            </p>
          </div>
        </Card>
      </section>

      <section
        aria-labelledby="creator-title"
        className="container-story section-separation border-t border-border pt-10"
      >
        <p className="text-overline">About the creator</p>
        <h2 className="mt-3 text-2xl" id="creator-title">
          Designed and built by Loris.
        </h2>
        <p className="mt-4 max-w-2xl leading-7 text-text-secondary">
          The platform is part of Loris&apos;s work in Data Analysis and analytics product
          development, exploring how analytical rigor and thoughtful product design can
          make data more useful to more people.
        </p>
      </section>

      <section aria-labelledby="about-cta-title" className="container-page pb-16 sm:pb-24">
        <div className="flex flex-col items-start justify-between gap-6 border-t border-border pt-10 sm:flex-row sm:items-center">
          <div>
            <p className="text-overline">{dictionary.about.ctaEyebrow}</p>
            <h2 className="mt-2" id="about-cta-title">
              {dictionary.about.ctaTitle}
            </h2>
          </div>
          <ButtonLink
            className="shrink-0"
            href={localizePath(lang, "/explore")}
            size="lg"
          >
            {dictionary.about.ctaLabel}
            <span aria-hidden="true">→</span>
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
