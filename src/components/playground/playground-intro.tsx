import {getTranslations} from "next-intl/server";

const items = ["kpis", "filters", "charts", "ranking"] as const;

export async function PlaygroundIntro() {
  const t = await getTranslations("Playground.intro");

  return (
    <section aria-labelledby="playground-intro-title" className="mt-12 sm:mt-16">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet">{t("eyebrow")}</p>
          <h2 id="playground-intro-title" className="mt-3 text-2xl font-bold tracking-[-0.035em] sm:text-3xl">{t("title")}</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-muted">{t("description")}</p>
      </div>
      <ol className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <li key={item} className="rounded-card border border-border bg-card p-5 shadow-soft">
            <span className="grid size-8 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary-strong">{index + 1}</span>
            <h3 className="mt-4 font-bold">{t(`${item}.title`)}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{t(`${item}.description`)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
