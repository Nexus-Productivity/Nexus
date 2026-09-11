"use client";
import React, { useState } from "react";

interface CurrencyInputProps {
  value?: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value = 0,
  onChange,
  placeholder = "0.00",
  className = ""
}) => {
  const [displayValue, setDisplayValue] = useState(() =>
    value ? value.toFixed(2) : ""
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const cleaned = rawValue.replace(/[^0-9.]/g, "");
    const [intPart, decPart = ""] = cleaned.split(".");
    setDisplayValue(intPart + (cleaned.includes(".") ? "." + decPart.slice(0, 2) : ""));
    const num = parseFloat(cleaned) || 0;
    onChange(num);
  };

  return (
    <input
      type="text"
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={`block w-full rounded-md border border-nexus-border bg-nexus-surface px-3 py-2 text-sm text-nexus-ink placeholder:text-nexus-muted focus:outline-none focus:ring-2 focus:ring-nexus-brand/30 ${className}`}
      inputMode="decimal"
    />
  );
};