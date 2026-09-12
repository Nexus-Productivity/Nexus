import { PortalHeader } from "./PortalHeader";
import type { NegocioInfo } from "@/lib/session";

interface PortalScaffoldProps {
  email: string;
  negocios: NegocioInfo[];
  activoSlug?: string;
  children: React.ReactNode;
}

/**
 * Scaffold de página dentro del portal: header global (marca + select de
 * negocio + sesión) y contenido. Usado por los módulos y paneles.
 */
export function PortalScaffold({ email, negocios, activoSlug, children }: PortalScaffoldProps) {
  return (
    <div className="min-h-screen bg-nexus-bg">
      <PortalHeader email={email} negocios={negocios} activoSlug={activoSlug} />
      <main className="mx-auto max-w-6xl px-4 py-8 lg:px-6">{children}</main>
    </div>
  );
}