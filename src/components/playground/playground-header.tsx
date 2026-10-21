import {getTranslations} from "next-intl/server";
import {Badge} from "@/components/ui";
import {MotionReveal} from "@/components/ui/motion-reveal";

export async function PlaygroundHeader() {
  const t = await getTranslations("Playground");

  return (
    <header className="max-w-4xl">
      <MotionReveal variant="text">
        <div className="flex flex-wrap items-center gap-3">
          <p className="site-overline text-primary-strong">{t("eyebrow")}</p>
          <Badge className="border-border bg-surface-raised text-muted">{t("demoBadge")}</Badge>
        </div>
      </MotionReveal>
      <MotionReveal variant="text" delay={0.09} className="mt-5">
        <h1 className="font-editorial text-5xl sm:text-6xl lg:text-7xl">{t("title")}</h1>
      </MotionReveal>
      <MotionReveal variant="text" delay={0.18} className="mt-5">
        <p className="max-w-3xl text-base leading-7 text-muted sm:text-lg sm:leading-8">{t("description")}</p>
      </MotionReveal>
      <MotionReveal variant="text" delay={0.25} className="mt-3">
        <p className="text-sm text-muted">{t("demoNotice")}</p>
      </MotionReveal>
      <MotionReveal delay={0.3} className="mt-6">
        <a href="#playground-workspace" className="editorial-action">
          {t("start")} <span aria-hidden="true" className="editorial-action-icon">↘</span>
        </a>
      </MotionReveal>
    </header>
  );
}
