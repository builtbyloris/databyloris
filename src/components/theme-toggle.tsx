"use client";

import {useTheme} from "next-themes";
import {useTranslations} from "next-intl";
import {useSyncExternalStore} from "react";
import {Button} from "@/components/ui";

const subscribe = () => () => {};

function SunIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20.2 14.1A8.4 8.4 0 0 1 9.9 3.8 8.5 8.5 0 1 0 20.2 14.1Z" />
    </svg>
  );
}

export function ThemeToggle() {
  const {resolvedTheme, setTheme} = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const t = useTranslations("Theme");

  const isDark = resolvedTheme === "dark";
  const label = isDark ? t("light") : t("dark");

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="size-9 px-0"
      aria-label={mounted ? label : t("toggle")}
      title={mounted ? label : t("toggle")}
      disabled={!mounted}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {mounted && isDark ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}
