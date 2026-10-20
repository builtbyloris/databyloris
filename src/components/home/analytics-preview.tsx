import {getTranslations} from "next-intl/server";
import {AnalyticsPreviewMotion} from "./analytics-preview-motion";

export async function AnalyticsPreview() {
  const t = await getTranslations("Home.Preview");

  return (
    <AnalyticsPreviewMotion>
      <div className="flex h-10 items-center justify-between border-b border-border bg-surface-raised px-4">
        <div className="flex items-center gap-1.5" aria-hidden="true"><span className="preview-status-dot size-2 rounded-full bg-primary/60" /><span className="size-2 rounded-full border border-border" /><span className="size-2 rounded-full border border-border" /></div>
        <span className="site-overline text-muted">databyloris / {t("eyebrow")}</span>
      </div>
      <div className="relative min-h-[27rem] p-5 sm:p-7">
        <div className="relative flex h-full min-h-[24rem] flex-col">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="site-overline text-muted">{t("eyebrow")}</p>
              <h2 className="font-editorial mt-2 text-2xl sm:text-3xl">{t("title")}</h2>
            </div>
            <span className="site-overline inline-flex items-center gap-2 text-primary-strong">
              <span className="size-1.5 rounded-full bg-primary" />
              {t("live")}
            </span>
          </div>

          <div className="mt-8 grid grid-cols-2 border-y border-border">
            <div className="preview-kpi border-r border-border py-5 pr-4">
              <p className="site-overline text-muted">{t("records")}</p>
              <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight">24.8K</p>
              <p className="mt-1 text-xs font-semibold text-primary-strong">+18.4%</p>
            </div>
            <div className="preview-kpi py-5 pl-4">
              <p className="site-overline text-muted">{t("quality")}</p>
              <div className="mt-2 flex items-end justify-between gap-3">
                <p className="text-3xl font-semibold tabular-nums tracking-tight">94.8%</p>
                <svg viewBox="0 0 36 36" className="size-9 -rotate-90 text-primary" aria-hidden="true">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="var(--border)" strokeWidth="4" />
                  <circle className="preview-ring" cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="83.4 88" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-6 flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="site-overline text-muted">{t("trend")}</p>
                <p className="mt-1 text-sm font-semibold">{t("period")}</p>
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
              <path className="preview-area" d="M0 130C42 126 46 98 88 104C126 110 142 72 180 78C222 85 233 43 276 56C319 68 342 18 382 34C408 44 422 23 440 18V160H0Z" fill="url(#chart-area)" />
              <path className="preview-trend" pathLength="1" d="M0 130C42 126 46 98 88 104C126 110 142 72 180 78C222 85 233 43 276 56C319 68 342 18 382 34C408 44 422 23 440 18" fill="none" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" />
              <path className="preview-trend-glint" pathLength="1" d="M0 130C42 126 46 98 88 104C126 110 142 72 180 78C222 85 233 43 276 56C319 68 342 18 382 34C408 44 422 23 440 18" fill="none" stroke="var(--cyan)" strokeWidth="5" strokeLinecap="round" />
              <path className="preview-baseline" d="M0 141C48 126 71 133 108 112C146 91 177 109 214 84C252 59 286 78 326 53C368 27 405 50 440 38" fill="none" stroke="var(--violet)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="7 8" opacity="0.75" />
              <circle className="preview-endpoint-halo" cx="440" cy="18" r="5" fill="var(--primary)" opacity="0" />
              <circle className="preview-endpoint" cx="440" cy="18" r="5" fill="var(--surface-raised)" stroke="var(--primary)" strokeWidth="3" />
            </svg>
          </div>
        </div>
      </div>
    </AnalyticsPreviewMotion>
  );
}
