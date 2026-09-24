"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "insights", label: "Insights" },
  { id: "explore", label: "Explore" },
  { id: "methodology", label: "Methodology" },
] as const;

type SectionId = (typeof sections)[number]["id"];

export function ProjectNavigation() {
  const [activeSection, setActiveSection] = useState<SectionId>("overview");

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.id))
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
      <nav aria-label="Project sections" className="container-story overflow-x-auto">
        <ul className="flex min-w-max items-center gap-1 py-2">
          {sections.map((section) => {
            const active = activeSection === section.id;

            return (
              <li key={section.id}>
                <a
                  aria-current={active ? "location" : undefined}
                  className={`inline-flex min-h-10 items-center rounded-control px-3 text-sm font-medium transition-colors ${
                    active
                      ? "bg-accent-subtle text-accent"
                      : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
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
