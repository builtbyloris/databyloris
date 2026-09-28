import {getTranslations} from "next-intl/server";
import {Card, Container, Section, buttonStyles} from "@/components/ui";
import {Link} from "@/i18n/navigation";

export async function HomeCta() {
  const t = await getTranslations("Home.Cta");

  return (
    <Section>
      <Container>
        <Card className="relative overflow-hidden px-6 py-12 text-center sm:px-12 sm:py-16">
          <div className="data-grid pointer-events-none absolute inset-0" />
          <div className="brand-gradient pointer-events-none absolute left-1/2 top-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-3xl" />
          <div className="relative mx-auto max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{t("eyebrow")}</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.045em] sm:text-5xl">{t("title")}</h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-muted">{t("description")}</p>
            <Link href="/projects" className={buttonStyles({size: "lg", className: "mt-8 w-full sm:w-auto"})}>
              {t("button")} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Card>
      </Container>
    </Section>
  );
}
