import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { iconoModulo } from "@/lib/iconos";

interface ModuloCardProps {
  slug: string;
  nombre: string;
  descripcion: string;
  href?: string;
  estado: "ACTIVO" | "SOLICITADO" | "SUGERIDO";
  /** Módulo BASE: viene incluido por defecto (badge azul/dorado). */
  esBase?: boolean;
}

/**
 * Tarjeta de un módulo en el contexto de un negocio.
 * ACTIVO → entra al módulo · SOLICITADO → badge de solicitud enviada.
 */
export function ModuloCard({ slug, nombre, descripcion, href, estado, esBase = false }: ModuloCardProps) {
  const Icono = iconoModulo(slug);

  const inner = (
    <>
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-nexus-gold-soft text-nexus-gold-strong">
        <Icono className="h-6 w-6" />
      </span>
      <span className="mt-5 block">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-base font-semibold text-nexus-ink">{nombre}</span>
          {estado === "SOLICITADO" && (
            <span className="rounded-full bg-nexus-surface-alt px-2 py-0.5 text-[11px] font-medium text-nexus-muted">
              Solicitud enviada
            </span>
          )}
          {esBase && (
            <span className="rounded-full bg-nexus-gold-soft px-2 py-0.5 text-[11px] font-medium text-nexus-gold-strong">
              Incluido por defecto
            </span>
          )}
        </span>
        <span className="mt-1 block text-sm text-nexus-muted">{descripcion}</span>
      </span>
    </>
  );

  const base =
    "block w-full rounded-2xl border p-6 text-left transition focus:outline-none focus:ring-2 focus:ring-nexus-brand";

  if (href && estado === "ACTIVO") {
    return (
      <Link
        href={href}
        className={`${base} group border-nexus-border bg-nexus-surface hover:border-nexus-brand/40 hover:shadow-md hover:shadow-nexus-ink/5`}
      >
        {inner}
        <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-nexus-brand opacity-0 transition group-hover:opacity-100">
          Entrar
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </Link>
    );
  }

  return (
    <div
      aria-disabled="true"
      className={`${base} cursor-not-allowed border-dashed border-nexus-border bg-nexus-surface/50 opacity-70`}
    >
      {inner}
    </div>
  );
}