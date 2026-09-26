import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PublicDictionary } from "@/i18n/types";

export function FeaturedInsights({ strings }: { strings: PublicDictionary["home"]["featuredInsights"] }) {
  return (
    <section aria-labelledby="featured-insights-title" className="container-page section-separation">
      <div className="mb-7 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div className="max-w-2xl space-y-3">
          <Badge variant="accent">{strings.badge}</Badge>
          <h2 id="featured-insights-title">{strings.title}</h2>
          <p className="text-text-secondary">
            {strings.description}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {strings.items.map((insight) => (
          <article key={insight.value}>
            <Card className="h-full" surface="primary">
              <CardHeader>
                <p className="text-3xl font-semibold tracking-tight text-accent">
                  {insight.value}
                </p>
                <CardTitle>{insight.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-text-secondary">
                  {insight.description}
                </p>
              </CardContent>
            </Card>
          </article>
        ))}
      </div>
    </section>
  );
}
