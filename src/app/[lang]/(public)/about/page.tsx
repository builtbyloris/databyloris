import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { isLocale, localizePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

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
          <p className="text-overline">{dictionary.about.philosophyEyebrow}</p>
          <h2 className="mt-3" id="philosophy-title">
            {dictionary.about.philosophyTitle}
          </h2>
          <p className="mt-5 leading-7 text-text-secondary">
            {dictionary.about.philosophyDescription}
          </p>
        </div>

        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {dictionary.about.philosophy.map((step) => (
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
            <p className="text-overline">{dictionary.about.contentsEyebrow}</p>
            <h2 className="mt-3" id="project-contents-title">
              {dictionary.about.contentsTitle}
            </h2>
            <p className="mt-5 leading-7 text-text-secondary">
              {dictionary.about.contentsDescription}
            </p>
          </div>

          <ol className="divide-y divide-border border-y border-border">
            {dictionary.about.contents.map((item, index) => (
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
            <p className="text-overline">{dictionary.about.purposeEyebrow}</p>
            <h2 className="mt-3" id="purpose-title">
              {dictionary.about.purposeTitle}
            </h2>
          </div>
          <div className="space-y-4 text-lg leading-8 text-text-secondary">
            {dictionary.about.purposeParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </Card>
      </section>

      <section
        aria-labelledby="creator-title"
        className="container-story section-separation border-t border-border pt-10"
      >
        <p className="text-overline">{dictionary.about.creatorEyebrow}</p>
        <h2 className="mt-3 text-2xl" id="creator-title">
          {dictionary.about.creatorTitle}
        </h2>
        <p className="mt-4 max-w-2xl leading-7 text-text-secondary">
          {dictionary.about.creatorDescription}
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
