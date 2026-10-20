import {getTranslations} from "next-intl/server";
import {Container} from "@/components/ui";
import type {Project} from "@/types";

export async function StatsStrip({projects}: {projects: Project[]}) {
  const t = await getTranslations("Home.Stats");
  const technologyCount = new Set(projects.flatMap((project) => project.technologies)).size;
  const stats = [
    {value: projects.length, label: t("projects")},
    {value: projects.filter((project) => project.dashboardAvailable).length, label: t("dashboards")},
    {value: technologyCount, label: t("technologies")},
    {value: projects.filter((project) => project.featured).length, label: t("featured")},
  ];

  return (
    <div className="pb-6">
      <Container>
        <div className="grid grid-cols-2 border-y border-border lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="relative px-4 py-6 sm:px-6 sm:py-7 lg:px-8"
            >
              {index > 0 && <span className="absolute inset-y-5 left-0 hidden w-px bg-border lg:block" />}
              {index > 1 && <span className="absolute inset-x-5 top-0 h-px bg-border lg:hidden" />}
              {index % 2 === 1 && <span className="absolute inset-y-5 left-0 w-px bg-border lg:hidden" />}
              <p className="font-editorial text-4xl text-foreground sm:text-5xl">
                {String(stat.value).padStart(2, "0")}
              </p>
              <p className="site-overline mt-2 text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
