import React from "react";

interface CurrencyDisplayProps {
  amount: number;
  currencyCode?: string;
  showSign?: boolean;
  className?: string;
}

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  amount,
  currencyCode = "ARS",
  showSign = false,
  className = ""
}) => {
  const formatted = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currencyCode
  }).format(Math.abs(amount));

  const sign = showSign ? (amount >= 0 ? "+" : "-") : amount < 0 ? "-" : "";
  const amountClass =
    amount >= 0 ? "text-nexus-green-strong" : "text-nexus-red-strong";

  return (
    <span className={`${amountClass} ${className}`}>
      {sign}
      {formatted}
    </span>
  );
};