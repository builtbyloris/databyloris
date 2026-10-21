import {getTranslations} from "next-intl/server";
import {Container, Section} from "@/components/ui";
import {MotionReveal} from "@/components/ui/motion-reveal";

export async function HowItWorks() {
  const t = await getTranslations("Home.HowItWorks");
  const steps = ["explore", "analyze", "discover"] as const;

  return (
    <Section id="how-it-works" className="scroll-mt-24 border-y border-border bg-surface/50">
      <Container>
        <div className="max-w-2xl">
          <MotionReveal variant="text"><p className="site-overline text-primary-strong">{t("eyebrow")}</p></MotionReveal>
          <MotionReveal variant="text" delay={0.09} className="mt-4"><h2 className="font-editorial text-4xl sm:text-6xl">{t("title")}</h2></MotionReveal>
          <MotionReveal variant="text" delay={0.18} className="mt-4"><p className="leading-7 text-muted">{t("description")}</p></MotionReveal>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
          {steps.map((step, index) => (
            <div key={step} className="group border-t border-border pt-5">
              <MotionReveal variant="text" delay={index * 0.07}><span className="site-overline text-primary-strong">{String(index + 1).padStart(2, "0")}</span></MotionReveal>
              <MotionReveal variant="text" delay={index * 0.07 + 0.09} className="mt-6"><h3 className="font-editorial text-2xl transition-colors group-hover:text-primary-strong">{t(`${step}.title`)}</h3></MotionReveal>
              <MotionReveal variant="text" delay={index * 0.07 + 0.18} className="mt-3"><p className="max-w-sm text-sm leading-7 text-muted">{t(`${step}.description`)}</p></MotionReveal>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
