import {
  WalletIcon,
  type AppHeaderLink,
  type AppHeaderUser,
  type CajaMenorDashboardLayoutSidebar,
} from "@nexus/ui";

/** URL de la app shell (selector de módulos). Nivel app → módulo. */
export const APP_SHELL_URL =
  process.env.NEXT_PUBLIC_APP_SHELL_URL ?? "http://localhost:3001";

/** Usuario de ejemplo (MVP sin auth). */
export const CURRENT_USER: AppHeaderUser = {
  name: "Laura Rivas",
  initials: "LR",
};

/** Links globales de nivel app (quedan fuera del sidebar del módulo). */
export const APP_HEADER_LINKS: AppHeaderLink[] = [
  { label: "Usuarios", href: `${APP_SHELL_URL}/usuarios` },
  { label: "Configuración", href: `${APP_SHELL_URL}/configuracion` },
];

/**
 * Sidebar del módulo Caja Menor, agrupado:
 * OPERACIÓN (uso diario) · CONTROL (revisión) · MÓDULO (config del módulo).
 */
export const MODULE_SECTIONS = [
  {
    label: "Operación",
    items: [
      { label: "Dashboard", href: "/" },
      { label: "Movimientos", href: "/movimientos" },
      { label: "Solicitudes", href: "/solicitudes" },
      { label: "Arqueos", href: "/arqueos" },
    ],
  },
  {
    label: "Control",
    items: [
      { label: "Comprobantes", href: "/comprobantes" },
      { label: "Reportes", href: "/reportes" },
      { label: "Auditoría", href: "/auditoria" },
    ],
  },
  {
    label: "Módulo",
    items: [{ label: "Categorías", href: "/categorias" }],
  },
];

export function moduleSidebar(activeHref: string): CajaMenorDashboardLayoutSidebar {
  return {
    backHref: APP_SHELL_URL,
    backLabel: "Módulos",
    title: "Caja menor",
    icon: <WalletIcon />,
    sections: MODULE_SECTIONS,
    user: CURRENT_USER,
    activeHref,
  };
}