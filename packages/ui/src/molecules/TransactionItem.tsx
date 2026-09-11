import React from "react";
import { CurrencyDisplay } from "./CurrencyDisplay";
import { TransactionTag } from "../atoms/TransactionTag";

interface TransactionItemProps {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: "income" | "expense" | "transfer";
  className?: string;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  description,
  amount,
  date,
  type,
  className = ""
}) => {
  const formattedDate = new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  return (
    <div className={`flex items-start justify-between gap-4 p-4 border rounded-lg bg-nexus-surface border-nexus-border ${className}`}>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-nexus-ink line-clamp-1">
          {description}
        </h3>
        <p className="mt-1 text-sm text-nexus-muted">
          {formattedDate}
        </p>
      </div>
      <div className="flex items-baseline gap-3">
        <CurrencyDisplay amount={amount} showSign className="text-right" />
        <TransactionTag type={type} className="ml-2" />
      </div>
    </div>
  );
};