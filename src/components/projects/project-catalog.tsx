"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ProjectCategory, ProjectSummary } from "@/types/project";

import { ProjectCard } from "./project-card";

interface ProjectCatalogProps {
  projects: readonly ProjectSummary[];
}

type CategoryFilter = "All" | ProjectCategory;

export function ProjectCatalog({ projects }: ProjectCatalogProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");

  const categories = useMemo(
    () => ["All", ...new Set(projects.map((project) => project.category))] as CategoryFilter[],
    [projects],
  );

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return projects.filter((project) => {
      const matchesCategory = category === "All" || project.category === category;
      const searchableText = [
        project.title,
        project.description,
        project.category,
        ...project.tags,
      ]
        .join(" ")
        .toLocaleLowerCase();

      return matchesCategory && searchableText.includes(normalizedQuery);
    });
  }, [category, projects, query]);

  function resetFilters() {
    setQuery("");
    setCategory("All");
  }

  return (
    <div className="mt-10">
      <div className="grid gap-5 border-y border-border py-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary" htmlFor="project-search">
            Search projects
          </label>
          <div className="relative max-w-xl">
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-text-muted"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.75" />
              <path
                d="m16 16 4 4"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.75"
              />
            </svg>
            <input
              className="min-h-12 w-full rounded-control border border-border bg-surface-primary py-2.5 pl-11 pr-4 text-sm text-text-primary placeholder:text-text-muted"
              id="project-search"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search titles, topics or tags"
              type="search"
              value={query}
            />
          </div>
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-text-primary">
            Filter by category
          </legend>
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <Button
                aria-pressed={category === item}
                key={item}
                onClick={() => setCategory(item)}
                size="sm"
                variant={category === item ? "primary" : "secondary"}
              >
                {item}
              </Button>
            ))}
          </div>
        </fieldset>
      </div>

      <p aria-live="polite" className="my-6 text-sm text-text-muted">
        {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"}
      </p>

      {filteredProjects.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-start gap-4 p-6 sm:p-8" surface="secondary">
          <div>
            <h2 className="text-xl">No projects found</h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Try a different search or reset the category filter to see every project.
            </p>
          </div>
          <Button onClick={resetFilters} variant="secondary">
            Reset filters
          </Button>
        </Card>
      )}
    </div>
  );
}
