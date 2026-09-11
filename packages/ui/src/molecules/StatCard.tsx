import React from "react";

export type StatTone = "neutral" | "gold" | "green" | "red";

interface StatCardProps {
  label: string;
  value: string;
  tone?: StatTone;
  footnote?: string;
  className?: string;
}

const cardClasses: Record<StatTone, string> = {
  neutral: "bg-nexus-surface border-nexus-border",
  gold: "bg-nexus-gold-soft border-nexus-gold/30",
  green: "bg-nexus-green-soft border-nexus-green/30",
  red: "bg-nexus-red-soft border-nexus-red/30",
};

const labelClasses: Record<StatTone, string> = {
  neutral: "text-nexus-muted",
  gold: "text-nexus-gold-text",
  green: "text-nexus-green-text",
  red: "text-nexus-red-text",
};

const valueClasses: Record<StatTone, string> = {
  neutral: "text-nexus-ink",
  gold: "text-nexus-gold-strong",
  green: "text-nexus-green-strong",
  red: "text-nexus-red-strong",
};

/** Tarjeta de métrica — Saldo (dorado), Ingresos (verde), Gastos (rojo), neutro. */
export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  tone = "neutral",
  footnote,
  className = ""
}) => (
  <div className={`rounded-xl border p-5 ${cardClasses[tone]} ${className}`}>
    <p className={`text-xs font-medium uppercase tracking-wider ${labelClasses[tone]}`}>
      {label}
    </p>
    <p className={`mt-2 text-2xl font-semibold tabular-nums ${valueClasses[tone]}`}>
      {value}
    </p>
    {footnote && <p className={`mt-1 text-xs ${labelClasses[tone]}`}>{footnote}</p>}
  </div>
);