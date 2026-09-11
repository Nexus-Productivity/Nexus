import React from "react";

/** Descripción tipada de un módulo de Nexus Finance. */
export interface ModuleCardData {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
  enabled: boolean;
  status?: string;
}

interface ModuleCardProps {
  module: ModuleCardData;
  className?: string;
}

/** Tarjeta del selector de módulos: activa (clickeable) o placeholder "Próximamente". */
export const ModuleCard: React.FC<ModuleCardProps> = ({ module, className = "" }) => {
  const inner = (
    <>
      <span
        className={`inline-flex h-11 w-11 items-center justify-center rounded-lg ${
          module.enabled
            ? "bg-nexus-gold-soft text-nexus-gold-strong"
            : "bg-nexus-surface-alt text-nexus-muted"
        }`}
      >
        {module.icon}
      </span>
      <span className="mt-4 block">
        <span className="flex items-center gap-2">
          <span className="text-base font-semibold text-nexus-ink">{module.name}</span>
          {!module.enabled && (
            <span className="rounded-full bg-nexus-surface-alt px-2 py-0.5 text-[11px] font-medium text-nexus-muted">
              {module.status ?? "Próximamente"}
            </span>
          )}
        </span>
        <span className="mt-1 block text-sm text-nexus-muted">{module.description}</span>
      </span>
    </>
  );

  const base =
    "block w-full rounded-xl border p-5 text-left transition focus:outline-none focus:ring-2 focus:ring-nexus-brand";

  if (module.enabled && module.href) {
    return (
      <a href={module.href} className={`${base} border-nexus-border bg-nexus-surface hover:border-nexus-brand/40 hover:shadow-sm ${className}`}>
        {inner}
      </a>
    );
  }

  return (
    <div
      aria-disabled="true"
      className={`${base} cursor-not-allowed border-dashed border-nexus-border bg-nexus-surface/50 opacity-70 ${className}`}
    >
      {inner}
    </div>
  );
};