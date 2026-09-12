/**
 * Acciones del dominio GYM (prototipo). Solo operaciones reales: alta de
 * cliente, cobro de membresía, gasto, plan. Nada simulado.
 */
"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import type { MetodoPago } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getGymOrg } from "@/lib/gym";

async function requireGym() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");
  const org = await getGymOrg();
  if (!org) redirect("/login");
  return { email: session.user.email, orgId: org.id };
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
  const { orgId } = await requireGym();
  const nombre = str(input, "nombre");
  if (!nombre) redirect("/clientes?error=nombre");

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
  revalidatePath("/clientes");
  redirect(`/clientes/${cliente.id}`);
}

export async function actualizarCliente(input: FormData) {
  const { orgId } = await requireGym();
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

  revalidatePath(`/clientes/${id}`);
}

export async function congelarCliente(input: FormData) {
  const { orgId } = await requireGym();
  const id = str(input, "id");
  if (!id) return;
  await prisma.cliente.updateMany({ where: { id, orgId }, data: { estado: "CONGELADO" } });
  revalidatePath(`/clientes/${id}`);
  revalidatePath("/clientes");
}

export async function reactivarCliente(input: FormData) {
  const { orgId } = await requireGym();
  const id = str(input, "id");
  if (!id) return;
  await prisma.cliente.updateMany({ where: { id, orgId }, data: { estado: "ACTIVO" } });
  revalidatePath(`/clientes/${id}`);
  revalidatePath("/clientes");
}

// ---------------------------------------------------------------
// PAGOS
// ---------------------------------------------------------------

/**
 * Cobra una membresía: registra el pago y actualiza el período del cliente.
 * El estado pasa a ACTIVO y el periodoFin lo da el plan (o fecha libre).
 */
export async function cobrarPago(input: FormData) {
  const { orgId } = await requireGym();
  const clienteId = str(input, "clienteId");
  if (!clienteId) redirect("/clientes");

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

  revalidatePath("/");
  revalidatePath("/pagos");
  revalidatePath(`/clientes/${clienteId}`);
  redirect(`/clientes/${clienteId}?ok=pago`);
}

export async function anularPago(input: FormData) {
  const { orgId } = await requireGym();
  const id = str(input, "id");
  const motivo = str(input, "motivo");
  if (!id || !motivo) return;

  await prisma.pago.updateMany({ where: { id, orgId }, data: { anulado: true, motivoAnulacion: motivo } });
  revalidatePath("/");
  revalidatePath("/pagos");
}

// ---------------------------------------------------------------
// GASTOS
// ---------------------------------------------------------------

const GASTO_ENUM = ["ARRIENDO", "NOMINA", "SERVICIOS", "MANTENIMIENTO", "PUBLICIDAD", "OTROS"];

export async function registrarGasto(input: FormData) {
  const { orgId } = await requireGym();
  const monto = din(input, "monto");
  const categoria = (str(input, "categoria") || "OTROS").toUpperCase();
  if (monto <= 0) redirect("/gastos?error=monto");

  await prisma.gasto.create({
    data: {
      orgId,
      monto,
      categoria: GASTO_ENUM.includes(categoria) ? (categoria as never) : "OTROS",
      descripcion: str(input, "descripcion") || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/gastos");
}

export async function anularGasto(input: FormData) {
  const { orgId } = await requireGym();
  const id = str(input, "id");
  const motivo = str(input, "motivo");
  if (!id || !motivo) return;
  await prisma.gasto.updateMany({ where: { id, orgId }, data: { anulado: true, motivoAnulacion: motivo } });
  revalidatePath("/");
  revalidatePath("/gastos");
}

// ---------------------------------------------------------------
// PLANES
// ---------------------------------------------------------------

export async function crearPlan(input: FormData) {
  const { orgId } = await requireGym();
  const nombre = str(input, "nombre");
  const precio = din(input, "precio");
  const duracionDias = Math.round(din(input, "duracionDias")) || 30;
  if (!nombre || precio <= 0) redirect("/pagos?error=plan");

  await prisma.plan.create({ data: { orgId, nombre, precio, duracionDias } });
  revalidatePath("/pagos");
}

// ---------------------------------------------------------------
// CUENTA (demo rápida del prototipo: el dueño no puede registrarse él
// mismo si ya existe, así que el registro queda para prospectos futuros).
// ---------------------------------------------------------------

export async function registrar(input: FormData) {
  const nombre = str(input, "nombre");
  const email = str(input, "email").toLowerCase();
  const password = str(input, "password");
  if (!nombre || !email || !password) redirect("/registro?error=campos");
  if (password.length < 6) redirect("/registro?error=password");

  const existente = await prisma.member.findFirst({ where: { email } });
  if (existente) redirect("/registro?error=email");

  const passwordHash = await bcrypt.hash(password, 10);
  const nexus = await prisma.organization.upsert({
    where: { slug: "nexus" },
    update: {},
    create: { nombre: "Nexus", slug: "nexus", tipoNegocio: "plataforma", moneda: "COP", pais: "CO" },
  });
  await prisma.member.create({
    data: { orgId: nexus.id, nombre, email, passwordHash, rol: "OPERADOR", scope: "USER" },
  });
  redirect("/login?ok=1");
}