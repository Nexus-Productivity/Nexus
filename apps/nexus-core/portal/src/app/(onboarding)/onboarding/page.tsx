import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getGymOrg } from "@/lib/gym";
import { prisma } from "@/lib/prisma";
import { OnboardingWizard } from "./OnboardingWizard";

export const dynamic = "force-dynamic";

/**
 * ONBOARDING — cada USUARIO nuevo arma su acceso al negocio con los datos que
 * Nexus necesita (base NEXUS 2026-09-12): intro de visión (problema → NEXUS es
 * la solución) + 5 pasos editables (nombre, rubro, país+moneda, equipo, dolor
 * primero). Es POR PERSONA: si este miembro ya completó su guía, directo al
 * dashboard (aunque otros usuarios sigan pendientes).
 */
export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const org = await getGymOrg();
  if (!org) redirect("/login");

  const miembro = await prisma.member.findUnique({
    where: { email_orgId: { email: session.user.email, orgId: org.id } },
  });
  if (miembro?.onboardingCompletadoAt) redirect("/");

  return <OnboardingWizard orgNombre={org.nombre ?? "Mi negocio"} />;
}