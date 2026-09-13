/**
 * NÚCLEO — sesión y organización activa del usuario.
 *
 * La identidad es GLOBAL: el Member (email) es la persona y puede estar
 * en varias orgs. La org "activa" es con la que trabaja el usuario hoy.
 * El selector de org (multi-org real) llega en un paso posterior: acá se
 * toma la primera con onboarding completo (futuro: la seleccionada).
 */
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function requiereSesion() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");
  return { email: session.user.email, nombre: session.user.name ?? null };
}

/** Org activa del usuario: la primera con onboarding completo, si no la primera. */
export async function getOrgActiva() {
  const email = (await requiereSesion()).email;
  const member = await prisma.member.findFirst({
    where: { email, activo: true },
    orderBy: [{ onboardingCompletadoAt: "desc" }, { createdAt: "asc" }],
    include: { org: true },
  });
  if (!member) redirect("/registro");
  return { member, org: member.org };
}

/** Todas las orgs donde el usuario es miembro (para el futuro selector). */
export async function getMisOrgs(email: string) {
  return prisma.member.findMany({
    where: { email, activo: true },
    include: { org: true },
    orderBy: { createdAt: "asc" },
  });
}