"use client";

import {useEffect, useRef} from "react";
import Link from "next/link";
import {useSearchParams} from "next/navigation";
import {buttonStyles} from "@/components/ui/button";

export type StoryStep =
  | {id: "context" | "objective"; title: string; kind: "text"; body: string}
  | {id: "data"; title: string; kind: "data"; name?: string; description?: string; source?: string; sourceUrl?: string; records?: string; period?: string}
  | {id: "method" | "insights"; title: string; kind: "items"; items: {id: string; title?: string; description: string}[]}
  | {id: "explore"; title: string; kind: "links"; links: {href: string; label: string}[]};

interface StoryLabels {
  progress: string;
  progressLabel: string;
  jumpLabel: string;
  previous: string;
  next: string;
  source: string;
  records: string;
  period: string;
  openSource: string;
}

export function StoryReader({steps, labels}: {steps: StoryStep[]; labels: StoryLabels}) {
  const searchParams = useSearchParams();
  const requestedStep = searchParams.get("step");
  const index = Math.max(0, steps.findIndex((step) => step.id === requestedStep));
  const step = steps[index];
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(step.id);

  useEffect(() => {
    if (requestedStep && !steps.some((entry) => entry.id === requestedStep)) {
      const url = new URL(window.location.href);
      url.searchParams.delete("step");
      window.history.replaceState(null, "", url);
    }
  }, [requestedStep, steps]);

  useEffect(() => {
    if (previousStep.current !== step.id) {
      previousStep.current = step.id;
      headingRef.current?.focus();
    }
  }, [step.id]);

  function goTo(id: string) {
    const url = new URL(window.location.href);
    if (id === steps[0].id) url.searchParams.delete("step");
    else url.searchParams.set("step", id);
    if (url.href !== window.location.href) window.history.pushState(null, "", url);
  }

  return (
    <div className="mt-10">
      <div className="flex flex-col gap-5 border-y border-border py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-muted">{labels.progress.replace("{current}", String(index + 1)).replace("{total}", String(steps.length))}</p>
          <div role="progressbar" aria-label={labels.progressLabel} aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={index + 1} className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div className="h-full rounded-full bg-primary transition-[width] motion-reduce:transition-none" style={{width: `${((index + 1) / steps.length) * 100}%`}} />
          </div>
        </div>
        <label className="min-w-0 text-sm font-semibold sm:w-56">
          {labels.jumpLabel}
          <select value={step.id} onChange={(event) => goTo(event.target.value)} className="mt-1.5 h-11 w-full min-w-0 rounded-control border border-border bg-surface px-3 text-foreground focus-visible:outline-2 focus-visible:outline-primary">
            {steps.map((entry) => <option key={entry.id} value={entry.id}>{entry.title}</option>)}
          </select>
        </label>
      </div>

      <section aria-labelledby="story-step-title" className="min-h-64 py-10 sm:py-14">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-strong">{String(index + 1).padStart(2, "0")}</p>
        <h2 ref={headingRef} id="story-step-title" tabIndex={-1} className="mt-3 text-3xl font-black tracking-tight outline-none sm:text-4xl">{step.title}</h2>
        {step.kind === "text" ? <p className="mt-6 max-w-3xl whitespace-pre-line text-lg leading-8 text-muted">{step.body}</p> : null}
        {step.kind === "data" ? (
          <div className="mt-6 max-w-3xl">
            {step.name ? <h3 className="text-xl font-bold">{step.name}</h3> : null}
            {step.description ? <p className="mt-3 whitespace-pre-line leading-7 text-muted">{step.description}</p> : null}
            <dl className="mt-6 grid gap-5 border-t border-border pt-5 sm:grid-cols-3">
              {step.source ? <div><dt className="text-sm text-muted">{labels.source}</dt><dd className="mt-1 font-semibold">{step.source}</dd></div> : null}
              {step.records !== undefined ? <div><dt className="text-sm text-muted">{labels.records}</dt><dd className="mt-1 font-semibold">{step.records}</dd></div> : null}
              {step.period ? <div><dt className="text-sm text-muted">{labels.period}</dt><dd className="mt-1 font-semibold">{step.period}</dd></div> : null}
            </dl>
            {step.sourceUrl ? <a href={step.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-primary-strong underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-primary">{labels.openSource} <span className="ml-2" aria-hidden="true">↗</span></a> : null}
          </div>
        ) : null}
        {step.kind === "items" ? <div className="mt-6 max-w-3xl divide-y divide-border border-t border-border">
          {step.items.map((item) => <article key={item.id} className="py-6 first:pt-0">
            {item.title ? <h3 className="text-xl font-bold tracking-tight">{item.title}</h3> : null}
            {item.description ? <p className={`${item.title ? "mt-3 " : ""}whitespace-pre-line leading-7 text-muted`}>{item.description}</p> : null}
          </article>)}
        </div> : null}
        {step.kind === "links" ? <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {step.links.map((link) => <Link key={link.href} href={link.href} className={buttonStyles({variant: "secondary", className: "w-full sm:w-auto"})}>{link.label} <span aria-hidden="true">→</span></Link>)}
        </div> : null}
      </section>

      <nav aria-label={labels.progressLabel} className="flex items-center justify-between gap-3 border-t border-border pt-6">
        <button type="button" onClick={() => goTo(steps[index - 1].id)} disabled={index === 0} className={buttonStyles({variant: "secondary", className: "min-w-0 flex-1 sm:flex-none"})}>{labels.previous}</button>
        <button type="button" onClick={() => goTo(steps[index + 1].id)} disabled={index === steps.length - 1} className={buttonStyles({className: "min-w-0 flex-1 sm:flex-none"})}>{labels.next}</button>
      </nav>
    </div>
  );
}
