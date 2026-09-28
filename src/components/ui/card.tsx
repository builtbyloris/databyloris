import type {HTMLAttributes} from "react";
import {cn} from "@/lib/cn";

export function Card({className, ...props}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-card border border-border bg-card shadow-card backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}
