import {getTranslations} from "next-intl/server";
import {Card, Container, Section} from "@/components/ui";

export async function HowItWorks() {
  const t = await getTranslations("Home.HowItWorks");
  const steps = ["explore", "analyze", "discover"] as const;

  return (
    <Section id="how-it-works" className="scroll-mt-24 border-y border-border bg-surface/35">
      <Container>
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{t("eyebrow")}</p>
          <h2 className="mt-4 text-3xl font-black tracking-[-0.045em] sm:text-5xl">{t("title")}</h2>
          <p className="mt-4 leading-7 text-muted">{t("description")}</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={step} className="group p-6 transition-colors hover:border-primary/30 sm:p-7">
              <div className="flex items-center justify-between">
                <span className="brand-gradient grid size-10 place-items-center rounded-control text-sm font-black text-white shadow-soft">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="h-px w-12 bg-gradient-to-r from-border to-transparent" />
              </div>
              <h3 className="mt-7 text-xl font-bold tracking-tight">{t(`${step}.title`)}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{t(`${step}.description`)}</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
