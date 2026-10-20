import type {HTMLAttributes} from "react";
import {cn} from "@/lib/cn";

export function Badge({className, ...props}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "site-overline inline-flex items-center rounded-control border border-border bg-surface-raised px-3 py-1.5 text-primary-strong",
        className,
      )}
      {...props}
    />
  );
}
