import {getTranslations} from "next-intl/server";
import {Container, Section, buttonStyles} from "@/components/ui";
import {Link} from "@/i18n/navigation";

export async function HomeCta() {
  const t = await getTranslations("Home.Cta");

  return (
    <Section id="start" className="scroll-mt-24">
      <Container>
        <div className="site-rule relative px-1 py-14 text-center sm:py-20">
          <div className="relative mx-auto max-w-3xl">
            <p className="site-overline text-primary-strong">{t("eyebrow")}</p>
            <h2 className="font-editorial mt-4 text-4xl sm:text-6xl">{t("title")}</h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-muted">{t("description")}</p>
            <Link href="/projects" className={buttonStyles({size: "lg", className: "mt-8 w-full sm:w-auto"})}>
              {t("button")} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
