import React from "react";

export type TransactionTagVariant = "income" | "expense" | "transfer";

interface TransactionTagProps {
  type: TransactionTagVariant;
  label?: string;
  className?: string;
}

const typeConfig: Record<
  TransactionTagVariant,
  { bg: string; text: string; label: string }
> = {
  income: { bg: "bg-nexus-green-soft", text: "text-nexus-green-strong", label: "Ingreso" },
  expense: { bg: "bg-nexus-red-soft", text: "text-nexus-red-strong", label: "Gasto" },
  transfer: { bg: "bg-nexus-gold-soft", text: "text-nexus-gold-strong", label: "Transferencia" },
};

/** Badge semántico de tipo de movimiento (verde/rojo/dorado en sus 3 tonos). */
export const TransactionTag: React.FC<TransactionTagProps> = ({
  type = "income",
  label,
  className = ""
}) => {
  const config = typeConfig[type] ?? typeConfig.income;
  const displayLabel = label ?? config.label;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text} ${className}`}
    >
      {displayLabel}
    </span>
  );
};