import {getTranslations} from "next-intl/server";
import {Card} from "@/components/ui";

export async function AnalyticsPreview() {
  const t = await getTranslations("Home.Preview");

  return (
    <Card className="relative overflow-hidden p-2.5 sm:p-3">
      <div className="relative min-h-[29rem] overflow-hidden rounded-[calc(var(--radius-card-value)-0.25rem)] bg-surface-raised p-5 sm:p-7">
        <div className="data-grid pointer-events-none absolute inset-0" />
        <div className="brand-gradient pointer-events-none absolute -right-20 -top-16 size-64 rounded-full opacity-20 blur-3xl" />

        <div className="relative flex h-full min-h-[25rem] flex-col">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted">{t("eyebrow")}</p>
              <h2 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">{t("title")}</h2>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-cyan">
              <span className="size-1.5 rounded-full bg-cyan" />
              {t("live")}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-card border border-border bg-card p-4 backdrop-blur">
              <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted">{t("records")}</p>
              <p className="mt-2 text-2xl font-black tracking-tight">24.8K</p>
              <p className="mt-1 text-xs font-semibold text-cyan">+18.4%</p>
            </div>
            <div className="rounded-card border border-border bg-card p-4 backdrop-blur">
              <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted">{t("quality")}</p>
              <div className="mt-2 flex items-end justify-between gap-3">
                <p className="text-2xl font-black tracking-tight">94.8%</p>
                <svg viewBox="0 0 36 36" className="size-9 -rotate-90 text-primary" aria-hidden="true">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="var(--border)" strokeWidth="4" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="83.4 88" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-3 flex-1 rounded-card border border-border bg-card p-4 backdrop-blur sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted">{t("trend")}</p>
                <p className="mt-1 text-sm font-bold">{t("period")}</p>
              </div>
              <div className="flex items-center gap-3 text-[0.65rem] text-muted">
                <span className="inline-flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-primary" />{t("actual")}</span>
                <span className="inline-flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-violet" />{t("baseline")}</span>
              </div>
            </div>
            <svg viewBox="0 0 440 160" className="mt-5 w-full overflow-visible" role="img" aria-label={t("chartLabel")}>
              <defs>
                <linearGradient id="chart-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="var(--primary)" stopOpacity="0.3" />
                  <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[28, 68, 108, 148].map((y) => <line key={y} x1="0" y1={y} x2="440" y2={y} stroke="var(--border)" />)}
              <path d="M0 130C42 126 46 98 88 104C126 110 142 72 180 78C222 85 233 43 276 56C319 68 342 18 382 34C408 44 422 23 440 18V160H0Z" fill="url(#chart-area)" />
              <path d="M0 130C42 126 46 98 88 104C126 110 142 72 180 78C222 85 233 43 276 56C319 68 342 18 382 34C408 44 422 23 440 18" fill="none" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" />
              <path d="M0 141C48 126 71 133 108 112C146 91 177 109 214 84C252 59 286 78 326 53C368 27 405 50 440 38" fill="none" stroke="var(--violet)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="7 8" opacity="0.75" />
              <circle cx="440" cy="18" r="5" fill="var(--surface-raised)" stroke="var(--primary)" strokeWidth="3" />
            </svg>
          </div>
        </div>
      </div>
    </Card>
  );
}
