"use client";

import React, { useMemo, useState } from "react";
import type { Movement, MovementStatus } from "@/lib/data";
import { formatDate, formatMoney } from "@/lib/format";

interface MovementsTableProps {
  movements: Movement[];
  limit?: number;
  categories?: string[];
  className?: string;
}

const statusBadge: Record<MovementStatus, { bg: string; text: string; label: string }> = {
  approved: { bg: "bg-nexus-green-soft", text: "text-nexus-green-strong", label: "Aprobado" },
  pending: { bg: "bg-nexus-gold-soft", text: "text-nexus-gold-strong", label: "Pendiente soporte" },
  rejected: { bg: "bg-nexus-red-soft", text: "text-nexus-red-strong", label: "Rechazado" },
};

/** Tabla de movimientos con filtro por categoría. */
export const MovementsTable: React.FC<MovementsTableProps> = ({ movements, limit, categories, className = "" }) => {
  const [category, setCategory] = useState<string>("all");

  const allCategories =
    categories && categories.length > 0
      ? categories
      : Array.from(new Set(movements.map((m) => m.category)));

  const filtered = useMemo(() => {
    const rows = category === "all" ? movements : movements.filter((m) => m.category === category);
    return limit ? rows.slice(0, limit) : rows;
  }, [movements, category, limit]);

  return (
    <div className={className}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-nexus-ink">
          {limit ? "Movimientos recientes" : "Historial de efectivo"}
        </h2>
        <label className="flex items-center gap-2 text-sm text-nexus-muted">
          <span>Categoría</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-nexus-border bg-nexus-surface px-3 py-1.5 text-sm text-nexus-ink focus:border-nexus-brand focus:outline-none"
          >
            <option value="all">Todas</option>
            {allCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="overflow-hidden rounded-xl border border-nexus-border bg-nexus-surface">
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
            {filtered.map((m) => {
              const badge = statusBadge[m.status];
              return (
                <tr key={m.id} className="transition hover:bg-nexus-surface-alt">
                  <td className="px-4 py-3 text-nexus-muted">{formatDate(m.date)}</td>
                  <td className="px-4 py-3 font-medium text-nexus-ink">{m.concept}</td>
                  <td className="px-4 py-3 text-nexus-muted">{m.category}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.bg} ${badge.text}`}
                    >
                      {badge.label}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-semibold tabular-nums ${
                      m.type === "income" ? "text-nexus-green-strong" : "text-nexus-red-strong"
                    }`}
                  >
                    {m.type === "income" ? "+" : "-"}
                    {formatMoney(m.amount)}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-nexus-muted">
                  Sin movimientos en esta categoría.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};