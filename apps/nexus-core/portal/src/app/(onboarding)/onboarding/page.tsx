import { redirect } from "next/navigation";
import { getOrgActiva } from "@/lib/org";
import { prisma } from "@/lib/prisma";
import { OnboardingWizard } from "./OnboardingWizard";

export const dynamic = "force-dynamic";

/**
 * ONBOARDING — cada USUARIO nuevo arma SU negocio con los datos que Nexus
 * necesita (base NEXUS 2026-09-12): intro de visión (problema → NEXUS es la
 * solución) + 5 pasos editables (nombre, rubro, país+moneda, equipo, dolor
 * primero). Es POR PERSONA: si este miembro ya completó su guía, directo al
 * panel (aunque otros usuarios sigan pendientes).
 */
export default async function OnboardingPage() {
  const { member, org } = await getOrgActiva();

  const miembro = await prisma.member.findUnique({
    where: { email_orgId: { email: member.email, orgId: org.id } },
  });
  if (miembro?.onboardingCompletadoAt) redirect("/");

  return <OnboardingWizard orgNombre={org.nombre} />;
}