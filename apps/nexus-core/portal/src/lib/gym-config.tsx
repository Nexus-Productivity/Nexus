import { CoinsIcon, type AppHeaderUser, type CajaMenorDashboardLayoutSidebar } from "@nexus/ui";

/**
 * Sidebar del módulo Gym, agrupado:
 * OPERACIÓN (uso diario) · NEGOCIO (métricas) · PRÓXIMAMENTE (roadmap de la demo).
 * Las rutas se construyen con la base del negocio: /negocios/[slug]/gym/...
 */
const GYM_SECTIONS = [
  {
    label: "Operación",
    items: [
      { label: "Panel de control", href: "/" },
      { label: "Historial de efectivo", href: "/historial" },
    ],
  },
  {
    label: "Negocio",
    items: [{ label: "Métricas", href: "/#metricas" }],
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

export function gymHeaderUser(nombre: string): AppHeaderUser {
  const initials = nombre
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return { name: nombre, initials };
}

export function gymSidebar(
  orgNombre: string,
  slug: string,
  activeHref: string,
  userNombre: string
): CajaMenorDashboardLayoutSidebar {
  const base = `/negocios/${slug}/gym`;
  return {
    backHref: `/negocios/${slug}`,
    backLabel: "Módulos",
    title: orgNombre,
    icon: <CoinsIcon />,
    sections: GYM_SECTIONS.map((s) => ({
      ...s,
      items: s.items.map((i) =>
        i.href.startsWith("/#") ? i : { ...i, href: `${base}${i.href}` }
      ),
    })),
    user: {
      name: userNombre,
      initials: gymHeaderUser(userNombre).initials,
    },
    activeHref,
  };
}