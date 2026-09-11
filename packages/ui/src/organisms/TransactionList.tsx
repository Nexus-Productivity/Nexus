import React from "react";
import { TransactionItem } from "../molecules/TransactionItem";

interface TransactionListProps {
  transactions: Array<{
    id: string;
    description: string;
    amount: number;
    date: string;
    type: "income" | "expense" | "transfer";
  }>;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions = [],
  loading = false,
  emptyMessage = "No hay movimientos",
  className = ""
}) => {
  if (loading) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <span className="inline-block animate-spin rounded-full border-2 border-nexus-brand border-t-transparent w-8 h-8"></span>
        <p className="mt-2 text-sm text-nexus-muted">Cargando...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-sm text-nexus-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`divide-y divide-nexus-border bg-nexus-surface border border-nexus-border rounded-lg ${className}`}>
      {transactions.map((tx) => (
        <TransactionItem
          key={tx.id}
          id={tx.id}
          description={tx.description}
          amount={tx.amount}
          date={tx.date}
          type={tx.type}
        />
      ))}
    </div>
  );
};