import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {notFound} from "next/navigation";
import {Badge, Card, Container, Section, buttonStyles} from "@/components/ui";
import {getProjectBySlug, projects} from "@/data/projects";
import {Link} from "@/i18n/navigation";

interface ProjectPageProps {
  params: Promise<{slug: string}>;
}

export function generateStaticParams() {
  return projects.map(({slug}) => ({slug}));
}

export async function generateMetadata({params}: ProjectPageProps): Promise<Metadata> {
  const project = getProjectBySlug((await params).slug);
  return project ? {title: project.title, description: project.description} : {};
}

export default async function ProjectPage({params}: ProjectPageProps) {
  const project = getProjectBySlug((await params).slug);
  if (!project) notFound();
  const t = await getTranslations("Projects");

  return (
    <Section className="min-h-[68vh]">
      <Container>
        <Link href="/projects" className="text-sm font-semibold text-muted hover:text-foreground">← {t("back")}</Link>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_0.7fr] lg:items-start">
          <div>
            <Badge>{project.category}</Badge>
            <h1 className="mt-6 text-4xl font-black tracking-[-0.045em] sm:text-6xl">{project.title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{project.description}</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {project.technologies.map((technology) => (
                <span key={technology} className="rounded-full border border-border bg-surface/70 px-3 py-1.5 text-xs text-muted">{technology}</span>
              ))}
            </div>
            <Link
              href={`/projects/${project.slug}/dashboard`}
              className={buttonStyles({className: "mt-9"})}
            >
              {t("openDashboard")} <span aria-hidden="true">→</span>
            </Link>
          </div>
          <Card className="p-3">
            <div className="data-grid relative min-h-80 overflow-hidden rounded-[calc(var(--radius-card-value)-0.25rem)] bg-surface-raised">
              <div className="brand-gradient absolute -right-16 -top-16 size-52 rounded-full opacity-20 blur-3xl" />
              <div className="absolute inset-0 grid place-items-center text-7xl font-black tracking-[-0.08em] text-foreground/10">
                0{project.id.at(-1)}
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
