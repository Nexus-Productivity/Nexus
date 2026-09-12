import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getPortalCtx } from "@/lib/session";
import { PortalHeader } from "@/components/PortalHeader";
import { NegocioSidebar } from "@/components/NegocioSidebar";

/**
 * Layout del segmento /negocios/[slug] — el NEGOCIO.
 * Shell corporativo: header global (marca + select) + sidebar del negocio
 * (Dashboard + módulos ACTIVOS) + contenido extendido estilo empresa.
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
    include: {
      members: true,
      modules: {
        where: { estado: "ACTIVO" },
        include: { module: true },
        orderBy: { module: { orden: "asc" } },
      },
    },
  });
  if (!org) notFound();

  const soyMiembro = org.members.some((m) => m.email === session.user!.email);
  const scope = (session.user as { scope?: string } | undefined)?.scope;

  if (scope === "CEO" && !soyMiembro) redirect("/ceo");
  if (!soyMiembro) redirect("/");

  const ctx = await getPortalCtx(session.user.email);

  const modulos = org.modules.map((m) => ({
    slug: m.module.slug,
    nombre: m.module.nombre,
  }));

  return (
    <div className="min-h-screen bg-nexus-bg">
      <PortalHeader email={ctx.email} negocios={ctx.negocios} activoSlug={ctx.activo?.slug} />
      <div className="mx-auto flex max-w-7xl items-start gap-6 px-4 py-6 lg:px-6">
        <NegocioSidebar
          negocioSlug={params.slug}
          negocioNombre={org.nombre}
          modulos={modulos}
        />
        <main className="min-w-0 flex-1 pb-12">{children}</main>
      </div>
    </div>
  );
}