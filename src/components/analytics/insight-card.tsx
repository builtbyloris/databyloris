import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { InsightPreviewData } from "@/types/analytics";
import type { PublicDictionary } from "@/i18n/types";

interface InsightCardProps {
  insight: InsightPreviewData;
  strings: PublicDictionary["project"]["overview"];
}

export function InsightCard({ insight, strings }: InsightCardProps) {
  return (
    <Card className="flex h-full flex-col p-5 sm:p-6" surface="primary">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          {insight.label}
        </p>
        <Badge>{strings.insightBadge}</Badge>
      </div>

      <p className="mt-6 text-3xl font-semibold tracking-tight text-text-primary">
        {insight.value}
      </p>
      <h3 className="mt-3 text-lg">{insight.title}</h3>
      <p className="mt-3 text-sm leading-6 text-text-secondary">
        {insight.interpretation}
      </p>

      <div className="mt-auto pt-5">
        <ButtonLink
          aria-label={`${strings.exploreInsightAria}: ${insight.title}`}
          href={insight.href}
          size="sm"
          variant="ghost"
        >
          {strings.exploreInsight}
          <span aria-hidden="true">→</span>
        </ButtonLink>
      </div>
    </Card>
  );
}
