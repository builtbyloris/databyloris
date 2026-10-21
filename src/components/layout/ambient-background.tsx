"use client";

import {useEffect, useRef} from "react";
import {usePathname} from "next/navigation";
import {useMotionPreference} from "@/lib/use-motion-preference";

const words = {
  it: ["dati", "segnali", "pattern", "analisi", "contesto", "metriche", "query", "insight", "trend", "dataset", "evidenze", "visualizza"],
  en: ["data", "signals", "patterns", "analysis", "context", "metrics", "queries", "insights", "trends", "datasets", "evidence", "visualize"],
};

export function AmbientBackground({locale}: {locale: string}) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const motionPreference = useMotionPreference();
  const pathname = usePathname();
  const isAdmin = /^\/(?:(?:it|en)\/)?admin(?:\/|$)/.test(pathname);

  useEffect(() => {
    const backdrop = backdropRef.current;
    const finePointer = window.matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine)");
    if (!backdrop || isAdmin || motionPreference !== "full") return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      backdrop.style.setProperty("--ambient-x", `${x}px`);
      backdrop.style.setProperty("--ambient-y", `${y}px`);
      backdrop.dataset.active = "true";
      frame = 0;
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!finePointer.matches || (event.pointerType !== "mouse" && event.pointerType !== "pen")) return;
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(paint);
    };
    const hide = () => { backdrop.dataset.active = "false"; };
    const onPointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) hide();
    };
    const onVisibilityChange = () => {
      if (document.hidden) hide();
    };

    window.addEventListener("pointermove", onPointerMove, {passive: true});
    document.addEventListener("pointerout", onPointerOut);
    document.addEventListener("visibilitychange", onVisibilityChange);
    finePointer.addEventListener("change", hide);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      finePointer.removeEventListener("change", hide);
      if (frame) window.cancelAnimationFrame(frame);
      hide();
    };
  }, [isAdmin, motionPreference]);

  if (isAdmin) return null;

  const vocabulary = words[locale === "en" ? "en" : "it"];

  return (
    <div ref={backdropRef} className="ambient-background pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true" data-active="false">
      <div className="ambient-background-glow absolute inset-0" />
      <div className="ambient-background-words absolute inset-0 grid grid-cols-7 grid-rows-6">
        {Array.from({length: 42}, (_, index) => (
          <span key={index} className="self-center justify-self-center whitespace-nowrap font-mono text-[11px] font-medium uppercase tracking-[0.18em]">
            {vocabulary[(index * 7 + Math.floor(index / 7) * 3) % vocabulary.length]}
          </span>
        ))}
      </div>
    </div>
  );
}
