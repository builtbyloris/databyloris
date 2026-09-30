"use client";

import {useTranslations} from "next-intl";
import {usePathname, useRouter} from "next/navigation";
import {FormEvent, useEffect, useRef, useTransition} from "react";
import {buttonStyles} from "@/components/ui";
import {cn} from "@/lib/cn";

export type ProjectsSort = "recent" | "name-asc" | "name-desc";

export interface ProjectCategoryOption {
  label: string;
  value: string;
}

interface ProjectsToolbarProps {
  categories: ProjectCategoryOption[];
  query: string;
  selectedCategory: string;
  sort: ProjectsSort;
}

export function ProjectsToolbar({categories, query, selectedCategory, sort}: ProjectsToolbarProps) {
  const t = useTranslations("Projects");
  const pathname = usePathname();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (inputRef.current && document.activeElement !== inputRef.current) {
      inputRef.current.value = query;
    }
  }, [query]);

  useEffect(() => () => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
  }, []);

  function navigate(next: {query?: string; category?: string; sort?: ProjectsSort}) {
    const nextQuery = next.query ?? query;
    const nextCategory = next.category ?? selectedCategory;
    const nextSort = next.sort ?? sort;
    const params = new URLSearchParams();

    if (nextQuery.trim()) params.set("q", nextQuery.trim());
    if (nextCategory !== "all") params.set("category", nextCategory);
    if (nextSort !== "recent") params.set("sort", nextSort);

    const url = params.size > 0 ? `${pathname}?${params.toString()}` : pathname;
    startTransition(() => router.replace(url, {scroll: false}));
  }

  function scheduleSearch(value: string) {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => navigate({query: value}), 300);
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    navigate({query: inputRef.current?.value ?? ""});
  }

  return (
    <div aria-busy={isPending} className={cn("transition-opacity", isPending && "opacity-70")}>
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <form onSubmit={submitSearch} role="search">
          <label htmlFor="projects-search" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-muted">
            {t("searchLabel")}
          </label>
          <div className="flex min-h-13 items-center gap-3 rounded-control border border-control-border bg-surface-raised px-4 transition-colors focus-within:border-primary focus-within:bg-surface">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>
            <input
              ref={inputRef}
              id="projects-search"
              name="q"
              type="search"
              defaultValue={query}
              placeholder={t("searchPlaceholder")}
              autoComplete="off"
              onChange={(event) => scheduleSearch(event.currentTarget.value)}
              className="min-w-0 flex-1 bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted"
            />
            <button type="submit" className={buttonStyles({size: "sm", className: "shrink-0"})}>
              <span className="hidden sm:inline">{t("searchAction")}</span>
              <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 sm:hidden" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="9" cy="9" r="5" />
                <path d="m13 13 4 4" />
              </svg>
              <span className="sr-only sm:hidden">{t("searchAction")}</span>
            </button>
          </div>
        </form>

        <div className="lg:min-w-52">
          <label htmlFor="projects-sort" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-muted">
            {t("sortLabel")}
          </label>
          <div className="relative">
            <select
              id="projects-sort"
              value={sort}
              onChange={(event) => navigate({sort: event.currentTarget.value as ProjectsSort})}
              className="h-13 w-full appearance-none rounded-control border border-control-border bg-surface-raised px-4 pr-10 text-sm font-semibold text-foreground outline-none transition-colors focus:border-primary"
            >
              <option value="recent">{t("sortRecent")}</option>
              <option value="name-asc">{t("sortNameAsc")}</option>
              <option value="name-desc">{t("sortNameDesc")}</option>
            </select>
            <svg aria-hidden="true" viewBox="0 0 20 20" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="m6 8 4 4 4-4" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <p id="category-filter-label" className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-muted">
          {t("categoryLabel")}
        </p>
        <div
          role="group"
          aria-labelledby="category-filter-label"
          className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <button
            type="button"
            aria-pressed={selectedCategory === "all"}
            onClick={() => navigate({category: "all"})}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
              selectedCategory === "all"
                ? "border-primary bg-primary text-primary-contrast"
                : "border-border bg-surface-raised text-muted hover:border-primary/30 hover:text-foreground",
            )}
          >
            {t("categoryAll")}
          </button>
          {categories.map((category) => (
            <button
              key={category.value}
              type="button"
              aria-pressed={selectedCategory === category.value}
              onClick={() => navigate({category: category.value})}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                selectedCategory === category.value
                  ? "border-primary bg-primary text-primary-contrast"
                  : "border-border bg-surface-raised text-muted hover:border-primary/30 hover:text-foreground",
              )}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
