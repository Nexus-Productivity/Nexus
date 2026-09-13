import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, Receipt, Users, Wallet } from "lucide-react";
import { getOrgActiva } from "@/lib/org";
import { gymHabilitado } from "@/lib/gym";

export const dynamic = "force-dynamic";

/**
 * MÓDULO GYM — layout del módulo: solo se entra si la org lo tiene ACTIVO.
 * El subnav es interno del módulo; la base Nexus no sabe nada de esto.
 */
export default async function GymModuleLayout({ children }: { children: React.ReactNode }) {
  const { org } = await getOrgActiva();
  if (!(await gymHabilitado(org.id))) redirect("/");

  const nav = [
    { href: "/gym", label: "Dashboard", icon: LayoutDashboard },
    { href: "/gym/clientes", label: "Clientes", icon: Users },
    { href: "/gym/pagos", label: "Pagos", icon: Wallet },
    { href: "/gym/gastos", label: "Gastos", icon: Receipt },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-nexus-muted">
            Módulo Gym
          </p>
          <p className="text-sm text-nexus-muted">
            Socios, membresías y cobros · {org.nombre}
          </p>
        </div>
        <Link
          href="/"
          className="rounded-lg border border-nexus-border px-3 py-1.5 text-sm font-medium text-nexus-muted transition hover:bg-nexus-surface-alt hover:text-nexus-ink"
        >
          Panel principal
        </Link>
      </div>

      <nav className="flex flex-wrap gap-1 border-b border-nexus-border/70 pb-px">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-1.5 rounded-t-lg border border-b-0 border-transparent px-3 py-2 text-sm font-medium text-nexus-muted transition hover:bg-nexus-surface-alt hover:text-nexus-ink"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  );
}