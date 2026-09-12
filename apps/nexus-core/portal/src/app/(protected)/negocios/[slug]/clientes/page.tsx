import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";

/**
 * MÓDULO CLIENTES — la BASE del negocio.
 * Viene por defecto en toda organización; acá vive el registro de clientes
 * y su historial (fase 2 del módulo).
 */
export default async function ClientesPage({ params }: { params: { slug: string } }) {
  const org = await prisma.organization.findUnique({
    where: { slug: params.slug },
    select: { nombre: true, slug: true },
  });
  if (!org) notFound();

  const base = `/negocios/${org.slug}`;

  return (
    <>
      <Link
        href={base}
        className="inline-flex items-center gap-1.5 text-sm text-nexus-muted transition hover:text-nexus-ink"
      >
        <ChevronLeft className="h-4 w-4" />
        {org.nombre}
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-nexus-ink">Clientes</h1>
          <p className="mt-1 text-sm text-nexus-muted">
            La base de todo negocio: registro, historial y seguimiento de cada cliente.
          </p>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-dashed border-nexus-border bg-nexus-surface/50 p-12 text-center">
        <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-nexus-gold-soft text-nexus-gold-strong">
          <Users className="h-6 w-6" />
        </span>
        <h2 className="mt-4 text-base font-semibold text-nexus-ink">
          Próximamente en el módulo de clientes
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-nexus-muted">
          Registro de clientes, historial de pagos y membresías. Por ahora es
          parte de la base de tu negocio — su herramienta llega en la próxima fase.
        </p>
      </div>
    </>
  );
}