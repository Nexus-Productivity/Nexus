import React from "react";
import { CurrencyDisplay } from "../molecules/CurrencyDisplay";

interface BalanceSummaryProps {
  income: number;
  expenses: number;
  className?: string;
}

export const BalanceSummary: React.FC<BalanceSummaryProps> = ({
  income,
  expenses,
  className = ""
}) => {
  const net = income + expenses;

  return (
    <div className={`grid gap-4 p-6 bg-nexus-surface border border-nexus-border rounded-lg ${className}`}>
      <div className="text-center">
        <h3 className="text-sm font-medium text-nexus-muted">Ingresos</h3>
        <p className="mt-1">
          <CurrencyDisplay amount={income} showSign />
        </p>
      </div>

      <div className="text-center">
        <h3 className="text-sm font-medium text-nexus-muted">Gastos</h3>
        <p className="mt-1">
          <CurrencyDisplay amount={expenses} showSign />
        </p>
      </div>

      <div className="text-center">
        <h3 className="text-sm font-medium text-nexus-muted">Balance</h3>
        <p className="mt-1 text-nexus-ink">
          <CurrencyDisplay amount={net} showSign className="font-bold" />
        </p>
      </div>
    </div>
  );
};