import {
  Breadcrumb,
  Button,
  CajaMenorDashboardLayout,
  PlusIcon,
  StatCard,
} from "@nexus/ui";
import { CashFlowChart } from "@/components/charts/CashFlowChart";
import { ExpenseDonut } from "@/components/charts/ExpenseDonut";
import { MovementsTable } from "@/components/MovementsTable";
import { DASHBOARD_METRICS, expenseByCategory, monthlyFlow, recentMovements } from "@/lib/data";
import { formatMoney } from "@/lib/format";
import { GYM_HEADER_USER, gymSidebar } from "@/lib/module-config";
import { ORG } from "@/lib/org";

export default function GymDashboardPage() {
  const today = new Date().toLocaleDateString(ORG.locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <CajaMenorDashboardLayout
      sidebar={gymSidebar("/")}
      header={{ appHref: "/", brandLabel: "Servicios", user: GYM_HEADER_USER }}
    >
      <Breadcrumb items={[{ label: "Nexus" }, { label: ORG.name }]} />

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-nexus-ink">Panel de control</h1>
          <p className="mt-1 text-sm text-nexus-muted">{today}</p>
        </div>
        <Button>
          <PlusIcon className="mr-1.5 h-4 w-4" />
          Nuevo movimiento
        </Button>
      </div>

      <div id="metricas" className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
          label="Socios activos"
          value={String(DASHBOARD_METRICS.activeMembers)}
          tone="neutral"
          footnote="Membresías vigentes"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <CashFlowChart data={monthlyFlow} />
        <ExpenseDonut data={expenseByCategory} />
      </div>

      <div className="mt-8">
        <MovementsTable movements={recentMovements} limit={8} />
      </div>
    </CajaMenorDashboardLayout>
  );
}