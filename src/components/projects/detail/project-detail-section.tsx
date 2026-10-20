import type {ReactNode} from "react";

export function ProjectDetailSection({id, title, children}: {id: string; title: string; children: ReactNode}) {
  return (
    <section id={id} className="site-reveal scroll-mt-32 border-b border-border py-12 sm:py-16">
      <div className="grid gap-7 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
        <h2 className="font-editorial text-3xl sm:text-4xl">{title}</h2>
        <div>{children}</div>
      </div>
    </section>
  );
}
