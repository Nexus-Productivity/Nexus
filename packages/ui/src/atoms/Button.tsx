import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "gold" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = negro (CTA principal) · secondary = blanco con borde · gold = atención · ghost = texto */
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-nexus-ink text-white hover:bg-nexus-ink/85 focus:ring-nexus-ink",
  secondary:
    "bg-nexus-surface text-nexus-ink border border-nexus-border hover:bg-nexus-surface-alt focus:ring-nexus-border",
  gold:
    "bg-nexus-gold-soft text-nexus-gold-strong border border-nexus-gold/30 hover:bg-nexus-gold/15 focus:ring-nexus-gold",
  ghost: "text-nexus-ink hover:bg-nexus-surface-alt focus:ring-nexus-border",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

/** Botón base del ecosistema Nexus — CTA primaria negro, dorado solo semántico. */
export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
}