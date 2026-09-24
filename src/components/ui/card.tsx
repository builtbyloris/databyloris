import type { HTMLAttributes } from "react";

type CardSurface = "primary" | "secondary" | "elevated";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  surface?: CardSurface;
}

const surfaces: Record<CardSurface, string> = {
  primary: "bg-surface-primary",
  secondary: "bg-surface-secondary",
  elevated: "bg-surface-elevated shadow-elevated",
};

export function Card({
  className = "",
  surface = "primary",
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-card border border-border ${surfaces[surface]} ${className}`}
      {...props}
    />
  );
}

export function CardHeader({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={`space-y-1.5 p-5 sm:p-6 ${className}`} {...props} />;
}

export function CardTitle({
  className = "",
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`text-lg font-semibold tracking-tight text-text-primary ${className}`}
      {...props}
    />
  );
}

export function CardDescription({
  className = "",
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-sm leading-6 text-text-secondary ${className}`} {...props} />
  );
}

export function CardContent({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={`px-5 pb-5 sm:px-6 sm:pb-6 ${className}`} {...props} />;
}

export function CardFooter({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`flex items-center gap-3 border-t border-border px-5 py-4 sm:px-6 ${className}`}
      {...props}
    />
  );
}
