"use client";

import {LazyMotion, domAnimation, useInView} from "motion/react";
import * as m from "motion/react-m";
import {useRef, type ReactNode} from "react";
import {useMotionPreference} from "@/lib/use-motion-preference";

export function MotionReveal({children, className, delay = 0, variant = "default"}: {children: ReactNode; className?: string; delay?: number; variant?: "default" | "text"}) {
  const motionEnabled = useMotionPreference() === "full";
  const isText = variant === "text";
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {once: !isText, amount: isText ? 0.28 : 0.12});
  const hidden = {opacity: 0, y: isText ? 26 : 18, ...(isText ? {filter: "blur(10px)"} : {})};
  const visible = {opacity: 1, y: 0, ...(isText ? {filter: "blur(0px)"} : {})};

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        ref={ref}
        className={`motion-reveal ${className ?? ""}`}
        initial={motionEnabled ? "hidden" : false}
        animate={motionEnabled && !inView ? "hidden" : "visible"}
        variants={{
          hidden: {...hidden, transition: {duration: 0.24}},
          visible: {...visible, transition: {duration: isText ? 0.82 : 0.56, delay, ease: [0.22, 1, 0.36, 1]}},
        }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
