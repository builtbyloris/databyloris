import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const metadata = ["2022–2025", "Artists", "Genres", "Countries"];

const rankingPreview = [82, 67, 54, 39];

export function FeaturedAnalysis() {
  return (
    <section aria-labelledby="featured-analysis-title" className="container-page section-separation">
      <div className="mb-7 space-y-3">
        <p className="text-overline">Featured analysis</p>
        <h2 id="featured-analysis-title">A data story built to be explored.</h2>
      </div>

      <Card className="grid overflow-hidden lg:grid-cols-[1.05fr_0.95fr]" surface="elevated">
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <Badge variant="accent">Music</Badge>
            <Badge>Interactive demo</Badge>
          </div>

          <h3 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
            Spotify Listening Trends
          </h3>
          <p className="mt-4 text-lg font-medium leading-7 text-text-primary">
            What can streaming data tell us about how people listen?
          </p>
          <p className="mt-3 max-w-xl leading-7 text-text-secondary">
            Explore listening patterns, artists, genres, markets and trends through an
            interactive data story.
          </p>

          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Analysis metadata">
            {metadata.map((item) => (
              <li
                className="rounded-badge border border-border bg-surface-secondary px-2.5 py-1 text-xs font-medium text-text-secondary"
                key={item}
              >
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-7">
            <ButtonLink href="/demo" size="lg">
              Explore analysis
              <span aria-hidden="true">→</span>
            </ButtonLink>
          </div>
        </div>

        <div
          aria-label="Illustrative Spotify analysis interface preview"
          className="border-t border-border bg-surface-secondary p-5 sm:p-7 lg:border-l lg:border-t-0"
          role="img"
        >
          <div className="rounded-card border border-border bg-surface-primary p-5 shadow-elevated">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-text-primary">Listening pulse</p>
                <p className="text-xs text-text-muted">Demo interface preview</p>
              </div>
              <Badge variant="accent">2022–2025</Badge>
            </div>

            <svg
              aria-hidden="true"
              className="mb-7 h-auto w-full"
              viewBox="0 0 420 150"
            >
              <path
                className="text-border"
                d="M0 30H420M0 75H420M0 120H420"
                fill="none"
                stroke="currentColor"
                strokeDasharray="4 7"
              />
              <path
                className="text-accent"
                d="M0 116C44 120 53 88 94 94C135 100 153 62 196 73C239 84 258 48 298 55C340 62 366 32 420 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="4"
              />
            </svg>

            <div className="space-y-3">
              {rankingPreview.map((width, index) => (
                <div className="grid grid-cols-[4.5rem_1fr] items-center gap-3" key={width}>
                  <span className="text-xs text-text-muted">Artist {index + 1}</span>
                  <span className="h-2.5 rounded-badge bg-surface-secondary">
                    <span
                      className="block h-full rounded-badge bg-accent"
                      style={{ width: `${width}%` }}
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
