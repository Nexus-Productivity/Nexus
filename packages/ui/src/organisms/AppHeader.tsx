import React from "react";
import { SparkleIcon } from "../atoms/Icons";

export interface AppHeaderLink {
  label: string;
  href: string;
}

export interface AppHeaderUser {
  name: string;
  initials: string;
  href?: string;
}

interface AppHeaderProps {
  /** A dónde lleva el logo (home de Nexus Finance). */
  appHref?: string;
  /** Etiqueta junto al wordmark (ej: "Finance"). */
  brandLabel?: string;
  /** Links globales de nivel app (Usuarios, Configuración). */
  links?: AppHeaderLink[];
  user?: AppHeaderUser;
  className?: string;
}

/** Barra superior global de Nexus Finance — siempre visible, compartida por todos los módulos. */
export const AppHeader: React.FC<AppHeaderProps> = ({
  appHref = "/",
  brandLabel = "",
  links = [],
  user,
  className = ""
}) => (
  <header
    className={`sticky top-0 z-20 flex h-16 items-center justify-between border-b border-nexus-border bg-nexus-surface px-4 lg:px-6 ${className}`}
  >
    <a href={appHref} className="flex items-center gap-2 transition hover:opacity-80">
      <span className="text-lg font-black italic tracking-tight text-nexus-ink">NEXUS</span>
      <SparkleIcon className="text-nexus-brand" />
      {brandLabel && (
        <span className="ml-1 text-sm font-medium text-nexus-muted">{brandLabel}</span>
      )}
    </a>

    <div className="flex items-center gap-1">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className="rounded-md px-3 py-2 text-sm font-medium text-nexus-muted transition hover:bg-nexus-surface-alt hover:text-nexus-ink"
        >
          {link.label}
        </a>
      ))}
      {user && (
        <a
          href={user.href ?? "#"}
          className="ml-2 flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition hover:bg-nexus-surface-alt"
          title={user.name}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-nexus-ink text-xs font-bold text-white">
            {user.initials}
          </span>
          <span className="hidden text-sm font-medium text-nexus-ink sm:block">{user.name}</span>
        </a>
      )}
    </div>
  </header>
);