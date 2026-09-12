import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getPortalCtx } from "@/lib/session";
import { PortalScaffold } from "@/components/PortalScaffold";

/**
 * Layout del segmento /negocios/[slug] — el NEGOCIO.
 * Valida membresía (aislamiento por membership, no por parche) y envuelve
 * panel + módulos con el header global del portal (select de negocio activo).
 */
export default async function NegocioLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const org = await prisma.organization.findUnique({
    where: { slug: params.slug },
    include: { members: true },
  });
  if (!org) notFound();

  const soyMiembro = org.members.some((m) => m.email === session.user!.email);
  const scope = (session.user as { scope?: string } | undefined)?.scope;

  if (scope === "CEO" && !soyMiembro) redirect("/ceo");
  if (!soyMiembro) redirect("/");

  const ctx = await getPortalCtx(session.user.email);

  return (
    <PortalScaffold email={ctx.email} negocios={ctx.negocios} activoSlug={ctx.activo?.slug}>
      {children}
    </PortalScaffold>
  );
}