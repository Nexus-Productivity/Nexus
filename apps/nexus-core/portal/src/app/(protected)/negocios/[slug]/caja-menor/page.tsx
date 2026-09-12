import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { StatCard } from "@nexus/ui";
import { prisma } from "@/lib/prisma";
import { MovementsTable } from "@/components/MovementsTable";
import { DASHBOARD_METRICS, allMovements } from "@/lib/data";
import { formatMoney } from "@/lib/format";

/**
 * MÓDULO CAJA MENOR — dentro del negocio.
 * Métricas de caja + historial de movimientos. Las gráficas de negocio viven
 * en el Dashboard (raíz del negocio), la sidebar navega entre módulos.
 */
export default async function CajaMenorPage({ params }: { params: { slug: string } }) {
  const org = await prisma.organization.findUnique({
    where: { slug: params.slug },
    select: { nombre: true, slug: true },
  });
  if (!org) notFound();

  const today = new Date().toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const base = `/negocios/${org.slug}`;

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-nexus-ink">Caja menor</h1>
          <p className="mt-1 text-sm text-nexus-muted">
            Control de gastos menores · {today}
          </p>
        </div>
        <Link
          href={`${base}/caja-menor/historial`}
          className="inline-flex items-center rounded-lg border border-nexus-brand/40 bg-nexus-gold-soft px-4 py-2.5 text-sm font-medium text-nexus-gold-strong transition hover:bg-nexus-gold/15"
        >
          Historial completo
          <ArrowRight className="ml-1.5 h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Efectivo en caja"
          value={formatMoney(DASHBOARD_METRICS.cash)}
          tone="gold"
          footnote="Disponible hoy"
        />
        <StatCard
          label="Ingresos (mes)"
          value={formatMoney(DASHBOARD_METRICS.income)}
          tone="green"
        />
        <StatCard
          label="Egresos (mes)"
          value={formatMoney(DASHBOARD_METRICS.expenses)}
          tone="red"
        />
        <StatCard
          label="Movimientos"
          value={String(allMovements.length)}
          tone="neutral"
          footnote="Registrados"
        />
      </div>

      <div className="mt-7">
        <MovementsTable movements={allMovements} limit={10} />
      </div>
    </>
  );
}