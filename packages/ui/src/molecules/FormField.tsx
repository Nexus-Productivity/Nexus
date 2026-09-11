import React from "react";

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  className?: string;
  helperText?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  children,
  error,
  className = "",
  helperText = ""
}) => {
  return (
    <div className={`${className} mb-4`}>
      <span className="block mb-2 text-sm font-medium text-nexus-ink">{label}</span>
      <div className="flex w-full">{children}</div>
      {helperText && (
        <p className="mt-1 text-xs text-nexus-muted">{helperText}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-nexus-red-text">{error}</p>
      )}
    </div>
  );
};