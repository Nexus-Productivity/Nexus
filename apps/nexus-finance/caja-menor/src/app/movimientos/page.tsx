import {
  Button,
  CajaMenorDashboardLayout,
  TransactionList,
} from "@nexus/ui";
import { APP_HEADER_LINKS, CURRENT_USER, moduleSidebar } from "@/lib/module-config";

const movimientos = [
  { id: "1", description: "Cubiertas para el auto de reparto", amount: -1856.5, date: "2026-09-10", type: "expense" as const },
  { id: "2", description: "Recarga de SUBE institucional", amount: -320, date: "2026-09-09", type: "expense" as const },
  { id: "3", description: "Reposición de caja (gerencia)", amount: 5000, date: "2026-09-08", type: "income" as const },
  { id: "4", description: "Resmas A4 y carpetas", amount: -480, date: "2026-09-06", type: "expense" as const },
  { id: "5", description: "Café y provisiones oficina", amount: -210.75, date: "2026-09-04", type: "expense" as const },
];

const APP_SHELL_URL = process.env.NEXT_PUBLIC_APP_SHELL_URL ?? "http://localhost:3001";

export default function MovimientosPage() {
  return (
    <CajaMenorDashboardLayout
      sidebar={moduleSidebar("/movimientos")}
      header={{
        appHref: APP_SHELL_URL,
        brandLabel: "Finance",
        links: APP_HEADER_LINKS,
        user: CURRENT_USER,
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-nexus-ink">Movimientos</h1>
          <p className="mt-1 text-sm text-nexus-muted">
            Ingresos, egresos, reembolsos y ajustes de la caja.
          </p>
        </div>
        <Button>Nuevo movimiento</Button>
      </div>

      <div className="mt-6">
        <TransactionList transactions={movimientos} />
      </div>
    </CajaMenorDashboardLayout>
  );
}