/**
 * Dominio GYM — prototipo a la medida del gimnasio (rama gym/prototipo).
 * Cero mocks: todo se calcula sobre la base real.
 */
import { prisma } from "@/lib/prisma";
import type { MonthlyFlow, CategoryExpense } from "@/lib/data";

export type RangoKey = "semana" | "mes" | "anio";

export const RANGOS: { key: RangoKey; label: string }[] = [
  { key: "semana", label: "Última semana" },
  { key: "mes", label: "Último mes" },
  { key: "anio", label: "Último año" },
];

export function isRango(v: string | undefined): v is RangoKey {
  return v === "semana" || v === "mes" || v === "anio";
}

export function rangoFechas(rango: RangoKey): { desde: Date; hasta: Date } {
  const hasta = new Date();
  hasta.setHours(23, 59, 59, 999);
  const desde = new Date(hasta);
  if (rango === "semana") desde.setDate(hasta.getDate() - 6);
  else if (rango === "mes") desde.setMonth(hasta.getMonth() - 1);
  else desde.setFullYear(hasta.getFullYear() - 1);
  desde.setHours(0, 0, 0, 0);
  return { desde, hasta };
}

/** La org del gimnasio (el negocio del prototipo). */
export async function getGymOrg() {
  return prisma.organization.findFirst({ where: { tipoNegocio: "gimnasio" } });
}

/**
 * Deriva el estado real de cada cliente: si su membresía ya venció, pasa a
 * VENCIDO; si está al día (porque cobraron), vuelve a ACTIVO.
 * Se llama en cada lectura del dashboard: el estado SIEMPRE refleja los pagos.
 */
export async function derivaEstadosClientes(orgId: string) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  await prisma.cliente.updateMany({
    where: { orgId, estado: "ACTIVO", periodoFin: { not: null, lt: hoy } },
    data: { estado: "VENCIDO" },
  });
  await prisma.cliente.updateMany({
    where: { orgId, estado: "VENCIDO", periodoFin: { gte: hoy } },
    data: { estado: "ACTIVO" },
  });
}

const DIA_LABEL = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MES_LABEL = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

interface Bucket {
  desde: Date;
  hasta: Date;
  label: string;
}

/** Buckets para la gráfica según rango (semana: 7 días · mes: 5 semanas · año: 12 meses). */
function buckets(rango: RangoKey, desde: Date, hasta: Date): Bucket[] {
  const out: Bucket[] = [];
  if (rango === "semana") {
    for (let i = 0; i < 7; i++) {
      const d = new Date(desde);
      d.setDate(desde.getDate() + i);
      d.setHours(0, 0, 0, 0);
      const fin = new Date(d);
      fin.setHours(23, 59, 59, 999);
      out.push({ desde: d, hasta: fin, label: DIA_LABEL[d.getDay()] ?? "" });
    }
  } else if (rango === "mes") {
    // 5 ventanas semanales de 7 días terminando hoy.
    for (let i = 4; i >= 0; i--) {
      const fin = new Date(hasta);
      fin.setDate(hasta.getDate() - i * 7);
      fin.setHours(23, 59, 59, 999);
      const d = new Date(fin);
      d.setDate(fin.getDate() - 6);
      d.setHours(0, 0, 0, 0);
      out.push({ desde: d, hasta: fin, label: `S${5 - i}` });
    }
  } else {
    // 12 meses terminando hoy.
    for (let i = 11; i >= 0; i--) {
      const fin = new Date(hasta.getFullYear(), hasta.getMonth() - i + 1, 1);
      fin.setDate(0); // último día del mes
      fin.setHours(23, 59, 59, 999);
      const d = new Date(hasta.getFullYear(), hasta.getMonth() - i, 1);
      d.setHours(0, 0, 0, 0);
      out.push({ desde: d, hasta: fin, label: MES_LABEL[d.getMonth()] ?? "" });
    }
  }
  return out;
}

function inRange(fecha: Date, b: Bucket) {
  return fecha >= b.desde && fecha <= b.hasta;
}

export interface GymDashboard {
  orgId: string;
  orgNombre: string;
  rango: RangoKey;
  ingresos: number;
  gastos: number;
  balance: number;
  sociosActivos: number;
  sociosVencidos: number;
  porVencer: { id: string; nombre: string; vence: Date }[];
  flujo: MonthlyFlow[];
  egresosPorCategoria: CategoryExpense[];
  pagosPorMetodo: CategoryExpense[];
}

/** Datos del dashboard del gym en el rango pedido — TODO real. */
export async function getGymDashboard(rango: RangoKey, orgId: string, orgNombre: string): Promise<GymDashboard> {
  const { desde, hasta } = rangoFechas(rango);
  await derivaEstadosClientes(orgId);

  const [pagos, gastos, clientes] = await Promise.all([
    prisma.pago.findMany({ where: { orgId, anulado: false, pagadoEl: { gte: desde, lte: hasta } } }),
    prisma.gasto.findMany({ where: { orgId, anulado: false, fecha: { gte: desde, lte: hasta } } }),
    prisma.cliente.findMany({ where: { orgId }, select: { id: true, nombre: true, estado: true, periodoFin: true } }),
  ]);

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const en7d = new Date(hoy);
  en7d.setDate(hoy.getDate() + 7);

  let ingresos = 0;
  let gastosTotal = 0;
  for (const p of pagos) ingresos += Number(p.monto);
  for (const g of gastos) gastosTotal += Number(g.monto);

  const flujo: MonthlyFlow[] = buckets(rango, desde, hasta).map((b) => {
    let income = 0;
    let expenses = 0;
    for (const p of pagos) if (inRange(p.pagadoEl, b)) income += Number(p.monto);
    for (const g of gastos) if (inRange(g.fecha, b)) expenses += Number(g.monto);
    return { month: b.label, income, expenses };
  });

  const byCat = new Map<string, number>();
  for (const g of gastos) {
    byCat.set(g.categoria, (byCat.get(g.categoria) ?? 0) + Number(g.monto));
  }
  const egresosPorCategoria: CategoryExpense[] = [...byCat.entries()]
    .map(([category, amount]) => ({ category: category.toLowerCase(), amount }))
    .sort((a, b) => b.amount - a.amount);

  const byMetodo = new Map<string, number>();
  for (const p of pagos) {
    byMetodo.set(p.metodo, (byMetodo.get(p.metodo) ?? 0) + Number(p.monto));
  }
  const pagosPorMetodo: CategoryExpense[] = [...byMetodo.entries()]
    .map(([category, amount]) => ({ category: category.toLowerCase(), amount }))
    .sort((a, b) => b.amount - a.amount);

  const sociosActivos = clientes.filter((c) => c.estado === "ACTIVO").length;
  const sociosVencidos = clientes.filter((c) => c.estado === "VENCIDO").length;
  const porVencer = clientes
    .filter((c) => c.estado === "ACTIVO" && c.periodoFin && c.periodoFin >= hoy && c.periodoFin <= en7d)
    .sort((a, b) => (a.periodoFin! > b.periodoFin! ? 1 : -1))
    .map((c) => ({ id: c.id, nombre: c.nombre, vence: c.periodoFin! }));

  return {
    orgId,
    orgNombre,
    rango,
    ingresos,
    gastos: gastosTotal,
    balance: ingresos - gastosTotal,
    sociosActivos,
    sociosVencidos,
    porVencer,
    flujo,
    egresosPorCategoria,
    pagosPorMetodo,
  };
}