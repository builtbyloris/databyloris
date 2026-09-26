import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { MarketComparisonData } from "@/types/analytics";
import type { PublicDictionary } from "@/i18n/types";

interface MarketComparisonProps {
  data: MarketComparisonData;
  strings: PublicDictionary["project"]["insights"];
}

const segmentClasses = ["bg-accent", "bg-success", "bg-warning", "bg-text-muted"];
const dotClasses = ["bg-accent", "bg-success", "bg-warning", "bg-text-muted"];

export function MarketComparison({ data, strings }: MarketComparisonProps) {
  return (
    <Card aria-label={data.title} className="p-5 sm:p-6" role="group" surface="elevated">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-text-primary">{data.title}</h4>
          <p className="mt-1 text-xs text-text-muted">{data.context}</p>
        </div>
        <Badge className="self-start" variant="warning">{strings.demoData}</Badge>
      </div>
      <p className="sr-only">{data.summary}</p>

      <ul aria-label={strings.genreLegend} className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
        {data.categories.map((category, index) => (
          <li className="flex items-center gap-2 text-xs text-text-secondary" key={category}>
            <span aria-hidden="true" className={`size-2.5 rounded-sm ${dotClasses[index % dotClasses.length]}`} />
            {category}
          </li>
        ))}
      </ul>

      <div className="mt-7 grid gap-6 md:grid-cols-2">
        {data.markets.map((market) => (
          <div key={market.label}>
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <p className="text-sm font-semibold text-text-primary">{market.label}</p>
              <p className="text-xs text-text-muted">{market.highlight}</p>
            </div>
            <div className="flex h-7 w-full overflow-hidden rounded-control" role="img" aria-label={`${market.label}: ${market.values.map((value) => `${value.category} ${value.value}%`).join(", ")}`}>
              {market.values.map((value, index) => (
                <span
                  className={segmentClasses[index % segmentClasses.length]}
                  key={value.category}
                  style={{ width: `${value.value}%` }}
                  title={`${value.category}: ${value.value}%`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
