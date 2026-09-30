import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {PlaygroundDashboard, PlaygroundHeader, PlaygroundIntro} from "@/components/playground";
import {Container} from "@/components/ui";
import {retailPulseDashboard} from "@/data/playground/retail-pulse-dashboard";
import {retailPulseData} from "@/data/playground/retail-pulse-data";
import type {AppLocale} from "@/i18n/routing";
import {createLocalizedMetadata} from "@/lib/seo";

export async function generateMetadata({params}: {params: Promise<{locale: AppLocale}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "Playground"});
  return createLocalizedMetadata({
    locale,
    pathname: "/playground",
    title: t("title"),
    description: t("description"),
  });
}

export default async function PlaygroundPage() {
  return (
    <section className="relative overflow-hidden pb-section pt-12 sm:pt-16 lg:pt-20">
      <div className="data-grid pointer-events-none absolute inset-x-0 top-0 h-[34rem]" />
      <Container className="relative">
        <PlaygroundHeader />
        <PlaygroundIntro />
        <PlaygroundDashboard config={retailPulseDashboard} records={retailPulseData} />
      </Container>
    </section>
  );
}
