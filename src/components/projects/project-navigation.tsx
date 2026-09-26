"use client";

import { useEffect, useState } from "react";

import type { PublicDictionary } from "@/i18n/types";

const sectionIds = ["overview", "insights", "explore", "methodology"] as const;

type SectionId = (typeof sectionIds)[number];

export function ProjectNavigation({
  labels,
}: {
  labels: PublicDictionary["projectNavigation"];
}) {
  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const sections = [
    { id: "overview", label: labels.overview },
    { id: "insights", label: labels.insights },
    { id: "explore", label: labels.explore },
    { id: "methodology", label: labels.methodology },
  ] as const;

  useEffect(() => {
    const elements = sectionIds
      .map((sectionId) => document.getElementById(sectionId))
      .filter((element): element is HTMLElement => Boolean(element));

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry) {
          setActiveSection(visibleEntry.target.id as SectionId);
        }
      },
      { rootMargin: "-25% 0px -60%", threshold: [0, 0.25, 0.5] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="sticky top-16 z-40 border-y border-border bg-page-background/95 backdrop-blur-md">
      <nav
        aria-label={labels.label}
        className="container-story overflow-x-auto overscroll-x-contain py-2"
      >
        <ul className="mx-auto flex w-max min-w-max items-center gap-2">
          {sections.map((section) => {
            const active = activeSection === section.id;

            return (
              <li key={section.id}>
                <a
                  aria-current={active ? "location" : undefined}
                  className={`inline-flex min-h-10 shrink-0 items-center whitespace-nowrap rounded-control px-3.5 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-accent-subtle text-accent"
                      : "text-text-primary/80 hover:bg-surface-secondary hover:text-text-primary"
                  }`}
                  href={`#${section.id}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
