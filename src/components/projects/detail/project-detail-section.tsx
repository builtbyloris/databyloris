import type {ReactNode} from "react";
import {MotionReveal} from "@/components/ui/motion-reveal";

export function ProjectDetailSection({id, title, children}: {id: string; title: string; children: ReactNode}) {
  return (
    <section id={id} className="scroll-mt-32 border-b border-border py-14 sm:py-20">
      <MotionReveal className="grid gap-9 sm:gap-12">
        <h2 className="font-editorial max-w-3xl text-4xl tracking-tight sm:text-5xl">{title}</h2>
        <div className="min-w-0">{children}</div>
      </MotionReveal>
    </section>
  );
}
