import Link from "next/link";
import type { ComponentPropsWithRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ComponentPropsWithRef<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export type ButtonLinkProps = ComponentPropsWithRef<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-accent bg-accent text-accent-contrast hover:border-accent-hover hover:bg-accent-hover",
  secondary:
    "border-border bg-surface-primary text-text-primary hover:border-accent hover:bg-accent-subtle hover:text-accent",
  ghost:
    "border-transparent bg-transparent text-text-secondary hover:bg-surface-secondary hover:text-text-primary",
  danger:
    "border-danger bg-danger text-danger-contrast hover:brightness-110",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-10 px-4 text-sm",
  lg: "min-h-12 px-5 text-base",
  icon: "size-11 p-0",
};

function buttonClassName(
  variant: ButtonVariant,
  size: ButtonSize,
  className: string,
) {
  return `inline-flex items-center justify-center gap-2 rounded-control border font-medium transition-colors ${variants[variant]} ${sizes[size]} ${className}`;
}

export function Button({
  className = "",
  type = "button",
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${buttonClassName(variant, size, className)} disabled:pointer-events-none disabled:opacity-50`}
      {...props}
    />
  );
}

export function ButtonLink({
  className = "",
  variant = "primary",
  size = "md",
  ...props
}: ButtonLinkProps) {
  return <Link className={buttonClassName(variant, size, className)} {...props} />;
}
