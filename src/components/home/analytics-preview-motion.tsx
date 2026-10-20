"use client";

import {useEffect, useRef, type ReactNode} from "react";

export function AnalyticsPreviewMotion({children}: {children: ReactNode}) {
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    if (!("IntersectionObserver" in window)) {
      frame.dataset.animate = "true";
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      frame.dataset.animate = "true";
      observer.disconnect();
    }, {threshold: 0.2});
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return <div ref={frameRef} className="analytics-preview-frame document-frame relative min-w-0 overflow-hidden rounded-panel">{children}</div>;
}
