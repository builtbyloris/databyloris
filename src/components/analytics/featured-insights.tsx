import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const insights = [
  {
    value: "+42%",
    title: "Fastest-growing genre",
    description: "A sample growth signal presented as a concise analytical finding.",
  },
  {
    value: "Top 10",
    title: "Artists concentrate a significant share of streams",
    description: "A preview of how rankings can reveal concentration in listening.",
  },
  {
    value: "Global",
    title: "Listening preferences vary across markets",
    description: "A sample comparison that leads from an insight into exploration.",
  },
];

export function FeaturedInsights() {
  return (
    <section aria-labelledby="featured-insights-title" className="container-page section-separation">
      <div className="mb-7 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div className="max-w-2xl space-y-3">
          <Badge variant="accent">Demo preview</Badge>
          <h2 id="featured-insights-title">Insights that invite a closer look.</h2>
          <p className="text-text-secondary">
            Illustrative interface content only—not verified Spotify findings.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {insights.map((insight) => (
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
