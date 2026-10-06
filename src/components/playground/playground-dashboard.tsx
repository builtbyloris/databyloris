"use client";

import {useState} from "react";
import {DashboardShell} from "@/components/dashboard";
import type {DashboardConfig, DashboardRecord} from "@/types";
import {PlaygroundTutorial} from "./playground-tutorial";

const sections = ["kpis", "filters", "charts", "ranking"] as const;

export function PlaygroundDashboard({config, records}: {config: DashboardConfig; records: DashboardRecord[]}) {
  const [step, setStep] = useState<number | null>(0);
  const highlightedSection = step === null ? "none" : sections[step];

  const viewSection = () => {
    if (step === null) return;
    const target = document.querySelector<HTMLElement>(`[data-dashboard-section="${sections[step]}"]`)
      ?? document.querySelector<HTMLElement>('[data-dashboard-section="filters"]');
    if (!target) return;
    target.tabIndex = -1;
    target.focus({preventScroll: true});
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({top: target.getBoundingClientRect().top + window.scrollY - 96, behavior: reducedMotion ? "instant" : "smooth"});
  };

  return (
    <section id="playground-workspace" data-playground-highlight={highlightedSection} className="mt-10 grid min-w-0 scroll-mt-24 gap-6 xl:grid-cols-[18rem_minmax(0,1fr)] xl:items-start">
      <div className="xl:sticky xl:top-[6.5rem]">
        <PlaygroundTutorial
          step={step}
          onBack={() => setStep((current) => current === null ? 0 : Math.max(0, current - 1))}
          onNext={() => setStep((current) => current === null || current >= sections.length - 1 ? null : current + 1)}
          onExit={() => setStep(null)}
          onRestart={() => setStep(0)}
          onViewSection={viewSection}
        />
      </div>
      <DashboardShell embedded config={config} records={records} />
    </section>
  );
}
