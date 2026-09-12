import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { StatCard } from "@nexus/ui";
import { prisma } from "@/lib/prisma";
import { CashFlowChart } from "@/components/charts/CashFlowChart";
import { ExpenseDonut } from "@/components/charts/ExpenseDonut";
import { MovementsTable } from "@/components/MovementsTable";
import { getDashboardData } from "@/lib/negocio";
import { formatMoney } from "@/lib/format";
import { iconoNegocio } from "@/lib/iconos";

/**
 * DASHBOARD DEL NEGOCIO — la primera pantalla que se ve al entrar.
 * Métricas y gráficas reales desde la base (cero mocks).
 */
export default async function NegocioDashboard({ params }: { params: { slug: string } }) {
  const org = await prisma.organization.findUnique({
    where: { slug: params.slug },
    select: { id: true, nombre: true, slug: true, tipoNegocio: true, moneda: true },
  });
  if (!org) notFound();

  const data = await getDashboardData(org.id);
  const IconoNegocio = iconoNegocio(org.tipoNegocio);

  const today = new Date().toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-nexus-gold-soft text-nexus-gold-strong">
          <IconoNegocio className="h-6 w-6" />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold text-nexus-ink">{org.nombre}</h1>
            <span className="rounded-full bg-nexus-surface-alt px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-nexus-muted">
              {org.moneda}
            </span>
          </div>
          <p className="mt-0.5 text-sm capitalize text-nexus-muted">
            Dashboard · {today}
          </p>
        </div>
      </div>

      {/* Métricas */}
      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Efectivo en caja"
          value={formatMoney(data.metrics.cash)}
          tone="gold"
          footnote="Disponible hoy"
        />
        <StatCard
          label="Ingresos (mes)"
          value={formatMoney(data.metrics.income)}
          tone="green"
        />
        <StatCard
          label="Egresos (mes)"
          value={formatMoney(data.metrics.expenses)}
          tone="red"
        />
        <StatCard
          label="Miembros del negocio"
          value={String(data.metrics.activeMembers)}
          tone="neutral"
          footnote="Usuarios con acceso"
        />
      </div>

      {/* Gráficas */}
      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <CashFlowChart data={data.monthlyFlow} />
        <ExpenseDonut data={data.expenseByCategory} />
      </div>

      {/* Movimientos recientes + historial */}
      <div className="mt-7">
        <div className="mb-4 flex items-center justify-between">
          <MovementsTable
            movements={data.movements}
            categories={data.expenseByCategory.map((c) => c.category)}
            limit={8}
          />
        </div>
        <div className="flex justify-end">
          <Link
            href={`/negocios/${org.slug}/caja-menor/historial`}
            className="inline-flex items-center gap-2 rounded-lg bg-nexus-ink px-4 py-2.5 text-sm font-medium text-white transition hover:bg-nexus-ink/85"
          >
            Ver historial completo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}