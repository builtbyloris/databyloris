"use client";

import {LazyMotion, domAnimation, useMotionValue, useSpring} from "motion/react";
import * as m from "motion/react-m";
import {useEffect, useRef, useState, type PointerEvent, type ReactNode} from "react";
import {useMotionPreference} from "@/lib/use-motion-preference";

export function AnalyticsPreviewMotion({children}: {children: ReactNode}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const motionEnabled = useMotionPreference() === "full";
  const pointerX = useMotionValue(-240);
  const pointerY = useMotionValue(-240);
  const springX = useSpring(pointerX, {stiffness: 140, damping: 24});
  const springY = useSpring(pointerY, {stiffness: 140, damping: 24});
  const [pointerInside, setPointerInside] = useState(false);

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

  function moveGlow(event: PointerEvent<HTMLDivElement>) {
    if (!motionEnabled || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(event.clientX - bounds.left - 120);
    pointerY.set(event.clientY - bounds.top - 120);
    setPointerInside(true);
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <div
        ref={frameRef}
        onPointerEnter={moveGlow}
        onPointerMove={moveGlow}
        onPointerLeave={() => setPointerInside(false)}
        className="analytics-preview-frame document-frame relative min-w-0 overflow-hidden rounded-panel"
      >
        <m.div
          aria-hidden="true"
          className="analytics-pointer-glow pointer-events-none absolute left-0 top-0 z-20 size-60 rounded-full"
          style={{x: springX, y: springY}}
          animate={{opacity: motionEnabled && pointerInside ? 1 : 0}}
          transition={{duration: 0.28}}
        />
        <div className="relative z-10">{children}</div>
      </div>
    </LazyMotion>
  );
}
