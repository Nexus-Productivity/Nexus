import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, PlusIcon } from "lucide-react";
import { Button } from "@nexus/ui";
import { prisma } from "@/lib/prisma";
import { MovementsTable } from "@/components/MovementsTable";
import { getMovimientos, toMovementView } from "@/lib/negocio";

/**
 * MÓDULO CAJA MENOR — historial completo de efectivo (datos reales).
 */
export default async function CajaMenorHistorialPage({ params }: { params: { slug: string } }) {
  const org = await prisma.organization.findUnique({
    where: { slug: params.slug },
    select: { id: true, nombre: true, slug: true },
  });
  if (!org) notFound();

  const movimientos = await getMovimientos(org.id);
  const categories = Array.from(new Set(movimientos.map((m) => m.categoria.nombre)));
  const base = `/negocios/${org.slug}`;

  return (
    <>
      <Link
        href={`${base}/caja-menor`}
        className="inline-flex items-center gap-1.5 text-sm text-nexus-muted transition hover:text-nexus-ink"
      >
        <ChevronLeft className="h-4 w-4" />
        {org.nombre} · Caja menor
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-nexus-ink">Historial de efectivo</h1>
          <p className="mt-1 text-sm text-nexus-muted">
            Todos los ingresos y egresos del negocio, con su categoría y estado.
          </p>
        </div>
        <Button>
          <PlusIcon className="mr-1.5 h-4 w-4" />
          Nuevo movimiento
        </Button>
      </div>

      <div className="mt-6">
        <MovementsTable movements={movimientos.map(toMovementView)} categories={categories} />
      </div>
    </>
  );
}