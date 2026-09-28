"use client";

import {useState} from "react";
import {DashboardShell} from "@/components/dashboard";
import type {DashboardConfig, DashboardRecord} from "@/types";
import {PlaygroundTutorial} from "./playground-tutorial";

const sections = ["kpis", "filters", "charts", "ranking"] as const;

export function PlaygroundDashboard({config, records}: {config: DashboardConfig; records: DashboardRecord[]}) {
  const [step, setStep] = useState<number | null>(0);
  const highlightedSection = step === null ? "none" : sections[step];

  return (
    <section data-playground-highlight={highlightedSection} className="mt-12 grid min-w-0 gap-6 xl:grid-cols-[18rem_minmax(0,1fr)] xl:items-start">
      <div className="xl:sticky xl:top-[6.5rem]">
        <PlaygroundTutorial
          step={step}
          onBack={() => setStep((current) => current === null ? 0 : Math.max(0, current - 1))}
          onNext={() => setStep((current) => current === null || current >= sections.length - 1 ? null : current + 1)}
          onExit={() => setStep(null)}
          onRestart={() => setStep(0)}
        />
      </div>
      <DashboardShell embedded config={config} records={records} />
    </section>
  );
}
