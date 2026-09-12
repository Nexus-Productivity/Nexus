"use client";

import { useRef } from "react";
import { solicitarModulo } from "@/lib/actions";

interface OrgLite {
  id: string;
  slug: string;
  nombre: string;
}

interface SolicitarModuloFormProps {
  moduleId: string;
  moduleNombre: string;
  orgs: OrgLite[];
  activoEn?: string;
}

/**
 * Botón "Solicitar" de un módulo del catálogo.
 * Si el usuario tiene varios negocios, elige a cuál pedirlo.
 */
export function SolicitarModuloForm({ moduleId, moduleNombre, orgs, activoEn }: SolicitarModuloFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  if (orgs.length === 0) return null;
  if (activoEn) return null;

  const varios = orgs.length > 1;

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await solicitarModulo(fd);
        formRef.current?.reset();
      }}
      className="space-y-2"
    >
      <input type="hidden" name="moduleId" value={moduleId} />
      {varios && orgs.length > 1 && (
        <select
          name="orgId"
          className="w-full rounded-md border border-nexus-border bg-nexus-surface px-3 py-1.5 text-sm text-nexus-ink focus:border-nexus-brand focus:outline-none"
        >
          {orgs.map((o) => (
            <option key={o.id} value={o.id}>
              Pedir para {o.nombre}
            </option>
          ))}
        </select>
      )}
      {!varios && orgs[0] && <input type="hidden" name="orgId" value={orgs[0].id} />}

      <button
        type="submit"
        className="w-full rounded-md border border-nexus-brand/40 bg-nexus-gold-soft px-4 py-2 text-sm font-medium text-nexus-gold-strong transition hover:bg-nexus-gold/15"
      >
        Solicitar {moduleNombre}
      </button>
    </form>
  );
}