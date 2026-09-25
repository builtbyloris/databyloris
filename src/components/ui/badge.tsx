import type { HTMLAttributes } from "react";

type BadgeVariant = "neutral" | "accent" | "success" | "warning" | "danger";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
  neutral: "border-border bg-surface-secondary text-text-secondary",
  accent: "border-accent/25 bg-accent-subtle text-accent",
  success: "border-success/25 bg-success-subtle text-success",
  warning: "border-warning/25 bg-warning-subtle text-warning",
  danger: "border-danger/25 bg-danger-subtle text-danger",
};

export function Badge({
  className = "",
  variant = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex min-h-6 max-w-full items-center whitespace-normal break-words rounded-badge border px-2 py-0.5 text-xs font-semibold tracking-wide ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
