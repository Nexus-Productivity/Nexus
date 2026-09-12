"use client";

import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { CategoryExpense } from "@/lib/data";
import { formatMoney } from "@/lib/format";

interface ExpenseDonutProps {
  data: CategoryExpense[];
  className?: string;
}

/** Paleta Nexus (sin azul): dorado, verde, rojo y neutros. */
const COLORS = ["#c9821a", "#8a570f", "#27500a", "#791f1f", "#6b6b68"];

/** Donut de egresos del mes por categoría. */
export const ExpenseDonut: React.FC<ExpenseDonutProps> = ({ data, className = "" }) => (
  <div className={`rounded-xl border border-nexus-border bg-nexus-surface p-5 ${className}`}>
    <h3 className="text-sm font-semibold text-nexus-ink">Egresos por categoría</h3>
    <p className="mt-0.5 text-xs text-nexus-muted">Mes actual</p>
    {data.length === 0 ? (
      <div className="mt-2 flex h-44 items-center justify-center rounded-lg border border-dashed border-nexus-border bg-nexus-surface/50">
        <p className="text-sm text-nexus-muted">Sin egresos en el mes</p>
      </div>
    ) : (
      <>
      <div className="mt-2 h-44">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            innerRadius={48}
            outerRadius={72}
            paddingAngle={3}
            strokeWidth={0}
          >
            {data.map((entry, i) => (
              <Cell key={entry.category} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatMoney(Number(value))}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e5e5e3",
              fontSize: 13,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
    <ul className="mt-3 space-y-1.5">
      {data.map((entry, i) => (
        <li key={entry.category} className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-nexus-muted">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            {entry.category}
          </span>
          <span className="font-medium tabular-nums text-nexus-ink">{formatMoney(entry.amount)}</span>
        </li>
      ))}
    </ul>
      </>
    )}
  </div>
);