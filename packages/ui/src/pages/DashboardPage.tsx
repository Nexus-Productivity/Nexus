import React from "react";
import { CajaMenorDashboardLayout, type CajaMenorDashboardLayoutSidebar } from "../templates/CajaMenorDashboardLayout";
import type { AppHeaderLink, AppHeaderUser } from "../organisms/AppHeader";
import { Breadcrumb } from "../molecules/Breadcrumb";
import { StatCard } from "../molecules/StatCard";
import { BannerAlert } from "../molecules/BannerAlert";
import { Button } from "../atoms/Button";
import { PlusIcon } from "../atoms/Icons";

export type MovementStatus = "approved" | "pending" | "rejected";

export interface DashboardMovement {
  id: string;
  date: string;
  concept: string;
  category: string;
  status: MovementStatus;
  amount: number; // positivo = ingreso, negativo = egreso
}

interface DashboardPageProps {
  movements?: DashboardMovement[];
  balance?: number;
  income?: number;
  expenses?: number;
  pendingCount?: number;
  /** Si balance < minBalance se muestra el banner de alerta. */
  minBalance?: number;
  dateLabel?: string;
  sidebar: CajaMenorDashboardLayoutSidebar;
  header?: {
    appHref?: string;
    brandLabel?: string;
    links?: AppHeaderLink[];
    user?: AppHeaderUser;
  };
  className?: string;
}

const statusBadge: Record<MovementStatus, { bg: string; text: string; label: string }> = {
  approved: { bg: "bg-nexus-green-soft", text: "text-nexus-green-strong", label: "Aprobado" },
  pending: { bg: "bg-nexus-gold-soft", text: "text-nexus-gold-strong", label: "Pendiente soporte" },
  rejected: { bg: "bg-nexus-red-soft", text: "text-nexus-red-strong", label: "Rechazado" },
};

function formatMoney(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(Math.abs(value));
}

const defaultMovements: DashboardMovement[] = [
  { id: "1", date: "2026-09-10", concept: "Cubiertas para el auto de reparto", category: "Mantenimiento", status: "approved", amount: -1856.5 },
  { id: "2", date: "2026-09-09", concept: "Recarga de SUBE institucional", category: "Transporte", status: "approved", amount: -320 },
  { id: "3", date: "2026-09-08", concept: "Reposición de caja (gerencia)", category: "Ingresos", status: "approved", amount: 5000 },
  { id: "4", date: "2026-09-06", concept: "Resmas A4 y carpetas", category: "Papelería", status: "pending", amount: -480 },
  { id: "5", date: "2026-09-04", concept: "Café y provisiones oficina", category: "Alimentación", status: "approved", amount: -210.75 },
];

/** Dashboard del módulo Caja Menor (Pantalla 2). */
export const DashboardPage: React.FC<DashboardPageProps> = ({
  movements = defaultMovements,
  balance = 3032.75,
  income = 5000,
  expenses = -2867.25,
  pendingCount = 3,
  minBalance = 1000,
  dateLabel,
  sidebar,
  header,
  className = ""
}) => {
  const lowBalance = balance < minBalance;
  const today = new Date().toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <CajaMenorDashboardLayout sidebar={sidebar} header={header} className={className}>
      <Breadcrumb items={[{ label: "Nexus Finance" }, { label: "Caja menor" }]} />

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-nexus-ink">Dashboard</h1>
          <p className="mt-1 text-sm text-nexus-muted">{dateLabel ?? today}</p>
        </div>
        <Button>
          <PlusIcon className="mr-1.5 h-4 w-4" />
          Nuevo movimiento
        </Button>
      </div>

      {lowBalance && (
        <BannerAlert
          className="mt-5"
          title="Saldo por debajo del mínimo"
        >
          El saldo actual ({formatMoney(balance)}) está por debajo del mínimo
          configurado ({formatMoney(minBalance)}). Reponé la caja para seguir operando.
        </BannerAlert>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Saldo actual" value={formatMoney(balance)} tone="gold" />
        <StatCard label="Ingresos (mes)" value={formatMoney(income)} tone="green" />
        <StatCard label="Gastos (mes)" value={formatMoney(expenses)} tone="red" />
        <StatCard label="Pendientes de soporte" value={String(pendingCount)} tone="neutral" />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-nexus-ink">Movimientos recientes</h2>
        <div className="mt-3 overflow-hidden rounded-xl border border-nexus-border bg-nexus-surface">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-nexus-border text-xs uppercase tracking-wider text-nexus-muted">
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Concepto</th>
                <th className="px-4 py-3 font-medium">Categoría</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 text-right font-medium">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nexus-border">
              {movements.map((m) => {
                const badge = statusBadge[m.status];
                return (
                  <tr key={m.id} className="transition hover:bg-nexus-surface-alt">
                    <td className="px-4 py-3 text-nexus-muted">
                      {new Date(m.date).toLocaleDateString("es-AR")}
                    </td>
                    <td className="px-4 py-3 font-medium text-nexus-ink">{m.concept}</td>
                    <td className="px-4 py-3 text-nexus-muted">{m.category}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.bg} ${badge.text}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold tabular-nums ${
                      m.amount >= 0 ? "text-nexus-green-strong" : "text-nexus-red-strong"
                    }`}>
                      {m.amount >= 0 ? "+" : "-"}{formatMoney(m.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </CajaMenorDashboardLayout>
  );
};