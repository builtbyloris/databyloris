import {getTranslations} from "next-intl/server";
import {Card, Container} from "@/components/ui";
import {projects} from "@/data/projects";

export async function StatsStrip() {
  const t = await getTranslations("Home.Stats");
  const publishedProjects = projects.filter((project) => project.status === "published");
  const technologyCount = new Set(projects.flatMap((project) => project.technologies)).size;
  const stats = [
    {value: projects.length, label: t("datasets")},
    {value: publishedProjects.length, label: t("dashboards")},
    {value: technologyCount, label: t("technologies")},
    {value: publishedProjects.length, label: t("published")},
  ];

  return (
    <div className="relative z-10 -mt-7 pb-6 sm:-mt-9">
      <Container>
        <Card className="grid grid-cols-2 overflow-hidden lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="relative px-5 py-6 sm:px-7 sm:py-7 lg:px-8"
            >
              {index > 0 && <span className="absolute inset-y-5 left-0 hidden w-px bg-border lg:block" />}
              {index > 1 && <span className="absolute inset-x-5 top-0 h-px bg-border lg:hidden" />}
              {index % 2 === 1 && <span className="absolute inset-y-5 left-0 w-px bg-border lg:hidden" />}
              <p className="text-3xl font-black tracking-[-0.045em] text-foreground sm:text-4xl">
                {String(stat.value).padStart(2, "0")}
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">{stat.label}</p>
            </div>
          ))}
        </Card>
      </Container>
    </div>
  );
}
