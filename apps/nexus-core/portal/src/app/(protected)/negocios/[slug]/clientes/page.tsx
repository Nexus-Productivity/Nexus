import { Users } from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

/**
 * MÓDULO CLIENTES — la BASE del negocio (viene por defecto).
 * Acá vivirá el registro de clientes, membresías e historial de pagos.
 * Sin datos inventados: el CRUD llega con la próxima iteración.
 */
export default async function ClientesPage({ params }: { params: { slug: string } }) {
  const org = await prisma.organization.findUnique({
    where: { slug: params.slug },
    select: { nombre: true, slug: true },
  });
  if (!org) notFound();

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold text-nexus-ink">Clientes</h1>
        <p className="mt-1 text-sm text-nexus-muted">
          La base de todo negocio: registro, historial y seguimiento de cada cliente.
        </p>
      </div>

      <div className="mt-7 rounded-2xl border border-dashed border-nexus-border bg-nexus-surface/50 p-12 text-center">
        <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-nexus-gold-soft text-nexus-gold-strong">
          <Users className="h-6 w-6" />
        </span>
        <h2 className="mt-4 text-base font-semibold text-nexus-ink">
          Registro de clientes en construcción
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-nexus-muted">
          El listado de clientes, membresías y pagos llega en la próxima fase.
          Por ahora el sistema arranca desde cero: no hay números inventados acá.
        </p>
      </div>
    </>
  );
}