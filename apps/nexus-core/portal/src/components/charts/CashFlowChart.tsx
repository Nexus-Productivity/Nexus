"use client";

import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthlyFlow } from "@/lib/data";
import { formatCompact, formatMoney } from "@/lib/format";

interface CashFlowChartProps {
  data: MonthlyFlow[];
  className?: string;
}

/** Gráfica de flujo mensual: ingresos vs egresos (últimos 6 meses). */
export const CashFlowChart: React.FC<CashFlowChartProps> = ({ data, className = "" }) => (
  <div className={`rounded-xl border border-nexus-border bg-nexus-surface p-5 ${className}`}>
    <h3 className="text-sm font-semibold text-nexus-ink">Flujo de efectivo</h3>
    <p className="mt-0.5 text-xs text-nexus-muted">Ingresos vs egresos · últimos 6 meses</p>
    <div className="mt-4 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--nexus-border-rgb, #e5e5e3)" vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "#6b6b68" }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={56}
            tickFormatter={(v: number) => formatCompact(v)}
            tick={{ fontSize: 12, fill: "#6b6b68" }}
          />
          <Tooltip
            formatter={(value) => formatMoney(Number(value))}
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e5e5e3",
              fontSize: 13,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="income" name="Ingresos" fill="#27500a" radius={[4, 4, 0, 0]} maxBarSize={28} />
          <Bar dataKey="expenses" name="Egresos" fill="#791f1f" radius={[4, 4, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);