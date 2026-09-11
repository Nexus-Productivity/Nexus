import React from "react";

interface DateInputProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  min?: string;
  max?: string;
}

export const DateInput: React.FC<DateInputProps> = ({
  value = "",
  onChange,
  placeholder = "Seleccionar fecha",
  className = "",
  min,
  max
}) => {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`block w-full rounded-md border border-nexus-border bg-nexus-surface px-3 py-2 text-sm text-nexus-ink focus:outline-none focus:ring-2 focus:ring-nexus-brand/30 ${className}`}
      min={min}
      max={max}
    />
  );
};