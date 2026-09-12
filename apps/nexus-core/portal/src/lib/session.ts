import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export interface NegocioInfo {
  id: string;
  slug: string;
  nombre: string;
  tipoNegocio: string | null;
}

/**
 * Todos los negocios del miembro (para el SELECT de la navbar).
 * Excluye la org interna "Nexus" (plataforma): no es un negocio cliente.
 */
export async function getMisNegocios(email: string): Promise<NegocioInfo[]> {
  return prisma.organization.findMany({
    where: {
      members: { some: { email, activo: true } },
      tipoNegocio: { not: "plataforma" },
    },
    select: { id: true, slug: true, nombre: true, tipoNegocio: true },
    orderBy: { createdAt: "asc" },
  });
}

/**
 * El negocio ACTIVO del miembro: la cookie `negocio_activo` si pertenece,
 * si no el primero. Devuelve null si no tiene negocios.
 */
export async function getNegocioActivo(email: string): Promise<NegocioInfo | null> {
  const negocios = await getMisNegocios(email);
  if (negocios.length === 0) return null;

  const cookieStore = await cookies();
  const slug = cookieStore.get("negocio_activo")?.value;
  const activo = negocios.find((n) => n.slug === slug);
  return activo ?? negocios[0] ?? null;
}

export interface PortalCtx {
  email: string;
  negocios: NegocioInfo[];
  activo: NegocioInfo | null;
}

/** Contexto de sesión para el portal: email + negocios + negocio activo. */
export async function getPortalCtx(email: string): Promise<PortalCtx> {
  const negocios = await getMisNegocios(email);
  const activo = await getNegocioActivo(email);
  return { email, negocios, activo };
}