import React from "react";
import {
  AppHeader,
  type AppHeaderLink,
  type AppHeaderUser,
} from "../organisms/AppHeader";
import { ModuleGrid } from "../organisms/ModuleGrid";
import type { ModuleCardData } from "../molecules/ModuleCard";

interface ModulesHomePageProps {
  modules: ModuleCardData[];
  header?: {
    appHref?: string;
    brandLabel?: string;
    links?: AppHeaderLink[];
    user?: AppHeaderUser;
  };
  className?: string;
}

/** Pantalla 1 — Selector de módulos (home de Nexus Finance). */
export const ModulesHomePage: React.FC<ModulesHomePageProps> = ({
  modules,
  header,
  className = ""
}) => (
  <div className={`min-h-screen bg-nexus-bg ${className}`}>
    <AppHeader
      appHref={header?.appHref ?? "/"}
      brandLabel={header?.brandLabel ?? "Finance"}
      links={header?.links ?? []}
      user={header?.user}
    />
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-semibold text-nexus-ink">Tus módulos</h1>
      <p className="mt-2 text-sm text-nexus-muted">
        Seleccioná un módulo para entrar
      </p>
      <ModuleGrid modules={modules} className="mt-8" />
    </main>
  </div>
);