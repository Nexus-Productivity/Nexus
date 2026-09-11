import React from "react";
import { ChevronLeftIcon, LogOutIcon } from "../atoms/Icons";

export interface SidebarItem {
  label: string;
  href: string;
  disabled?: boolean;
}

export interface SidebarSection {
  label: string;
  items: SidebarItem[];
}

export interface SidebarUser {
  name: string;
  initials: string;
}

interface SidebarProps {
  /** Volver al selector de módulos (nivel app). */
  backHref: string;
  backLabel?: string;
  title: string;
  icon?: React.ReactNode;
  sections: SidebarSection[];
  user?: SidebarUser;
  /** Sobre qué href marcar el ítem activo. */
  activeHref?: string;
  className?: string;
}

/**
 * Sidebar específico del módulo, con navegación agrupada:
 * OPERACIÓN (uso diario) · CONTROL (revisión) · MÓDULO (config del módulo).
 */
export const Sidebar: React.FC<SidebarProps> = ({
  backHref,
  backLabel = "Módulos",
  title,
  icon,
  sections,
  user,
  activeHref,
  className = ""
}) => (
  <aside
    className={`flex w-64 shrink-0 flex-col border-r border-nexus-border bg-nexus-surface ${className}`}
  >
    <div className="px-4 pb-3 pt-4">
      <a
        href={backHref}
        className="inline-flex items-center gap-1 text-sm font-medium text-nexus-muted transition hover:text-nexus-ink"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        {backLabel}
      </a>
    </div>

    <div className="flex items-center gap-2 border-b border-nexus-border px-4 py-3">
      {icon && <span className="text-nexus-brand">{icon}</span>}
      <span className="text-sm font-semibold text-nexus-ink">{title}</span>
    </div>

    <nav className="flex-1 overflow-y-auto px-3 py-4">
      {sections.map((section) => (
        <div key={section.label} className="mb-5">
          <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-nexus-muted">
            {section.label}
          </p>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const isActive = !item.disabled && item.href === activeHref;
              if (item.disabled) {
                return (
                  <li key={item.label}>
                    <span className="block cursor-not-allowed rounded-md px-3 py-2 text-sm text-nexus-muted/60">
                      {item.label}
                    </span>
                  </li>
                );
              }
              return (
                <li key={item.label}>
                  <a
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`block rounded-md px-3 py-2 text-sm transition ${
                      isActive
                        ? "bg-nexus-gold-soft font-medium text-nexus-gold-strong"
                        : "text-nexus-ink hover:bg-nexus-surface-alt"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>

    {user && (
      <div className="flex items-center justify-between border-t border-nexus-border px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-nexus-ink text-xs font-bold text-white">
            {user.initials}
          </span>
          <span className="truncate text-sm font-medium text-nexus-ink">{user.name}</span>
        </div>
        <a
          href="#"
          title="Cerrar sesión"
          className="rounded-md p-2 text-nexus-muted transition hover:bg-nexus-surface-alt hover:text-nexus-ink"
        >
          <LogOutIcon className="h-4 w-4" />
        </a>
      </div>
    )}
  </aside>
);