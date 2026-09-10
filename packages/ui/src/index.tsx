import type { ButtonHTMLAttributes } from "react";

export const version = "0.0.0";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

/** Botón base del ecosistema Nexus (estética: espacio negro + dorado). */
export function Button({ className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md bg-nexus-gold px-4 py-2 text-sm font-medium text-nexus-bg transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-nexus-amber disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}