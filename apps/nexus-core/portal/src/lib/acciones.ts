/**
 * NÚCLEO — acciones server de la base Nexus.
 *
 * Flujo REAL de la base: REGISTRO (cuenta) → ONBOARDING (negocio)
 * → MÓDULO ACTIVO según rubro → PANEL PRINCIPAL con sugerencias.
 *
 * Decisión (PLAN-BASE-NEXUS §6): el registro crea la cuenta de la
 * PERSONA y su primer negocio en borrador ("Mi negocio"); el onboarding
 * lo perfila de verdad. Nadie cae en una org "interna" ni en un gym
 * inventado: cada usuario arma SU negocio.
 */
"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requiereSesion } from "@/lib/org";
import { activarModuloPorRubro, activarModuloEnOrg } from "@/lib/modulos";

function str(input: FormData, key: string): string {
  return String(input.get(key) || "").trim();
}

/** Slug amigable único a partir de un nombre (la org se crea una vez). */
async function slugUnico(base: string): Promise<string> {
  const candidato = (base || "mi-negocio")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  let slug = candidato || "mi-negocio";
  while (await prisma.organization.findUnique({ where: { slug } })) {
    slug = `${candidato.slice(0, 34)}-${Math.random().toString(36).slice(2, 6)}`;
  }
  return slug;
}

/**
 * REGISTRO — crea la cuenta de la persona y SU primer negocio en borrador.
 * El negocio se completa después, en el onboarding (5 minutos, editable).
 */
export async function registrar(input: FormData) {
  const nombre = str(input, "nombre");
  const email = str(input, "email").toLowerCase();
  const password = str(input, "password");
  if (!nombre || !email || !password) redirect("/registro?error=campos");
  if (password.length < 6) redirect("/registro?error=password");

  const existente = await prisma.member.findFirst({ where: { email, passwordHash: { not: null } } });
  if (existente) redirect("/registro?error=email");

  const passwordHash = await bcrypt.hash(password, 10);
  const slugBase = (email ?? "mi-negocio").split("@")[0] ?? "mi-negocio";

  const org = await prisma.organization.create({
    data: { nombre: "Mi negocio", slug: await slugUnico(slugBase) },
  });

  await prisma.member.create({
    data: { orgId: org.id, nombre, email, passwordHash, rol: "ADMIN" },
  });

  redirect("/login?ok=1");
}

/**
 * ONBOARDING — completa el negocio del usuario (nombre, rubro, país+moneda,
 * equipo y dolor primero) y activa su MÓDULO base según el rubro.
 * El onboarding POR PERSONA está en el Member: cada usuario ve la guía
 * hasta completarla, aunque la org ya esté armada.
 */
export async function guardarOnboarding(input: FormData) {
  const { email } = await requiereSesion();

  const nombreNegocio = str(input, "nombre") || "Mi negocio";
  const rubro = (str(input, "rubro") || "otro").toLowerCase();
  const pais = (str(input, "pais") || "CO").toUpperCase();
  const moneda = (str(input, "moneda") || "COP").toUpperCase();
  const equipo = str(input, "equipo") === "equipo" ? "equipo" : "solo-yo";
  const dolor = ["cobrar", "no-perder", "saber-flujo"].includes(str(input, "dolor"))
    ? str(input, "dolor")
    : null;

  const miembro = await prisma.member.findFirst({
    where: { email, activo: true },
    orderBy: [{ onboardingCompletadoAt: "desc" }, { createdAt: "asc" }],
  });
  if (!miembro) redirect("/registro");

  // El perfil del negocio lo completa una vez el primer dueño; los demás
  // usuarios completan su propia guía sin pisar los datos del negocio.
  const org = await prisma.organization.findUnique({ where: { id: miembro.orgId } });
  if (org && !org.onboardingCompletadoAt) {
    await prisma.organization.update({
      where: { id: org.id },
      data: {
        nombre: nombreNegocio,
        tipoNegocio: rubro,
        pais,
        moneda,
        equipo,
        dolor,
        onboardingCompletadoAt: new Date(),
      },
    });
  }

  await prisma.member.update({
    where: { id: miembro.id },
    data: { onboardingCompletadoAt: new Date() },
  });

  // El rubro decide el módulo que se enciende (PLAN-BASE §6: "módulo activo
  // + dashboard funcionando + checklist" — nada de "próximamente").
  const conModulo = await activarModuloPorRubro(miembro.orgId, rubro);

  revalidatePath("/");
  redirect(conModulo ? "/gym?tour=1" : "/");
}

/** PANEL — activa un módulo sugerido (solo el ADMIN de la org). */
export async function activarModulo(input: FormData) {
  const { email } = await requiereSesion();
  const moduleId = str(input, "moduleId");
  if (!moduleId) return;

  const miembro = await prisma.member.findFirst({
    where: { email, activo: true, rol: "ADMIN" },
    orderBy: [{ onboardingCompletadoAt: "desc" }, { createdAt: "asc" }],
  });
  if (!miembro) return;

  await activarModuloEnOrg(miembro.orgId, moduleId, miembro.rol);

  revalidatePath("/");
  const org = await prisma.organization.findUnique({ where: { id: miembro.orgId } });
  const module = await prisma.module.findUnique({ where: { id: moduleId } });
  if (org && module) revalidatePath(`/${module.slug}`);
}