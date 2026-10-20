"use client";

import {useEffect, useState} from "react";

type Phase = "typing" | "holding" | "erasing" | "waiting";

export function TypewriterTitle({lead, accent}: {lead: string; accent: string}) {
  const leadChars = Array.from(lead);
  const accentChars = Array.from(accent);
  const total = leadChars.length + accentChars.length;
  const [count, setCount] = useState(total);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout> | undefined;
    let frame: number | undefined;
    let position = 0;
    let phase: Phase = "typing";

    const tick = () => {
      if (phase === "typing") {
        position += 1;
        setCount(position);
        if (position === total) phase = "holding";
        timer = setTimeout(tick, phase === "holding" ? 1900 : 80);
      } else if (phase === "holding") {
        phase = "erasing";
        timer = setTimeout(tick, 45);
      } else if (phase === "erasing") {
        position -= 1;
        setCount(position);
        if (position === 0) phase = "waiting";
        timer = setTimeout(tick, phase === "waiting" ? 550 : 45);
      } else {
        phase = "typing";
        timer = setTimeout(tick, 80);
      }
    };

    const syncMotion = () => {
      if (timer) clearTimeout(timer);
      if (frame) cancelAnimationFrame(frame);

      if (media.matches || document.documentElement.dataset.motion === "reduced" || document.hidden || total === 0) {
        frame = requestAnimationFrame(() => {
          setActive(false);
          setCount(total);
        });
        return;
      }

      position = 0;
      phase = "typing";
      frame = requestAnimationFrame(() => {
        setCount(0);
        setActive(true);
        timer = setTimeout(tick, 500);
      });
    };

    const observer = new MutationObserver(syncMotion);
    observer.observe(document.documentElement, {attributes: true, attributeFilter: ["data-motion"]});
    media.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncMotion);
    syncMotion();

    return () => {
      if (timer) clearTimeout(timer);
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      media.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncMotion);
    };
  }, [lead, accent, total]);

  const visibleLead = leadChars.slice(0, count).join("");
  const visibleAccent = accentChars.slice(0, Math.max(0, count - leadChars.length)).join("");

  return (
    <h1 aria-label={`${lead} ${accent}`} className="font-editorial relative mt-8 text-[clamp(3.5rem,7vw,7rem)] leading-[0.94]">
      <span aria-hidden="true" className={active ? "invisible" : undefined}>
        <span className="block">{lead}</span>
        <span className="text-gradient -mb-[0.08em] block pb-[0.08em]">{accent}</span>
      </span>
      {active && (
        <span aria-hidden="true" className="pointer-events-none absolute inset-0">
          <span className="block">
            {visibleLead}
            {count <= leadChars.length && <span className="typewriter-caret" />}
          </span>
          <span className="text-gradient -mb-[0.08em] block pb-[0.08em]">
            {visibleAccent}
            {count > leadChars.length && <span className="typewriter-caret" />}
          </span>
        </span>
      )}
    </h1>
  );
}
