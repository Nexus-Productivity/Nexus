"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PackageSearch } from "lucide-react";
import { iconoModulo } from "@/lib/iconos";

interface SidebarModule {
  slug: string;
  nombre: string;
}

interface NegocioSidebarProps {
  negocioSlug: string;
  negocioNombre: string;
  modulos: SidebarModule[];
}

/**
 * Sidebar del NEGOCIO — navegación estilo corporativo:
 * Dashboard (el home del negocio, con gráficas) + cada módulo ACTIVO.
 * El catálogo queda al pie para pedir más capacidades.
 */
export function NegocioSidebar({ negocioSlug, negocioNombre, modulos }: NegocioSidebarProps) {
  const pathname = usePathname();
  const base = `/negocios/${negocioSlug}`;
  const enDashboard = pathname === base;

  const itemClase = (activo: boolean) =>
    `flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition ${
      activo
        ? "bg-nexus-gold-soft text-nexus-gold-strong"
        : "text-nexus-muted hover:bg-nexus-surface-alt hover:text-nexus-ink"
    }`;

  return (
    <nav className="flex h-full flex-col gap-7 px-3 py-6">
      <div>
          <p className="px-2.5 text-[11px] font-semibold uppercase tracking-widest text-nexus-muted">
            {negocioNombre}
          </p>
          <ul className="mt-2 space-y-0.5">
            <li>
              <Link href={base} className={itemClase(enDashboard)}>
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {modulos.length > 0 && (
          <div>
            <p className="px-2.5 text-[11px] font-semibold uppercase tracking-widest text-nexus-muted">
              Módulos
            </p>
            <ul className="mt-2 space-y-0.5">
              {modulos.map((m) => {
                const href = `${base}/${m.slug}`;
                const activo = pathname.startsWith(href);
                const Icono = iconoModulo(m.slug);
                return (
                  <li key={m.slug}>
                    <Link href={href} className={itemClase(activo)}>
                      <Icono className="h-4 w-4" />
                      {m.nombre}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="mt-auto border-t border-nexus-border/70 pt-4">
          <Link
            href="/explorar"
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-nexus-muted transition hover:bg-nexus-surface-alt hover:text-nexus-ink"
          >
            <PackageSearch className="h-4 w-4" />
            Explorar catálogo
          </Link>
        </div>
      </nav>
  );
}