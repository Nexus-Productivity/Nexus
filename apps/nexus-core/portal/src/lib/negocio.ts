/**
 * Consultas reales del negocio (caja menor). Cero mocks: todo sale de la base.
 * El módulo Caja (categorías + movimientos) es post-MVP pero el schema ya
 * existe; con datos en 0 el sistema muestra 0 reales.
 */
import { prisma } from "@/lib/prisma";
import type { Movement, MonthlyFlow, CategoryExpense, NegocioMetrics } from "@/lib/data";

type MovimientoRow = {
  id: string;
  fecha: Date;
  descripcion: string | null;
  tipo: "INGRESO" | "EGRESO";
  estado: "CONFIRMADO" | "ANULADO";
  monto: { toString(): string };
  categoria: { nombre: string };
};

export function toMovementView(m: MovimientoRow): Movement {
  const date = `${m.fecha.getFullYear()}-${String(m.fecha.getMonth() + 1).padStart(2, "0")}-${String(
    m.fecha.getDate(),
  ).padStart(2, "0")}`;
  return {
    id: m.id,
    date,
    concept: m.descripcion ?? m.categoria.nombre,
    category: m.categoria.nombre,
    type: m.tipo === "INGRESO" ? "income" : "expense",
    status: m.estado === "CONFIRMADO" ? "approved" : "pending",
    amount: Number(m.monto),
  };
}

export async function getMovimientos(orgId: string): Promise<MovimientoRow[]> {
  return prisma.movimiento.findMany({
    where: { orgId },
    include: { categoria: { select: { nombre: true } } },
    orderBy: { fecha: "desc" },
  }) as unknown as Promise<MovimientoRow[]>;
}

function mismoMes(fecha: Date, anio: number, mes: number) {
  return fecha.getFullYear() === anio && fecha.getMonth() === mes;
}

export async function getDashboardData(orgId: string): Promise<{
  metrics: NegocioMetrics;
  monthlyFlow: MonthlyFlow[];
  expenseByCategory: CategoryExpense[];
  movements: Movement[];
  totalMovements: number;
}> {
  const [movimientos, activeMembers] = await Promise.all([
    getMovimientos(orgId),
    prisma.member.count({ where: { orgId } }),
  ]);

  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = hoy.getMonth();

  let cash = 0;
  let income = 0;
  let expenses = 0;
  for (const m of movimientos) {
    if (m.estado !== "CONFIRMADO") continue;
    const monto = Number(m.monto);
    if (m.tipo === "INGRESO") {
      cash += monto;
      if (mismoMes(m.fecha, anio, mes)) income += monto;
    } else {
      cash -= monto;
      if (mismoMes(m.fecha, anio, mes)) expenses += monto;
    }
  }

  // Flujo mensual: últimos 6 meses (si no hay nada, gráfica vacía).
  const monthlyFlow: MonthlyFlow[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(anio, mes - i, 1);
    let inc = 0;
    let exp = 0;
    for (const m of movimientos) {
      if (m.estado !== "CONFIRMADO") continue;
      if (!mismoMes(m.fecha, d.getFullYear(), d.getMonth())) continue;
      const monto = Number(m.monto);
      if (m.tipo === "INGRESO") inc += monto;
      else exp += monto;
    }
    monthlyFlow.push({
      month: d.toLocaleDateString("es", { month: "short" }),
      income: inc,
      expenses: exp,
    });
  }

  // Egresos del mes por categoría (donut).
  const byCat = new Map<string, number>();
  for (const m of movimientos) {
    if (m.estado !== "CONFIRMADO" || m.tipo !== "EGRESO") continue;
    if (!mismoMes(m.fecha, anio, mes)) continue;
    const monto = Number(m.monto);
    byCat.set(m.categoria.nombre, (byCat.get(m.categoria.nombre) ?? 0) + monto);
  }
  const expenseByCategory: CategoryExpense[] = [...byCat.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  return {
    metrics: { cash, income, expenses, activeMembers },
    monthlyFlow,
    expenseByCategory,
    movements: movimientos.map(toMovementView),
    totalMovements: movimientos.length,
  };
}