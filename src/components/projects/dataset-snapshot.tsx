import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { DatasetMetadata } from "@/types/project";

interface DatasetSnapshotProps {
  dataset: DatasetMetadata;
}

export function DatasetSnapshot({ dataset }: DatasetSnapshotProps) {
  const facts = [
    { label: "Period", value: dataset.period },
    { label: "Records", value: dataset.records },
    { label: "Entities", value: dataset.entities },
    { label: "Categories", value: dataset.categories },
    { label: "Markets", value: dataset.markets },
    { label: "Grain", value: dataset.grain },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value));

  return (
    <Card className="p-5 sm:p-6" surface="elevated">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-overline">Dataset snapshot</p>
          <h2 className="mt-2 text-xl">{dataset.name}</h2>
        </div>
        {dataset.illustrative ? <Badge variant="warning">Demo metadata</Badge> : null}
      </div>

      <p className="mt-4 text-sm leading-6 text-text-secondary">{dataset.summary}</p>

      <dl className="mt-6 grid grid-cols-2 gap-x-5 gap-y-4 border-t border-border pt-5">
        {facts.map((fact) => (
          <div className={fact.label === "Grain" ? "col-span-2" : undefined} key={fact.label}>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              {fact.label}
            </dt>
            <dd className="mt-1 text-sm font-medium leading-5 text-text-primary">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>

      {dataset.source ? (
        <div className="mt-5 border-t border-border pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Source</p>
          <p className="mt-1 text-sm text-text-secondary">{dataset.source}</p>
        </div>
      ) : null}
    </Card>
  );
}
