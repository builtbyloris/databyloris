import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {ProjectsGrid} from "@/components/projects/projects-grid";
import {ProjectsHeader} from "@/components/projects/projects-header";
import {
  ProjectsToolbar,
  type ProjectCategoryOption,
  type ProjectsSort,
} from "@/components/projects/projects-toolbar";
import {Card, Container, Section} from "@/components/ui";
import {projects} from "@/data/projects";

interface ProjectsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const validSorts = new Set<ProjectsSort>(["recent", "name-asc", "name-desc"]);

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase()
    .trim();
}

function toCategorySlug(category: string) {
  return normalize(category).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Projects");
  return {title: t("title"), description: t("description")};
}

export default async function ProjectsPage({searchParams}: ProjectsPageProps) {
  const params = await searchParams;
  const t = await getTranslations("ProjectContent");
  const publicProjects = projects.filter((project) => project.status === "published");
  const rawQuery = firstValue(params.q);
  const query = normalize(rawQuery);
  const requestedCategory = firstValue(params.category);
  const requestedSort = firstValue(params.sort) as ProjectsSort;
  const sort = validSorts.has(requestedSort) ? requestedSort : "recent";

  const categories = Array.from(
    new Map(
      publicProjects.map((project) => [
        project.category,
        {
          value: toCategorySlug(project.category),
          label: t(`${project.slug}.category`),
        } satisfies ProjectCategoryOption,
      ]),
    ).values(),
  );
  const selectedCategory = categories.some((category) => category.value === requestedCategory)
    ? requestedCategory
    : "all";

  const filteredProjects = publicProjects
    .filter((project) => {
      const matchesCategory =
        selectedCategory === "all" || toCategorySlug(project.category) === selectedCategory;
      if (!matchesCategory) return false;
      if (!query) return true;

      const searchableContent = normalize([
        project.title,
        project.description,
        project.category,
        project.technologies.join(" "),
        t(`${project.slug}.description`),
        t(`${project.slug}.category`),
      ].join(" "));

      return searchableContent.includes(query);
    })
    .sort((left, right) => {
      if (sort === "name-asc") return left.title.localeCompare(right.title);
      if (sort === "name-desc") return right.title.localeCompare(left.title);
      return (right.publishedAt ?? "").localeCompare(left.publishedAt ?? "");
    });

  return (
    <Section className="relative min-h-[72vh] overflow-hidden pt-16 sm:pt-20 lg:pt-24">
      <div className="data-grid pointer-events-none absolute inset-x-0 top-0 h-[30rem]" />
      <Container className="relative">
        <ProjectsHeader />
        <Card className="mt-10 p-4 sm:mt-12 sm:p-6 lg:p-8">
          <ProjectsToolbar
            categories={categories}
            query={rawQuery}
            selectedCategory={selectedCategory}
            sort={sort}
          />
          <ProjectsGrid projects={filteredProjects} />
        </Card>
      </Container>
    </Section>
  );
}
