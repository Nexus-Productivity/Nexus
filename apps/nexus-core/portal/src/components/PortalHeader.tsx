import Link from "next/link";
import { LogOut } from "lucide-react";
import { Logo } from "@nexus/ui";
import { SelectorNegocio } from "./SelectorNegocio";
import type { NegocioInfo } from "@/lib/session";

interface PortalHeaderProps {
  email: string;
  /** Negocios del miembro para el SELECT de la navbar. */
  negocios: NegocioInfo[];
  /** Slug del negocio activo. */
  activoSlug?: string;
}

/**
 * Header global del portal: marca → negocio ACTIVO (select) → sesión/salir.
 */
export function PortalHeader({ email, negocios, activoSlug }: PortalHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-nexus-border/80 bg-nexus-surface/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 lg:px-6">
        <Link href="/" className="shrink-0 transition hover:opacity-85">
          <Logo size="sm" />
        </Link>

        {negocios.length > 0 && (
          <SelectorNegocio
            negocios={negocios}
            activoSlug={activoSlug ?? negocios[0]!.slug}
            conNuevo
          />
        )}

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden rounded-full border border-nexus-border bg-nexus-surface-alt px-3 py-1 text-xs font-medium text-nexus-muted md:block">
            {email}
          </span>
          <form action="/api/auth/signout" method="post">
            <input type="hidden" name="callbackUrl" value="/login" />
            <button
              type="submit"
              title="Salir"
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-nexus-muted transition hover:bg-nexus-surface-alt hover:text-nexus-ink"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}