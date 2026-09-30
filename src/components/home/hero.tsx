import {getTranslations} from "next-intl/server";
import {AnalyticsPreview} from "@/components/home/analytics-preview";
import {Badge, Container, Section, buttonStyles} from "@/components/ui";
import {Link} from "@/i18n/navigation";

export async function Hero() {
  const t = await getTranslations("Home.Hero");

  return (
    <Section className="relative overflow-hidden pb-20 pt-16 sm:pb-24 sm:pt-24 lg:pb-28 lg:pt-28">
      <div className="data-grid pointer-events-none absolute inset-0" />
      <Container className="relative grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="max-w-3xl">
          <Badge>{t("eyebrow")}</Badge>
          <h1 className="mt-7 text-[clamp(3.25rem,7vw,6rem)] font-black leading-[0.94] tracking-[-0.06em]">
            <span className="block">{t("titleLead")}</span>
            <span className="text-gradient -mb-[0.06em] block pb-[0.06em]">{t("titleAccent")}</span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">{t("description")}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/projects" className={buttonStyles({size: "lg", className: "w-full sm:w-auto"})}>
              {t("primaryCta")} <span aria-hidden="true">→</span>
            </Link>
            <Link href="/#how-it-works" className={buttonStyles({variant: "secondary", size: "lg", className: "w-full sm:w-auto"})}>
              {t("secondaryCta")}
            </Link>
          </div>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            <span className="inline-flex items-center gap-2"><span className="size-1.5 rounded-full bg-cyan" />{t("proofOne")}</span>
            <span className="inline-flex items-center gap-2"><span className="size-1.5 rounded-full bg-violet" />{t("proofTwo")}</span>
          </div>
        </div>
        <AnalyticsPreview />
      </Container>
    </Section>
  );
}
