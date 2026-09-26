import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { KPIData } from "@/types/analytics";

interface KPICardProps {
  demoLabel: string;
  kpi: KPIData;
}

export function KPICard({ demoLabel, kpi }: KPICardProps) {
  return (
    <Card className="flex h-full flex-col p-5" surface="primary">
      <div className="flex items-start justify-between gap-3 lg:min-h-[3.75rem]">
        <p className="text-sm font-medium text-text-secondary">{kpi.label}</p>
        <Badge className="shrink-0" variant="accent">
          {demoLabel}
        </Badge>
      </div>

      <p className="mt-5 break-normal text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
        {kpi.value}
      </p>

      <div className="mt-auto pt-4">
        {kpi.trend ? (
          <p className="text-sm font-semibold text-success">
            <span aria-hidden="true">↗ </span>
            {kpi.trend.value}{" "}
            <span className="font-normal text-text-muted">{kpi.trend.context}</span>
          </p>
        ) : null}
        {kpi.context ? (
          <p className={`${kpi.trend ? "mt-2" : ""} text-xs leading-5 text-text-muted`}>
            {kpi.context}
          </p>
        ) : null}
      </div>
    </Card>
  );
}
