import React from "react";
import {
  AppHeader,
  type AppHeaderLink,
  type AppHeaderUser,
} from "../organisms/AppHeader";
import {
  Sidebar,
  type SidebarSection,
  type SidebarUser,
} from "../organisms/Sidebar";

export interface CajaMenorDashboardLayoutSidebar {
  backHref: string;
  backLabel?: string;
  title: string;
  icon?: React.ReactNode;
  sections: SidebarSection[];
  user?: SidebarUser;
  activeHref?: string;
}

interface CajaMenorDashboardLayoutProps {
  children: React.ReactNode;
  /** Configuración del header global (nivel app). */
  header?: {
    appHref?: string;
    brandLabel?: string;
    links?: AppHeaderLink[];
    user?: AppHeaderUser;
  };
  /** Configuración del sidebar específico del módulo. */
  sidebar?: CajaMenorDashboardLayoutSidebar;
  /** Sidebar por composición (legacy) — si se pasa, reemplaza al sidebar configurado. */
  sidebarContent?: React.ReactNode;
  className?: string;
}

/**
 * Layout del módulo Caja Menor: header global de Nexus Finance arriba,
 * sidebar del módulo a la izquierda y contenido principal.
 */
export const CajaMenorDashboardLayout: React.FC<CajaMenorDashboardLayoutProps> = ({
  children,
  header,
  sidebar,
  sidebarContent,
  className = ""
}) => (
  <div className={`flex min-h-screen flex-col bg-nexus-bg ${className}`}>
    <AppHeader
      appHref={header?.appHref ?? "/"}
      brandLabel={header?.brandLabel ?? "Finance"}
      links={header?.links ?? []}
      user={header?.user}
    />

    <div className="flex flex-1">
      {sidebarContent ? (
        <aside className="w-64 shrink-0 border-r border-nexus-border bg-nexus-surface">
          {sidebarContent}
        </aside>
      ) : (
        sidebar && (
          <Sidebar
            backHref={sidebar.backHref}
            backLabel={sidebar.backLabel}
            title={sidebar.title}
            icon={sidebar.icon}
            sections={sidebar.sections}
            user={sidebar.user}
            activeHref={sidebar.activeHref}
          />
        )
      )}

      <main className="min-w-0 flex-1 p-4 lg:p-8">{children}</main>
    </div>
  </div>
);