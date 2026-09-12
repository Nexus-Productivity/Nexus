"use client";

import { Plus } from "lucide-react";
import { crearNegocio } from "@/lib/actions";

interface NuevoNegocioFormProps {
  /** true = form visible (página dedicada) · false = acordeón compacto */
  standalone?: boolean;
}

const TIPOS = [
  { value: "gimnasio", label: "Gimnasio" },
  { value: "comercio", label: "Comercio" },
  { value: "restaurante", label: "Restaurante" },
  { value: "taller", label: "Taller / servicio" },
  { value: "otro", label: "Otro" },
];

/** Formulario para crear un negocio (onboarding o "crear otro"). Server action directa. */
export function NuevoNegocioForm({ standalone = false }: NuevoNegocioFormProps) {
  const formBody = (
    <form
      action={crearNegocio}
      className={`${standalone ? "space-y-4" : "space-y-3 border-t border-nexus-border/70 px-5 py-4"}`}
    >
      <div>
        <label className="mb-1 block text-xs font-medium text-nexus-muted">
          Nombre del negocio
        </label>
        <input
          name="nombre"
          type="text"
          required
          className="w-full rounded-md border border-nexus-border bg-nexus-surface px-3 py-2 text-sm text-nexus-ink transition focus:border-nexus-brand focus:outline-none focus:ring-2 focus:ring-nexus-brand/20"
          placeholder="Mi nuevo negocio"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-nexus-muted">
          Tipo de negocio
        </label>
        <select
          name="tipoNegocio"
          className="w-full rounded-md border border-nexus-border bg-nexus-surface px-3 py-2 text-sm text-nexus-ink transition focus:border-nexus-brand focus:outline-none focus:ring-2 focus:ring-nexus-brand/20"
        >
          {TIPOS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-nexus-muted">
          Esto nos dice qué módulos te conviene arrancar.
        </p>
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-nexus-ink px-4 py-2 text-sm font-medium text-white transition hover:bg-nexus-ink/85"
      >
        Crear negocio
      </button>
    </form>
  );

  if (standalone) return formBody;

  return (
    <details className="group rounded-2xl border border-dashed border-nexus-border bg-nexus-surface/60 transition hover:border-nexus-brand/40">
      <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 text-sm font-medium text-nexus-ink">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-nexus-surface-alt text-nexus-muted transition group-open:bg-nexus-gold-soft group-open:text-nexus-gold-strong">
          <Plus className="h-5 w-5" />
        </span>
        Crear otro negocio
      </summary>
      {formBody}
    </details>
  );
}