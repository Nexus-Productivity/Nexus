"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ChevronDown } from "lucide-react";
import { setNegocioActivo } from "@/lib/actions";
import type { NegocioInfo } from "@/lib/session";

interface SelectorNegocioProps {
  negocios: NegocioInfo[];
  activoSlug: string;
  /** Mostrar también "Nuevo negocio" dentro del select. */
  conNuevo?: boolean;
}

/**
 * SELECT del negocio ACTIVO (navbar): el nombre desplegado cambia de org
 * entre los negocios del miembro, o abre "Nuevo negocio".
 */
export function SelectorNegocio({ negocios, activoSlug, conNuevo = false }: SelectorNegocioProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const activo = negocios.find((n) => n.slug === activoSlug) ?? negocios[0];

  function cambiar(slug: string) {
    if (slug === activoSlug) return;
    startTransition(async () => {
      await setNegocioActivo(slug);
      router.push(`/negocios/${slug}`);
      router.refresh();
    });
  }

  return (
    <div className="relative">
      <label className="pointer-events-none absolute -top-2 left-3 z-10 bg-nexus-surface px-1 text-[10px] font-medium uppercase tracking-wide text-nexus-muted">
        Negocio
      </label>
      <select
        value={activo?.slug ?? ""}
        disabled={isPending}
        aria-label="Negocio activo"
        onChange={(e) => {
          const v = e.target.value;
          if (v === "__nuevo") {
            router.push("/nuevo-negocio");
            return;
          }
          cambiar(v);
        }}
        className="h-10 min-w-[180px] max-w-[240px] cursor-pointer appearance-none rounded-lg border border-nexus-border bg-nexus-surface pr-8 pl-3 text-sm font-medium text-nexus-ink transition focus:border-nexus-brand focus:outline-none focus:ring-2 focus:ring-nexus-brand/20"
      >
        {negocios.map((n) => (
          <option key={n.slug} value={n.slug}>
            {n.nombre}
          </option>
        ))}
        {conNuevo && (
          <option value="__nuevo">
            + Nuevo negocio
          </option>
        )}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-nexus-muted" />
    </div>
  );
}