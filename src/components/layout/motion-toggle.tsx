"use client";

import {useTranslations} from "next-intl";
import {useEffect, useSyncExternalStore} from "react";

const storageKey = "databyloris-motion";
const changeEvent = "databyloris-motion-change";

function subscribe(onChange: () => void) {
  window.addEventListener(changeEvent, onChange);
  window.addEventListener("storage", onChange);
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onChange);
  return () => {
    window.removeEventListener(changeEvent, onChange);
    window.removeEventListener("storage", onChange);
    media.removeEventListener("change", onChange);
  };
}

function getSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "system"
    : window.localStorage.getItem(storageKey) === "reduced" ? "reduced" : "full";
}

export function MotionToggle() {
  const t = useTranslations("Motion");
  const setting = useSyncExternalStore(subscribe, getSnapshot, () => "full");
  const reduced = setting !== "full";

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "reduced" : "full";
  }, [reduced]);

  const toggle = () => {
    if (setting === "system") return;
    window.localStorage.setItem(storageKey, reduced ? "full" : "reduced");
    window.dispatchEvent(new Event(changeEvent));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={setting === "system"}
      aria-pressed={reduced}
      title={setting === "system" ? t("system") : t("hint")}
      className="inline-flex min-h-9 items-center gap-2 rounded-control border border-border px-3 text-xs font-semibold text-muted transition-colors hover:border-primary/40 hover:text-foreground disabled:cursor-default disabled:opacity-70"
    >
      <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
      {t("label")}: {t(reduced ? "reduced" : "full")}
    </button>
  );
}
