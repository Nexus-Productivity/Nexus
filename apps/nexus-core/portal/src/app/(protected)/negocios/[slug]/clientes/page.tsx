import { Users } from "lucide-react";
import { notFound } from "next/navigation";
import { StatCard } from "@nexus/ui";
import { prisma } from "@/lib/prisma";
import { DASHBOARD_METRICS } from "@/lib/data";

/**
 * MÓDULO CLIENTES — la BASE del negocio (viene por defecto).
 * Acá vivirá el registro de clientes, membresías e historial de pagos.
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

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Socios activos"
          value={String(DASHBOARD_METRICS.activeMembers)}
          tone="gold"
          footnote="Membresías vigentes"
        />
        <StatCard
          label="Ingreso mensualidad"
          value="1.800.000 COP"
          tone="green"
          footnote="Agosto"
        />
        <StatCard
          label="Membresías nuevos (mes)"
          value="6"
          tone="neutral"
        />
        <StatCard
          label="Bajas del mes"
          value="2"
          tone="red"
        />
      </div>

      <div className="mt-7 rounded-2xl border border-dashed border-nexus-border bg-nexus-surface/50 p-12 text-center">
        <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-nexus-gold-soft text-nexus-gold-strong">
          <Users className="h-6 w-6" />
        </span>
        <h2 className="mt-4 text-base font-semibold text-nexus-ink">
          Registro de clientes en construcción
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-nexus-muted">
          El listado con historial de pagos y membresías llega en la próxima fase.
          Mientras tanto, el módulo ya reporta métricas desde el dashboard.
        </p>
      </div>
    </>
  );
}