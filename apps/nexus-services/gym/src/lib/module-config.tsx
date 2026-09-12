import { CoinsIcon, type AppHeaderUser, type CajaMenorDashboardLayoutSidebar } from "@nexus/ui";
import { CURRENT_USER, ORG } from "./org";

/**
 * Sidebar del módulo Gym, agrupado:
 * OPERACIÓN (uso diario) · NEGOCIO (métricas) · PRÓXIMAMENTE (roadmap de la demo).
 */
export const GYM_SECTIONS = [
  {
    label: "Operación",
    items: [
      { label: "Panel de control", href: "/" },
      { label: "Historial de efectivo", href: "/historial" },
    ],
  },
  {
    label: "Negocio",
    items: [
      { label: "Métricas", href: "/#metricas" },
    ],
  },
  {
    label: "Próximamente",
    items: [
      { label: "Clientes", href: "/clientes" },
      { label: "Reportes", href: "/reportes", disabled: true },
      { label: "Membresías", href: "/membresias", disabled: true },
    ],
  },
];

/** Header global de nivel app (demo). La marca es Nexus, el cliente se ve en el sidebar. */
export const GYM_HEADER_USER: AppHeaderUser = {
  name: CURRENT_USER.name,
  initials: CURRENT_USER.initials,
};

export function gymSidebar(activeHref: string): CajaMenorDashboardLayoutSidebar {
  return {
    backHref: "/",
    backLabel: "Nexus",
    title: ORG.name,
    icon: <CoinsIcon />,
    sections: GYM_SECTIONS,
    user: CURRENT_USER,
    activeHref,
  };
}