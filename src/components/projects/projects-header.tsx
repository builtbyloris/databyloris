import {getTranslations} from "next-intl/server";
import {Badge} from "@/components/ui";
import {MotionReveal} from "@/components/ui/motion-reveal";

export async function ProjectsHeader() {
  const t = await getTranslations("Projects");

  return (
    <div className="max-w-3xl">
      <MotionReveal variant="text"><Badge>{t("eyebrow")}</Badge></MotionReveal>
      <MotionReveal variant="text" delay={0.09} className="mt-6">
        <h1 className="font-editorial text-5xl leading-[1.02] sm:text-7xl lg:text-8xl">{t("headerTitle")}</h1>
      </MotionReveal>
      <MotionReveal variant="text" delay={0.18} className="mt-5">
        <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">{t("headerDescription")}</p>
      </MotionReveal>
    </div>
  );
}
