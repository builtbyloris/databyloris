import type {ReactNode} from "react";

export function ProjectDetailSection({id, eyebrow, title, children}: {id: string; eyebrow: string; title: string; children: ReactNode}) {
  return (
    <section id={id} className="scroll-mt-36 border-b border-border py-14 last:border-0 sm:py-20">
      <div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-strong">{eyebrow}</p>
          <h2 className="mt-3 text-2xl font-bold tracking-[-0.035em] sm:text-3xl">{title}</h2>
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}
