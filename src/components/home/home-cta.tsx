import {getTranslations} from "next-intl/server";
import {Container, Section} from "@/components/ui";
import {MotionReveal} from "@/components/ui/motion-reveal";
import {Link} from "@/i18n/navigation";

export async function HomeCta() {
  const t = await getTranslations("Home.Cta");

  return (
    <Section id="start" className="scroll-mt-24">
      <Container>
        <div className="site-rule relative px-1 py-14 text-center sm:py-20">
          <div className="relative mx-auto max-w-3xl">
            <MotionReveal variant="text"><p className="site-overline text-primary-strong">{t("eyebrow")}</p></MotionReveal>
            <MotionReveal variant="text" delay={0.09} className="mt-4"><h2 className="font-editorial text-4xl sm:text-6xl">{t("title")}</h2></MotionReveal>
            <MotionReveal variant="text" delay={0.18} className="mx-auto mt-4 max-w-2xl"><p className="leading-7 text-muted">{t("description")}</p></MotionReveal>
            <MotionReveal delay={0.26} className="mt-8">
              <Link href="/projects" className="editorial-action w-full sm:w-auto">
                {t("button")} <span aria-hidden="true" className="editorial-action-icon">↗</span>
              </Link>
            </MotionReveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
