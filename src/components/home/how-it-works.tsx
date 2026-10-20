import {getTranslations} from "next-intl/server";
import {Container, Section} from "@/components/ui";

export async function HowItWorks() {
  const t = await getTranslations("Home.HowItWorks");
  const steps = ["explore", "analyze", "discover"] as const;

  return (
    <Section id="how-it-works" className="scroll-mt-24 border-y border-border bg-surface/50">
      <Container>
        <div className="max-w-2xl">
          <p className="site-overline text-primary-strong">{t("eyebrow")}</p>
          <h2 className="font-editorial mt-4 text-4xl sm:text-6xl">{t("title")}</h2>
          <p className="mt-4 leading-7 text-muted">{t("description")}</p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
          {steps.map((step, index) => (
            <div key={step} className="site-reveal-item group border-t border-border pt-5">
              <span className="site-overline text-primary-strong">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="font-editorial mt-6 text-2xl transition-colors group-hover:text-primary-strong">{t(`${step}.title`)}</h3>
              <p className="mt-3 max-w-sm text-sm leading-7 text-muted">{t(`${step}.description`)}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
