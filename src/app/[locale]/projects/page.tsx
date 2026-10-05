import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {ProjectsGrid} from "@/components/projects/projects-grid";
import {ProjectsDataError} from "@/components/projects/projects-data-error";
import {ProjectsHeader} from "@/components/projects/projects-header";
import {
  ProjectsToolbar,
  type ProjectCategoryOption,
  type ProjectsSort,
} from "@/components/projects/projects-toolbar";
import {Container, Section} from "@/components/ui";
import type {AppLocale} from "@/i18n/routing";
import {listPublishedProjects} from "@/lib/repositories/projects-repository";
import {createLocalizedMetadata} from "@/lib/seo";
import type {Project} from "@/types";

interface ProjectsPageProps {
  params: Promise<{locale: AppLocale}>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const dynamic = "force-dynamic";

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

export async function generateMetadata({params}: Pick<ProjectsPageProps, "params">): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "Projects"});
  return createLocalizedMetadata({
    locale,
    pathname: "/projects",
    title: t("title"),
    description: t("description"),
  });
}

export default async function ProjectsPage({params, searchParams}: ProjectsPageProps) {
  const [{locale}, queryParams] = await Promise.all([params, searchParams]);
  let publicProjects: Project[] = [];
  let dataError = false;

  try {
    publicProjects = await listPublishedProjects(locale);
  } catch {
    dataError = true;
  }

  const rawQuery = firstValue(queryParams.q);
  const query = normalize(rawQuery);
  const requestedCategory = firstValue(queryParams.category);
  const requestedSort = firstValue(queryParams.sort) as ProjectsSort;
  const sort = validSorts.has(requestedSort) ? requestedSort : "recent";

  const categories = Array.from(
    new Map(
      publicProjects.map((project) => [
        project.category,
        {
          value: toCategorySlug(project.category),
          label: project.category,
        } satisfies ProjectCategoryOption,
      ]),
    ).values(),
  );
  const selectedCategory = categories.some((category) => category.value === requestedCategory)
    ? requestedCategory
    : "all";
  const titleCollator = new Intl.Collator(locale, {numeric: true, sensitivity: "base"});

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
      ].join(" "));

      return searchableContent.includes(query);
    })
    .sort((left, right) => {
      if (sort === "name-asc") return titleCollator.compare(left.title, right.title);
      if (sort === "name-desc") return titleCollator.compare(right.title, left.title);
      return (right.publishedAt ?? "").localeCompare(left.publishedAt ?? "");
    });

  return (
    <Section className="relative min-h-[72vh] overflow-hidden pt-16 sm:pt-20 lg:pt-24">
      <div className="data-grid pointer-events-none absolute inset-x-0 top-0 h-[30rem]" />
      <Container className="relative">
        <ProjectsHeader />
        {dataError ? (
          <div className="mt-10 sm:mt-12"><ProjectsDataError retryHref="/projects" /></div>
        ) : (
          <div className="mt-10 sm:mt-12">
            <ProjectsToolbar
              categories={categories}
              query={rawQuery}
              resultCount={filteredProjects.length}
              selectedCategory={selectedCategory}
              sort={sort}
            />
            <ProjectsGrid projects={filteredProjects} />
          </div>
        )}
      </Container>
    </Section>
  );
}
