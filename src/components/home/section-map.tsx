"use client";

import {useEffect, useState} from "react";

type SectionLink = {id: string; label: string; description?: string; eyebrow?: string};

export function SectionMap({label, sections}: {label: string; sections: SectionLink[]}) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const readingLine = window.innerHeight * 0.35;
      const current = [...sections].reverse().find(({id}) => {
        const element = document.getElementById(id);
        return element && element.getBoundingClientRect().top <= readingLine;
      });
      setActive(current?.id ?? sections[0]?.id ?? "");
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, {passive: true});
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [sections]);

  return (
    <nav aria-label={label} className="section-map fixed left-2 top-1/2 z-30 hidden -translate-y-1/2 xl:block">
      {sections.map(({id, label: sectionLabel, description, eyebrow}) => (
        <a
          key={id}
          href={`#${id}`}
          aria-label={sectionLabel}
          aria-current={active === id ? "location" : undefined}
          className="section-map-link group relative flex h-6 w-9 items-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span
            aria-hidden="true"
            className={`section-map-line block h-0.5 transition-[width,background-color] duration-200 motion-reduce:transition-none group-hover:w-7 group-focus-visible:w-7 ${active === id ? "w-7 bg-primary" : "w-4 bg-muted/70 group-hover:bg-primary-strong group-focus-visible:bg-primary-strong"}`}
          />
          <span aria-hidden="true" className={`pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 translate-x-1 rounded-panel border border-border bg-surface-raised p-3 text-left opacity-0 shadow-card transition-[opacity,transform] duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:transition-none ${description || eyebrow ? "w-72" : "w-40"}`}>
            <span className="block text-sm font-semibold leading-5 text-foreground">{sectionLabel}</span>
            {description ? <span className="mt-1.5 block text-xs leading-[1.45] text-muted">{description}</span> : null}
            {eyebrow ? <span className="mt-1.5 block font-mono text-[10px] leading-4 tracking-wide text-muted">{eyebrow}</span> : null}
          </span>
        </a>
      ))}
    </nav>
  );
}
