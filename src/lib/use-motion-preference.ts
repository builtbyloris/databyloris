"use client";

import {useSyncExternalStore} from "react";

const storageKey = "databyloris-motion";
const changeEvent = "databyloris-motion-change";

type MotionSetting = "full" | "reduced" | "system";

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

function getSnapshot(): MotionSetting {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "system";
  return window.localStorage.getItem(storageKey) === "reduced" ? "reduced" : "full";
}

export function useMotionPreference() {
  return useSyncExternalStore(subscribe, getSnapshot, () => "full" as MotionSetting);
}

export function setMotionPreference(reduced: boolean) {
  window.localStorage.setItem(storageKey, reduced ? "reduced" : "full");
  window.dispatchEvent(new Event(changeEvent));
}
