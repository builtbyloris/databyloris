import type {HTMLAttributes} from "react";
import {cn} from "@/lib/cn";

export function Badge({className, ...props}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary-strong",
        className,
      )}
      {...props}
    />
  );
}
