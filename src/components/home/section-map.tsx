"use client";

import {useEffect, useState} from "react";

type SectionLink = {id: string; label: string};

export function SectionMap({label, sections}: {label: string; sections: SectionLink[]}) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const [progress, setProgress] = useState(0);

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
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(maxScroll > 0 ? Math.min(100, Math.max(0, window.scrollY / maxScroll * 100)) : 0);
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
    <nav aria-label={label} className="fixed left-4 top-1/2 z-30 hidden w-24 -translate-y-1/2 min-[1400px]:block">
      <div className="site-overline mb-4 text-muted">{label}</div>
      <div className="relative border-l border-border pl-3">
        <span className="absolute -left-px top-0 w-px bg-primary transition-[height] duration-150 motion-reduce:transition-none" style={{height: `${progress}%`}} aria-hidden="true" />
        {sections.map(({id, label: sectionLabel}) => (
          <a
            key={id}
            href={`#${id}`}
            aria-current={active === id ? "location" : undefined}
            className={`block py-2 text-xs leading-4 transition-[color,transform] duration-200 hover:translate-x-0.5 hover:text-foreground motion-reduce:transform-none ${active === id ? "font-semibold text-primary-strong" : "text-muted"}`}
          >
            {sectionLabel}
          </a>
        ))}
      </div>
    </nav>
  );
}
