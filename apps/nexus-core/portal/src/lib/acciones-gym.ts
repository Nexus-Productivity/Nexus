/**
 * MÓDULO GYM — acciones server del gimnasio (rama core/base).
 * Solo operaciones reales: alta de cliente, cobro de membresía, gasto, plan.
 * La sesión sale del NÚCLEO (org activa del usuario) y acá se verifica
 * que la org tenga el módulo Gym ACTIVO antes de operar.
 */
"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { MetodoPago } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requiereSesion, getOrgActiva } from "@/lib/org";

async function requireModuloGym() {
  const { email } = await requiereSesion();
  const { org } = await getOrgActiva();

  const gym = await prisma.module.findUnique({ where: { slug: "gym" } });
  const habilitado = gym
    ? await prisma.organizationModule.findUnique({
        where: { orgId_moduleId: { orgId: org.id, moduleId: gym.id } },
      })
    : null;
  if (!habilitado || habilitado.estado !== "ACTIVO") redirect("/");

  return { email, orgId: org.id };
}

function str(input: FormData, key: string): string {
  return String(input.get(key) || "").trim();
}

function din(input: FormData, key: string): number {
  const v = Number(String(input.get(key) || "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(v) ? v : 0;
}

// ---------------------------------------------------------------
// CLIENTES
// ---------------------------------------------------------------

export async function crearCliente(input: FormData) {
  const { orgId } = await requireModuloGym();
  const nombre = str(input, "nombre");
  if (!nombre) redirect("/gym/clientes?error=nombre");

  const planId = str(input, "planId") || null;

  const cliente = await prisma.cliente.create({
    data: {
      orgId,
      nombre,
      documento: str(input, "documento") || null,
      telefono: str(input, "telefono") || null,
      email: str(input, "email") || null,
      fechaNacimiento: str(input, "fechaNacimiento") ? new Date(str(input, "fechaNacimiento")) : null,
      planId,
      nota: str(input, "nota") || null,
    },
  });

  // Si el cliente nace con membresía definida, registrar el primer pago es
  // responsabilidad del dueño desde el perfil (no se inventan pagos acá).
  revalidatePath("/gym/clientes");
  redirect(`/gym/clientes/${cliente.id}`);
}

export async function actualizarCliente(input: FormData) {
  const { orgId } = await requireModuloGym();
  const id = str(input, "id");
  if (!id) return;
  const nombre = str(input, "nombre");
  if (!nombre) return;

  await prisma.cliente.updateMany({
    where: { id, orgId },
    data: {
      nombre,
      documento: str(input, "documento") || null,
      telefono: str(input, "telefono") || null,
      email: str(input, "email") || null,
      fechaNacimiento: str(input, "fechaNacimiento") ? new Date(str(input, "fechaNacimiento")) : null,
      planId: str(input, "planId") || null,
      nota: str(input, "nota") || null,
    },
  });

  revalidatePath(`/gym/clientes/${id}`);
}

export async function congelarCliente(input: FormData) {
  const { orgId } = await requireModuloGym();
  const id = str(input, "id");
  if (!id) return;
  await prisma.cliente.updateMany({ where: { id, orgId }, data: { estado: "CONGELADO" } });
  revalidatePath(`/gym/clientes/${id}`);
  revalidatePath("/gym/clientes");
}

export async function reactivarCliente(input: FormData) {
  const { orgId } = await requireModuloGym();
  const id = str(input, "id");
  if (!id) return;
  await prisma.cliente.updateMany({ where: { id, orgId }, data: { estado: "ACTIVO" } });
  revalidatePath(`/gym/clientes/${id}`);
  revalidatePath("/gym/clientes");
}

// ---------------------------------------------------------------
// PAGOS
// ---------------------------------------------------------------

/**
 * Cobra una membresía: registra el pago y actualiza el período del cliente.
 * El estado pasa a ACTIVO y el periodoFin lo da el plan (o fecha libre).
 */
export async function cobrarPago(input: FormData) {
  const { orgId } = await requireModuloGym();
  const clienteId = str(input, "clienteId");
  if (!clienteId) redirect("/gym/clientes");

  const planId = str(input, "planId") || null;
  const monto = din(input, "monto");
  const metodo = (str(input, "metodo") || "EFECTIVO").toUpperCase();

  const cliente = await prisma.cliente.findFirst({ where: { id: clienteId, orgId } });
  if (!cliente) return;

  const plan = planId ? await prisma.plan.findFirst({ where: { id: planId, orgId } }) : null;

  const base = cliente.periodoFin && cliente.periodoFin > new Date() ? cliente.periodoFin : new Date();
  const dias = plan?.duracionDias ?? 30;
  const periodoFin = new Date(base);
  periodoFin.setDate(periodoFin.getDate() + dias);

  await prisma.pago.create({
    data: {
      orgId,
      clienteId,
      monto: monto || (plan?.precio ?? 0),
      metodo: metodo as MetodoPago,
      concepto: plan ? `${plan.nombre} — ${periodoFin.toLocaleDateString("es-CO", { month: "long", year: "numeric" })}` : "Membresía",
      periodoInicio: base,
      periodoFin,
    },
  });

  await prisma.cliente.update({
    where: { id: clienteId },
    data: { periodoFin, estado: "ACTIVO", planId: plan?.id },
  });

  revalidatePath("/"); revalidatePath("/gym");
  revalidatePath("/gym/pagos");
  revalidatePath(`/gym/clientes/${clienteId}`);
  redirect(`/gym/clientes/${clienteId}?ok=pago`);
}

export async function anularPago(input: FormData) {
  const { orgId } = await requireModuloGym();
  const id = str(input, "id");
  const motivo = str(input, "motivo");
  if (!id || !motivo) return;

  await prisma.pago.updateMany({ where: { id, orgId }, data: { anulado: true, motivoAnulacion: motivo } });
  revalidatePath("/"); revalidatePath("/gym");
  revalidatePath("/gym/pagos");
}

// ---------------------------------------------------------------
// GASTOS
// ---------------------------------------------------------------

const GASTO_ENUM = ["ARRIENDO", "NOMINA", "SERVICIOS", "MANTENIMIENTO", "PUBLICIDAD", "OTROS"];

export async function registrarGasto(input: FormData) {
  const { orgId } = await requireModuloGym();
  const monto = din(input, "monto");
  const categoria = (str(input, "categoria") || "OTROS").toUpperCase();
  if (monto <= 0) redirect("/gym/gastos?error=monto");

  await prisma.gasto.create({
    data: {
      orgId,
      monto,
      categoria: GASTO_ENUM.includes(categoria) ? (categoria as never) : "OTROS",
      descripcion: str(input, "descripcion") || null,
    },
  });

  revalidatePath("/"); revalidatePath("/gym");
  revalidatePath("/gym/gastos");
}

export async function anularGasto(input: FormData) {
  const { orgId } = await requireModuloGym();
  const id = str(input, "id");
  const motivo = str(input, "motivo");
  if (!id || !motivo) return;
  await prisma.gasto.updateMany({ where: { id, orgId }, data: { anulado: true, motivoAnulacion: motivo } });
  revalidatePath("/"); revalidatePath("/gym");
  revalidatePath("/gym/gastos");
}

// ---------------------------------------------------------------
// PLANES
// ---------------------------------------------------------------

export async function crearPlan(input: FormData) {
  const { orgId } = await requireModuloGym();
  const nombre = str(input, "nombre");
  const precio = din(input, "precio");
  const duracionDias = Math.round(din(input, "duracionDias")) || 30;
  if (!nombre || precio <= 0) redirect("/gym/pagos?error=plan");

  await prisma.plan.create({ data: { orgId, nombre, precio, duracionDias } });
  revalidatePath("/gym/pagos");
}