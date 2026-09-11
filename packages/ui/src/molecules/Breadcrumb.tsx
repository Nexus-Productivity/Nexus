import React from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/** Migaja de pan: Nexus Finance › Caja menor (refuerza el nivel de jerarquía). */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = "" }) => (
  <nav aria-label="Breadcrumb" className={`flex items-center gap-2 text-sm ${className}`}>
    {items.map((item, i) => (
      <span key={i} className="flex items-center gap-2">
        {i > 0 && <span className="text-nexus-muted">›</span>}
        {item.href ? (
          <a href={item.href} className="text-nexus-muted transition hover:text-nexus-ink">
            {item.label}
          </a>
        ) : (
          <span className="font-medium text-nexus-ink">{item.label}</span>
        )}
      </span>
    ))}
  </nav>
);