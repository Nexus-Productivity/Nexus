"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authOptions } from "./auth";

/** Normaliza un nombre de negocio a slug de URL: "Zona Rosa" → "zonarosa". */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Busca el módulo BASE (porDefecto) — se activa en toda organización nueva. */
async function activarModuloBase(orgId: string) {
  const base = await prisma.module.findFirst({ where: { porDefecto: true, activo: true } });
  if (!base) return;
  await prisma.organizationModule.upsert({
    where: { orgId_moduleId: { orgId, moduleId: base.id } },
    update: { estado: "ACTIVO", activadoAt: new Date() },
    create: { orgId, moduleId: base.id, estado: "ACTIVO", activadoAt: new Date() },
  });
}

/**
 * REGISTRO — crea cuenta + negocio. El módulo BASE (Clientes) se activa
 * automáticamente; el resto se sugiere según el tipo de negocio en el panel.
 */
export async function registrar(input: FormData) {
  const nombre = String(input.get("nombre") || "").trim();
  const email = String(input.get("email") || "").trim().toLowerCase();
  const password = String(input.get("password") || "");
  const negocio = String(input.get("negocio") || "").trim();
  const tipoNegocio = String(input.get("tipoNegocio") || "otro").trim();

  if (!nombre || !email || !password || !negocio) {
    redirect("/registro?error=campos");
  }
  if (password.length < 6) {
    redirect("/registro?error=password");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const slug = `${slugify(negocio)}-${Date.now().toString(36).slice(-4)}`;

  const primeraOrg = await prisma.organization.create({
    data: {
      nombre: negocio,
      slug,
      tipoNegocio,
      moneda: "COP",
      pais: "CO",
      members: {
        create: { nombre, email, passwordHash, rol: "ADMIN" },
      },
    },
  });

  await activarModuloBase(primeraOrg.id);

  redirect("/login?ok=1");
}

/**
 * SOLICITAR MÓDULO (upsell).
 * Solo el miembro de esa organización puede pedirlo; el módulo BASE (clientes)
 * no se solicita: ya viene por defecto.
 */
export async function solicitarModulo(input: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const orgId = String(input.get("orgId") || "");
  const moduleId = String(input.get("moduleId") || "");
  if (!orgId || !moduleId) return;

  const module = await prisma.module.findUnique({ where: { id: moduleId } });
  if (!module || module.porDefecto) return;

  const member = await prisma.member.findFirst({
    where: { email: session.user.email, orgId },
  });
  if (!member) return; // no pertenece a esa org

  await prisma.organizationModule.upsert({
    where: { orgId_moduleId: { orgId, moduleId } },
    update: { estado: "SOLICITADO" },
    create: { orgId, moduleId, estado: "SOLICITADO" },
  });

  const orgSlug = await prisma.organization.findUnique({ where: { id: orgId }, select: { slug: true } });
  revalidatePath("/explorar");
  revalidatePath(orgSlug ? `/negocios/${orgSlug}` : "/negocios/");
}

/**
 * NUEVO NEGOCIO — la cuenta suma otra org (mis negocios crece).
 * El módulo BASE se activa igual que en el registro.
 */
export async function crearNegocio(input: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const nombre = String(input.get("nombre") || "").trim();
  const tipoNegocio = String(input.get("tipoNegocio") || "otro").trim();
  if (!nombre) return;

  const slug = `${slugify(nombre)}-${Date.now().toString(36).slice(-4)}`;

  const org = await prisma.organization.create({
    data: {
      nombre,
      slug,
      tipoNegocio,
      moneda: "COP",
      pais: "CO",
      members: {
        create: {
          nombre: session.user.name ?? nombre,
          email: session.user.email,
          rol: "ADMIN",
        },
      },
    },
  });

  await activarModuloBase(org.id);

  // El negocio recién creado pasa a ser el ACTIVO.
  cookies().set("negocio_activo", slug, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  revalidatePath("/");
  redirect(`/negocios/${slug}`);
}

/**
 * SELECT DE NEGOCIO (navbar) — cambia la org ACTIVA del usuario.
 * Valida que el usuario pertenezca a la org antes de setear la cookie.
 */
export async function setNegocioActivo(slug: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const org = await prisma.organization.findFirst({
    where: {
      slug,
      members: { some: { email: session.user.email, activo: true } },
    },
    select: { slug: true },
  });
  if (!org) return;

  cookies().set("negocio_activo", org.slug, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  revalidatePath("/");
}

/**
 * CONSOLA CEO — decisión sobre una solicitud de módulo.
 * Aprobar → ACTIVO · Rechazar → se elimina la solicitud (queda como sugerido de nuevo).
 */
export async function decidirSolicitud(input: FormData) {
  const session = await getServerSession(authOptions);
  const scope = (session?.user as { scope?: string } | undefined)?.scope;
  if (!session?.user?.email || scope !== "CEO") redirect("/login");

  const orgModuleId = String(input.get("orgModuleId") || "");
  const decision = String(input.get("decision") || "");
  if (!orgModuleId || (decision !== "aprobar" && decision !== "rechazar")) return;

  if (decision === "aprobar") {
    await prisma.organizationModule.update({
      where: { id: orgModuleId },
      data: { estado: "ACTIVO", activadoAt: new Date() },
    });
  } else {
    await prisma.organizationModule.delete({ where: { id: orgModuleId } });
  }

  revalidatePath("/ceo");
}