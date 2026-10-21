"use client";

import {useTranslations} from "next-intl";
import {useEffect} from "react";
import {setMotionPreference, useMotionPreference} from "@/lib/use-motion-preference";

export function MotionToggle() {
  const t = useTranslations("Motion");
  const setting = useMotionPreference();
  const reduced = setting !== "full";

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "reduced" : "full";
  }, [reduced]);

  const toggle = () => {
    if (setting === "system") return;
    setMotionPreference(!reduced);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={setting === "system"}
      aria-pressed={reduced}
      title={setting === "system" ? t("system") : t("hint")}
      className="inline-flex min-h-9 items-center gap-2 rounded-full border border-border px-3 text-xs font-semibold text-muted transition-colors hover:border-primary/40 hover:bg-surface-raised hover:text-foreground disabled:cursor-default disabled:opacity-70"
    >
      <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
      {t("label")}: {t(reduced ? "reduced" : "full")}
    </button>
  );
}
