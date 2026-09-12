/**
 * Datos de la demo gym (mock). Categorías del dominio: mensualidades, nómina,
 * arriendo, mantenimiento, servicios, ventas.
 * Montos en COP. La serie mensual de septiembre es parcial (día 12).
 */

export type MovementStatus = "approved" | "pending" | "rejected";

export interface Movement {
  id: string;
  date: string; // ISO
  concept: string;
  category: string;
  type: "income" | "expense";
  status: MovementStatus;
  amount: number; // siempre positivo; el signo lo da `type`
}

/** Movimientos recientes (vista dashboard) y el historial completo. */
export const recentMovements: Movement[] = [
  { id: "m01", date: "2026-09-11", concept: "Mensualidad — Carlos M.", category: "Mensualidades", type: "income", status: "approved", amount: 120_000 },
  { id: "m02", date: "2026-09-10", concept: "Mensualidades (12 socios)", category: "Mensualidades", type: "income", status: "approved", amount: 1_440_000 },
  { id: "m03", date: "2026-09-09", concept: "Nómina quincenal — entrenadores", category: "Nómina", type: "expense", status: "approved", amount: 1_800_000 },
  { id: "m04", date: "2026-09-08", concept: "Servicios públicos del mes", category: "Servicios", type: "expense", status: "approved", amount: 324_500 },
  { id: "m05", date: "2026-09-06", concept: "Mantenimiento de máquinas", category: "Mantenimiento", type: "expense", status: "pending", amount: 380_000 },
  { id: "m06", date: "2026-09-04", concept: "Mensualidad — A. Pérez", category: "Mensualidades", type: "income", status: "approved", amount: 120_000 },
  { id: "m07", date: "2026-09-02", concept: "Ventas suplementos (semana)", category: "Ventas", type: "income", status: "approved", amount: 385_000 },
  { id: "m08", date: "2026-09-01", concept: "Arriendo del local", category: "Arriendo", type: "expense", status: "approved", amount: 2_000_000 },
];

export const allMovements: Movement[] = [
  ...recentMovements,
  { id: "m09", date: "2026-08-29", concept: "Nómina quincenal — entrenadores", category: "Nómina", type: "expense", status: "approved", amount: 1_800_000 },
  { id: "m10", date: "2026-08-27", concept: "Mensualidad — J. Rodríguez", category: "Mensualidades", type: "income", status: "approved", amount: 120_000 },
  { id: "m11", date: "2026-08-25", concept: "Reparación aire acondicionado", category: "Mantenimiento", type: "expense", status: "approved", amount: 650_000 },
  { id: "m12", date: "2026-08-20", concept: "Mantenimiento de máquinas", category: "Mantenimiento", type: "expense", status: "approved", amount: 380_000 },
  { id: "m13", date: "2026-08-18", concept: "Mensualidades (15 socios)", category: "Mensualidades", type: "income", status: "approved", amount: 1_800_000 },
  { id: "m14", date: "2026-08-15", concept: "Arriendo del local", category: "Arriendo", type: "expense", status: "approved", amount: 2_000_000 },
  { id: "m15", date: "2026-08-12", concept: "Ventas suplementos (semana)", category: "Ventas", type: "income", status: "approved", amount: 410_000 },
  { id: "m16", date: "2026-08-10", concept: "Nómina quincenal — entrenadores", category: "Nómina", type: "expense", status: "approved", amount: 1_800_000 },
];

export interface MonthlyFlow {
  month: string; // etiqueta corta: "abr"
  income: number;
  expenses: number;
}

/** Flujo mensual de los últimos 6 meses (septiembre parcial). */
export const monthlyFlow: MonthlyFlow[] = [
  { month: "abr", income: 6_820_000, expenses: 7_940_000 },
  { month: "may", income: 7_140_000, expenses: 7_410_000 },
  { month: "jun", income: 6_910_000, expenses: 7_660_000 },
  { month: "jul", income: 7_520_000, expenses: 7_180_000 },
  { month: "ago", income: 7_430_000, expenses: 6_910_000 },
  { month: "sep", income: 5_845_000, expenses: 4_682_500 },
];

export interface CategoryExpense {
  category: string;
  amount: number;
}

/** Egresos del mes actual por categoría (para el donut). */
export const expenseByCategory: CategoryExpense[] = [
  { category: "Arriendo", amount: 2_000_000 },
  { category: "Nómina", amount: 1_800_000 },
  { category: "Mantenimiento", amount: 380_000 },
  { category: "Servicios", amount: 324_500 },
  { category: "Otros", amount: 178_000 },
];

/** Métricas del dashboard (mes actual). */
export const DASHBOARD_METRICS = {
  cash: 2_847_500,
  income: 5_845_000,
  expenses: 4_682_500,
  activeMembers: 47,
};

export const CATEGORIES = [
  "Mensualidades",
  "Ventas",
  "Nómina",
  "Arriendo",
  "Mantenimiento",
  "Servicios",
  "Otros",
];