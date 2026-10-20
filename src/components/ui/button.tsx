import type {ButtonHTMLAttributes} from "react";
import {cn} from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary:
    "border border-transparent bg-primary text-primary-contrast shadow-soft hover:-translate-y-0.5 hover:bg-primary-strong hover:shadow-card active:translate-y-0",
  secondary:
    "border border-border bg-surface text-foreground hover:-translate-y-0.5 hover:border-primary/35 hover:bg-surface-raised active:translate-y-0",
  ghost: "text-muted hover:bg-surface-raised hover:text-foreground",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-control font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out motion-reduce:transform-none disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button className={buttonStyles({variant, size, className})} {...props} />
  );
}
