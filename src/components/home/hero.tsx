import {getTranslations} from "next-intl/server";
import {AnalyticsPreview} from "@/components/home/analytics-preview";
import {TypewriterTitle} from "@/components/home/typewriter-title";
import {Badge, Container, Section, buttonStyles} from "@/components/ui";
import {Link} from "@/i18n/navigation";

export async function Hero() {
  const t = await getTranslations("Home.Hero");

  return (
    <Section id="top" className="relative scroll-mt-24 overflow-hidden pb-20 pt-16 sm:pb-24 sm:pt-24 lg:pb-28 lg:pt-28">
      <div className="data-grid pointer-events-none absolute inset-0 opacity-50" />
      <Container className="relative grid items-center gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] lg:gap-16">
        <div className="max-w-3xl motion-safe:animate-[editorial-arrive_650ms_ease-out_both]">
          <Badge>{t("eyebrow")}</Badge>
          <TypewriterTitle lead={t("titleLead")} accent={t("titleAccent")} />
          <p className="mt-8 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">{t("description")}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/projects" className={buttonStyles({size: "lg", className: "w-full sm:w-auto"})}>
              {t("primaryCta")} <span aria-hidden="true">→</span>
            </Link>
            <Link href="/#how-it-works" className={buttonStyles({variant: "secondary", size: "lg", className: "w-full sm:w-auto"})}>
              {t("secondaryCta")}
            </Link>
          </div>
          <div className="site-overline mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-5 text-muted">
            <span className="inline-flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary" />{t("proofOne")}</span>
            <span className="inline-flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary" />{t("proofTwo")}</span>
          </div>
        </div>
        <AnalyticsPreview />
      </Container>
    </Section>
  );
}
