import React from "react";

export type IconButtonVariant = "primary" | "outline" | "gold" | "ghost";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  className?: string;
}

const variantClasses: Record<IconButtonVariant, string> = {
  primary:
    "bg-nexus-ink text-white hover:bg-nexus-ink/85 focus:ring-nexus-ink",
  outline:
    "border border-nexus-border bg-nexus-surface text-nexus-ink hover:bg-nexus-surface-alt focus:ring-nexus-border",
  gold: "bg-nexus-gold-soft text-nexus-gold-strong border border-nexus-gold/30 hover:bg-nexus-gold/15 focus:ring-nexus-gold",
  ghost: "text-nexus-ink hover:bg-nexus-surface-alt focus:ring-nexus-border",
};

/** IconButton del ecosistema Nexus, variantes alineadas con la paleta semántica. */
export const IconButton: React.FC<IconButtonProps> = ({
  variant = "outline",
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50";
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
};