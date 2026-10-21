import {getTranslations} from "next-intl/server";
import {ProjectCard} from "@/components/project-card";
import {Card, Container, Section} from "@/components/ui";
import {MotionReveal} from "@/components/ui/motion-reveal";
import {Link} from "@/i18n/navigation";
import type {Project} from "@/types";

export async function FeaturedProjects({projects}: {projects: Project[]}) {
  const t = await getTranslations("Home.Featured");
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 3);

  return (
    <Section id="featured" className="scroll-mt-24">
      <Container>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <MotionReveal variant="text"><p className="site-overline text-primary-strong">{t("eyebrow")}</p></MotionReveal>
            <MotionReveal variant="text" delay={0.09} className="mt-4"><h2 className="font-editorial text-4xl sm:text-6xl">{t("title")}</h2></MotionReveal>
            <MotionReveal variant="text" delay={0.18} className="mt-4"><p className="text-base leading-7 text-muted">{t("description")}</p></MotionReveal>
          </div>
          <MotionReveal delay={0.24}>
            <Link href="/projects" className="inline-flex items-center gap-2 border-b border-primary/35 pb-1 text-sm font-semibold text-primary-strong transition-[color,border-color] hover:border-primary hover:text-primary">
              {t("viewAll")} <span aria-hidden="true">→</span>
            </Link>
          </MotionReveal>
        </div>
        {featuredProjects.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project, index) => <MotionReveal key={project.id} delay={index * 0.07}><ProjectCard project={project} ordinal={index + 1} /></MotionReveal>)}
          </div>
        ) : (
          <Card className="mt-10 p-8 text-center sm:p-10">
            <h3 className="text-xl font-bold">{t("emptyTitle")}</h3>
            <p className="mt-2 text-sm text-muted">{t("emptyDescription")}</p>
          </Card>
        )}
      </Container>
    </Section>
  );
}
