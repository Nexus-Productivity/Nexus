import React from "react";

interface PagePlaceholderProps {
  title: string;
  description: string;
  phase?: string;
  icon?: React.ReactNode;
  className?: string;
}

/** Sección del módulo en desarrollo (fase 2). Tarjeta centrada sin navegación extra. */
export const PagePlaceholder: React.FC<PagePlaceholderProps> = ({
  title,
  description,
  phase = "Disponible en una próxima fase",
  icon,
  className = ""
}) => (
  <div className={`flex min-h-[60vh] items-center justify-center ${className}`}>
    <div className="max-w-md rounded-2xl border border-dashed border-nexus-border bg-nexus-surface p-10 text-center">
      <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-nexus-gold-soft text-nexus-gold-strong">
        {icon}
      </span>
      <h2 className="mt-5 text-xl font-semibold text-nexus-ink">{title}</h2>
      <p className="mt-2 text-sm text-nexus-muted">{description}</p>
      <span className="mt-6 inline-block rounded-full bg-nexus-surface-alt px-3 py-1 text-xs font-medium text-nexus-muted">
        {phase}
      </span>
    </div>
  </div>
);